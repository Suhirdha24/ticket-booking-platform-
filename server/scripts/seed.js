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
    console.log('🌱 Connecting to MongoDB for seeding India events...');
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
      phone: '+91 98765 43210',
    });

    const standardUser = await User.create({
      name: 'Sudhir Kumar',
      email: 'user@example.com',
      password: 'User@123456',
      role: 'user',
      phone: '+91 91234 56789',
    });

    const testUser2 = await User.create({
      name: 'Ananya Sharma',
      email: 'ananya@example.com',
      password: 'User@123456',
      role: 'user',
      phone: '+91 99887 76655',
    });

    console.log('🏛️ Seeding Iconic Indian Venues...');
    const venuesData = [
      {
        name: 'D.Y. Patil Sports Stadium',
        address: 'Sector 7, Nerul',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400706',
        capacity: 154,
        imageUrl:
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Front Stage Pitch', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'West Stand Club Lounge', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'East Grandstand Upper', rows: 5, seatsPerRow: 15, category: 'General' },
        ],
      },
      {
        name: 'Jawaharlal Nehru Stadium',
        address: 'Pragati Vihar, Lodhi Road',
        city: 'New Delhi',
        state: 'Delhi',
        zipCode: '110003',
        capacity: 148,
        imageUrl:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Royal Symphony VIP', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Pavilion Tier 1', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'North & South Stands', rows: 5, seatsPerRow: 14, category: 'General' },
        ],
      },
      {
        name: 'M.A. Chidambaram Stadium (Chepauk)',
        address: 'Victoria Hostel Rd, Chepauk',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipCode: '600005',
        capacity: 160,
        imageUrl:
          'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Pavilion Terrace VIP', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Anna Pavilion Club', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'C & D Stand General', rows: 6, seatsPerRow: 14, category: 'General' },
        ],
      },
      {
        name: 'M. Chinnaswamy Stadium',
        address: 'MG Road, Shivaji Nagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560001',
        capacity: 144,
        imageUrl:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Diamond Box', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Executive Corporate Stand', rows: 4, seatsPerRow: 11, category: 'Premium' },
          { name: 'B Stand Fan Zone', rows: 5, seatsPerRow: 14, category: 'General' },
        ],
      },
      {
        name: 'Nita Mukesh Ambani Cultural Centre (NMACC)',
        address: 'Bandra Kurla Complex (BKC)',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400051',
        capacity: 116,
        imageUrl:
          'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Diamond Royal Box', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Grand Balcony Tier 1', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Emerald Circle', rows: 4, seatsPerRow: 13, category: 'General' },
        ],
      },
      {
        name: 'Vagator Beach Arena',
        address: 'Vagator Cliffside',
        city: 'Goa',
        state: 'Goa',
        zipCode: '403509',
        capacity: 150,
        imageUrl:
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Oceanfront Deck', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Platinum Dance Arena', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'General Sunset Zone', rows: 5, seatsPerRow: 14, category: 'General' },
        ],
      },
      {
        name: 'Gachibowli Indoor Stadium',
        address: 'Old Mumbai Highway, Gachibowli',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500032',
        capacity: 130,
        imageUrl:
          'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Arena Front', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Club Terrace', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Upper Tier General', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },
    ];

    const venues = await Venue.insertMany(venuesData);
    const [
      dyPatilMumbai,
      jnlStadiumDelhi,
      chepaukChennai,
      chinnaswamyBlr,
      nmaccMumbai,
      vagatorGoa,
      gachibowliHyd,
    ] = venues;

    console.log('🎪 Seeding Live Indian Events and generating Seat Layouts...');
    const now = new Date();
    const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

    const eventsData = [
      {
        title: 'Coldplay: Music of the Spheres World Tour Live in Mumbai',
        description:
          'The historic return of Coldplay to India! Witness Chris Martin, Jonny Buckland, Guy Berryman, and Will Champion live in a mesmerizing 60,000+ stadium experience with synchronized LED wristbands, biodegradable confetti, laser fireworks, and legendary anthems like Yellow, Fix You, Viva La Vida, and Higher Power.',
        category: 'Concert',
        venue: dyPatilMumbai._id,
        city: dyPatilMumbai.city,
        date: addDays(25),
        doorsOpen: addDays(25),
        bannerUrl:
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        featured: true,
        pricing: [
          { category: 'VIP', price: 299 },
          { category: 'Premium', price: 175 },
          { category: 'General', price: 85 },
        ],
        cancellationPolicy: {
          allowCancellation: true,
          cutoffHours: 24,
        },
      },
      {
        title: 'A.R. Rahman: The Symphony of India Live in Concert',
        description:
          'Two-time Academy Award winner A.R. Rahman brings his monumental live concert to New Delhi! Accompanied by a 90-piece live orchestral ensemble and international vocalists, journey through three decades of iconic musical masterworks from Roja, Dil Se, Rockstar, Slumdog Millionaire, and Ponniyin Selvan.',
        category: 'Concert',
        venue: jnlStadiumDelhi._id,
        city: jnlStadiumDelhi.city,
        date: addDays(18),
        doorsOpen: addDays(18),
        bannerUrl:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        featured: true,
        pricing: [
          { category: 'VIP', price: 220 },
          { category: 'Premium', price: 130 },
          { category: 'General', price: 65 },
        ],
        cancellationPolicy: {
          allowCancellation: true,
          cutoffHours: 24,
        },
      },
      {
        title: 'IPL 2026 Grand Final: Chennai Super Kings vs Mumbai Indians',
        description:
          'The biggest cricket rivalry on planet Earth! The IPL 2026 Championship Grand Final takes place under the historic floodlights of Chepauk. Witness world-class batting, thrilling last-over finishes, and thunderous crowd energy as the titans clash for the coveted IPL trophy.',
        category: 'Sports',
        venue: chepaukChennai._id,
        city: chepaukChennai.city,
        date: addDays(40),
        doorsOpen: addDays(40),
        bannerUrl:
          'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        featured: true,
        pricing: [
          { category: 'VIP', price: 350 },
          { category: 'Premium', price: 190 },
          { category: 'General', price: 75 },
        ],
        cancellationPolicy: {
          allowCancellation: true,
          cutoffHours: 48,
        },
      },
      {
        title: 'Diljit Dosanjh: Dil-Luminati Tour Live in Bengaluru',
        description:
          'Global Punjabi superstar Diljit Dosanjh brings his record-breaking Dil-Luminati Tour to Namma Bengaluru! Get ready for high-octane Bhangra rhythms, sensational stage production, LED dancers, and chartbusters including Lover, Born to Shine, G.O.A.T., and Naina.',
        category: 'Concert',
        venue: chinnaswamyBlr._id,
        city: chinnaswamyBlr.city,
        date: addDays(30),
        doorsOpen: addDays(30),
        bannerUrl:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        featured: false,
        pricing: [
          { category: 'VIP', price: 210 },
          { category: 'Premium', price: 125 },
          { category: 'General', price: 60 },
        ],
        cancellationPolicy: {
          allowCancellation: true,
          cutoffHours: 24,
        },
      },
      {
        title: 'Sunburn Goa Mega EDM Music Festival 2026',
        description:
          "Asia's premier electronic dance music festival returns to the sunny beaches of Vagator, Goa! 3 days, 4 massive stages, 80+ international DJs, mind-bending holographic stage lasers, beach carnivals, and sunset dance sessions till dawn.",
        category: 'Festival',
        venue: vagatorGoa._id,
        city: vagatorGoa.city,
        date: addDays(60),
        doorsOpen: addDays(60),
        bannerUrl:
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        featured: true,
        pricing: [
          { category: 'VIP', price: 280 },
          { category: 'Premium', price: 160 },
          { category: 'General', price: 80 },
        ],
        cancellationPolicy: {
          allowCancellation: true,
          cutoffHours: 48,
        },
      },
      {
        title: 'Anirudh Live in Concert: Hukum Symphony Tour',
        description:
          'Rockstar Anirudh Ravichander takes the stage in Chennai with a pulse-pounding, high-energy live performance! Experience thumping stadium basslines, synchronized visual effects, and blockbusters from Vikram, Leo, Jailer, Jawan, and Devara.',
        category: 'Concert',
        venue: chepaukChennai._id,
        city: chepaukChennai.city,
        date: addDays(35),
        doorsOpen: addDays(35),
        bannerUrl:
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        featured: false,
        pricing: [
          { category: 'VIP', price: 195 },
          { category: 'Premium', price: 115 },
          { category: 'General', price: 55 },
        ],
        cancellationPolicy: {
          allowCancellation: true,
          cutoffHours: 24,
        },
      },
      {
        title: 'Zakir Khan: Live Special Standup Tour — Tathastu & Beyond',
        description:
          "India's most beloved comedic storyteller Zakir Khan delivers his brand new 100-minute solo special live at the prestigious NMACC The Grand Theatre. An evening of heartwarming poetry, relatable nostalgia, and unstoppable laughter.",
        category: 'Comedy',
        venue: nmaccMumbai._id,
        city: nmaccMumbai.city,
        date: addDays(12),
        doorsOpen: addDays(12),
        bannerUrl:
          'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        featured: false,
        pricing: [
          { category: 'VIP', price: 110 },
          { category: 'Premium', price: 70 },
          { category: 'General', price: 40 },
        ],
        cancellationPolicy: {
          allowCancellation: true,
          cutoffHours: 24,
        },
      },
      {
        title: 'India Global AI & Tech Innovation Summit 2026',
        description:
          "India's flagship AI and Technology Conference. Join 4,000+ visionary researchers, CTOs, and founders exploring Generative AI, Autonomous Multi-Agent Workflows, Quantum Computing, and India's booming DeepTech ecosystem.",
        category: 'Conference',
        venue: chinnaswamyBlr._id,
        city: chinnaswamyBlr.city,
        date: addDays(50),
        doorsOpen: addDays(50),
        bannerUrl:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        featured: false,
        pricing: [
          { category: 'VIP', price: 260 },
          { category: 'Premium', price: 150 },
          { category: 'General', price: 75 },
        ],
        cancellationPolicy: {
          allowCancellation: true,
          cutoffHours: 24,
        },
      },
      {
        title: 'Sunidhi Chauhan: I Am Home Tour Live in Hyderabad',
        description:
          'Bollywood powerhouse vocal queen Sunidhi Chauhan performs live at the Gachibowli Indoor Stadium! Featuring an explosive setlist of dance hits, soul-stirring melodies, energetic choreography, and a full live band.',
        category: 'Concert',
        venue: gachibowliHyd._id,
        city: gachibowliHyd.city,
        date: addDays(22),
        doorsOpen: addDays(22),
        bannerUrl:
          'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
        status: 'PUBLISHED',
        featured: false,
        pricing: [
          { category: 'VIP', price: 165 },
          { category: 'Premium', price: 95 },
          { category: 'General', price: 50 },
        ],
        cancellationPolicy: {
          allowCancellation: true,
          cutoffHours: 24,
        },
      },
    ];

    for (const evtData of eventsData) {
      const event = await Event.create(evtData);
      const venue = venues.find((v) => v._id.toString() === evtData.venue.toString());
      const seats = await generateSeatsForEvent(event._id, venue);
      console.log(`  🎟️ Event: "${event.title}" -> ${seats.length} seats generated in ${event.city}`);
    }

    console.log('\n=========================================');
    console.log('🎉 INDIA EVENTS DATABASE SEEDED SUCCESSFULLY!');
    console.log('=========================================');
    console.log('📍 Cities: Mumbai, New Delhi, Chennai, Bengaluru, Goa, Hyderabad');
    console.log('🎟️ Featured: Coldplay, A.R. Rahman, IPL 2026 Final, Diljit Dosanjh, Sunburn Goa, Anirudh');
    console.log('👤 Admin: admin@example.com / Admin@123456');
    console.log('👤 User:  user@example.com  / User@123456');
    console.log('=========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
