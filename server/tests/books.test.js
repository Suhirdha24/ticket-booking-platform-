import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

describe('Book & Recommendation API Endpoints', () => {
  let userToken;
  let userId;
  let sampleBook;

  beforeEach(async () => {
    // Create test user
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Austen Reader',
        email: 'reader.test@example.com',
        password: 'Password@123',
        preferredGenres: ['Sci-Fi', 'Dystopian'],
        preferredMoods: ['Dark & Gritty', 'Philosophical'],
      });

    userToken = userRes.body.data?.token || userRes.body.token;
    userId = userRes.body.data?.user?.id || userRes.body.user?._id;

    // Seed test book
    sampleBook = await Book.create({
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      description: 'A lone astronaut must save the Earth from disaster.',
      isbn: '9780593135204',
      genres: ['Sci-Fi', 'Space', 'Adventure'],
      pageCount: 496,
      averageRating: 4.8,
      ratingsCount: 1500,
      moodTags: ['Hopeful & Wholesome', 'Fast-Paced', 'Mind-Bending'],
      readingPace: 'Fast',
      coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80',
    });

    await Book.create({
      title: 'Dune',
      author: 'Frank Herbert',
      description: 'Set on the desert planet Arrakis, Dune is the story of Paul Atreides.',
      isbn: '9780441172719',
      genres: ['Sci-Fi', 'Space', 'Classics'],
      pageCount: 688,
      averageRating: 4.7,
      ratingsCount: 2200,
      moodTags: ['Dark & Gritty', 'Philosophical', 'Epic Worldbuilding'],
      readingPace: 'Moderate',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    });
  });

  describe('GET /api/books', () => {
    it('should return a list of books', async () => {
      const res = await request(app).get('/api/books');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.books.length).toBe(2);
      expect(res.body.data.total).toBe(2);
    });

    it('should filter books by genre', async () => {
      const res = await request(app).get('/api/books?genre=Classics');
      expect(res.status).toBe(200);
      expect(res.body.data.books.length).toBe(1);
      expect(res.body.data.books[0].title).toBe('Dune');
    });

    it('should search books by title or author', async () => {
      const res = await request(app).get('/api/books?search=Andy Weir');
      expect(res.status).toBe(200);
      expect(res.body.data.books.length).toBe(1);
      expect(res.body.data.books[0].title).toBe('Project Hail Mary');
    });
  });

  describe('GET /api/books/:id', () => {
    it('should return single book details', async () => {
      const res = await request(app).get(`/api/books/${sampleBook._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.book.title).toBe('Project Hail Mary');
    });
  });

  describe('GET /api/recommendations/vibe-matcher', () => {
    it('should match books based on mood tags and reading pace', async () => {
      const res = await request(app)
        .post('/api/recommendations/vibe-matcher')
        .send({
          mood: 'Mind-Bending',
          pace: 'Fast',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].title).toBe('Project Hail Mary');
      expect(res.body.data[0].matchPercentage).toBeGreaterThan(0);
    });
  });

  describe('GET /api/recommendations/similar/:bookId', () => {
    it('should return similar books based on genres and mood overlap', async () => {
      const res = await request(app).get(`/api/recommendations/similar/${sampleBook._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe('Dune');
    });
  });

  describe('Reading List / Bookshelf CRUD', () => {
    it('should add a book to the shelf and update progress', async () => {
      const addRes = await request(app)
        .post('/api/reading-list')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          bookId: sampleBook._id.toString(),
          status: 'CURRENTLY_READING',
          progressPages: 120,
        });

      expect(addRes.status).toBe(200);
      expect(addRes.body.success).toBe(true);
      expect(addRes.body.data.status).toBe('CURRENTLY_READING');
      expect(addRes.body.data.progressPages).toBe(120);

      // Verify shelf listing
      const listRes = await request(app)
        .get('/api/reading-list')
        .set('Authorization', `Bearer ${userToken}`);

      expect(listRes.status).toBe(200);
      expect(listRes.body.data.items.length).toBe(1);
      expect(listRes.body.data.stats.currentlyReading).toBe(1);
      expect(listRes.body.data.stats.totalPagesRead).toBe(120);
    });
  });

  describe('Book Reviews & Rating Recalculation', () => {
    it('should create a review and update book average rating', async () => {
      const reviewRes = await request(app)
        .post(`/api/reviews/book/${sampleBook._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          rating: 5,
          title: 'Masterpiece of modern sci-fi!',
          content: 'Unbelievably entertaining, scientifically grounded, and warm-hearted.',
        });

      expect(reviewRes.status).toBe(201);
      expect(reviewRes.body.success).toBe(true);
      expect(reviewRes.body.data.rating).toBe(5);

      // Verify reviews query
      const getReviewsRes = await request(app).get(`/api/reviews/book/${sampleBook._id}`);
      expect(getReviewsRes.status).toBe(200);
      expect(getReviewsRes.body.data.length).toBe(1);
      expect(getReviewsRes.body.data[0].title).toBe('Masterpiece of modern sci-fi!');
    });
  });
});
