import express from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Reservation from '../models/Reservation.js';
import Seat from '../models/Seat.js';
import Event from '../models/Event.js';
import Venue from '../models/Venue.js';
import { authenticate } from '../middleware/auth.js';
import { validateBooking } from '../middleware/validate.js';
import { PaymentService } from '../services/paymentService.js';
import { QRService } from '../services/qrService.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

function generateBookingReference() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = 'BK-';
  for (let i = 0; i < 4; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  ref += '-';
  for (let i = 0; i < 4; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

/**
 * Execute booking state confirmation without transaction (standalone fallback)
 */
async function completeBookingAtomic({
  bookingPayload,
  reservation,
  seatIds,
  event,
}) {
  const booking = await Booking.create(bookingPayload);
  booking.qrToken = QRService.generateQRToken(booking);
  await booking.save();

  reservation.status = 'COMPLETED';
  reservation.completedAt = new Date();
  await reservation.save();

  await Seat.updateMany(
    { _id: { $in: seatIds }, reservation: reservation._id },
    {
      $set: {
        status: 'BOOKED',
        heldBy: null,
        heldExpiresAt: null,
      },
      $inc: { version: 1 },
    }
  );

  await Event.findByIdAndUpdate(event._id, {
    $inc: { availableSeats: -seatIds.length },
  });

  return booking;
}

/**
 * @route   POST /api/bookings
 * @desc    Process payment and confirm booking from an active reservation
 * @access  Private
 */
router.post('/', authenticate, validateBooking, async (req, res, next) => {
  let session = null;
  try {
    const { reservationId, paymentMethod, paymentDetails, simulateFailure } =
      req.body;
    const userId = req.user._id;
    const now = new Date();

    // 1. Fetch Reservation
    const reservation = await Reservation.findById(reservationId)
      .populate('seats')
      .populate('event');

    if (!reservation) {
      return next(
        new AppError('Reservation not found', 404, 'RESERVATION_NOT_FOUND')
      );
    }

    // 2. Verify ownership
    if (reservation.user.toString() !== userId.toString()) {
      return next(
        new AppError(
          'You are not authorized to complete this reservation',
          403,
          'FORBIDDEN_RESERVATION'
        )
      );
    }

    // 3. Verify reservation is active
    if (reservation.status !== 'ACTIVE') {
      return next(
        new AppError(
          `Reservation cannot be booked because it is ${reservation.status.toLowerCase()}`,
          400,
          'RESERVATION_INACTIVE'
        )
      );
    }

    // 4. Verify reservation has not expired
    if (new Date(reservation.expiresAt) <= now) {
      reservation.status = 'EXPIRED';
      await reservation.save();
      return next(
        new AppError(
          'Reservation hold has expired. Please select your seats again.',
          400,
          'RESERVATION_EXPIRED'
        )
      );
    }

    // 5. Verify seats are still held by this reservation
    const seatIds = reservation.seats.map((s) => s._id);
    const seats = await Seat.find({
      _id: { $in: seatIds },
      reservation: reservation._id,
      status: 'HELD',
    });

    if (seats.length !== reservation.seats.length) {
      return next(
        new AppError(
          'One or more reserved seats are no longer locked to this reservation',
          409,
          'SEAT_HOLD_LOST'
        )
      );
    }

    // 6. Calculate Pricing
    const event = reservation.event;
    const venue = await Venue.findById(event.venue);

    const priceSnapshot = seats.map((seat) => ({
      seatNumber: seat.seatNumber,
      row: seat.row,
      section: seat.section,
      category: seat.category,
      price: seat.price,
    }));

    const subtotal = priceSnapshot.reduce((sum, item) => sum + item.price, 0);
    const convenienceFee = Math.round(subtotal * 0.05 * 100) / 100;
    const total = Math.round((subtotal + convenienceFee) * 100) / 100;

    // 7. Process Mock Payment
    const paymentResult = await PaymentService.processPayment({
      amount: total,
      paymentMethod,
      paymentDetails: paymentDetails || {},
      simulateFailure: simulateFailure === true,
    });

    if (!paymentResult.success) {
      return next(
        new AppError(
          paymentResult.message || 'Payment transaction failed',
          400,
          'PAYMENT_FAILED'
        )
      );
    }

    // 8. Create Confirmed Booking
    const bookingReference = generateBookingReference();

    const bookingPayload = {
      user: userId,
      event: event._id,
      reservation: reservation._id,
      seats: seatIds,
      eventSnapshot: {
        title: event.title,
        category: event.category,
        date: event.date,
        venueName: venue ? venue.name : 'Main Venue',
        venueCity: event.city,
        venueAddress: venue ? venue.address : '',
        bannerUrl: event.bannerUrl,
      },
      venueSnapshot: {
        name: venue ? venue.name : 'Main Venue',
        city: event.city,
        address: venue ? venue.address : '',
      },
      priceSnapshot,
      subtotal,
      convenienceFee,
      total,
      paymentDetails: {
        transactionId: paymentResult.transactionId,
        paymentMethod,
        paymentStatus: 'SUCCESS',
        paidAt: paymentResult.timestamp,
      },
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      bookingReference,
      qrToken: 'PENDING',
    };

    let useTransaction = false;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      useTransaction = true;
    } catch (e) {
      session = null;
      useTransaction = false;
    }

    if (useTransaction && session) {
      try {
        const [booking] = await Booking.create([bookingPayload], { session });

        booking.qrToken = QRService.generateQRToken(booking);
        await booking.save({ session });

        reservation.status = 'COMPLETED';
        reservation.completedAt = new Date();
        await reservation.save({ session });

        await Seat.updateMany(
          { _id: { $in: seatIds }, reservation: reservation._id },
          {
            $set: {
              status: 'BOOKED',
              heldBy: null,
              heldExpiresAt: null,
            },
            $inc: { version: 1 },
          },
          { session }
        );

        await Event.findByIdAndUpdate(
          event._id,
          { $inc: { availableSeats: -seatIds.length } },
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
          success: true,
          data: booking,
        });
      } catch (txnErr) {
        if (session) {
          try {
            await session.abortTransaction();
            session.endSession();
          } catch (_) {}
        }

        if (
          txnErr.message?.includes('Transaction numbers are only allowed') ||
          txnErr.code === 20
        ) {
          const booking = await completeBookingAtomic({
            bookingPayload,
            reservation,
            seatIds,
            event,
          });

          return res.status(201).json({
            success: true,
            data: booking,
          });
        }

        return next(txnErr);
      }
    } else {
      const booking = await completeBookingAtomic({
        bookingPayload,
        reservation,
        seatIds,
        event,
      });

      return res.status(201).json({
        success: true,
        data: booking,
      });
    }
  } catch (error) {
    if (session) {
      try {
        session.endSession();
      } catch (_) {}
    }
    next(error);
  }
});

/**
 * @route   GET /api/bookings & GET /api/bookings/my-bookings
 * @desc    Get all bookings for logged-in user
 * @access  Private
 */
const getMyBookingsHandler = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date city bannerUrl category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

router.get('/', authenticate, getMyBookingsHandler);
router.get('/my-bookings', authenticate, getMyBookingsHandler);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking by ID with full ticket details
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('event');

    if (!booking) {
      return next(new AppError('Booking not found', 404, 'BOOKING_NOT_FOUND'));
    }

    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(
        new AppError(
          'Access forbidden to this booking',
          403,
          'FORBIDDEN_BOOKING'
        )
      );
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/bookings/:id/cancel
 * @desc    Cancel confirmed booking with 24h cutoff policy and release seats
 * @access  Private
 */
router.post('/:id/cancel', authenticate, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404, 'BOOKING_NOT_FOUND'));
    }

    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(
        new AppError(
          'Access forbidden to cancel this booking',
          403,
          'FORBIDDEN_BOOKING'
        )
      );
    }

    if (booking.bookingStatus === 'CANCELLED') {
      return next(
        new AppError(
          'This booking is already cancelled',
          400,
          'ALREADY_CANCELLED'
        )
      );
    }

    const event = await Event.findById(booking.event);
    if (!event) {
      return next(new AppError('Event not found', 404, 'EVENT_NOT_FOUND'));
    }

    const policy = event.cancellationPolicy || {
      allowCancellation: true,
      cutoffHours: 24,
    };

    if (!policy.allowCancellation) {
      return next(
        new AppError(
          'Cancellations are not permitted for this event according to organizer policy',
          400,
          'CANCELLATION_NOT_PERMITTED'
        )
      );
    }

    const now = new Date();
    const eventTime = new Date(event.date).getTime();
    const cutoffTime = policy.cutoffHours * 60 * 60 * 1000;

    if (eventTime - now.getTime() < cutoffTime) {
      return next(
        new AppError(
          `Cancellations must be requested at least ${policy.cutoffHours} hours prior to the event`,
          400,
          'CANCELLATION_DEADLINE_PASSED'
        )
      );
    }

    booking.bookingStatus = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    booking.cancelledAt = now;
    await booking.save();

    await Seat.updateMany(
      { _id: { $in: booking.seats } },
      {
        $set: {
          status: 'AVAILABLE',
          heldBy: null,
          reservation: null,
          heldExpiresAt: null,
        },
        $inc: { version: 1 },
      }
    );

    await Event.findByIdAndUpdate(event._id, {
      $inc: { availableSeats: booking.seats.length },
    });

    res.status(200).json({
      success: true,
      message: 'Booking successfully cancelled and payment refund initiated',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
