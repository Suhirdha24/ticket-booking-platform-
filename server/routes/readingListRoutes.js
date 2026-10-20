import express from 'express';
import ReadingList from '../models/ReadingList.js';
import Book from '../models/Book.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All reading list routes require authentication
router.use(protect);

/**
 * @route   GET /api/reading-list
 * @desc    Get user's bookshelf (WANT_TO_READ, CURRENTLY_READING, COMPLETED, or all)
 */
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };

    if (status) {
      filter.status = status;
    }

    const items = await ReadingList.find(filter)
      .populate('book')
      .sort({ updatedAt: -1 })
      .lean();

    // Calculate reading stats for the user
    const stats = {
      totalShelved: items.length,
      wantToRead: items.filter((i) => i.status === 'WANT_TO_READ').length,
      currentlyReading: items.filter((i) => i.status === 'CURRENTLY_READING').length,
      completed: items.filter((i) => i.status === 'COMPLETED').length,
      favorites: items.filter((i) => i.isFavorite).length,
      totalPagesRead: items.reduce((acc, curr) => {
        if (curr.status === 'COMPLETED' && curr.book?.pageCount) {
          return acc + curr.book.pageCount;
        }
        return acc + (curr.progressPages || 0);
      }, 0),
    };

    res.status(200).json({
      success: true,
      data: {
        items,
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/reading-list
 * @desc    Add or update a book on user's shelf
 */
router.post('/', async (req, res, next) => {
  try {
    const {
      bookId,
      status = 'WANT_TO_READ',
      progressPages,
      userRating,
      personalNotes,
      isFavorite,
    } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        error: { code: 'BOOK_REQUIRED', message: 'Book ID is required' },
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: { code: 'BOOK_NOT_FOUND', message: 'Book not found' },
      });
    }

    let item = await ReadingList.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (item) {
      if (status) item.status = status;
      if (progressPages !== undefined) item.progressPages = Math.min(book.pageCount, Math.max(0, progressPages));
      if (userRating !== undefined) item.userRating = userRating;
      if (personalNotes !== undefined) item.personalNotes = personalNotes;
      if (isFavorite !== undefined) item.isFavorite = isFavorite;

      if (status === 'CURRENTLY_READING' && !item.startedAt) {
        item.startedAt = new Date();
      }
      if (status === 'COMPLETED') {
        item.completedAt = new Date();
        item.progressPages = book.pageCount;
      }

      await item.save();
    } else {
      item = await ReadingList.create({
        user: req.user._id,
        book: bookId,
        status,
        progressPages: progressPages || (status === 'COMPLETED' ? book.pageCount : 0),
        userRating,
        personalNotes,
        isFavorite: isFavorite || false,
        startedAt: status === 'CURRENTLY_READING' ? new Date() : null,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      });
    }

    const populated = await ReadingList.findById(item._id).populate('book');

    res.status(200).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/reading-list/:bookId
 * @desc    Remove a book from user's shelf
 */
router.delete('/:bookId', async (req, res, next) => {
  try {
    await ReadingList.findOneAndDelete({
      user: req.user._id,
      book: req.params.bookId,
    });

    res.status(200).json({
      success: true,
      message: 'Book removed from shelf',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
