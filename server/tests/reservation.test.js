import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Venue from '../models/Venue.js';
import Event from '../models/Event.js';
import Seat from '../models/Seat.js';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import { generateToken } from '../middleware/auth.js';

describe('Reservation API', () => {
  let user1, user2, token1, token2, event, seat1, seat2;

  beforeEach(async () => {
    user1 = await User.create({
      name: 'User One',
      email: 'user1@example.com',
      password: 'Password@123',
      phone: '9876543212',
    });
    token1 = generateToken(user1);

    user2 = await User.create({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'Password@123',
      phone: '9876543213',
    });
    token2 = generateToken(user2);

    const venue = await Venue.create({
      name: 'Test Venue',
      address: '123 Test St',
      city: 'Seattle',
      capacity: 2,
      sections: [{ name: 'A', rows: 1, seatsPerRow: 2, category: 'General' }],
    });

    event = await Event.create({
      title: 'Test Concert',
      description: 'A test concert',
      category: 'Concert',
      venue: venue._id,
      city: 'Seattle',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      status: 'PUBLISHED',
    });

    seat1 = await Seat.create({
      event: event._id,
      venue: venue._id,
      seatNumber: 'A-A1',
      row: 'A',
      section: 'A',
      category: 'General',
      price: 50,
      status: 'AVAILABLE',
    });

    seat2 = await Seat.create({
      event: event._id,
      venue: venue._id,
      seatNumber: 'A-A2',
      row: 'A',
      section: 'A',
      category: 'General',
      price: 50,
      status: 'AVAILABLE',
    });
  });

  it('7. should create a successful 5-minute seat reservation', async () => {
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        eventId: event._id,
        seatIds: [seat1._id],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.reservationId).toBeDefined();
    expect(res.body.data.expiresAt).toBeDefined();

    // Verify seat status changed to HELD
    const updatedSeat = await Seat.findById(seat1._id);
    expect(updatedSeat.status).toBe('HELD');
    expect(updatedSeat.heldBy.toString()).toBe(user1._id.toString());
  });

  it('8. should reject booking if reservation has expired', async () => {
    // Create an already expired reservation
    const pastExpiresAt = new Date(Date.now() - 5000);
    const reservation = await Reservation.create({
      user: user1._id,
      event: event._id,
      seats: [seat1._id],
      status: 'ACTIVE',
      expiresAt: pastExpiresAt,
    });

    await Seat.findByIdAndUpdate(seat1._id, {
      status: 'HELD',
      heldBy: user1._id,
      reservation: reservation._id,
      heldExpiresAt: pastExpiresAt,
    });

    const bookRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        reservationId: reservation._id,
        paymentMethod: 'CARD',
      });

    expect(bookRes.status).toBe(400);
    expect(bookRes.body.success).toBe(false);
    expect(bookRes.body.error.code).toBe('RESERVATION_EXPIRED');
  });

  it('9. should enforce reservation ownership (user cannot book someone elses reservation)', async () => {
    // User 1 reserves seat
    const res = await request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${token1}`)
      .send({
        eventId: event._id,
        seatIds: [seat1._id],
      });

    const reservationId = res.body.data.reservationId;

    // User 2 attempts to book User 1's reservation
    const bookRes = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        reservationId,
        paymentMethod: 'CARD',
      });

    expect(bookRes.status).toBe(403);
    expect(bookRes.body.success).toBe(false);
    expect(bookRes.body.error.code).toBe('FORBIDDEN_RESERVATION');
  });
});
