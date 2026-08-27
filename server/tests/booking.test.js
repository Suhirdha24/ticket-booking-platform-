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

describe('Booking & Payment API', () => {
  let user, token, event, seat, reservation;

  beforeEach(async () => {
    user = await User.create({
      name: 'Booking Tester',
      email: 'booker@example.com',
      password: 'Password@123',
    });
    token = generateToken(user);

    const venue = await Venue.create({
      name: 'Stage One',
      address: '789 Grand Ave',
      city: 'Chicago',
      capacity: 1,
      sections: [{ name: 'VIP', rows: 1, seatsPerRow: 1, category: 'VIP' }],
    });

    event = await Event.create({
      title: 'Grand Gala',
      description: 'Annual dinner & live performance',
      category: 'Theatre',
      venue: venue._id,
      city: 'Chicago',
      date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      status: 'PUBLISHED',
      totalSeats: 1,
      availableSeats: 1,
    });

    seat = await Seat.create({
      event: event._id,
      venue: venue._id,
      seatNumber: 'VIP-A1',
      row: 'A',
      section: 'VIP',
      category: 'VIP',
      price: 150,
      status: 'AVAILABLE',
    });

    // Create active reservation
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        eventId: event._id,
        seatIds: [seat._id],
      });

    reservation = res.body.data;
  });

  it('10. should complete a confirmed booking with snapshot and QR token on valid payment', async () => {
    const bookRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reservationId: reservation.reservationId,
        paymentMethod: 'CARD',
        paymentDetails: { cardNumber: '4000123456789010' },
      });

    expect(bookRes.status).toBe(201);
    expect(bookRes.body.success).toBe(true);
    const booking = bookRes.body.data;
    expect(booking.bookingStatus).toBe('CONFIRMED');
    expect(booking.paymentStatus).toBe('PAID');
    expect(booking.bookingReference).toMatch(/^BK-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
    expect(booking.qrToken).toBeDefined();
    expect(booking.eventSnapshot.title).toBe('Grand Gala');
    expect(booking.priceSnapshot.length).toBe(1);

    // Verify seat is now marked BOOKED in database
    const bookedSeat = await Seat.findById(seat._id);
    expect(bookedSeat.status).toBe('BOOKED');
  });

  it('11. should handle payment failure and avoid confirming the booking', async () => {
    const failRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reservationId: reservation.reservationId,
        paymentMethod: 'CARD',
        simulateFailure: true,
      });

    expect(failRes.status).toBe(400);
    expect(failRes.body.success).toBe(false);
    expect(failRes.body.error.code).toBe('PAYMENT_FAILED');

    // Verify no booking was created
    const bookingCount = await Booking.countDocuments();
    expect(bookingCount).toBe(0);

    // Seat should still not be marked BOOKED
    const seatDoc = await Seat.findById(seat._id);
    expect(seatDoc.status).not.toBe('BOOKED');
  });

  it('12. should reject duplicate booking attempt for the same completed reservation', async () => {
    // 1st booking attempt
    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reservationId: reservation.reservationId,
        paymentMethod: 'CARD',
      });

    // 2nd booking attempt with same reservation
    const dupRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        reservationId: reservation.reservationId,
        paymentMethod: 'CARD',
      });

    expect(dupRes.status).toBe(400);
    expect(dupRes.body.success).toBe(false);
    expect(dupRes.body.error.code).toBe('RESERVATION_INACTIVE');
  });
});
