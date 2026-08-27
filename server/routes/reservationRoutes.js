import express from 'express';
import mongoose from 'mongoose';
import Reservation from '../models/Reservation.js';
import Seat from '../models/Seat.js';
import Event from '../models/Event.js';
import { authenticate } from '../middleware/auth.js';
import { validateReservation } from '../middleware/validate.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * Executes atomic reservation claiming without session (for standalone or fallback)
 */
async function claimSeatsAtomic({ eventId, seatIds, userId, expiresAt, now }) {
  const claimedSeatIds = [];
  let reservation = null;

  try {
    // 1. Check all seats exist and belong to event
    const seats = await Seat.find({ _id: { $in: seatIds }, event: eventId });
    if (seats.length !== seatIds.length) {
      throw new AppError(
        'One or more requested seats do not exist or belong to another event',
        400,
        'INVALID_SEAT_SELECTION'
      );
    }

    // 2. Pre-check availability
    for (const seat of seats) {
      const isAvailable =
        seat.status === 'AVAILABLE' ||
        (seat.status === 'HELD' &&
          seat.heldExpiresAt &&
          new Date(seat.heldExpiresAt) <= now);

      if (!isAvailable) {
        throw new AppError(
          'One or more selected seats are no longer available.',
          409,
          'SEAT_ALREADY_HELD'
        );
      }
    }

    // 3. Create Reservation
    reservation = await Reservation.create({
      user: userId,
      event: eventId,
      seats: seatIds,
      status: 'ACTIVE',
      expiresAt,
    });

    // 4. Atomically claim each seat with conditional criteria
    for (const seatId of seatIds) {
      const claimedSeat = await Seat.findOneAndUpdate(
        {
          _id: seatId,
          event: eventId,
          $or: [
            { status: 'AVAILABLE' },
            { status: 'HELD', heldExpiresAt: { $lte: now } },
          ],
        },
        {
          $set: {
            status: 'HELD',
            heldBy: userId,
            reservation: reservation._id,
            heldExpiresAt: expiresAt,
          },
          $inc: { version: 1 },
        },
        { new: true }
      );

      if (!claimedSeat) {
        throw new AppError(
          'One or more selected seats are no longer available.',
          409,
          'SEAT_ALREADY_HELD'
        );
      }

      claimedSeatIds.push(seatId);
    }

    return reservation;
  } catch (err) {
    // Rollback any partial claims
    if (claimedSeatIds.length > 0) {
      await Seat.updateMany(
        {
          _id: { $in: claimedSeatIds },
          reservation: reservation?._id,
        },
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
    }

    if (reservation) {
      await Reservation.findByIdAndDelete(reservation._id);
    }

    throw err;
  }
}

/**
 * @route   POST /api/reservations
 * @desc    Atomically reserve/hold seats for 5 minutes
 * @access  Private
 */
router.post('/', authenticate, validateReservation, async (req, res, next) => {
  let session = null;
  try {
    const { eventId, seatIds } = req.body;
    const userId = req.user._id;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes lock

    // 1. Verify Event exists and is published
    const event = await Event.findById(eventId);
    if (!event) {
      return next(new AppError('Event not found', 404, 'EVENT_NOT_FOUND'));
    }

    if (event.status === 'CANCELLED' || event.status === 'COMPLETED') {
      return next(
        new AppError(
          'This event is no longer accepting reservations',
          400,
          'EVENT_INACTIVE'
        )
      );
    }

    // Determine if transactions can be run
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
        const seats = await Seat.find({
          _id: { $in: seatIds },
          event: eventId,
        }).session(session);

        if (seats.length !== seatIds.length) {
          throw new AppError(
            'One or more requested seats do not exist or belong to another event',
            400,
            'INVALID_SEAT_SELECTION'
          );
        }

        for (const seat of seats) {
          const isAvailable =
            seat.status === 'AVAILABLE' ||
            (seat.status === 'HELD' &&
              seat.heldExpiresAt &&
              new Date(seat.heldExpiresAt) <= now);

          if (!isAvailable) {
            throw new AppError(
              'One or more selected seats are no longer available.',
              409,
              'SEAT_ALREADY_HELD'
            );
          }
        }

        const [reservation] = await Reservation.create(
          [
            {
              user: userId,
              event: eventId,
              seats: seatIds,
              status: 'ACTIVE',
              expiresAt,
            },
          ],
          { session }
        );

        for (const seat of seats) {
          const updateResult = await Seat.updateOne(
            {
              _id: seat._id,
              version: seat.version,
              $or: [
                { status: 'AVAILABLE' },
                { status: 'HELD', heldExpiresAt: { $lte: now } },
              ],
            },
            {
              $set: {
                status: 'HELD',
                heldBy: userId,
                reservation: reservation._id,
                heldExpiresAt: expiresAt,
              },
              $inc: { version: 1 },
            },
            { session }
          );

          if (updateResult.modifiedCount !== 1) {
            throw new AppError(
              'One or more selected seats are no longer available.',
              409,
              'SEAT_ALREADY_HELD'
            );
          }
        }

        await session.commitTransaction();
        session.endSession();

        const populatedReservation = await Reservation.findById(
          reservation._id
        ).populate('seats');

        return res.status(201).json({
          success: true,
          data: {
            reservationId: reservation._id,
            expiresAt: reservation.expiresAt,
            seats: populatedReservation.seats,
            event: {
              id: event._id,
              title: event.title,
              date: event.date,
              city: event.city,
            },
          },
        });
      } catch (txnError) {
        if (session) {
          try {
            await session.abortTransaction();
            session.endSession();
          } catch (_) {}
        }

        // If standalone error or transaction not supported, fall back to atomic non-session execution
        if (
          txnError.message?.includes('Transaction numbers are only allowed') ||
          txnError.code === 20
        ) {
          const reservation = await claimSeatsAtomic({
            eventId,
            seatIds,
            userId,
            expiresAt,
            now,
          });

          const populatedReservation = await Reservation.findById(
            reservation._id
          ).populate('seats');

          return res.status(201).json({
            success: true,
            data: {
              reservationId: reservation._id,
              expiresAt: reservation.expiresAt,
              seats: populatedReservation.seats,
              event: {
                id: event._id,
                title: event.title,
                date: event.date,
                city: event.city,
              },
            },
          });
        }

        if (txnError instanceof AppError) {
          return next(txnError);
        }

        if (
          txnError.code === 112 ||
          txnError.message?.includes('WriteConflict') ||
          txnError.message?.includes('duplicate key')
        ) {
          return next(
            new AppError(
              'One or more selected seats are no longer available.',
              409,
              'SEAT_ALREADY_HELD'
            )
          );
        }

        return next(txnError);
      }
    } else {
      // Direct atomic execution
      const reservation = await claimSeatsAtomic({
        eventId,
        seatIds,
        userId,
        expiresAt,
        now,
      });

      const populatedReservation = await Reservation.findById(
        reservation._id
      ).populate('seats');

      return res.status(201).json({
        success: true,
        data: {
          reservationId: reservation._id,
          expiresAt: reservation.expiresAt,
          seats: populatedReservation.seats,
          event: {
            id: event._id,
            title: event.title,
            date: event.date,
            city: event.city,
          },
        },
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
 * @route   GET /api/reservations/:id
 * @desc    Get reservation status & time remaining
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('seats')
      .populate('event', 'title date venue city bannerUrl');

    if (!reservation) {
      return next(
        new AppError('Reservation not found', 404, 'RESERVATION_NOT_FOUND')
      );
    }

    if (
      reservation.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return next(
        new AppError(
          'Access forbidden to this reservation',
          403,
          'FORBIDDEN_RESERVATION'
        )
      );
    }

    const now = new Date();
    const isExpired =
      reservation.status === 'EXPIRED' ||
      (reservation.status === 'ACTIVE' && new Date(reservation.expiresAt) <= now);

    const remainingMs = Math.max(
      0,
      new Date(reservation.expiresAt).getTime() - now.getTime()
    );

    res.status(200).json({
      success: true,
      data: {
        reservation: {
          _id: reservation._id,
          status: isExpired ? 'EXPIRED' : reservation.status,
          expiresAt: reservation.expiresAt,
          remainingSeconds: Math.floor(remainingMs / 1000),
          seats: reservation.seats,
          event: reservation.event,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
