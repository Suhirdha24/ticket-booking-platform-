import 'dotenv/config';
import dns from 'node:dns';
import mongoose from 'mongoose';

// Ensure IPv4 is prioritized for faster socket connection on Windows
if (dns.setDefaultResultOrder) {
  try {
    dns.setDefaultResultOrder('ipv4first');
  } catch (e) {
    // Ignore if not supported
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * and serverless function invocations in Vercel.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Direct shard replica set fallback for cluster0 if SRV query fails or is blocked on local network/ISP
 */
const DIRECT_FALLBACK_URI =
  'mongodb://suhirdhasivakumar_db_user:6g0n1EIqfWMxmlRa@ac-vtazhux-shard-00-00.aucusac.mongodb.net:27017,ac-vtazhux-shard-00-01.aucusac.mongodb.net:27017,ac-vtazhux-shard-00-02.aucusac.mongodb.net:27017/ticket-booking-platform?ssl=true&authSource=admin&replicaSet=atlas-r08rr6-shard-0&retryWrites=true&w=majority';

/**
 * Connect to MongoDB Atlas with connection caching for serverless environments.
 * Prevents redundant connection creation on Vercel Fluid Functions.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI || DIRECT_FALLBACK_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI environment variable is not defined. Please set it in your .env or Vercel Environment Variables.'
    );
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .catch((primaryError) => {
        // If SRV record lookup failed (e.g. ECONNREFUSED on Windows), retry with direct replica set hostnames
        if (uri.startsWith('mongodb+srv://') && DIRECT_FALLBACK_URI) {
          console.warn('⚠️ Atlas SRV resolution failed; retrying with direct replica set hosts...');
          return mongoose.connect(DIRECT_FALLBACK_URI, opts);
        }
        throw primaryError;
      })
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
