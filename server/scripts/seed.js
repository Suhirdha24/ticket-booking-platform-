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
    console.log('🌱 Connecting to MongoDB for seeding 5+ events per Indian city with INR (₹)...');
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

    console.log('🏛️ Seeding Venues Across All 15 Indian Cities...');
    const venuesData = [
      // 1. Ahmedabad
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
      {
        name: 'Mahatma Mandir Convention Centre',
        address: 'Sector 13C, Gandhinagar',
        city: 'Ahmedabad',
        state: 'Gujarat',
        zipCode: '382016',
        capacity: 130,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Executive Plenary VIP', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Delegate Tier', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'General Seating', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },

      // 2. Bengaluru
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
      {
        name: 'Chowdiah Memorial Hall',
        address: '16th Cross, Malleshwaram',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560003',
        capacity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Front Orchestra VIP', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Balcony Tier', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Rear General', rows: 4, seatsPerRow: 14, category: 'General' },
        ],
      },

      // 3. Chandigarh
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
      {
        name: 'Tagore Cultural Centre',
        address: 'Sector 18B',
        city: 'Chandigarh',
        state: 'Punjab',
        zipCode: '160018',
        capacity: 125,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Gold Tier VIP', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Silver Stalls', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Upper Deck', rows: 4, seatsPerRow: 15, category: 'General' },
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
      {
        name: 'Chennai Trade Centre',
        address: 'Mount Poonamallee Rd, Nandambakkam',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zipCode: '600089',
        capacity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Summit VIP Hall', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Executive Terrace', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Convention Floor', rows: 4, seatsPerRow: 14, category: 'General' },
        ],
      },

      // 5. Coimbatore
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
      {
        name: 'Nehru Stadium & Arena',
        address: 'V.O.C. Park, Gopalapuram',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        zipCode: '641018',
        capacity: 135,
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Pavilion', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'East Stand Tier', rows: 4, seatsPerRow: 11, category: 'Premium' },
          { name: 'West General', rows: 5, seatsPerRow: 12, category: 'General' },
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
      {
        name: 'Dr. Shyama Prasad Mukherjee Stadium',
        address: 'Goa University Complex, Taleigao',
        city: 'Goa',
        state: 'Goa',
        zipCode: '403206',
        capacity: 130,
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Royal Stalls', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Club Terrace', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'General Arena', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },

      // 7. Hyderabad
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
      {
        name: 'Rajiv Gandhi International Cricket Stadium',
        address: 'Uppal Main Road',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500039',
        capacity: 155,
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Corporate Box', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'South Pavilion', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'North & East General', rows: 5, seatsPerRow: 15, category: 'General' },
        ],
      },

      // 8. Indore
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
      {
        name: 'Brilliant Convention Centre',
        address: 'Plot No. 5, Vijay Nagar',
        city: 'Indore',
        state: 'Madhya Pradesh',
        zipCode: '452010',
        capacity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Grand Ballroom VIP', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Executive Terrace', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Delegate Tier', rows: 4, seatsPerRow: 14, category: 'General' },
        ],
      },

      // 9. Jaipur
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
      {
        name: 'Diggi Palace Cultural Arena',
        address: 'Shivaji Marg, C Scheme',
        city: 'Jaipur',
        state: 'Rajasthan',
        zipCode: '302004',
        capacity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Royal Front Diwan', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Heritage Lawn Club', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Courtyard General', rows: 4, seatsPerRow: 14, category: 'General' },
        ],
      },

      // 10. Kochi
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
      {
        name: 'Bolgatty Palace Grand Lawn',
        address: 'Mulavukad, Bolgatty Island',
        city: 'Kochi',
        state: 'Kerala',
        zipCode: '682504',
        capacity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Waterside Deck', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Lawn Club Tier', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Island General', rows: 4, seatsPerRow: 14, category: 'General' },
        ],
      },

      // 11. Kolkata
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
      {
        name: 'Biswa Bangla Convention Centre',
        address: 'Action Area I, New Town',
        city: 'Kolkata',
        state: 'West Bengal',
        zipCode: '700156',
        capacity: 130,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Plenary VIP Hall', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Executive Gallery', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Delegate Seating', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },

      // 12. Lucknow
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
      {
        name: 'Indira Gandhi Pratishthan',
        address: 'Vibhuti Khand, Gomti Nagar',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        zipCode: '226010',
        capacity: 125,
        imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Nawab VIP Lounge', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Auditorium Tier', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'General Hall', rows: 4, seatsPerRow: 15, category: 'General' },
        ],
      },

      // 13. Mumbai
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
      {
        name: 'Mahalaxmi Racecourse Arena',
        address: 'Dr E Moses Rd, Mahalaxmi',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400034',
        capacity: 150,
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Golden Circle', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Club Enclosure', rows: 4, seatsPerRow: 12, category: 'Premium' },
          { name: 'Grandstand General', rows: 5, seatsPerRow: 14, category: 'General' },
        ],
      },

      // 14. New Delhi
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
      {
        name: 'Siri Fort Auditorium',
        address: 'August Kranti Marg, Siri Fort Institutional Area',
        city: 'New Delhi',
        state: 'Delhi',
        zipCode: '110049',
        capacity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'Front VIP Rows', rows: 3, seatsPerRow: 8, category: 'VIP' },
          { name: 'Middle Stalls', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'Balcony General', rows: 4, seatsPerRow: 14, category: 'General' },
        ],
      },

      // 15. Pune
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
      {
        name: 'Balewadi Sports Complex',
        address: 'National Games Park, Mahalunge',
        city: 'Pune',
        state: 'Maharashtra',
        zipCode: '411045',
        capacity: 130,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        sections: [
          { name: 'VIP Court Front', rows: 3, seatsPerRow: 10, category: 'VIP' },
          { name: 'Club Terrace', rows: 4, seatsPerRow: 10, category: 'Premium' },
          { name: 'General Bleachers', rows: 5, seatsPerRow: 12, category: 'General' },
        ],
      },
    ];

    const venues = await Venue.insertMany(venuesData);
    const venueMap = {};
    venues.forEach((v) => {
      venueMap[v.name] = v;
    });

    console.log('🎪 Seeding 75+ Events (Minimum 5 per City) in Alphabetical Order...');
    const now = new Date();
    const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

    const eventsData = [
      // 1. AHMEDABAD (5 events)
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
      {
        title: 'Shreya Ghoshal: All Hearts Symphony Tour Live',
        description: 'The nightingale of India Shreya Ghoshal performs her timeless romantic melodies and classical cinematic masterpieces with a 40-piece live orchestra.',
        category: 'Concert',
        venueName: 'Narendra Modi Mega Stadium',
        city: 'Ahmedabad',
        date: addDays(23),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 6499 }, { category: 'Premium', price: 3499 }, { category: 'General', price: 1299 }],
      },
      {
        title: 'Startup Mahakumbh Gujarat & AI Summit 2026',
        description: 'Connecting 3,500+ investors, founders, and engineers at Mahatma Mandir exploring deep tech innovations and seed startup grants.',
        category: 'Conference',
        venueName: 'Mahatma Mandir Convention Centre',
        city: 'Ahmedabad',
        date: addDays(49),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 4499 }, { category: 'Premium', price: 2299 }, { category: 'General', price: 999 }],
      },
      {
        title: 'Ahmedabad Laugh Fest ft. Abhishek Upmanyu & Gaurav Kapoor',
        description: 'An explosive double-headline comedy special featuring Abhishek Upmanyu and Gaurav Kapoor delivering fresh, uncensored standup routines.',
        category: 'Comedy',
        venueName: 'Mahatma Mandir Convention Centre',
        city: 'Ahmedabad',
        date: addDays(15),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2499 }, { category: 'Premium', price: 1499 }, { category: 'General', price: 799 }],
      },

      // 2. BENGALURU (5 events)
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
      {
        title: 'Kenny Sebastian: Professor of Tomfoolery Live',
        description: 'Kenny Sebastian brings his brand new musical storytelling standup special filled with hilarious observations on Indian life and tea rituals.',
        category: 'Comedy',
        venueName: 'Chowdiah Memorial Hall',
        city: 'Bengaluru',
        date: addDays(12),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2199 }, { category: 'Premium', price: 1299 }, { category: 'General', price: 699 }],
      },

      // 3. CHANDIGARH (5 events)
      {
        title: 'AP Dhillon & Shubh: Punjab Live Arena Tour',
        description: 'Chart-topping Punjabi icons AP Dhillon and Shubh perform Brown Munde, With You, Cheques, and Baller in an epic concert.',
        category: 'Concert',
        venueName: 'PCA Stadium Complex',
        city: 'Chandigarh',
        date: addDays(29),
        bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
        featured: true,
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
      {
        title: 'B Praak: Symphony of Soul Live in Chandigarh',
        description: 'National Award-winner B Praak delivers a soul-stirring live symphony concert with full orchestra, choir, and timeless romantic ballads.',
        category: 'Concert',
        venueName: 'PCA Stadium Complex',
        city: 'Chandigarh',
        date: addDays(38),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 5499 }, { category: 'Premium', price: 2899 }, { category: 'General', price: 1199 }],
      },
      {
        title: 'Punjab International Auto & EV Expo 2026',
        description: 'Showcasing luxury supercars, modified vintage vehicles, state-of-the-art electric tractors, and hyper-efficient green transport.',
        category: 'Exhibition',
        venueName: 'Tagore Cultural Centre',
        city: 'Chandigarh',
        date: addDays(51),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 1999 }, { category: 'Premium', price: 999 }, { category: 'General', price: 499 }],
      },
      {
        title: 'Chandigarh Rose Festival & Star Musical Night 2026',
        description: 'A 3-day cultural festival with 800+ rose varieties, live Punjabi folk dances, night food streets, and headlining indie acoustic bands.',
        category: 'Festival',
        venueName: 'Tagore Cultural Centre',
        city: 'Chandigarh',
        date: addDays(64),
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2499 }, { category: 'Premium', price: 1199 }, { category: 'General', price: 599 }],
      },

      // 4. CHENNAI (5 events)
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
      {
        title: 'Ilayaraja: 80 Years of Musical Genius Live Symphony',
        description: 'Isaignani Ilayaraja conducts a monumental 100-piece live symphony orchestra playing immortal musical gems from four decades of Tamil cinema.',
        category: 'Concert',
        venueName: 'M.A. Chidambaram Stadium (Chepauk)',
        city: 'Chennai',
        date: addDays(27),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 7499 }, { category: 'Premium', price: 3899 }, { category: 'General', price: 1499 }],
      },
      {
        title: 'Chennai Global Tech Conclave & SaaS Expo 2026',
        description: 'Asia’s SaaS capital hosts 2,500+ product builders, tech executives, and startup founders exploring generative AI and enterprise scale.',
        category: 'Conference',
        venueName: 'Chennai Trade Centre',
        city: 'Chennai',
        date: addDays(53),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 4499 }, { category: 'Premium', price: 2499 }, { category: 'General', price: 999 }],
      },

      // 5. COIMBATORE (5 events)
      {
        title: 'Yuvan Shankar Raja: U1 Drug Live in Coimbatore',
        description: 'Little Maestro Yuvan Shankar Raja performs a massive 3.5-hour stadium rock concert with full band and blockbuster BGM themes.',
        category: 'Concert',
        venueName: 'CODISSIA Trade & Cultural Complex',
        city: 'Coimbatore',
        date: addDays(31),
        bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
        featured: true,
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
      {
        title: 'Harris Jayaraj: Hearts of Harris Live Tour',
        description: 'The melody king Harris Jayaraj performs his legendary romantic and club anthems live with top playback stars and high-tech stage lasers.',
        category: 'Concert',
        venueName: 'Nehru Stadium & Arena',
        city: 'Coimbatore',
        date: addDays(20),
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 4499 }, { category: 'Premium', price: 2499 }, { category: 'General', price: 999 }],
      },
      {
        title: 'Coimbatore Standup Night: Jagan Krishnan & Mervyn Rozz',
        description: 'A non-stop laugh riot in Tanglish exploring relatable Tamil marriage culture, IT corporate life, and cinema nostalgia.',
        category: 'Comedy',
        venueName: 'CODISSIA Trade & Cultural Complex',
        city: 'Coimbatore',
        date: addDays(11),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 1999 }, { category: 'Premium', price: 999 }, { category: 'General', price: 499 }],
      },
      {
        title: 'Kongu Food & Cultural Music Carnival 2026',
        description: 'Experience authentic Kongunadu traditional recipes, live folk percussion (Thavil & Nadaswaram), and modern indie band performances.',
        category: 'Festival',
        venueName: 'Nehru Stadium & Arena',
        city: 'Coimbatore',
        date: addDays(57),
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 1799 }, { category: 'Premium', price: 899 }, { category: 'General', price: 399 }],
      },

      // 6. GOA (5 events)
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
      {
        title: 'Boiler Room Goa: Underground Electronic Waves',
        description: 'The world’s most famous underground dance music broadcast hits Goa with cutting-edge techno, deep house, and live synth sets.',
        category: 'Concert',
        venueName: 'Vagator Beach Arena',
        city: 'Goa',
        date: addDays(36),
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 4999 }, { category: 'Premium', price: 2799 }, { category: 'General', price: 1299 }],
      },
      {
        title: 'International Film Festival of India (IFFI) Gala 2026',
        description: 'Asia’s premier cinema festival presenting world cinema premieres, red carpet director Q&As, and masterclasses with global filmmakers.',
        category: 'Theatre',
        venueName: 'Dr. Shyama Prasad Mukherjee Stadium',
        city: 'Goa',
        date: addDays(46),
        bannerUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3499 }, { category: 'Premium', price: 1899 }, { category: 'General', price: 799 }],
      },
      {
        title: 'Global Wellness, Yoga & Music Conclave 2026',
        description: 'Immerse in holistic beachfront meditation, international sound healing concerts, organic vegan food symposiums, and yoga retreats.',
        category: 'Conference',
        venueName: 'Dr. Shyama Prasad Mukherjee Stadium',
        city: 'Goa',
        date: addDays(63),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3999 }, { category: 'Premium', price: 1999 }, { category: 'General', price: 899 }],
      },

      // 7. HYDERABAD (5 events)
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
        featured: true,
        pricing: [{ category: 'VIP', price: 6999 }, { category: 'Premium', price: 3999 }, { category: 'General', price: 1799 }],
      },
      {
        title: 'Sunrisers Hyderabad vs KKR: IPL 2026 Power Clash',
        description: 'Massive sixes, roaring Orange Army crowd, and electric T20 cricket under the Uppal floodlights as SRH battles Kolkata Knight Riders.',
        category: 'Sports',
        venueName: 'Rajiv Gandhi International Cricket Stadium',
        city: 'Hyderabad',
        date: addDays(43),
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 7999 }, { category: 'Premium', price: 3999 }, { category: 'General', price: 1499 }],
      },
      {
        title: 'Telugu Cinema Symphony & Star Grand Musical Night',
        description: 'Top Tollywood music directors and singers perform blockbusters from RRR, Pushpa, Kalki 2898 AD, and Baahubali with live visual projection.',
        category: 'Concert',
        venueName: 'Gachibowli Indoor Stadium',
        city: 'Hyderabad',
        date: addDays(17),
        bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 4499 }, { category: 'Premium', price: 2299 }, { category: 'General', price: 899 }],
      },

      // 8. INDORE (5 events)
      {
        title: 'Indore Street Food & Music Carnival 2026',
        description: 'Celebrate Indore’s world-famous culinary culture with 100+ gourmet food stalls, live acoustic indie bands, and DJ nights.',
        category: 'Festival',
        venueName: 'Holkar Cricket Stadium Arena',
        city: 'Indore',
        date: addDays(46),
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 1999 }, { category: 'Premium', price: 999 }, { category: 'General', price: 499 }],
      },
      {
        title: 'Central India Tech & FinTech Summit 2026',
        description: 'Connecting top FinTech innovators, bank executives, and startup founders discussing UPI innovations and digital banking.',
        category: 'Conference',
        venueName: 'Brilliant Convention Centre',
        city: 'Indore',
        date: addDays(52),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3999 }, { category: 'Premium', price: 1999 }, { category: 'General', price: 899 }],
      },
      {
        title: 'Jubin Nautiyal: Live Acoustic & Bollywood Symphony',
        description: 'Bollywood chart-topper Jubin Nautiyal delivers an intimate live concert of his greatest romantic and devotional hits with full band.',
        category: 'Concert',
        venueName: 'Holkar Cricket Stadium Arena',
        city: 'Indore',
        date: addDays(25),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 4999 }, { category: 'Premium', price: 2699 }, { category: 'General', price: 1099 }],
      },
      {
        title: 'Indore Comedy Carnival: Vipul Goyal & Ravi Gupta',
        description: 'Two of India’s smartest observational standup comics team up for a side-splitting night about Indian families and corporate quirks.',
        category: 'Comedy',
        venueName: 'Brilliant Convention Centre',
        city: 'Indore',
        date: addDays(13),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 1999 }, { category: 'Premium', price: 1199 }, { category: 'General', price: 599 }],
      },
      {
        title: 'Central India Auto & EV Show 2026',
        description: 'The largest automotive expo in MP showcasing upcoming electric vehicles, custom motorbikes, and smart transport innovations.',
        category: 'Exhibition',
        venueName: 'Holkar Cricket Stadium Arena',
        city: 'Indore',
        date: addDays(61),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 1499 }, { category: 'Premium', price: 799 }, { category: 'General', price: 349 }],
      },

      // 9. JAIPUR (5 events)
      {
        title: 'Jaipur Literature Festival (JLF) 2026 Gala',
        description: 'The greatest literary show on Earth bringing Nobel laureates, Booker prize authors, thought leaders, and musical evenings.',
        category: 'Festival',
        venueName: 'Sawai Mansingh Stadium Arena',
        city: 'Jaipur',
        date: addDays(62),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: true,
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
      {
        title: 'Rajasthan Royals vs Gujarat Titans: IPL 2026 Desert Derby',
        description: 'Catch Sanju Samson and Rajasthan Royals defending their pink fortress at SMS Stadium in an action-packed IPL thriller.',
        category: 'Sports',
        venueName: 'Sawai Mansingh Stadium Arena',
        city: 'Jaipur',
        date: addDays(39),
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 7499 }, { category: 'Premium', price: 3799 }, { category: 'General', price: 1399 }],
      },
      {
        title: 'Amit Trivedi: Indradhanush Tour Live in Jaipur',
        description: 'Versatile music composer Amit Trivedi performs his iconic Bollywood and Coke Studio folk hits with high energy and live instrumentation.',
        category: 'Concert',
        venueName: 'Diggi Palace Cultural Arena',
        city: 'Jaipur',
        date: addDays(28),
        bannerUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 4499 }, { category: 'Premium', price: 2499 }, { category: 'General', price: 999 }],
      },
      {
        title: 'Jaipur International Jewellery & Craft Expo 2026',
        description: 'Exquisite handcrafted polki diamonds, royal gemstone jewellery, traditional block prints, and artisan crafts from across India.',
        category: 'Exhibition',
        venueName: 'Diggi Palace Cultural Arena',
        city: 'Jaipur',
        date: addDays(54),
        bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 1999 }, { category: 'Premium', price: 999 }, { category: 'General', price: 399 }],
      },

      // 10. KOCHI (5 events)
      {
        title: 'Kochi-Muziris International Art & Cultural Biennale',
        description: 'Asia’s most celebrated contemporary art exhibition and performance festival with installations from 90+ global artists.',
        category: 'Exhibition',
        venueName: 'Jawaharlal Nehru International Stadium',
        city: 'Kochi',
        date: addDays(44),
        bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
        featured: true,
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
        featured: true,
        pricing: [{ category: 'VIP', price: 3499 }, { category: 'Premium', price: 1999 }, { category: 'General', price: 899 }],
      },
      {
        title: 'Kerala Blasters vs Mohun Bagan: ISL High Voltage Clash',
        description: 'Feel the earth-shaking roar of the Yellow Army at JLN Stadium Kaloor as Kerala Blasters host Mohun Bagan in an electric ISL battle.',
        category: 'Sports',
        venueName: 'Jawaharlal Nehru International Stadium',
        city: 'Kochi',
        date: addDays(32),
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2999 }, { category: 'Premium', price: 1499 }, { category: 'General', price: 499 }],
      },
      {
        title: 'Masala Coffee: Live Folk Fusion Night Kochi',
        description: 'Soulful Malayalam and Tamil indie folk melodies, thumping drums, and acoustic guitar fusion in a scenic waterfront setting.',
        category: 'Concert',
        venueName: 'Bolgatty Palace Grand Lawn',
        city: 'Kochi',
        date: addDays(24),
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2499 }, { category: 'Premium', price: 1399 }, { category: 'General', price: 599 }],
      },
      {
        title: 'Kerala Global Tech & Startup Conclave 2026',
        description: 'Bringing together 2,000+ engineers, founders, and tech investors exploring AI in healthcare, tourism tech, and green energy.',
        category: 'Conference',
        venueName: 'Bolgatty Palace Grand Lawn',
        city: 'Kochi',
        date: addDays(56),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3499 }, { category: 'Premium', price: 1899 }, { category: 'General', price: 799 }],
      },

      // 11. KOLKATA (5 events)
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
        featured: true,
        pricing: [{ category: 'VIP', price: 3499 }, { category: 'Premium', price: 1799 }, { category: 'General', price: 699 }],
      },
      {
        title: 'Kolkata International Film & Theatre Festival 2026',
        description: 'A celebration of Bengali and international cinema and avant-garde theatre productions with world-renowned directors and actors.',
        category: 'Theatre',
        venueName: 'Biswa Bangla Convention Centre',
        city: 'Kolkata',
        date: addDays(47),
        bannerUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2999 }, { category: 'Premium', price: 1499 }, { category: 'General', price: 599 }],
      },
      {
        title: 'Bangla Rock Revolution: Fossils & Cactus Live',
        description: 'Relive the golden age of Bengali rock music as Rupam Islam (Fossils) and Cactus unite for an explosive 4-hour stadium rock night.',
        category: 'Concert',
        venueName: 'Eden Gardens Cricket Stadium',
        city: 'Kolkata',
        date: addDays(18),
        bannerUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3999 }, { category: 'Premium', price: 1999 }, { category: 'General', price: 799 }],
      },
      {
        title: 'Kolkata Grand Food & Sweets Carnival 2026',
        description: 'Over 120 historic sweet makers and chefs present Kolkata’s legendary Biryani, Rosogolla, Kathi Rolls, and artisanal gourmet desserts.',
        category: 'Festival',
        venueName: 'Biswa Bangla Convention Centre',
        city: 'Kolkata',
        date: addDays(60),
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 1799 }, { category: 'Premium', price: 899 }, { category: 'General', price: 399 }],
      },

      // 12. LUCKNOW (5 events)
      {
        title: 'Lucknow Super Giants IPL Home Derby 2026',
        description: 'Cheer for Lucknow Super Giants live at Ekana Stadium in an electrifying IPL 2026 encounter with pyrotechnics and fanfare.',
        category: 'Sports',
        venueName: 'BRSABV Ekana Stadium',
        city: 'Lucknow',
        date: addDays(37),
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        featured: true,
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
      {
        title: 'Awadh Heritage Kathak & Ghazal Symphony',
        description: 'Experience the regal elegance of Lucknow with live Ghazals from master vocalists and graceful Kathak by the Lucknow Gharana.',
        category: 'Theatre',
        venueName: 'Indira Gandhi Pratishthan',
        city: 'Lucknow',
        date: addDays(19),
        bannerUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2999 }, { category: 'Premium', price: 1599 }, { category: 'General', price: 699 }],
      },
      {
        title: 'Lucknow Super Comedy Night ft. Zakir Khan & Friends',
        description: 'Zakir Khan headlines an unforgettable evening of Awadhi storytelling, heartwarming poetry, and non-stop laughter at IGP.',
        category: 'Comedy',
        venueName: 'Indira Gandhi Pratishthan',
        city: 'Lucknow',
        date: addDays(10),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2499 }, { category: 'Premium', price: 1399 }, { category: 'General', price: 699 }],
      },
      {
        title: 'UP Global Investors & Deep Tech Summit 2026',
        description: 'Over 3,000 delegates, industrial leaders, and tech founders gather to explore defense corridors, AI infrastructure, and green startups.',
        category: 'Conference',
        venueName: 'Indira Gandhi Pratishthan',
        city: 'Lucknow',
        date: addDays(55),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3999 }, { category: 'Premium', price: 1999 }, { category: 'General', price: 899 }],
      },

      // 13. MUMBAI (6 events)
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
        venueName: 'Mahalaxmi Racecourse Arena',
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
      {
        title: 'Mumbai Indians vs RCB: IPL 2026 Blockbuster Clash',
        description: 'The roaring blue brigade battles Royal Challengers Bengaluru under the floodlights in a high-octane IPL 2026 showdown.',
        category: 'Sports',
        venueName: 'D.Y. Patil Sports Stadium',
        city: 'Mumbai',
        date: addDays(34),
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 8999 }, { category: 'Premium', price: 4499 }, { category: 'General', price: 1899 }],
      },
      {
        title: 'Ed Sheeran: Mathematics Tour Live in Mumbai',
        description: 'Global pop titan Ed Sheeran brings his record-breaking 360-degree stadium show with Shape of You, Perfect, Bad Habits, and acoustic loop-pedal wizardry.',
        category: 'Concert',
        venueName: 'Mahalaxmi Racecourse Arena',
        city: 'Mumbai',
        date: addDays(48),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: true,
        pricing: [{ category: 'VIP', price: 11999 }, { category: 'Premium', price: 5999 }, { category: 'General', price: 2499 }],
      },

      // 14. NEW DELHI (6 events)
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
        venueName: 'Siri Fort Auditorium',
        city: 'New Delhi',
        date: addDays(14),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2999 }, { category: 'Premium', price: 1799 }, { category: 'General', price: 999 }],
      },
      {
        title: 'India Art Fair & Modern Architecture Conclave 2026',
        description: 'South Asia’s leading platform for modern and contemporary art, featuring 100+ galleries, outdoor art installations, and design discussions.',
        category: 'Exhibition',
        venueName: 'Bharat Mandapam Convention Centre',
        city: 'New Delhi',
        date: addDays(50),
        bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2499 }, { category: 'Premium', price: 1299 }, { category: 'General', price: 599 }],
      },
      {
        title: 'Delhi Capitals vs Chennai Super Kings: IPL 2026 Clash',
        description: 'Rishabh Pant and Delhi Capitals battle MS Dhoni’s Chennai Super Kings in a thrilling cricket encounter under the JLN floodlights.',
        category: 'Sports',
        venueName: 'Jawaharlal Nehru Stadium',
        city: 'New Delhi',
        date: addDays(41),
        bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 7999 }, { category: 'Premium', price: 3999 }, { category: 'General', price: 1499 }],
      },

      // 15. PUNE (5 events)
      {
        title: 'NH7 Weekender Pune 2026: The Happiest Music Fest',
        description: 'The iconic indie and rock music festival returns with 6 stages of indie, rock, hip-hop, metal, and electronic music.',
        category: 'Festival',
        venueName: 'MCA International Stadium',
        city: 'Pune',
        date: addDays(50),
        bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80',
        featured: true,
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
        featured: true,
        pricing: [{ category: 'VIP', price: 6499 }, { category: 'Premium', price: 3499 }, { category: 'General', price: 1499 }],
      },
      {
        title: 'Pune International Tech & Developer Summit 2026',
        description: 'Over 2,500 backend engineers, DevOps specialists, and AI researchers gather at Balewadi for deep-dive technical workshops.',
        category: 'Conference',
        venueName: 'Balewadi Sports Complex',
        city: 'Pune',
        date: addDays(43),
        bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 3999 }, { category: 'Premium', price: 1999 }, { category: 'General', price: 899 }],
      },
      {
        title: 'Pune Standup Gala: Kanan Gill & Rahul Subramanian',
        description: 'Kanan Gill and Rahul Subramanian bring their sharpest witty observations and crowd improvisations to Balewadi.',
        category: 'Comedy',
        venueName: 'Balewadi Sports Complex',
        city: 'Pune',
        date: addDays(14),
        bannerUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2199 }, { category: 'Premium', price: 1299 }, { category: 'General', price: 699 }],
      },
      {
        title: 'Pune Craft Beer, Food & Indie Music Fest 2026',
        description: 'Pune’s biggest lifestyle weekend featuring 15+ microbreweries, artisanal street gourmet food stalls, and acoustic indie rock bands.',
        category: 'Festival',
        venueName: 'MCA International Stadium',
        city: 'Pune',
        date: addDays(59),
        bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
        featured: false,
        pricing: [{ category: 'VIP', price: 2499 }, { category: 'Premium', price: 1299 }, { category: 'General', price: 599 }],
      },
    ];

    for (const evt of eventsData) {
      const venue = venueMap[evt.venueName];
      if (!venue) {
        console.warn(`⚠️ Venue not found for: ${evt.venueName}`);
        continue;
      }

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
      console.log(`  🎟️ [${evt.city.padEnd(11)}] [${evt.category.padEnd(10)}] "${event.title.substring(0, 42)}..." -> ${seatCount} seats`);
    }

    console.log('\n======================================================================');
    console.log('🎉 78 ALL-INDIA EVENTS SEEDED ACROSS ALL 15 CITIES (5+ PER CITY)!');
    console.log('======================================================================');
    console.log('📍 Cities (Alphabetical):');
    console.log('   1. Ahmedabad (5 events)      9. Jaipur (5 events)');
    console.log('   2. Bengaluru (5 events)     10. Kochi (5 events)');
    console.log('   3. Chandigarh (5 events)    11. Kolkata (5 events)');
    console.log('   4. Chennai (5 events)       12. Lucknow (5 events)');
    console.log('   5. Coimbatore (5 events)    13. Mumbai (6 events)');
    console.log('   6. Goa (5 events)           14. New Delhi (6 events)');
    console.log('   7. Hyderabad (5 events)     15. Pune (5 events)');
    console.log('   8. Indore (5 events)');
    console.log('💰 All Priced in Authentic Indian Rupee (₹ INR)');
    console.log('🏷️ Categories: Concert, Sports, Comedy, Festival, Theatre, Conference, Exhibition');
    console.log('👤 Admin: admin@example.com / Admin@123456');
    console.log('👤 User:  user@example.com  / User@123456');
    console.log('======================================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
