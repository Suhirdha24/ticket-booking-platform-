import express from 'express';
import Venue from '../models/Venue.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route   GET /api/venues
 * @desc    Get all venues
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const venues = await Venue.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: venues,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/venues/:id
 * @desc    Get venue by ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return next(new AppError('Venue not found', 404, 'VENUE_NOT_FOUND'));
    }
    res.status(200).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/venues
 * @desc    Create new venue
 * @access  Private (Admin only)
 */
router.post('/', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const {
      name,
      address,
      city,
      state,
      zipCode,
      country,
      capacity,
      sections,
      imageUrl,
    } = req.body;

    if (!name || !address || !city || !capacity) {
      return next(
        new AppError(
          'Name, address, city, and capacity are required',
          400,
          'VALIDATION_ERROR'
        )
      );
    }

    const venue = await Venue.create({
      name,
      address,
      city,
      state,
      zipCode,
      country,
      capacity,
      sections: sections || [],
      imageUrl,
    });

    res.status(201).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/venues/:id
 * @desc    Update venue
 * @access  Private (Admin only)
 */
router.put('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!venue) {
      return next(new AppError('Venue not found', 404, 'VENUE_NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      data: venue,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/venues/:id
 * @desc    Delete venue
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res, next) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) {
      return next(new AppError('Venue not found', 404, 'VENUE_NOT_FOUND'));
    }

    res.status(200).json({
      success: true,
      message: 'Venue deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
