import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from './errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'event_ticket_jwt_super_secret_key_2026';

/**
 * Authenticate incoming request using Bearer JWT
 */
export async function authenticate(req, res, next) {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(
        new AppError(
          'Authentication required. Please provide a valid Bearer token.',
          401,
          'UNAUTHORIZED'
        )
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new AppError(
          'User associated with this token no longer exists.',
          401,
          'USER_NOT_FOUND'
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware: if token is present, resolves req.user, otherwise continues
 */
export async function optionalAuth(req, res, next) {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // If token invalid, simply proceed as unauthenticated without throwing
    next();
  }
}

/**
 * Restrict route to Admin role only
 */
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(
      new AppError(
        'Access forbidden. Administrator privileges are required.',
        403,
        'FORBIDDEN_ADMIN_REQUIRED'
      )
    );
  }
  next();
}

/**
 * Generate JWT token for user
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
}
