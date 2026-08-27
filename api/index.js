import app from '../server/app.js';
import { connectDB } from '../server/config/db.js';

/**
 * Vercel Serverless Function entry point.
 * Ensures the cached MongoDB connection is initialized before dispatching
 * requests to the Express application handler.
 */
export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (dbError) {
    console.error('Failed to establish database connection in serverless function:', dbError);
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_CONNECTION_ERROR',
        message: 'Could not connect to database',
      },
    });
  }

  return app(req, res);
}
