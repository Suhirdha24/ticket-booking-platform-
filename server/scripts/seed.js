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
    console.log('🌱 Connecting to MongoDB for seeding All-India events with INR pricing...');
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

    console.log('👤 Seeding Demo Users...');
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

    console.log('🏛️ Seeding Venues Across All 15 Indian Cities & Districts...');
    const venuesData = [
      // 1. Mumbai
      {
        name: 'D.Y. Patil Sports Stadium',
        address: 'Sector 7, Nerul',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400706',
        capacity: 154,
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Front Stage Pitch', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'West Stand Club Lounge', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'East Grandstand Upper', rows: 5, seatsPerRow: 15, category: 'General' },
        ],
      },
      {
        name: 'Nita Mukesh Ambani Cultural Centre (NMACC)',
        address: 'Bandra Kurla Complex (BKC)',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400051',
        capacity: 116,
        imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Diamond Royal Box', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Grand Balcony Tier 1', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Emerald Circle', rows: 4, seatsPerRow: 13, category: 'General' },
        ],
      },
      // 2. New Delhi
      {
        name: 'Jawaharlal Nehru Stadium',
        address: 'Pragati Vihar, Lodhi Road',
        city: 'New Delhi',
        state: 'Delhi',
        zipCode: '110003',
        capacity: 148,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Royal Symphony VIP', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Pavilion Tier 1', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'North & South Stands', rows: 5, seatsPerRow: 14, category: 'General' },
        ],
      },
      {
        name: 'Bharat Mandapam Convention Centre',
        address: 'Pragati Maidan',
        city: 'New Delhi',
        state: 'Delhi',
        zipCode: '110001',
        capacity: 132,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Plenary VIP Hall', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Executive Gallery', rows: 4, seatsPerRow: 11, category: 'Premium' },
          { name: 'Delegate Seating', rows: 4, seatsPerRow: 14, category: 'General' },
        ],
      },
      // 3. Bengaluru
      {
        name: 'M. Chinnaswamy Stadium',
        address: 'MG Road, Shivaji Nagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560001',
        capacity: 144,
        imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Diamond Box', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Executive Corporate Stand', rows: 4, seatsPerRow: 11, category: 'Premium' },
          { name: 'B Stand Fan Zone', rows: 5, seatsPerRow: 14, category: 'General' },
        ],
      },
      {
        name: 'Bangalore International Exhibition Centre (BIEC)',
        address: '10th Mile, Tumkur Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '562123',
        capacity: 140,
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Keynote VIP Lounge', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Industry Delegate Tier', rows: 4, seatsPerRow: 11, category: 'Premium' },
          { name: 'General Tech Access', rows: 5, seatsPerRow: 13, category: 'General' },
        ],
      },
      // 4. Chennai
      {
        name: 'M.A. Chidambaram Stadium (Chepauk)',
        address: 'Victoria Hostel Rd, Chepauk',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipCode: '600005',
        capacity: 160,
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Pavilion Terrace VIP', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Anna Pavilion Club', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'C & D Stand General', rows: 6, seatsPerRow: 14, category: 'General' },
        ],
      },
      {
        name: 'Jawaharlal Nehru Indoor Stadium',
        address: 'Sydenhams Rd, Periamet',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipCode: '600003',
        capacity: 130,
        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Arena Floor Front', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Club Terrace', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Upper Tier General', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },
      // 5. Hyderabad
      {
        name: 'Gachibowli Indoor Stadium',
        address: 'Old Mumbai Highway, Gachibowli',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500032',
        capacity: 130,
        imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Arena Front', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Club Terrace', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Upper Tier General', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },
      {
        name: 'Hitex Exhibition Centre',
        address: 'Trade Fair Office Building, Hitec City',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500084',
        capacity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Executive VIP', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Premium Conclave', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'General Delegate', rows: 4, seatsPerRow: 14, category: 'General' },
        ],
      },
      // 6. Goa
      {
        name: 'Vagator Beach Arena',
        address: 'Vagator Cliffside',
        city: 'Goa',
        state: 'Goa',
        zipCode: '403509',
        capacity: 150,
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Oceanfront Deck', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Platinum Dance Arena', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'General Sunset Zone', rows: 5, seatsPerRow: 14, category: 'General' },
        ],
      },
      // 7. Kolkata
      {
        name: 'Eden Gardens Cricket Stadium',
        address: 'B.B.D. Bagh, Maidan',
        city: 'Kolkata',
        state: 'West Bengal',
        zipCode: '700021',
        capacity: 160,
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Club House VIP', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'High Court End Stand', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'Block B & C General', rows: 6, seatsPerRow: 14, category: 'General' },
        ],
      },
      // 8. Ahmedabad
      {
        name: 'Narendra Modi Mega Stadium',
        address: 'Motera, Sabarmati',
        city: 'Ahmedabad',
        state: 'Gujarat',
        zipCode: '380005',
        capacity: 170,
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'President Box VIP', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'South Pavilion Premium', rows: 4, seatsPerRow: 14, category: 'Premium' },
          { name: 'Upper Bowl General', rows: 6, seatsPerRow: 14, category: 'General' },
        ],
      },
      // 9. Pune
      {
        name: 'MCA International Stadium',
        address: 'Mumbai-Pune Expressway, Gahunje',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '412101',
        capacity: 140,
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Pavilion', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'East Stand Tier 1', rows: 4, seatsPerRow: 11, category: 'Premium' },
          { name: 'West Stand General', rows: 5, seatsPerRow: 13, category: 'General' },
        ],
      },
      // 10. Jaipur
      {
        name: 'Sawai Mansingh Stadium Arena',
        address: 'Amar Jawan Jyoti, Jan Path',
        city: 'Jaipur',
        state: 'Rajasthan',
        zipCode: '302005',
        capacity: 130,
        imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Royal Box VIP', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'North Stand Premium', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'General Enclosure', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },
      // 11. Kochi
      {
        name: 'Jawaharlal Nehru International Stadium',
        address: 'Kaloor',
        city: 'Kochi',
        state: 'Kerala',
        zipCode: '682017',
        capacity: 140,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Grandstand', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Manjappada Fan Tier', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'East & West General', rows: 5, seatsPerRow: 13, category: 'General' },
        ],
      },
      // 12. Chandigarh
      {
        name: 'PCA Stadium Complex',
        address: 'Sector 63, SAS Nagar',
        city: 'Chandigarh',
        state: 'Punjab',
        zipCode: '160062',
        capacity: 135,
        imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Corporate Box', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'North Stand Club', rows: 4, seatsPerRow: 11, category: 'Premium' },
          { name: 'General Terrace', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },
      // 13. Lucknow
      {
        name: 'BRSABV Ekana Stadium',
        address: 'Amar Shaheed Path, Gomti Nagar',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        zipCode: '226010',
        capacity: 145,
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Royal Terrace', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'East Pavilion Club', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'South Stand General', rows: 5, seatsPerRow: 13, category: 'General' },
        ],
      },
      // 14. Indore
      {
        name: 'Holkar Cricket Stadium Arena',
        address: 'Race Course Road',
        city: 'Indore',
        state: 'Madhya Pradesh',
        zipCode: '452001',
        capacity: 130,
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Pavilion', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Club Terrace', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'General Stands', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },
      // 15. Coimbatore
      {
        name: 'CODISSIA Trade & Cultural Complex',
        address: 'Avinashi Road, Peelamedu',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        zipCode: '641014',
        capacity: 130,
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Grand VIP Hall', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Executive Tier', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'General Delegates', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },
    ];

    const venues = await Venue.insertMany(venuesData);
    const venueMap = {};
    venues.forEach((v) => {
      venueMap[v.name] = v;
    });

    console.log('🎪 Seeding 35+ Live Events with INR (₹) Pricing...');
    const now = new Date();
    const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

    const eventsData = [
      // MUMBAI (4 events)
      {
        title: 'Coldplay: Music of the Spheres World Tour Live in Mumbai',
        description: 'The historic return of Coldplay to India! Chris Martin and the band live in a stadium spectacle with synchronized LED wristbands and laser fireworks.',
        category: 'Concert',
        venueName: 'D.Y. Patil Sports Stadium',
        city: 'Mumbai',
        date: addDays(25),
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 12500 }, { category: 'Premium', price: 6500 }, { category: 'General', price: 2500 }],
      },
      {
        title: 'Mughal-e-Azam: The Grand Musical Broadway',
        description: 'Director Feroz Abbas Khan’s award-winning Broadway-style theatrical spectacle with 350+ costumes designed by Manish Malhotra, live Kathak, and iconic songs.',
        category: 'Theatre',
        venueName: 'Nita Mukesh Ambani Cultural Centre (NMACC)',
        city: 'Mumbai',
        date: addDays(15),
        bannerUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 4999 }, { category: 'Premium', price: 2999 }, { category: 'General', price: 1499 }],
      },
      {
        title: 'Lollapalooza India Music Festival 2026',
        description: 'Asia’s biggest multi-genre music festival with 40+ international and indie artists across 4 mega stages, experiential art, and global food streets.',
        category: 'Festival',
        venueName: 'D.Y. Patil Sports Stadium',
        city: 'Mumbai',
        date: addDays(55),
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 8999 }, { category: 'Premium', price: 4999 }, { category: 'General', price: 2499 }],
      },
      {
        title: 'Zakir Khan: Live Special — Tathastu & Beyond',
        description: 'India’s most celebrated storyteller Zakir Khan delivers his brand new 100-minute solo special live with heartwarming poetry and non-stop laughter.',
        category: 'Comedy',
        venueName: 'Nita Mukesh Ambani Cultural Centre (NMACC)',
        city: 'Mumbai',
        date: addDays(8),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2499 }, { category: 'Premium', price: 1499 }, { category: 'General', price: 799 }],
      },

      // NEW DELHI (4 events)
      {
        title: 'A.R. Rahman: The Symphony of India Live in Concert',
        description: 'Oscar-winning maestro A.R. Rahman performs live with a 90-piece orchestral ensemble and international vocalists spanning 30 years of musical hits.',
        category: 'Concert',
        venueName: 'Jawaharlal Nehru Stadium',
        city: 'New Delhi',
        date: addDays(18),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 7999 }, { category: 'Premium', price: 3999 }, { category: 'General', price: 1499 }],
      },
      {
        title: 'Auto Expo India 2026: Future EV & Supercar Exhibition',
        description: 'India’s premier automotive showcase featuring concept hypercars, next-gen autonomous electric vehicles, and live test tracks at Pragati Maidan.',
        category: 'Exhibition',
        venueName: 'Bharat Mandapam Convention Centre',
        city: 'New Delhi',
        date: addDays(35),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2499 }, { category: 'Premium', price: 1299 }, { category: 'General', price: 499 }],
      },
      {
        title: 'Karan Aujla: It Was All A Dream Arena Tour',
        description: 'Punjabi music sensation Karan Aujla ignites Delhi with his explosive stadium tour featuring Tauba Tauba, Softly, Winning Speech, and high-tech pyrotechnics.',
        category: 'Concert',
        venueName: 'Jawaharlal Nehru Stadium',
        city: 'New Delhi',
        date: addDays(28),
        bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 6499 }, { category: 'Premium', price: 3499 }, { category: 'General', price: 1299 }],
      },
      {
        title: 'Delhi Standup Superstars ft. Bassi, Samay & Biswa',
        description: 'An all-star comedy gala featuring Anubhav Singh Bassi, Samay Raina, and Biswa Kalyan Rath together on one stage for 3 hours of uncensored humor.',
        category: 'Comedy',
        venueName: 'Bharat Mandapam Convention Centre',
        city: 'New Delhi',
        date: addDays(14),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2999 }, { category: 'Premium', price: 1799 }, { category: 'General', price: 999 }],
      },

      // BENGALURU (4 events)
      {
        title: 'Diljit Dosanjh: Dil-Luminati Tour Live in Bengaluru',
        description: 'Global superstar Diljit Dosanjh brings his record-breaking Dil-Luminati stadium concert to Bengaluru with high-octane Bhangra rhythms and LED choreography.',
        category: 'Concert',
        venueName: 'M. Chinnaswamy Stadium',
        city: 'Bengaluru',
        date: addDays(30),
        bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 8500 }, { category: 'Premium', price: 4500 }, { category: 'General', price: 1800 }],
      },
      {
        title: 'India Global AI & Tech Innovation Summit 2026',
        description: 'India’s flagship AI & Cloud Conference with 4,000+ engineers and founders discussing Autonomous AI Agents, LLM deployments, and Quantum Computing.',
        category: 'Conference',
        venueName: 'Bangalore International Exhibition Centre (BIEC)',
        city: 'Bengaluru',
        date: addDays(45),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 5999 }, { category: 'Premium', price: 3499 }, { category: 'General', price: 1499 }],
      },
      {
        title: 'Sid Sriram: Heart & Soul Live Concert',
        description: 'Immerse in an enchanting acoustic and electronic fusion evening with Sid Sriram performing his greatest classical and cinematic Tamil/Telugu hits.',
        category: 'Concert',
        venueName: 'M. Chinnaswamy Stadium',
        city: 'Bengaluru',
        date: addDays(22),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 4499 }, { category: 'Premium', price: 2499 }, { category: 'General', price: 999 }],
      },
      {
        title: 'Comic Con India Bengaluru 2026',
        description: 'The ultimate celebration of comics, cosplay, anime, Marvel, gaming tournaments, exclusive merchandise, and celebrity meet-and-greets.',
        category: 'Festival',
        venueName: 'Bangalore International Exhibition Centre (BIEC)',
        city: 'Bengaluru',
        date: addDays(65),
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2999 }, { category: 'Premium', price: 1499 }, { category: 'General', price: 799 }],
      },

      // CHENNAI (3 events)
      {
        title: 'IPL 2026 Grand Final: Chennai Super Kings vs Mumbai Indians',
        description: 'The epic showdown in world cricket! The IPL 2026 Championship Grand Final under the floodlights of Chepauk with electric crowd energy.',
        category: 'Sports',
        venueName: 'M.A. Chidambaram Stadium (Chepauk)',
        city: 'Chennai',
        date: addDays(40),
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 9999 }, { category: 'Premium', price: 4999 }, { category: 'General', price: 1999 }],
      },
      {
        title: 'Anirudh Live in Concert: Hukum Symphony Tour',
        description: 'Rockstar Anirudh Ravichander unleashes a stadium rock extravaganza with viral chartbusters, thumping bass drops, and guest superstar appearances.',
        category: 'Concert',
        venueName: 'Jawaharlal Nehru Indoor Stadium',
        city: 'Chennai',
        date: addDays(35),
        bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 5499 }, { category: 'Premium', price: 2999 }, { category: 'General', price: 1299 }],
      },
      {
        title: 'Pro Kabaddi League 2026: Tamil Thalaivas Home Derby',
        description: 'High-octane raiding and bone-crushing tackles as Tamil Thalaivas defend their home turf in the PKL 2026 Championship matches.',
        category: 'Sports',
        venueName: 'Jawaharlal Nehru Indoor Stadium',
        city: 'Chennai',
        date: addDays(19),
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2499 }, { category: 'Premium', price: 1299 }, { category: 'General', price: 599 }],
      },

      // HYDERABAD (3 events)
      {
        title: 'Sunidhi Chauhan: I Am Home Tour Live in Hyderabad',
        description: 'Bollywood powerhouse vocal queen Sunidhi Chauhan performs live with high-energy choreography, pyrotechnics, and full live band.',
        category: 'Concert',
        venueName: 'Gachibowli Indoor Stadium',
        city: 'Hyderabad',
        date: addDays(22),
        bannerUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 4999 }, { category: 'Premium', price: 2499 }, { category: 'General', price: 999 }],
      },
      {
        title: 'Hyderabad Global AI & Web3 Conclave 2026',
        description: 'Bringing together 3,000+ tech leaders, venture capitalists, and AI builders in Hitec City for deep tech keynotes and startup hackathons.',
        category: 'Conference',
        venueName: 'Hitex Exhibition Centre',
        city: 'Hyderabad',
        date: addDays(48),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 4499 }, { category: 'Premium', price: 2499 }, { category: 'General', price: 1199 }],
      },
      {
        title: 'Martin Garrix & Alan Walker: Sunburn Arena Hyderabad',
        description: 'World #1 DJs Martin Garrix and Alan Walker headline a titanic outdoor EDM festival night in Hyderabad with dazzling laser shows.',
        category: 'Festival',
        venueName: 'Gachibowli Indoor Stadium',
        city: 'Hyderabad',
        date: addDays(38),
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 6999 }, { category: 'Premium', price: 3999 }, { category: 'General', price: 1799 }],
      },

      // GOA (2 events)
      {
        title: 'Sunburn Goa Mega EDM Music Festival 2026',
        description: 'Asia’s premier electronic dance music festival on the beaches of Vagator with 4 massive stages, 80+ international DJs, and sunset sessions.',
        category: 'Festival',
        venueName: 'Vagator Beach Arena',
        city: 'Goa',
        date: addDays(60),
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 8500 }, { category: 'Premium', price: 4999 }, { category: 'General', price: 2499 }],
      },
      {
        title: 'Goa Carnival & Coastal Seafood Fest 2026',
        description: 'A vibrant 3-day carnival of colorful street floats, live Goan jazz and reggae bands, masterclass cooking, and beachside fire dancers.',
        category: 'Festival',
        venueName: 'Vagator Beach Arena',
        city: 'Goa',
        date: addDays(70),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2999 }, { category: 'Premium', price: 1499 }, { category: 'General', price: 699 }],
      },

      // KOLKATA (2 events)
      {
        title: 'Arijit Singh: Soul of Bengal Live in Kolkata',
        description: 'India’s most streamed voice Arijit Singh performs a magical 3-hour homecoming arena concert at Eden Gardens with full acoustic orchestra.',
        category: 'Concert',
        venueName: 'Eden Gardens Cricket Stadium',
        city: 'Kolkata',
        date: addDays(26),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 7499 }, { category: 'Premium', price: 3999 }, { category: 'General', price: 1499 }],
      },
      {
        title: 'Mohun Bagan vs East Bengal: ISL Kolkata Derby 2026',
        description: 'The historic 100-year football rivalry! 65,000 passionate fans roaring in the greatest football clash of the Indian Super League.',
        category: 'Sports',
        venueName: 'Eden Gardens Cricket Stadium',
        city: 'Kolkata',
        date: addDays(33),
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3499 }, { category: 'Premium', price: 1799 }, { category: 'General', price: 699 }],
      },

      // AHMEDABAD (2 events)
      {
        title: 'India vs Australia: ICC Champions Super Match 2026',
        description: 'Witness the titanic cricket clash between Team India and Australia inside the world’s largest stadium with 100,000 roaring fans.',
        category: 'Sports',
        venueName: 'Narendra Modi Mega Stadium',
        city: 'Ahmedabad',
        date: addDays(42),
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 8999 }, { category: 'Premium', price: 4499 }, { category: 'General', price: 1799 }],
      },
      {
        title: 'Gujarat International Kite & Music Mega Fest 2026',
        description: 'Spectacular illuminated night kite flying, live fusion Garba beats, laser illumination shows, and royal Gujarati cuisines.',
        category: 'Festival',
        venueName: 'Narendra Modi Mega Stadium',
        city: 'Ahmedabad',
        date: addDays(58),
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2999 }, { category: 'Premium', price: 1599 }, { category: 'General', price: 699 }],
      },

      // PUNE (2 events)
      {
        title: 'NH7 Weekender Pune 2026: The Happiest Music Fest',
        description: 'The iconic indie and rock music festival returns with 6 stages of indie, rock, hip-hop, metal, and electronic music.',
        category: 'Festival',
        venueName: 'MCA International Stadium',
        city: 'Pune',
        date: addDays(50),
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 5499 }, { category: 'Premium', price: 2999 }, { category: 'General', price: 1299 }],
      },
      {
        title: 'DJ Snake: Sunburn Arena Tour Live in Pune',
        description: 'Grammy-nominated hitmaker DJ Snake brings his monster bass hits Lean On, Taki Taki, and Magenta Riddim to Pune.',
        category: 'Concert',
        venueName: 'MCA International Stadium',
        city: 'Pune',
        date: addDays(27),
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 6499 }, { category: 'Premium', price: 3499 }, { category: 'General', price: 1499 }],
      },

      // JAIPUR (2 events)
      {
        title: 'Jaipur Literature Festival (JLF) 2026 Gala',
        description: 'The greatest literary show on Earth bringing Nobel laureates, Booker prize authors, thought leaders, and musical evenings.',
        category: 'Festival',
        venueName: 'Sawai Mansingh Stadium Arena',
        city: 'Jaipur',
        date: addDays(62),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3499 }, { category: 'Premium', price: 1899 }, { category: 'General', price: 799 }],
      },
      {
        title: 'Royal Sufi & Folk Night: Rajasthan Heritage Live',
        description: 'A mystical evening of traditional Rajasthani Manganiyar music, Sufi Qawwali, and Kathak performances under the star-lit sky.',
        category: 'Theatre',
        venueName: 'Sawai Mansingh Stadium Arena',
        city: 'Jaipur',
        date: addDays(21),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2999 }, { category: 'Premium', price: 1699 }, { category: 'General', price: 699 }],
      },

      // KOCHI (2 events)
      {
        title: 'Kochi-Muziris International Art & Cultural Biennale',
        description: 'Asia’s most celebrated contemporary art exhibition and performance festival with installations from 90+ global artists.',
        category: 'Exhibition',
        venueName: 'Jawaharlal Nehru International Stadium',
        city: 'Kochi',
        date: addDays(44),
        bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2499 }, { category: 'Premium', price: 1299 }, { category: 'General', price: 499 }],
      },
      {
        title: 'Thaikkudam Bridge: Namah Live Rock in Kochi',
        description: 'Kerala’s world-famous progressive folk rock band Thaikkudam Bridge live with their iconic high-octane stadium energy.',
        category: 'Concert',
        venueName: 'Jawaharlal Nehru International Stadium',
        city: 'Kochi',
        date: addDays(17),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3499 }, { category: 'Premium', price: 1999 }, { category: 'General', price: 899 }],
      },

      // CHANDIGARH (2 events)
      {
        title: 'AP Dhillon & Shubh: Punjab Live Arena Tour',
        description: 'Chart-topping Punjabi icons AP Dhillon and Shubh perform Brown Munde, With You, Cheques, and Baller in an epic concert.',
        category: 'Concert',
        venueName: 'PCA Stadium Complex',
        city: 'Chandigarh',
        date: addDays(29),
        bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 6999 }, { category: 'Premium', price: 3499 }, { category: 'General', price: 1499 }],
      },
      {
        title: 'Chandigarh Comedy Gala: Rahul Dua & Harsh Gujral',
        description: 'Two of North India’s most hilarious stand-up stars Rahul Dua and Harsh Gujral team up for a riotous evening of comedy.',
        category: 'Comedy',
        venueName: 'PCA Stadium Complex',
        city: 'Chandigarh',
        date: addDays(16),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2199 }, { category: 'Premium', price: 1299 }, { category: 'General', price: 699 }],
      },

      // LUCKNOW (2 events)
      {
        title: 'Lucknow Super Giants IPL Home Derby 2026',
        description: 'Cheer for Lucknow Super Giants live at Ekana Stadium in an electrifying IPL 2026 encounter with pyrotechnics and fanfare.',
        category: 'Sports',
        venueName: 'BRSABV Ekana Stadium',
        city: 'Lucknow',
        date: addDays(37),
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 7499 }, { category: 'Premium', price: 3899 }, { category: 'General', price: 1499 }],
      },
      {
        title: 'Shaan Live in Concert: Golden Nostalgia Tour',
        description: 'Legendary playback singer Shaan takes you on a nostalgic musical voyage of Bollywood romantic blockbusters and indie pop hits.',
        category: 'Concert',
        venueName: 'BRSABV Ekana Stadium',
        city: 'Lucknow',
        date: addDays(24),
        bannerUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3499 }, { category: 'Premium', price: 1899 }, { category: 'General', price: 799 }],
      },

      // INDORE (2 events)
      {
        title: 'Indore Street Food & Music Carnival 2026',
        description: 'Celebrate Indore’s world-famous culinary culture with 100+ gourmet food stalls, live acoustic indie bands, and DJ nights.',
        category: 'Festival',
        venueName: 'Holkar Cricket Stadium Arena',
        city: 'Indore',
        date: addDays(46),
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 1999 }, { category: 'Premium', price: 999 }, { category: 'General', price: 499 }],
      },
      {
        title: 'Central India Tech & FinTech Summit 2026',
        description: 'Connecting top FinTech innovators, bank executives, and startup founders discussing UPI innovations and digital banking.',
        category: 'Conference',
        venueName: 'Holkar Cricket Stadium Arena',
        city: 'Indore',
        date: addDays(52),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3999 }, { category: 'Premium', price: 1999 }, { category: 'General', price: 899 }],
      },

      // COIMBATORE (2 events)
      {
        title: 'Yuvan Shankar Raja: U1 Drug Live in Coimbatore',
        description: 'Little Maestro Yuvan Shankar Raja performs a massive 3.5-hour stadium rock concert with full band and blockbuster BGM themes.',
        category: 'Concert',
        venueName: 'CODISSIA Trade & Cultural Complex',
        city: 'Coimbatore',
        date: addDays(31),
        bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 4999 }, { category: 'Premium', price: 2799 }, { category: 'General', price: 1199 }],
      },
      {
        title: 'Tamil Nadu Industrial & Agri Tech Expo 2026',
        description: 'South India’s premier exhibition for advanced agricultural robotics, industrial automation, and green renewable energy tech.',
        category: 'Exhibition',
        venueName: 'CODISSIA Trade & Cultural Complex',
        city: 'Coimbatore',
        date: addDays(41),
        bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2499 }, { category: 'Premium', price: 1299 }, { category: 'General', price: 499 }],
      },
    ];

    for (const evt of eventsData) {
      const venue = venueMap[evt.venueName];
      if (!venue) continue;

      const event = await Event.create({
        title: evt.title,
        description: evt.description,
        category: evt.category,
        venue: venue._id,
        city: evt.city,
        date: evt.date,
        doorsOpen: evt.date,
        bannerUrl: evt.bannerUrl,
        thumbnailUrl: evt.bannerUrl,
        status: 'PUBLISHED',
        featured: evt.featured || false,
        pricing: evt.pricing,
        cancellationPolicy: {
          allowCancellation: true,
          cutoffHours: 24,
        },
      });

      const seatCount = await generateSeatsForEvent(event, venue, event.pricing);
      console.log(`  🎟️ [${evt.city}] [${evt.category}] "${event.title}" -> ${seatCount} seats`);
    }

    console.log('\n======================================================');
    console.log('🎉 35+ ALL-INDIA EVENTS SEEDED ACROSS 15 CITIES IN INR (₹)!');
    console.log('======================================================');
    console.log('📍 Cities: Mumbai, New Delhi, Bengaluru, Chennai, Hyderabad,');
    console.log('   Goa, Kolkata, Ahmedabad, Pune, Jaipur, Kochi, Chandigarh,');
    console.log('   Lucknow, Indore, Coimbatore');
    console.log('🏷️ Categories: Concert, Sports, Comedy, Festival, Theatre, Conference, Exhibition');
    console.log('💰 Currency: Indian Rupee (₹ INR)');
    console.log('👤 Admin: admin@example.com / Admin@123456');
    console.log('👤 User:  user@example.com  / User@123456');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
