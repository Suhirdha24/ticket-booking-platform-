import express from 'express';
import Seat from '../models/Seat.js';
import Event from '../models/Event.js';
import Venue from '../models/Venue.js';
import { generateSeatsForEvent } from './eventRoutes.js';
import { optionalAuth } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router({ mergeParams: true });

/**
 * @route   GET /api/events/:eventId/seats
 * @desc    Get all seats for an event with computed effective status
 * @access  Public (Optional auth for identifying user-held seats)
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return next(new AppError('Event not found', 404, 'EVENT_NOT_FOUND'));
    }

    let seats = await Seat.find({ event: eventId })
      .sort({ section: 1, row: 1, seatNumber: 1 })
      .lean();

    // Auto-generate seats from venue sections if not yet populated
    if (seats.length === 0) {
      let venue = null;
      if (event.venue) {
        venue = await Venue.findById(event.venue);
      }
      if (!venue) {
        venue = await Venue.findOne();
      }
      if (!venue) {
        venue = await Venue.create({
          name: 'Grand Arena',
          city: event.city || 'Chennai',
          address: 'Main Stadium Complex',
          capacity: 130,
          sections: [
            { name: 'VIP Front Row', category: 'VIP', rows: 2, seatsPerRow: 10 },
            { name: 'Premium Central', category: 'Premium', rows: 3, seatsPerRow: 15 },
            { name: 'General Upper Tier', category: 'General', rows: 5, seatsPerRow: 13 },
          ],
        });
      }

      if (!event.venue) {
        event.venue = venue._id;
        await event.save();
      }

      await generateSeatsForEvent(event, venue, event.pricing);
      seats = await Seat.find({ event: eventId })
        .sort({ section: 1, row: 1, seatNumber: 1 })
        .lean();
    }

    const now = new Date();
    const currentUserId = req.user ? req.user._id.toString() : null;

    // Calculate effective status on the fly based on current server time
    const computedSeats = seats.map((seat) => {
      let effectiveStatus = seat.status;

      // If status is HELD but the expiration time has passed, treat as AVAILABLE
      if (
        seat.status === 'HELD' &&
        seat.heldExpiresAt &&
        new Date(seat.heldExpiresAt) <= now
      ) {
        effectiveStatus = 'AVAILABLE';
      }

      const isHeldByMe = Boolean(
        currentUserId &&
          seat.heldBy &&
          seat.heldBy.toString() === currentUserId &&
          effectiveStatus === 'HELD'
      );

      return {
        _id: seat._id,
        seatNumber: seat.seatNumber,
        row: seat.row,
        section: seat.section,
        category: seat.category,
        price: seat.price,
        status: effectiveStatus,
        isHeldByCurrentUser: isHeldByMe,
        heldExpiresAt:
          effectiveStatus === 'HELD' ? seat.heldExpiresAt : null,
      };
    });

    res.status(200).json({
      success: true,
      data: computedSeats,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
