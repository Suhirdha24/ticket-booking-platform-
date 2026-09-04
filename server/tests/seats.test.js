import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Venue from '../models/Venue.js';
import Event from '../models/Event.js';
import Seat from '../models/Seat.js';
import User from '../models/User.js';

describe('Seats API & Effective Status', () => {
  let event, user;

  beforeEach(async () => {
    user = await User.create({
      name: 'Tester',
      email: 'tester@example.com',
      password: 'Password@123',
      phone: '9876543211',
    });

    const venue = await Venue.create({
      name: 'Small Hall',
      address: '100 Main St',
      city: 'Austin',
      capacity: 3,
      sections: [{ name: 'A', rows: 1, seatsPerRow: 3, category: 'General' }],
    });

    event = await Event.create({
      title: 'Rock Show',
      description: 'Live band',
      category: 'Concert',
      venue: venue._id,
      city: 'Austin',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      status: 'PUBLISHED',
    });

    // Seat 1: Available
    // Seat 2: Actively Held
    // Seat 3: Expired Held
    const now = Date.now();
    await Seat.create([
      {
        event: event._id,
        venue: venue._id,
        seatNumber: 'A-A1',
        row: 'A',
        section: 'A',
        category: 'General',
        price: 50,
        status: 'AVAILABLE',
      },
      {
        event: event._id,
        venue: venue._id,
        seatNumber: 'A-A2',
        row: 'A',
        section: 'A',
        category: 'General',
        price: 50,
        status: 'HELD',
        heldBy: user._id,
        heldExpiresAt: new Date(now + 3 * 60 * 1000), // in future
      },
      {
        event: event._id,
        venue: venue._id,
        seatNumber: 'A-A3',
        row: 'A',
        section: 'A',
        category: 'General',
        price: 50,
        status: 'HELD',
        heldBy: user._id,
        heldExpiresAt: new Date(now - 10 * 60 * 1000), // in past (expired)
      },
    ]);
  });

  it('6. should retrieve seats and dynamically compute effective status for expired held seats', async () => {
    const res = await request(app).get(`/api/events/${event._id}/seats`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const seats = res.body.data;
    expect(seats.length).toBe(3);

    const seat1 = seats.find((s) => s.seatNumber === 'A-A1');
    const seat2 = seats.find((s) => s.seatNumber === 'A-A2');
    const seat3 = seats.find((s) => s.seatNumber === 'A-A3');

    expect(seat1.status).toBe('AVAILABLE');
    expect(seat2.status).toBe('HELD');
    // Seat 3 had status HELD in DB, but its heldExpiresAt passed, so effective status MUST be AVAILABLE
    expect(seat3.status).toBe('AVAILABLE');
  });
});
