import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Venue from '../models/Venue.js';
import Event from '../models/Event.js';
import Seat from '../models/Seat.js';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import { generateToken } from '../middleware/auth.js';

describe('CRITICAL Concurrency: Race Condition Seat Collisions', () => {
  let userA, userB, tokenA, tokenB, event, singleSeat;

  beforeEach(async () => {
    // 1. Create two distinct users
    userA = await User.create({
      name: 'User Alpha',
      email: 'alpha@example.com',
      password: 'Password@123',
      phone: '9876543215',
    });
    tokenA = generateToken(userA);

    userB = await User.create({
      name: 'User Beta',
      email: 'beta@example.com',
      password: 'Password@123',
      phone: '9876543216',
    });
    tokenB = generateToken(userB);

    // 2. Create venue
    const venue = await Venue.create({
      name: 'Collision Arena',
      address: '100 Speed Way',
      city: 'Austin',
      capacity: 1,
      sections: [{ name: 'VIP', rows: 1, seatsPerRow: 1, category: 'VIP' }],
    });

    // 3. Create single event
    event = await Event.create({
      title: 'High Demand Soldout Show',
      description: 'Only 1 seat available!',
      category: 'Concert',
      venue: venue._id,
      city: 'Austin',
      date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      status: 'PUBLISHED',
      totalSeats: 1,
      availableSeats: 1,
    });

    // 4. Create single seat
    singleSeat = await Seat.create({
      event: event._id,
      venue: venue._id,
      seatNumber: 'VIP-A1',
      row: 'A',
      section: 'VIP',
      category: 'VIP',
      price: 250,
      status: 'AVAILABLE',
      version: 0,
    });
  });

  it('15. CRITICAL TEST: exactly ONE concurrent reservation succeeds (201) and ONE fails (409 Conflict)', async () => {
    // Run two simultaneous reservation requests for the EXACT SAME seat ID
    const requestA = request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        eventId: event._id,
        seatIds: [singleSeat._id],
      });

    const requestB = request(app)
      .post('/api/reservations')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        eventId: event._id,
        seatIds: [singleSeat._id],
      });

    // Await both promises executed in parallel
    const [resA, resB] = await Promise.all([requestA, requestB]);

    const results = [resA, resB];
    const successes = results.filter((r) => r.status === 201);
    const conflicts = results.filter((r) => r.status === 409);

    // STRICT EXPECTATIONS:
    // Exactly ONE request must succeed (201)
    expect(successes.length).toBe(1);

    // Exactly ONE request must receive 409 Conflict
    expect(conflicts.length).toBe(1);

    // The failing response MUST return the standard error envelope with SEAT_ALREADY_HELD
    const failedResponse = conflicts[0];
    expect(failedResponse.body.success).toBe(false);
    expect(failedResponse.body.error.code).toBe('SEAT_ALREADY_HELD');

    // Verify in database that exactly ONE active reservation exists
    const activeReservations = await Reservation.find({
      event: event._id,
      status: 'ACTIVE',
    });
    expect(activeReservations.length).toBe(1);

    // Verify seat is held by the winning user
    const winningUserId = successes[0].body.data.reservationId;
    const finalSeatState = await Seat.findById(singleSeat._id);
    expect(finalSeatState.status).toBe('HELD');
    expect(finalSeatState.reservation.toString()).toBe(
      winningUserId.toString()
    );
  });
});
