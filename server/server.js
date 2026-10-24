import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

/**
 * Local Development Server ONLY.
 * Production deployment on Vercel uses serverless functions in api/index.js
 * and does not depend on app.listen().
 */
const server = app.listen(PORT, () => {
  console.log(`🚀 Local dev server running on http://localhost:${PORT}`);
  console.log(`📡 Health endpoint: http://localhost:${PORT}/api/health`);
});

// Connect to MongoDB Atlas with auto-buffering so early requests don't drop
if (process.env.MONGODB_URI) {
  connectDB()
    .then(() => {
      console.log('✅ MongoDB connection established successfully');
    })
    .catch((error) => {
      console.error('❌ Failed to connect to MongoDB Atlas:', error.message);
    });
} else {
  console.warn('⚠️ MONGODB_URI is not set. Run with MongoDB configured or in test mode.');
}

export default server;

