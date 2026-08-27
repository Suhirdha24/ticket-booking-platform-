import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import route handlers
import authRoutes from './routes/authRoutes.js';
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
    contentSecurityPolicy: false, // Allows flexible integration in serverless/Vite setup
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration (allow requests from frontend or any origin in production)
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

// Expose GET /api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
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
