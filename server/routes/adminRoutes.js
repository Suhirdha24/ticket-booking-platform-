import express from 'express';
import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import Venue from '../models/Venue.js';
import User from '../models/User.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Enforce admin auth on all admin routes
router.use(authenticate, requireAdmin);

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard metrics & aggregations
 * @access  Private (Admin)
 */
router.get('/dashboard', async (req, res, next) => {
  try {
    const now = new Date();

    // Aggregations using MongoDB facet pipeline
    const [statsResult, revenueByCategory, recentBookings, totalUsers] =
      await Promise.all([
        Booking.aggregate([
          {
            $facet: {
              overview: [
                {
                  $group: {
                    _id: null,
                    totalBookings: { $sum: 1 },
                    confirmedBookings: {
                      $sum: {
                        $cond: [{ $eq: ['$bookingStatus', 'CONFIRMED'] }, 1, 0],
                      },
                    },
                    cancelledBookings: {
                      $sum: {
                        $cond: [{ $eq: ['$bookingStatus', 'CANCELLED'] }, 1, 0],
                      },
                    },
                    totalRevenue: {
                      $sum: {
                        $cond: [
                          { $eq: ['$bookingStatus', 'CONFIRMED'] },
                          '$total',
                          0,
                        ],
                      },
                    },
                    ticketsSold: {
                      $sum: {
                        $cond: [
                          { $eq: ['$bookingStatus', 'CONFIRMED'] },
                          { $size: '$seats' },
                          0,
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
        ]),

        // Revenue by category aggregation
        Booking.aggregate([
          { $match: { bookingStatus: 'CONFIRMED' } },
          {
            $group: {
              _id: '$eventSnapshot.category',
              revenue: { $sum: '$total' },
              bookingsCount: { $sum: 1 },
              ticketsCount: { $sum: { $size: '$seats' } },
            },
          },
          { $sort: { revenue: -1 } },
        ]),

        // Recent 8 bookings
        Booking.find()
          .populate('user', 'name email')
          .sort({ createdAt: -1 })
          .limit(8)
          .lean(),

        User.countDocuments({ role: 'user' }),
      ]);

    const overview = statsResult[0]?.overview[0] || {
      totalBookings: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      ticketsSold: 0,
    };

    const [totalEvents, upcomingEvents, totalVenues] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: now }, status: 'PUBLISHED' }),
      Venue.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        upcomingEvents,
        totalVenues,
        totalUsers,
        totalBookings: overview.totalBookings,
        confirmedBookings: overview.confirmedBookings,
        cancelledBookings: overview.cancelledBookings,
        totalRevenue: Math.round(overview.totalRevenue * 100) / 100,
        ticketsSold: overview.ticketsSold,
        revenueByCategory: revenueByCategory.map((c) => ({
          category: c._id || 'Uncategorized',
          revenue: Math.round(c.revenue * 100) / 100,
          bookingsCount: c.bookingsCount,
          ticketsCount: c.ticketsCount,
        })),
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/admin/events
 * @desc    Get all events with ticket sales stats
 * @access  Private (Admin)
 */
router.get('/events', async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate('venue', 'name city capacity')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/admin/bookings
 * @desc    Get all bookings with filters & pagination
 * @access  Private (Admin)
 */
router.get('/bookings', async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.bookingStatus = status;
    }

    if (search && search.trim()) {
      query.$or = [
        { bookingReference: { $regex: search.trim(), $options: 'i' } },
        { 'eventSnapshot.title': { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('user', 'name email phone')
        .populate('event', 'title date city')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Booking.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        bookings,
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

export default router;
