import express from 'express';
import Event from '../models/Event.js';
import Venue from '../models/Venue.js';
import Seat from '../models/Seat.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * Helper to generate event-specific seats from Venue sections
 */
export async function generateSeatsForEvent(event, venue, pricingTiers = []) {
  const priceMap = {};
  pricingTiers.forEach((tier) => {
    priceMap[tier.category] = tier.price;
  });

  const defaultPrices = {
    VIP: 150,
    Premium: 90,
    General: 45,
  };

  const seatsToInsert = [];

  for (const section of venue.sections || []) {
    const category = section.category || 'General';
    const price = priceMap[category] || defaultPrices[category] || 50;

    for (let r = 1; r <= section.rows; r++) {
      const rowLetter = String.fromCharCode(64 + r); // A, B, C...
      for (let s = 1; s <= section.seatsPerRow; s++) {
        const seatNumber = `${section.name}-${rowLetter}${s}`;
        seatsToInsert.push({
          event: event._id,
          venue: venue._id,
          seatNumber,
          row: rowLetter,
          section: section.name,
          category,
          price,
          status: 'AVAILABLE',
          version: 0,
        });
      }
    }
  }

  if (seatsToInsert.length > 0) {
    await Seat.insertMany(seatsToInsert);
    event.totalSeats = seatsToInsert.length;
    event.availableSeats = seatsToInsert.length;
    await event.save();
  }

  return seatsToInsert.length;
}

/**
 * @route   GET /api/events
 * @desc    Get all events with filters, search, sorting & pagination
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      category,
      city,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      status,
    } = req.query;

    const query = {};

    // Only show published events for public, unless specifically requested
    if (status) {
      query.status = status;
    } else {
      query.status = 'PUBLISHED';
    }

    // Keyword search on title and description
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { city: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // City filter
    if (city && city !== 'All') {
      query.city = { $regex: `^${city.trim()}$`, $options: 'i' };
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query['pricing.price'] = {};
      if (minPrice) query['pricing.price'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.price'].$lte = Number(maxPrice);
    }

    // Sorting
    let sortOption = { date: 1 };
    if (sort === 'date-desc') sortOption = { date: -1 };
    else if (sort === 'price-asc') sortOption = { 'pricing.0.price': 1 };
    else if (sort === 'price-desc') sortOption = { 'pricing.0.price': -1 };
    else if (sort === 'title-asc') sortOption = { title: 1 };
    else if (sort === 'popular') sortOption = { totalSeats: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate('venue', 'name address city capacity imageUrl')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Event.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        events,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/events/:id
 * @desc    Get single event by ID with venue details
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('venue');

    if (!event) {
      return next(new AppError('Event not found', 404, 'EVENT_NOT_FOUND'));
    }

    // Dynamically calculate actual available seats considering expired held seats
    const now = new Date();
    const availableCount = await Seat.countDocuments({
      event: event._id,
      $or: [
        { status: 'AVAILABLE' },
        { status: 'HELD', heldExpiresAt: { $lte: now } },
      ],
    });

    const eventObj = event.toObject();
    eventObj.availableSeats = availableCount;

    res.status(200).json({
      success: true,
      data: eventObj,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/events
 * @desc    Create new event and generate its seat map
 * @access  Private (Admin only)
 */
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      venueId,
      city,
      date,
      doorsOpen,
      endDate,
      bannerUrl,
      thumbnailUrl,
      status,
      pricing,
      cancellationPolicy,
    } = req.body;

    if (!title || !description || !category || !venueId || !date) {
      return next(
        new AppError(
          'Title, description, category, venueId, and date are required',
          400,
          'VALIDATION_ERROR'
        )
      );
    }

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return next(new AppError('Venue not found', 404, 'VENUE_NOT_FOUND'));
    }

    const eventCity = city || venue.city;

    const event = await Event.create({
      title,
      description,
      category,
      venue: venue._id,
      city: eventCity,
      date: new Date(date),
      doorsOpen: doorsOpen ? new Date(doorsOpen) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      bannerUrl,
      thumbnailUrl,
      status: status || 'PUBLISHED',
      pricing: pricing || [
        { category: 'VIP', price: 150 },
        { category: 'Premium', price: 90 },
        { category: 'General', price: 50 },
      ],
      cancellationPolicy: cancellationPolicy || {
        allowCancellation: true,
        cutoffHours: 24,
      },
    });

    // Generate seats for event
    await generateSeatsForEvent(event, venue, event.pricing);

    const populatedEvent = await Event.findById(event._id).populate('venue');

    res.status(201).json({
      success: true,
      data: populatedEvent,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/events/:id
 * @desc    Update event details
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('venue');

    if (!event) {
      return next(new AppError('Event not found', 404, 'EVENT_NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event and its seats
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return next(new AppError('Event not found', 404, 'EVENT_NOT_FOUND'));
    }

    // Delete event-specific seats
    await Seat.deleteMany({ event: event._id });
    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event and associated seats deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
