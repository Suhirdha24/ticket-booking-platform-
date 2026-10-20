import Book from '../models/Book.js';
import ReadingList from '../models/ReadingList.js';
import User from '../models/User.js';

export class RecommendationService {
  /**
   * Get personalized book recommendations for a user based on their
   * preferred genres, past read books, authors, and favorites.
   */
  static async getPersonalizedRecommendations(userId, limit = 12) {
    let preferredGenres = [];
    let preferredMoods = [];
    let readBookIds = [];
    let favoriteAuthors = new Set();

    if (userId) {
      const [user, readingList] = await Promise.all([
        User.findById(userId).lean(),
        ReadingList.find({ user: userId }).populate('book').lean(),
      ]);

      if (user) {
        preferredGenres = user.preferredGenres || [];
        preferredMoods = user.preferredMoods || [];
      }

      if (readingList && readingList.length > 0) {
        readingList.forEach((item) => {
          if (item.book) {
            readBookIds.push(item.book._id.toString());
            if (item.book.author) favoriteAuthors.add(item.book.author);
            if (item.book.genres && Array.isArray(item.book.genres)) {
              preferredGenres.push(...item.book.genres);
            }
            if (item.book.moodTags && Array.isArray(item.book.moodTags)) {
              preferredMoods.push(...item.book.moodTags);
            }
          }
        });
      }
    }

    // Deduplicate preferences
    preferredGenres = [...new Set(preferredGenres)];
    preferredMoods = [...new Set(preferredMoods)];

    // Fetch candidate books excluding already read/shelved
    const query = readBookIds.length > 0 ? { _id: { $nin: readBookIds } } : {};
    const candidateBooks = await Book.find(query).lean();

    if (!candidateBooks || candidateBooks.length === 0) {
      return await Book.find().sort({ averageRating: -1, ratingsCount: -1 }).limit(limit).lean();
    }

    // Score candidates
    const scoredBooks = candidateBooks.map((book) => {
      let score = 0;
      let matchReasons = [];

      // Genre score
      const matchingGenres = (book.genres || []).filter((g) =>
        preferredGenres.includes(g)
      );
      if (matchingGenres.length > 0) {
        score += matchingGenres.length * 30;
        matchReasons.push(`Matches your genre preference (${matchingGenres.join(', ')})`);
      }

      // Author score
      if (favoriteAuthors.has(book.author)) {
        score += 35;
        matchReasons.push(`More by ${book.author}`);
      }

      // Mood score
      const matchingMoods = (book.moodTags || []).filter((m) =>
        preferredMoods.includes(m)
      );
      if (matchingMoods.length > 0) {
        score += matchingMoods.length * 20;
        matchReasons.push(`Fits your vibe (${matchingMoods.join(', ')})`);
      }

      // Base quality score
      score += (book.averageRating || 4) * 5;
      if (book.featured) score += 10;
      if (book.trending) score += 10;

      // Calculate percentage match (scaled between 75% and 99%)
      const matchPercentage = Math.min(
        99,
        Math.max(76, Math.round(75 + (score / 150) * 24))
      );

      return {
        ...book,
        recommendationScore: score,
        matchPercentage,
        matchReasons: matchReasons.slice(0, 2),
      };
    });

    // Sort descending by score
    scoredBooks.sort((a, b) => b.recommendationScore - a.recommendationScore);
    return scoredBooks.slice(0, limit);
  }

  /**
   * Get similar books to a specific book (Content-Based)
   */
  static async getSimilarBooks(bookId, limit = 6) {
    const targetBook = await Book.findById(bookId).lean();
    if (!targetBook) return [];

    const candidateBooks = await Book.find({ _id: { $ne: bookId } }).lean();

    const scored = candidateBooks.map((book) => {
      let similarity = 0;
      let reasons = [];

      // Author match
      if (book.author === targetBook.author) {
        similarity += 40;
        reasons.push(`Also by ${book.author}`);
      }

      // Common genres
      const commonGenres = (book.genres || []).filter((g) =>
        (targetBook.genres || []).includes(g)
      );
      similarity += commonGenres.length * 25;
      if (commonGenres.length > 0) {
        reasons.push(`Shared genres: ${commonGenres.join(', ')}`);
      }

      // Common mood tags
      const commonMoods = (book.moodTags || []).filter((m) =>
        (targetBook.moodTags || []).includes(m)
      );
      similarity += commonMoods.length * 15;

      // Rating quality
      similarity += (book.averageRating || 4) * 3;

      const matchPercentage = Math.min(
        99,
        Math.max(78, Math.round(78 + (similarity / 120) * 21))
      );

      return {
        ...book,
        similarityScore: similarity,
        matchPercentage,
        matchReasons: reasons.slice(0, 2),
      };
    });

    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, limit);
  }

  /**
   * Interactive Mood & Vibe Quiz Matcher
   */
  static async getMoodRecommendations({ mood, genre, pace, length, limit = 12 }) {
    const filter = {};

    if (genre && genre !== 'All' && genre !== 'Surprise Me') {
      filter.genres = { $in: [new RegExp(genre, 'i')] };
    }

    if (pace && pace !== 'Any') {
      filter.readingPace = pace;
    }

    if (length) {
      if (length === 'short') filter.pageCount = { $lte: 280 };
      else if (length === 'medium') filter.pageCount = { $gt: 280, $lte: 450 };
      else if (length === 'epic') filter.pageCount = { $gt: 450 };
    }

    let books = await Book.find(filter).lean();

    // If too few results, loosen filters to ensure user always gets great recommendations
    if (books.length < 3) {
      books = await Book.find().lean();
    }

    // Rank by mood keyword affinity
    const scored = books.map((book) => {
      let score = 50;
      let reasons = [];

      if (mood) {
        const moodLower = mood.toLowerCase();
        const hasMood = (book.moodTags || []).some((m) =>
          m.toLowerCase().includes(moodLower)
        );
        if (hasMood) {
          score += 35;
          reasons.push(`Perfect for "${mood}" mood`);
        }
      }

      if (genre && genre !== 'All') {
        const hasGenre = (book.genres || []).some((g) =>
          g.toLowerCase().includes(genre.toLowerCase())
        );
        if (hasGenre) {
          score += 25;
          reasons.push(`Genre: ${genre}`);
        }
      }

      if (pace && book.readingPace === pace) {
        score += 15;
        reasons.push(`${pace} pacing`);
      }

      score += (book.averageRating || 4) * 4;

      const matchPercentage = Math.min(
        99,
        Math.max(82, Math.round(80 + (score / 120) * 19))
      );

      return {
        ...book,
        quizScore: score,
        matchPercentage,
        matchReasons: reasons.length > 0 ? reasons : ['Top community rating'],
      };
    });

    scored.sort((a, b) => b.quizScore - a.quizScore);
    return scored.slice(0, limit);
  }
}

export default RecommendationService;
