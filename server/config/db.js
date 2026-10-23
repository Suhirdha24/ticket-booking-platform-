import 'dotenv/config';
import dns from 'node:dns';
import mongoose from 'mongoose';

// Ensure reliable DNS resolution for MongoDB Atlas SRV records on Windows/local networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if not permitted
}

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
  'mongodb://suhirdhasivakumar_db_user:ZNpH6N6obdIY5za1@ac-kebc8ue-shard-00-00.fnmm7ku.mongodb.net:27017,ac-kebc8ue-shard-00-01.fnmm7ku.mongodb.net:27017,ac-kebc8ue-shard-00-02.fnmm7ku.mongodb.net:27017/ticket-booking-platform?ssl=true&authSource=admin&replicaSet=atlas-kebc8ue-shard-0&retryWrites=true&w=majority';

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
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
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
