import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Venue from '../models/Venue.js';
import Event from '../models/Event.js';
import Seat from '../models/Seat.js';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import Booking from '../models/Booking.js';
import { generateToken } from '../middleware/auth.js';

describe('Cancellation API & Policy Enforcement', () => {
  let user, token, venue;

  beforeEach(async () => {
    user = await User.create({
      name: 'Cancel Tester',
      email: 'canceler@example.com',
      password: 'Password@123',
      phone: '9876543214',
    });
    token = generateToken(user);

    venue = await Venue.create({
      name: 'Opera House',
      address: '500 Opera Plaza',
      city: 'Boston',
      capacity: 1,
      sections: [{ name: 'A', rows: 1, seatsPerRow: 1, category: 'General' }],
    });
  });

  it('14. should permit cancellation and release seat to AVAILABLE if > 24h before event', async () => {
    // Event 5 days in the future
    const event = await Event.create({
      title: 'Future Concert',
      description: 'Concert in 5 days',
      category: 'Concert',
      venue: venue._id,
      city: 'Boston',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      cancellationPolicy: { allowCancellation: true, cutoffHours: 24 },
      status: 'PUBLISHED',
      totalSeats: 1,
      availableSeats: 0,
    });

    const seat = await Seat.create({
      event: event._id,
      venue: venue._id,
      seatNumber: 'A-A1',
      row: 'A',
      section: 'A',
      category: 'General',
      price: 50,
      status: 'BOOKED',
    });

    const reservation = await Reservation.create({
      user: user._id,
      event: event._id,
      seats: [seat._id],
      status: 'COMPLETED',
      expiresAt: new Date(),
    });

    const booking = await Booking.create({
      user: user._id,
      event: event._id,
      reservation: reservation._id,
      seats: [seat._id],
      eventSnapshot: {
        title: event.title,
        category: event.category,
        date: event.date,
        venueName: venue.name,
        venueCity: event.city,
      },
      venueSnapshot: { name: venue.name, city: event.city },
      priceSnapshot: [
        {
          seatNumber: 'A-A1',
          row: 'A',
          section: 'A',
          category: 'General',
          price: 50,
        },
      ],
      subtotal: 50,
      convenienceFee: 2.5,
      total: 52.5,
      paymentDetails: {
        transactionId: 'TXN_TEST',
        paymentMethod: 'CARD',
        paymentStatus: 'SUCCESS',
      },
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      bookingReference: 'BK-TEST-CANCEL',
      qrToken: 'dummy_token',
    });

    const cancelRes = await request(app)
      .post(`/api/bookings/${booking._id}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.success).toBe(true);

    // Verify booking status
    const updatedBooking = await Booking.findById(booking._id);
    expect(updatedBooking.bookingStatus).toBe('CANCELLED');
    expect(updatedBooking.paymentStatus).toBe('REFUNDED');

    // Verify seat is released back to AVAILABLE
    const releasedSeat = await Seat.findById(seat._id);
    expect(releasedSeat.status).toBe('AVAILABLE');
  });

  it('14b. should reject cancellation if event starts within cutoff (< 24h)', async () => {
    // Event starting in 2 hours
    const urgentEvent = await Event.create({
      title: 'Tonight Event',
      description: 'Starting soon',
      category: 'Concert',
      venue: venue._id,
      city: 'Boston',
      date: new Date(Date.now() + 2 * 60 * 60 * 1000), // in 2 hours
      cancellationPolicy: { allowCancellation: true, cutoffHours: 24 },
      status: 'PUBLISHED',
      totalSeats: 1,
      availableSeats: 0,
    });

    const seat = await Seat.create({
      event: urgentEvent._id,
      venue: venue._id,
      seatNumber: 'A-A1',
      row: 'A',
      section: 'A',
      category: 'General',
      price: 50,
      status: 'BOOKED',
    });

    const reservation = await Reservation.create({
      user: user._id,
      event: urgentEvent._id,
      seats: [seat._id],
      status: 'COMPLETED',
      expiresAt: new Date(),
    });

    const booking = await Booking.create({
      user: user._id,
      event: urgentEvent._id,
      reservation: reservation._id,
      seats: [seat._id],
      eventSnapshot: {
        title: urgentEvent.title,
        category: urgentEvent.category,
        date: urgentEvent.date,
        venueName: venue.name,
        venueCity: urgentEvent.city,
      },
      venueSnapshot: { name: venue.name, city: urgentEvent.city },
      priceSnapshot: [
        {
          seatNumber: 'A-A1',
          row: 'A',
          section: 'A',
          category: 'General',
          price: 50,
        },
      ],
      subtotal: 50,
      convenienceFee: 2.5,
      total: 52.5,
      paymentDetails: {
        transactionId: 'TXN_TEST',
        paymentMethod: 'CARD',
        paymentStatus: 'SUCCESS',
      },
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      bookingReference: 'BK-TEST-NOCANCEL',
      qrToken: 'dummy_token',
    });

    const cancelRes = await request(app)
      .post(`/api/bookings/${booking._id}/cancel`)
      .set('Authorization', `Bearer ${token}`);

    expect(cancelRes.status).toBe(400);
    expect(cancelRes.body.success).toBe(false);
    expect(cancelRes.body.error.code).toBe('CANCELLATION_DEADLINE_PASSED');
  });
});
