import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Venue from '../models/Venue.js';
import Event from '../models/Event.js';
import Seat from '../models/Seat.js';
import Reservation from '../models/Reservation.js';
import Booking from '../models/Booking.js';
import { generateSeatsForEvent } from '../routes/eventRoutes.js';

dotenv.config();

// Ensure reliable DNS resolution for Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where setServers is restricted
}

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket-booking-platform';

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to MongoDB for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database');

    console.log('🧹 Cleaning existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Venue.deleteMany({}),
      Event.deleteMany({}),
      Seat.deleteMany({}),
      Reservation.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    console.log('👤 Seeding Users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'Admin@123456',
      role: 'admin',
      phone: '+1 (555) 019-2834',
    });

    const standardUser = await User.create({
      name: 'Jane Doe',
      email: 'user@example.com',
      password: 'User@123456',
      role: 'user',
      phone: '+1 (555) 482-9102',
    });

    const testUser2 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'User@123456',
      role: 'user',
      phone: '+1 (555) 392-1188',
    });

    console.log('🏛️ Seeding Venues...');
    const venuesData = [
      {
        name: 'Grand Symphony Hall',
        address: '401 Van Ness Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        capacity: 124,
        imageUrl:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Orchestra VIP', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Mezzanine', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Balcony Tier', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },
      {
        name: 'Cyber Arena & Stadium',
        address: '1100 Congress Ave',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        capacity: 162,
        imageUrl:
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Floor Stage Front', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Lower Bowl Club', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'Upper Deck', rows: 6, seatsPerRow: 14, category: 'General' },
        ],
      },
      {
        name: 'The Royal Broadway Playhouse',
        address: '242 W 45th St',
        city: 'New York',
        state: 'NY',
        zipCode: '10036',
        capacity: 104,
        imageUrl:
          'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Royal Stalls', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Dress Circle', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Upper Gallery', rows: 4, seatsPerRow: 10, category: 'General' },
        ],
      },
      {
        name: 'Neon Horizon Center',
        address: '305 Harrison St',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98109',
        capacity: 104,
        imageUrl:
          'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Sky Lounge', rows: 2, seatsPerRow: 8, category: 'VIP' },
          { name: 'Main Tier', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Horizon General', rows: 4, seatsPerRow: 12, category: 'General' },
        ],
      },
    ];

    const venues = await Venue.insertMany(venuesData);
    const [sfHall, austinArena, nyTheatre, seattleCenter] = venues;

    console.log('🎪 Seeding Events and generating Seat Layouts...');
    const now = new Date();
    const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

    const eventsData = [
      {
        title: 'Neon Pulse Electric Music Festival 2026',
        description:
          'Immerse yourself in a transcendent sensory journey featuring world-class electronic music producers, holographic laser installations, and cutting-edge spatial audio.',
        category: 'Concert',
        venue: austinArena._id,
        city: austinArena.city,
        date: addDays(25),
        doorsOpen: addDays(25),
        bannerUrl:
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        pricing: [
          { category: 'VIP', price: 185 },
          { category: 'Premium', price: 115 },
          { category: 'General', price: 65 },
        ],
        cancellationPolicy: { allowCancellation: true, cutoffHours: 24 },
      },
      {
        title: 'Global AI & Cloud Architecture Summit 2026',
        description:
          'The premier annual gathering of distributed systems engineers, cloud architects, and AI researchers exploring autonomous agents, vector databases, and high-scale inference.',
        category: 'Conference',
        venue: sfHall._id,
        city: sfHall.city,
        date: addDays(35),
        doorsOpen: addDays(35),
        bannerUrl:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        pricing: [
          { category: 'VIP', price: 349 },
          { category: 'Premium', price: 219 },
          { category: 'General', price: 99 },
        ],
        cancellationPolicy: { allowCancellation: true, cutoffHours: 48 },
      },
      {
        title: 'The Phantom Symphony: Live Orchestra Experience',
        description:
          'A spellbinding live theatrical performance featuring 80 classical virtuosos performing timeless orchestral arrangements, gothic scores, and cinematic masterworks.',
        category: 'Theatre',
        venue: nyTheatre._id,
        city: nyTheatre.city,
        date: addDays(18),
        doorsOpen: addDays(18),
        bannerUrl:
          'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        pricing: [
          { category: 'VIP', price: 165 },
          { category: 'Premium', price: 105 },
          { category: 'General', price: 55 },
        ],
        cancellationPolicy: { allowCancellation: true, cutoffHours: 24 },
      },
      {
        title: 'National Cyber Esports Grand Championship Finals',
        description:
          'Witness the top 8 international tactical gaming squads battle for $2,000,000 in prizes on a 360-degree holographic arena stage with live analyst commentary.',
        category: 'Sports',
        venue: seattleCenter._id,
        city: seattleCenter.city,
        date: addDays(14),
        doorsOpen: addDays(14),
        bannerUrl:
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        pricing: [
          { category: 'VIP', price: 140 },
          { category: 'Premium', price: 85 },
          { category: 'General', price: 45 },
        ],
        cancellationPolicy: { allowCancellation: true, cutoffHours: 24 },
      },
      {
        title: 'Laugh Riot: All-Stars Comedy Gala 2026',
        description:
          'An unforgettable night of non-stop laughter featuring 6 headline stand-up comedians from HBO, Netflix, and Comedy Central.',
        category: 'Comedy',
        venue: sfHall._id,
        city: sfHall.city,
        date: addDays(8),
        doorsOpen: addDays(8),
        bannerUrl:
          'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        pricing: [
          { category: 'VIP', price: 125 },
          { category: 'Premium', price: 75 },
          { category: 'General', price: 40 },
        ],
        cancellationPolicy: { allowCancellation: true, cutoffHours: 12 },
      },
      {
        title: 'Midnight Jazz & Soul Underground Sessions',
        description:
          'Intimate candlelit jazz quartet performing sultry neo-soul improvisations, vintage jazz standards, and modern brass grooves.',
        category: 'Concert',
        venue: nyTheatre._id,
        city: nyTheatre.city,
        date: addDays(40),
        doorsOpen: addDays(40),
        bannerUrl:
          'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        pricing: [
          { category: 'VIP', price: 130 },
          { category: 'Premium', price: 80 },
          { category: 'General', price: 45 },
        ],
        cancellationPolicy: { allowCancellation: true, cutoffHours: 24 },
      },
    ];

    for (const evt of eventsData) {
      const createdEvent = await Event.create(evt);
      const targetVenue = venues.find((v) => v._id.equals(createdEvent.venue));
      const seatCount = await generateSeatsForEvent(
        createdEvent,
        targetVenue,
        createdEvent.pricing
      );
      console.log(
        `  -> Event created: "${createdEvent.title}" (${seatCount} seats generated)`
      );
    }

    console.log('\n========================================');
    console.log('🎉 Seed completed successfully!');
    console.log('========================================');
    console.log('DEMO ACCOUNTS:');
    console.log('  Admin: admin@example.com / Admin@123456');
    console.log('  User:  user@example.com  / User@123456');
    console.log('  User2: alex@example.com  / User@123456');
    console.log('========================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
