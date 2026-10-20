import express from 'express';
import Book from '../models/Book.js';
import Review from '../models/Review.js';
import RecommendationService from '../services/recommendationService.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/books
 * @desc    Get all books with search, genre, mood, rating, and sort filters
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      genre,
      mood,
      pace,
      length,
      minRating,
      sort = 'rating',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search query across title, author, or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { author: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Genre filter
    if (genre && genre !== 'All') {
      query.genres = { $in: [new RegExp(genre, 'i')] };
    }

    // Mood filter
    if (mood && mood !== 'All') {
      query.moodTags = { $in: [new RegExp(mood, 'i')] };
    }

    // Pace filter
    if (pace && pace !== 'All') {
      query.readingPace = pace;
    }

    // Length filter
    if (length) {
      if (length === 'short') query.pageCount = { $lte: 280 };
      else if (length === 'medium') query.pageCount = { $gt: 280, $lte: 450 };
      else if (length === 'epic') query.pageCount = { $gt: 450 };
    }

    // Min rating
    if (minRating) {
      query.averageRating = { $gte: Number(minRating) };
    }

    // Sort order
    let sortOrder = {};
    if (sort === 'rating') sortOrder = { averageRating: -1, ratingsCount: -1 };
    else if (sort === 'newest') sortOrder = { publishedYear: -1, createdAt: -1 };
    else if (sort === 'popular') sortOrder = { ratingsCount: -1 };
    else if (sort === 'title') sortOrder = { title: 1 };
    else if (sort === 'pages_asc') sortOrder = { pageCount: 1 };
    else if (sort === 'pages_desc') sortOrder = { pageCount: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [books, total] = await Promise.all([
      Book.find(query).sort(sortOrder).skip(skip).limit(limitNum).lean(),
      Book.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: {
        books,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/books/featured
 * @desc    Get spotlighted featured books
 */
router.get('/featured', async (req, res, next) => {
  try {
    let books = await Book.find({ featured: true }).limit(6).lean();
    if (books.length === 0) {
      books = await Book.find().sort({ averageRating: -1 }).limit(6).lean();
    }
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/books/trending
 * @desc    Get top trending books
 */
router.get('/trending', async (req, res, next) => {
  try {
    let books = await Book.find({ trending: true }).limit(8).lean();
    if (books.length === 0) {
      books = await Book.find().sort({ ratingsCount: -1, averageRating: -1 }).limit(8).lean();
    }
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/books/genres
 * @desc    Get distinct genres with count of books
 */
router.get('/genres', async (req, res, next) => {
  try {
    const aggregate = await Book.aggregate([
      { $unwind: '$genres' },
      { $group: { _id: '$genres', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const genres = aggregate.map((g) => ({ name: g._id, count: g.count }));
    res.status(200).json({ success: true, data: genres });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/books/:id
 * @desc    Get book details, its reviews, and similar recommendations
 */
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) {
      return res.status(404).json({
        success: false,
        error: { code: 'BOOK_NOT_FOUND', message: 'Book not found' },
      });
    }

    const [similarBooks, reviews] = await Promise.all([
      RecommendationService.getSimilarBooks(book._id, 6),
      Review.find({ book: book._id }).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        book,
        similarBooks,
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/books
 * @desc    Create book (Admin only)
 */
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/books/:id
 * @desc    Update book (Admin only)
 */
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({
        success: false,
        error: { code: 'BOOK_NOT_FOUND', message: 'Book not found' },
      });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete book (Admin only)
 */
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: { code: 'BOOK_NOT_FOUND', message: 'Book not found' },
      });
    }
    res.status(200).json({ success: true, message: 'Book removed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
