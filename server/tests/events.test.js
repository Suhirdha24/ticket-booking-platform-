import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import Venue from '../models/Venue.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

describe('Events API', () => {
  let venue;

  beforeEach(async () => {
    venue = await Venue.create({
      name: 'San Francisco Symphony',
      address: '201 Van Ness Ave',
      city: 'San Francisco',
      capacity: 100,
      sections: [{ name: 'VIP Front', rows: 2, seatsPerRow: 5, category: 'VIP' }],
    });

    await Event.create([
      {
        title: 'Cyberpunk Electro Night',
        description: 'Electronic synthwave concert in downtown SF',
        category: 'Concert',
        venue: venue._id,
        city: 'San Francisco',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        pricing: [{ category: 'VIP', price: 120 }],
        status: 'PUBLISHED',
      },
      {
        title: 'Deep Learning Developer Summit',
        description: 'AI conference with world class researchers',
        category: 'Conference',
        venue: venue._id,
        city: 'San Francisco',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        pricing: [{ category: 'VIP', price: 250 }],
        status: 'PUBLISHED',
      },
    ]);
  });

  it('5. should discover events and support category and search filtering', async () => {
    // Discovery
    const allRes = await request(app).get('/api/events');
    expect(allRes.status).toBe(200);
    expect(allRes.body.success).toBe(true);
    expect(allRes.body.data.events.length).toBe(2);

    // Search query filter
    const searchRes = await request(app).get('/api/events?search=synthwave');
    expect(searchRes.status).toBe(200);
    expect(searchRes.body.data.events.length).toBe(1);
    expect(searchRes.body.data.events[0].title).toBe('Cyberpunk Electro Night');

    // Category filter
    const categoryRes = await request(app).get('/api/events?category=Conference');
    expect(categoryRes.status).toBe(200);
    expect(categoryRes.body.data.events.length).toBe(1);
    expect(categoryRes.body.data.events[0].category).toBe('Conference');
  });
});
