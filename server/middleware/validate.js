import { AppError } from './errorHandler.js';

/**
 * Validates registration payload
 */
export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new AppError('Full name is required', 400, 'VALIDATION_ERROR'));
  }

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    return next(
      new AppError('A valid email address is required', 400, 'VALIDATION_ERROR')
    );
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return next(
      new AppError(
        'Password must be at least 6 characters long',
        400,
        'VALIDATION_ERROR'
      )
    );
  }

  const { phone } = req.body;
  if (!phone || typeof phone !== 'string' || phone.trim().replace(/[^0-9]/g, '').length < 10) {
    return next(
      new AppError(
        'A valid 10-digit mobile number is required',
        400,
        'VALIDATION_ERROR'
      )
    );
  }

  next();
}

/**
 * Validates login payload
 */
export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError(
        'Email and password are required',
        400,
        'VALIDATION_ERROR'
      )
    );
  }

  next();
}

/**
 * Validates reservation payload
 */
export function validateReservation(req, res, next) {
  const { eventId, seatIds } = req.body;

  if (!eventId) {
    return next(new AppError('eventId is required', 400, 'VALIDATION_ERROR'));
  }

  if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return next(
      new AppError(
        'seatIds must be a non-empty array of seat IDs',
        400,
        'VALIDATION_ERROR'
      )
    );
  }

  if (seatIds.length > 8) {
    return next(
      new AppError(
        'Cannot reserve more than 8 seats in a single reservation',
        400,
        'MAX_SEATS_EXCEEDED'
      )
    );
  }

  next();
}

/**
 * Validates booking creation payload
 */
export function validateBooking(req, res, next) {
  const { reservationId, paymentMethod } = req.body;

  if (!reservationId) {
    return next(
      new AppError('reservationId is required', 400, 'VALIDATION_ERROR')
    );
  }

  if (!paymentMethod || !['CARD', 'UPI', 'NET_BANKING'].includes(paymentMethod)) {
    return next(
      new AppError(
        'paymentMethod must be one of CARD, UPI, NET_BANKING',
        400,
        'VALIDATION_ERROR'
      )
    );
  }

  next();
}
