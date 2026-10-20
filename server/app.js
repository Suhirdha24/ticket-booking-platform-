import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import Book Recommendation route handlers
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import readingListRoutes from './routes/readingListRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

// Legacy / platform routes
import eventRoutes from './routes/eventRoutes.js';
import venueRoutes from './routes/venueRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import error handlers
import {
  notFoundHandler,
  centralizedErrorHandler,
} from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Security headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// JSON body parser with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'BookVerse Recommendation API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Register Book Recommendation API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/reading-list', readingListRoutes);
app.use('/api/reviews', reviewRoutes);

// Register legacy event routes for compatibility
app.use('/api/events/:eventId/seats', seatRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Register 404 handler for unmatched routes
app.use(notFoundHandler);

// Register Centralized Error Handler
app.use(centralizedErrorHandler);

export default app;
