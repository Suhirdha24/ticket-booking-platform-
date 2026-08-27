import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

/**
 * Local Development Server ONLY.
 * Production deployment on Vercel uses serverless functions in api/index.js
 * and does not depend on app.listen().
 */
async function startLocalServer() {
  try {
    if (process.env.MONGODB_URI) {
      await connectDB();
      console.log('✅ MongoDB connection established successfully');
    } else {
      console.warn('⚠️ MONGODB_URI is not set. Run with MongoDB configured or in test mode.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Local dev server running on http://localhost:${PORT}`);
      console.log(`📡 Health endpoint: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start local development server:', error);
    process.exit(1);
  }
}

startLocalServer();
