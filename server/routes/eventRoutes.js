import express from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Venue from '../models/Venue.js';
import Seat from '../models/Seat.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * Helper to generate event-specific seats from Venue sections
 */
export async function generateSeatsForEvent(eventParam, venueParam, pricingTiers = []) {
  let event = eventParam;
  if (typeof eventParam === 'string' || eventParam instanceof mongoose.Types.ObjectId) {
    event = await Event.findById(eventParam);
  }
  if (!event) return 0;

  let venue = venueParam;
  if (!venue && event.venue) {
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
      capacity: 160,
      sections: [
        { name: 'VIP Front Row', category: 'VIP', rows: 5, seatsPerRow: 10 },
        { name: 'Premium Central', category: 'Premium', rows: 5, seatsPerRow: 10 },
        { name: 'General Upper Tier', category: 'General', rows: 5, seatsPerRow: 12 },
      ],
    });
  }

  if (!event.venue || event.venue.toString() !== venue._id.toString()) {
    event.venue = venue._id;
    await Event.updateOne({ _id: event._id }, { venue: venue._id });
  }

  const tiers = pricingTiers.length > 0 ? pricingTiers : event?.pricing || [];
  const priceMap = {};
  tiers.forEach((tier) => {
    priceMap[tier.category] = tier.price;
  });

  const defaultPrices = {
    VIP: 150,
    Premium: 90,
    General: 50,
  };

  const sections =
    venue.sections && Array.isArray(venue.sections) && venue.sections.length > 0
      ? venue.sections
      : [
          { name: 'VIP Front Row', category: 'VIP', rows: 5, seatsPerRow: 10 },
          { name: 'Premium Central', category: 'Premium', rows: 5, seatsPerRow: 10 },
          { name: 'General Upper Tier', category: 'General', rows: 5, seatsPerRow: 12 },
        ];

  // Remove any broken/incomplete seats for this event before recreating
  await Seat.deleteMany({ event: event._id });

  const seatsToInsert = [];

  for (const section of sections) {
    let category = section.category || 'General';
    if (!['VIP', 'Premium', 'General'].includes(category)) {
      category = 'General';
    }
    const price = priceMap[category] || defaultPrices[category] || 50;

    for (let r = 1; r <= section.rows; r++) {
      const rowLetter = String.fromCharCode(64 + r); // A, B, C...
      for (let s = 1; s <= section.seatsPerRow; s++) {
        const sectionPrefix = section.name.split(' ')[0] || 'S';
        const seatNumber = `${sectionPrefix}-${rowLetter}${s}`;
        seatsToInsert.push({
          _id: new mongoose.Types.ObjectId(),
          event: event._id,
          venue: venue._id,
          seatNumber,
          row: rowLetter,
          section: section.name,
          category,
          price,
          status: 'AVAILABLE',
          version: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }

  if (seatsToInsert.length > 0) {
    await Seat.collection.insertMany(seatsToInsert, { ordered: false });
    event.totalSeats = seatsToInsert.length;
    event.availableSeats = seatsToInsert.length;
    await Event.updateOne(
      { _id: event._id },
      {
        totalSeats: seatsToInsert.length,
        availableSeats: seatsToInsert.length,
        ...(venue?._id ? { venue: venue._id } : {}),
      }
    );
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
        .limit(limitNum)
        .lean(),
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
    const event = await Event.findById(req.params.id).populate('venue').lean();

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
      venueName,
      venue: venueObj,
      city,
      date,
      doorsOpen,
      endDate,
      bannerUrl,
      imageUrl,
      thumbnailUrl,
      status,
      pricing,
      cancellationPolicy,
    } = req.body;

    if (!title || !description || !category || !date) {
      return next(
        new AppError(
          'Title, description, category, and date are required',
          400,
          'VALIDATION_ERROR'
        )
      );
    }

    let venue = null;
    if (venueId) {
      venue = await Venue.findById(venueId);
    }

    // If venueId is not provided or not found, resolve or create by venueName or venue object
    const targetVenueName = venueName || venueObj?.name;
    const targetCity = city || venueObj?.city || 'Mumbai';
    const targetAddress = venueObj?.address || `${targetVenueName || 'Main'} Complex`;

    if (!venue && targetVenueName) {
      venue = await Venue.findOne({
        name: { $regex: new RegExp(`^${targetVenueName.trim()}$`, 'i') },
      });

      if (!venue) {
        venue = await Venue.create({
          name: targetVenueName.trim(),
          city: targetCity.trim(),
          address: targetAddress.trim(),
          capacity: 160,
          sections: [
            { name: 'VIP Front Row', category: 'VIP', rows: 5, seatsPerRow: 10 },
            { name: 'Premium Central', category: 'Premium', rows: 5, seatsPerRow: 10 },
            { name: 'General Upper Tier', category: 'General', rows: 5, seatsPerRow: 12 },
          ],
        });
      }
    }

    // Fallback to any existing venue or create default
    if (!venue) {
      venue = await Venue.findOne();
      if (!venue) {
        venue = await Venue.create({
          name: 'Grand Arena',
          city: targetCity,
          address: 'Main Boulevard',
          capacity: 160,
          sections: [
            { name: 'VIP Front Row', category: 'VIP', rows: 5, seatsPerRow: 10 },
            { name: 'Premium Central', category: 'Premium', rows: 5, seatsPerRow: 10 },
            { name: 'General Upper Tier', category: 'General', rows: 5, seatsPerRow: 12 },
          ],
        });
      }
    }

    const eventCity = city || venue.city;
    const finalBanner = bannerUrl || imageUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80';

    const event = await Event.create({
      title,
      description,
      category,
      venue: venue._id,
      city: eventCity,
      date: new Date(date),
      doorsOpen: doorsOpen ? new Date(doorsOpen) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      bannerUrl: finalBanner,
      thumbnailUrl: thumbnailUrl || finalBanner,
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

    const eventResponse = event.toObject();
    eventResponse.venue = venue;

    res.status(201).json({
      success: true,
      data: eventResponse,
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
