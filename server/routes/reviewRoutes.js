import express from 'express';
import Review from '../models/Review.js';
import Book from '../models/Book.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * Helper to update Book rating metrics
 */
async function updateBookRating(bookId) {
  const reviews = await Review.find({ book: bookId });
  if (reviews.length === 0) {
    await Book.findByIdAndUpdate(bookId, {
      averageRating: 4.5,
      ratingsCount: 0,
    });
    return;
  }
  const avg =
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
  await Book.findByIdAndUpdate(bookId, {
    averageRating: Math.round(avg * 10) / 10,
    ratingsCount: reviews.length,
  });
}

/**
 * @route   GET /api/reviews/book/:bookId
 * @desc    Get all reviews for a book
 */
router.get('/book/:bookId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/reviews/book/:bookId
 * @desc    Create or update a user's review for a book
 */
router.post('/book/:bookId', protect, async (req, res, next) => {
  try {
    const { rating, title, content } = req.body;
    const bookId = req.params.bookId;

    if (!rating || !title || !content) {
      return res.status(400).json({
        success: false,
        error: { code: 'FIELDS_REQUIRED', message: 'Rating, title, and review content are required' },
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: { code: 'BOOK_NOT_FOUND', message: 'Book not found' },
      });
    }

    let review = await Review.findOne({
      book: bookId,
      user: req.user._id,
    });

    if (review) {
      review.rating = rating;
      review.title = title;
      review.content = content;
      await review.save();
    } else {
      review = await Review.create({
        book: bookId,
        user: req.user._id,
        userName: req.user.name,
        userAvatar: req.user.avatar || '',
        rating,
        title,
        content,
      });
    }

    await updateBookRating(bookId);

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete review
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        error: { code: 'REVIEW_NOT_FOUND', message: 'Review not found' },
      });
    }

    // Only review owner or admin can delete
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Not authorized to delete this review' },
      });
    }

    const bookId = review.book;
    await review.deleteOne();
    await updateBookRating(bookId);

    res.status(200).json({
      success: true,
      message: 'Review deleted',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
