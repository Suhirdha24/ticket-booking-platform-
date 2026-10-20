import express from 'express';
import RecommendationService from '../services/recommendationService.js';
import { optionalAuth, protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/recommendations/for-you
 * @desc    Get smart personalized recommendations for the authenticated user or guest
 */
router.get('/for-you', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const limit = parseInt(req.query.limit, 10) || 12;
    const recommendations =
      await RecommendationService.getPersonalizedRecommendations(userId, limit);

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/recommendations/vibe-matcher
 * @desc    Interactive mood & vibe matching quiz
 */
router.post('/vibe-matcher', async (req, res, next) => {
  try {
    const { mood, genre, pace, length, limit = 12 } = req.body;
    const recommendations = await RecommendationService.getMoodRecommendations({
      mood,
      genre,
      pace,
      length,
      limit,
    });

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/recommendations/similar/:bookId
 * @desc    Get similar book recommendations for a book
 */
router.get('/similar/:bookId', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const recommendations = await RecommendationService.getSimilarBooks(
      req.params.bookId,
      limit
    );

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
