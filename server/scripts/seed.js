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
    console.log('🌱 Connecting to MongoDB for seeding comprehensive 5-10 events per category across all cities...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database');

    console.log('🧹 Cleaning existing collections...');
    try {
      await mongoose.connection.db.dropCollection('seats');
    } catch (e) {}
    try {
      await mongoose.connection.db.dropCollection('events');
    } catch (e) {}
    try {
      await mongoose.connection.db.dropCollection('reservations');
    } catch (e) {}
    try {
      await mongoose.connection.db.dropCollection('bookings');
    } catch (e) {}
    try {
      await mongoose.connection.db.dropCollection('venues');
    } catch (e) {}
    try {
      await mongoose.connection.db.dropCollection('users');
    } catch (e) {}

    console.log('👤 Seeding Demo Users...');
    await User.create([
      {
        name: 'System Admin',
        email: 'admin@example.com',
        password: 'Admin@123456',
        role: 'admin',
        phone: '+91 98765 43210',
      },
      {
        name: 'Sudhir Kumar',
        email: 'user@example.com',
        password: 'User@123456',
        role: 'user',
        phone: '+91 91234 56789',
      },
      {
        name: 'Ananya Sharma',
        email: 'ananya@example.com',
        password: 'User@123456',
        role: 'user',
        phone: '+91 99887 76655',
      },
    ]);

    console.log('🏛️ Seeding Venues Across All Cities & Tamil Nadu Districts...');
    const defaultSections = [
      { name: 'VIP Diamond Section', rows: 3, seatsPerRow: 10, category: 'VIP' },
      { name: 'Club Premium Tier', rows: 4, seatsPerRow: 10, category: 'Premium' },
      { name: 'General Enclosure', rows: 5, seatsPerRow: 12, category: 'General' },
    ];

    const allCitiesList = [
      { name: 'Agra Heritage Convention Arena', city: 'Agra', state: 'Uttar Pradesh' },
      { name: 'Narendra Modi Mega Stadium', city: 'Ahmedabad', state: 'Gujarat' },
      { name: 'Amritsar Cultural & Heritage Complex', city: 'Amritsar', state: 'Punjab' },
      { name: 'M. Chinnaswamy Stadium', city: 'Bengaluru', state: 'Karnataka' },
      { name: 'Bangalore International Exhibition Centre', city: 'Bengaluru', state: 'Karnataka' },
      { name: 'Chowdiah Memorial Hall', city: 'Bengaluru', state: 'Karnataka' },
      { name: 'Bhopal Lake View Convention Hall', city: 'Bhopal', state: 'Madhya Pradesh' },
      { name: 'Kalinga Stadium & Cultural Arena', city: 'Bhubaneswar', state: 'Odisha' },
      { name: 'PCA Stadium Complex', city: 'Chandigarh', state: 'Punjab' },
      { name: 'M.A. Chidambaram Stadium (Chepauk)', city: 'Chennai', state: 'Tamil Nadu' },
      { name: 'JLN Indoor Stadium', city: 'Chennai', state: 'Tamil Nadu' },
      { name: 'CODISSIA Trade & Cultural Complex', city: 'Coimbatore', state: 'Tamil Nadu' },
      { name: 'Cuddalore Coastal Cultural Hall', city: 'Cuddalore', state: 'Tamil Nadu' },
      { name: 'Dehradun Valley Convention Grounds', city: 'Dehradun', state: 'Uttarakhand' },
      { name: 'Dindigul Rock Fort Arena', city: 'Dindigul', state: 'Tamil Nadu' },
      { name: 'Erode Texvalley International Convention Centre', city: 'Erode', state: 'Tamil Nadu' },
      { name: 'Erode V.O.C. Stadium & Expo Grounds', city: 'Erode', state: 'Tamil Nadu' },
      { name: 'Vagator Beach Arena', city: 'Goa', state: 'Goa' },
      { name: 'Cyber Hub Amphitheatre & Arena', city: 'Gurugram', state: 'Haryana' },
      { name: 'Sarusajai Stadium Complex', city: 'Guwahati', state: 'Assam' },
      { name: 'Gwalior Fort Heritage Ground', city: 'Gwalior', state: 'Madhya Pradesh' },
      { name: 'Hosur Industrial Expo & Cultural Centre', city: 'Hosur', state: 'Tamil Nadu' },
      { name: 'Gachibowli Indoor Stadium', city: 'Hyderabad', state: 'Telangana' },
      { name: 'Hitex Exhibition Centre', city: 'Hyderabad', state: 'Telangana' },
      { name: 'Holkar Cricket Stadium Arena', city: 'Indore', state: 'Madhya Pradesh' },
      { name: 'Sawai Mansingh Stadium Arena', city: 'Jaipur', state: 'Rajasthan' },
      { name: 'Diggi Palace Cultural Arena', city: 'Jaipur', state: 'Rajasthan' },
      { name: 'Jalandhar Sports & Expo Complex', city: 'Jalandhar', state: 'Punjab' },
      { name: 'Jamshedpur Tata Auditorium', city: 'Jamshedpur', state: 'Jharkhand' },
      { name: 'Jodhpur Umaid Palace Arena', city: 'Jodhpur', state: 'Rajasthan' },
      { name: 'Kanchipuram Silk & Heritage Hall', city: 'Kanchipuram', state: 'Tamil Nadu' },
      { name: 'Kanyakumari Oceanfront Sunrise Arena', city: 'Kanyakumari', state: 'Tamil Nadu' },
      { name: 'Green Park Stadium Arena', city: 'Kanpur', state: 'Uttar Pradesh' },
      { name: 'Karur Textile Expo & Trade Centre', city: 'Karur', state: 'Tamil Nadu' },
      { name: 'JLN International Stadium', city: 'Kochi', state: 'Kerala' },
      { name: 'Bolgatty Palace Grand Lawn', city: 'Kochi', state: 'Kerala' },
      { name: 'Eden Gardens Cricket Stadium', city: 'Kolkata', state: 'West Bengal' },
      { name: 'Biswa Bangla Convention Centre', city: 'Kolkata', state: 'West Bengal' },
      { name: 'Calicut Trade Centre Arena', city: 'Kozhikode', state: 'Kerala' },
      { name: 'BRSABV Ekana Stadium', city: 'Lucknow', state: 'Uttar Pradesh' },
      { name: 'Indira Gandhi Pratishthan', city: 'Lucknow', state: 'Uttar Pradesh' },
      { name: 'Guru Nanak Stadium Complex', city: 'Ludhiana', state: 'Punjab' },
      { name: 'Madurai Meenakshi Cultural Hall', city: 'Madurai', state: 'Tamil Nadu' },
      { name: 'Mangalore Coastal Convention Centre', city: 'Mangaluru', state: 'Karnataka' },
      { name: 'D.Y. Patil Sports Stadium', city: 'Mumbai', state: 'Maharashtra' },
      { name: 'Nita Mukesh Ambani Cultural Centre (NMACC)', city: 'Mumbai', state: 'Maharashtra' },
      { name: 'Mahalaxmi Racecourse Arena', city: 'Mumbai', state: 'Maharashtra' },
      { name: 'Mysore Palace Heritage Grounds', city: 'Mysuru', state: 'Karnataka' },
      { name: 'Nagercoil Heritage Auditorium', city: 'Nagercoil', state: 'Tamil Nadu' },
      { name: 'Vidarbha Cricket Association Arena', city: 'Nagpur', state: 'Maharashtra' },
      { name: 'Namakkal Transport & Agri Expo Centre', city: 'Namakkal', state: 'Tamil Nadu' },
      { name: 'Nashik Sula Vineyards Arena', city: 'Nashik', state: 'Maharashtra' },
      { name: 'CIDCO Exhibition Centre', city: 'Navi Mumbai', state: 'Maharashtra' },
      { name: 'Jawaharlal Nehru Stadium', city: 'New Delhi', state: 'Delhi' },
      { name: 'Bharat Mandapam Convention Centre', city: 'New Delhi', state: 'Delhi' },
      { name: 'Siri Fort Auditorium', city: 'New Delhi', state: 'Delhi' },
      { name: 'Noida Indoor Stadium & Expo', city: 'Noida', state: 'Uttar Pradesh' },
      { name: 'Patna Gyan Bhawan Convention Centre', city: 'Patna', state: 'Bihar' },
      { name: 'Pondicherry French Promenade Arena', city: 'Puducherry', state: 'Puducherry' },
      { name: 'MCA International Stadium', city: 'Pune', state: 'Maharashtra' },
      { name: 'Balewadi Sports Complex', city: 'Pune', state: 'Maharashtra' },
      { name: 'Raipur International Cricket Stadium', city: 'Raipur', state: 'Chhattisgarh' },
      { name: 'Ramanathapuram Sethupathi Heritage Hall', city: 'Ramanathapuram', state: 'Tamil Nadu' },
      { name: 'JSCA International Stadium Complex', city: 'Ranchi', state: 'Jharkhand' },
      { name: 'Salem Convention & Sports Centre', city: 'Salem', state: 'Tamil Nadu' },
      { name: 'Sivakasi Print & Fireworks Expo Arena', city: 'Sivakasi', state: 'Tamil Nadu' },
      { name: 'Surat International Exhibition Centre', city: 'Surat', state: 'Gujarat' },
      { name: 'Thanjavur Brihadisvara Cultural Centre', city: 'Thanjavur', state: 'Tamil Nadu' },
      { name: 'Theni Cardamom Hills Arena', city: 'Theni', state: 'Tamil Nadu' },
      { name: 'Trivandrum Greenfield Stadium', city: 'Thiruvananthapuram', state: 'Kerala' },
      { name: 'Thoothukudi VOC Port City Arena', city: 'Thoothukudi', state: 'Tamil Nadu' },
      { name: 'Trichy Rockfort Cultural Complex', city: 'Tiruchirappalli', state: 'Tamil Nadu' },
      { name: 'Tirunelveli Nellai Cultural Centre', city: 'Tirunelveli', state: 'Tamil Nadu' },
      { name: 'Tiruppur Knitwear Trade Fair Centre', city: 'Tiruppur', state: 'Tamil Nadu' },
      { name: 'Tiruvannamalai Girivalam Spiritual Hall', city: 'Tiruvannamalai', state: 'Tamil Nadu' },
      { name: 'Udaipur City Palace Grand Courtyard', city: 'Udaipur', state: 'Rajasthan' },
      { name: 'Vadodara Navlakhi Palace Ground', city: 'Vadodara', state: 'Gujarat' },
      { name: 'Varanasi Ghats Cultural Amphitheatre', city: 'Varanasi', state: 'Uttar Pradesh' },
      { name: 'Vellore Fort Cultural Ground', city: 'Vellore', state: 'Tamil Nadu' },
      { name: 'Vijayawada Trade & Convention Centre', city: 'Vijayawada', state: 'Andhra Pradesh' },
      { name: 'Villupuram Cultural Centre', city: 'Villupuram', state: 'Tamil Nadu' },
      { name: 'Virudhunagar Industrial Expo Hall', city: 'Virudhunagar', state: 'Tamil Nadu' },
      { name: 'Visakhapatnam Port City Arena', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
    ];

    const venuesToInsert = allCitiesList.map((v) => ({
      name: v.name,
      address: `${v.city} Central Complex`,
      city: v.city,
      state: v.state,
      zipCode: '600001',
      capacity: 130,
      imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
      sections: defaultSections,
    }));

    const venues = await Venue.insertMany(venuesToInsert);
    const venueMapByCity = {};
    venues.forEach((v) => {
      if (!venueMapByCity[v.city]) venueMapByCity[v.city] = [];
      venueMapByCity[v.city].push(v);
    });

    console.log('🎪 Building Comprehensive 5-10 Events Per Category Catalog Across All Cities...');
    const now = new Date();
    const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

    const categories = [
      'Concert',
      'Sports',
      'Comedy',
      'Festival',
      'Theatre',
      'Conference',
      'Exhibition',
      'Workshop',
      'Gaming',
      'Meetup',
      'Wellness',
      'Nightlife',
      'Kids & Family',
    ];

    // 5 to 6 varied event templates for EVERY category
    const categoryTemplates = {
      Concert: [
        { title: 'Live Symphony & Cinematic Rock Arena Tour', price: [4999, 2799, 1199] },
        { title: 'Indie Fusion & Bollywood Acoustic Night Live', price: [3499, 1999, 899] },
        { title: 'Grand Musical Mega Fest & Star Concert', price: [5999, 3299, 1499] },
        { title: 'Unplugged Folk & Retro Classics Night', price: [2999, 1699, 799] },
        { title: 'Pop & EDM Beats Mega Stadium Tour', price: [6499, 3499, 1599] },
        { title: 'Soulful Ghazal & Sufi Symphony Live', price: [3999, 2199, 999] },
      ],
      Sports: [
        { title: 'Championship League Super Derby Match', price: [6999, 3499, 1299] },
        { title: 'Pro Kabaddi & Football High-Stakes Clash', price: [2999, 1499, 599] },
        { title: 'Grand Sports Invitational Trophy & Finals', price: [3999, 1999, 799] },
        { title: 'National Badminton & Tennis Open Cup', price: [2499, 1299, 499] },
        { title: 'Marathon & Athletics Championship Gala', price: [1999, 999, 399] },
        { title: 'T20 Cricket Power Clash Under Floodlights', price: [7999, 3999, 1499] },
      ],
      Comedy: [
        { title: 'Standup Comedy Superstars Live Special', price: [2499, 1399, 699] },
        { title: 'Laugh Riot: Uncensored Improvisation & Standup', price: [1999, 1099, 499] },
        { title: 'All-Star Regional & Tanglish Comedy Gala', price: [2199, 1299, 599] },
        { title: 'Crowd Work & Roast Comedy Night Special', price: [1899, 999, 449] },
        { title: 'Bollywood Satire & Observational Humor Live', price: [2299, 1199, 549] },
        { title: 'Midnight Comedy Club: Open Mic & Headliners', price: [1599, 899, 399] },
      ],
      Festival: [
        { title: 'Mega Food, Culture & Live Music Carnival', price: [2499, 1299, 599] },
        { title: 'Grand Arts, Crafts & Heritage Celebration Fest', price: [1999, 999, 449] },
        { title: 'Illuminated Night Carnival & DJ Music Fest', price: [2999, 1499, 699] },
        { title: 'Flea Market, Street Food & Indie Fest', price: [1799, 899, 399] },
        { title: 'Traditional Cultural Gala & Folk Rhythm Fest', price: [2199, 1099, 499] },
        { title: 'Spring Bloom & Kite Flying Festival 2026', price: [1999, 999, 449] },
      ],
      Theatre: [
        { title: 'Broadway Musical Broadway Stage Production', price: [3499, 1899, 799] },
        { title: 'Classical Epic & Heritage Folk Drama Live', price: [2499, 1299, 549] },
        { title: 'Contemporary Award-Winning Stage Play', price: [2199, 1199, 499] },
        { title: 'Historical Monologues & Stagecraft Spectacle', price: [2799, 1499, 649] },
        { title: 'Musical Comedy & Interactive Stage Drama', price: [1999, 1099, 449] },
        { title: 'Poetic Dance Drama & Classical Ballet Gala', price: [2999, 1599, 699] },
      ],
      Conference: [
        { title: 'Global AI, Cloud & Tech Innovation Summit', price: [4999, 2799, 1199] },
        { title: 'Future Startup, FinTech & Leadership Conclave', price: [3999, 2199, 899] },
        { title: 'Digital Enterprise & Deep Tech Expo 2026', price: [4499, 2499, 999] },
        { title: 'Green Energy, EV & Sustainable Tech Summit', price: [3499, 1999, 799] },
        { title: 'Healthcare Innovation & Biotech Conclave', price: [4199, 2299, 899] },
        { title: 'Design, Product & Agile Leadership Summit', price: [3799, 1999, 849] },
      ],
      Exhibition: [
        { title: 'International Auto, EV & Smart Mobility Expo', price: [1999, 999, 399] },
        { title: 'Handloom, Textile & Fine Jewellery Fair', price: [1499, 799, 299] },
        { title: 'Luxury Lifestyle, Architecture & Design Expo', price: [2499, 1299, 499] },
        { title: 'Modern Art, Photography & Sculpture Gallery', price: [1699, 899, 349] },
        { title: 'Industrial Robotics & Manufacturing Machinery Expo', price: [2199, 1199, 449] },
        { title: 'Books, Publications & Rare Manuscripts Fair', price: [1299, 699, 249] },
      ],
      Workshop: [
        { title: 'Hands-on AI Agent Coding & GenAI Masterclass', price: [2999, 1699, 799] },
        { title: 'Artisan Baking, Specialty Coffee & Culinary Workshop', price: [2199, 1299, 599] },
        { title: 'Ceramic Pottery, Clay Sculpting & Canvas Painting', price: [1899, 1099, 499] },
        { title: 'DSLR Photography & Visual Storytelling Bootcamp', price: [2499, 1399, 599] },
        { title: 'UI/UX Design Systems & Figma Pro Masterclass', price: [2699, 1499, 699] },
        { title: 'Music Production & DJing with Ableton Live', price: [3199, 1799, 799] },
      ],
      Gaming: [
        { title: 'Esports National Arena Championship Finals', price: [2499, 1299, 499] },
        { title: 'Valorant & Tactical FPS Pro LAN Tournament', price: [1999, 999, 399] },
        { title: 'Retro Arcade, Cosplay & Tabletop Gaming Fest', price: [1499, 799, 299] },
        { title: 'BGMI & Mobile Battle Royale Championship', price: [2199, 1199, 449] },
        { title: 'EA Sports FC 26 PlayStation Pro League', price: [1799, 899, 349] },
        { title: 'Fighting Game Championship: Tekken & SF6', price: [1699, 849, 329] },
      ],
      Meetup: [
        { title: 'Tech Founders, Angels & VC Networking Mixer', price: [1999, 999, 499] },
        { title: 'Product Designers, Engineers & Creators Circle', price: [1499, 799, 349] },
        { title: 'Book Lovers, Writers & Storytellers Meetup', price: [999, 499, 199] },
        { title: 'Speed Dating & Singles Evening for Professionals', price: [2299, 1299, 599] },
        { title: 'Digital Nomads, Freelancers & Remote Workers Hub', price: [1599, 849, 349] },
        { title: 'Foodies, Chefs & Culinary Creators Gathering', price: [1399, 699, 299] },
      ],
      Wellness: [
        { title: 'Sunrise Yoga, Pranayama & Sound Healing Symphony', price: [2199, 1199, 499] },
        { title: 'Mindful Meditation, Breathwork & Zen Retreat', price: [1899, 999, 399] },
        { title: 'Holistic Ayurvedic Health & Stress-Free Zen Camp', price: [1999, 1099, 449] },
        { title: 'Tibetan Singing Bowls & Crystal Sound Therapy', price: [2299, 1299, 549] },
        { title: 'Pranic Energy Cleansing & Chakra Alignment Camp', price: [1799, 899, 349] },
        { title: 'Breathwork & Ice Bath Immunity Booster Session', price: [2699, 1499, 649] },
      ],
      Nightlife: [
        { title: 'Rooftop Sundowner & Deep House Music Party', price: [2999, 1699, 799] },
        { title: 'Neon Glow Silent Disco & Retro Dance Wave', price: [1999, 1199, 549] },
        { title: 'High-Energy Club Takeover & Live DJ Night', price: [2499, 1399, 649] },
        { title: 'Beachfront Techno & Afro House Sunset Beats', price: [3199, 1799, 849] },
        { title: 'Craft Beer Crawl & Indie Band Rooftop Hop', price: [2299, 1299, 599] },
        { title: 'Midnight Retro 80s Disco & Synthwave Blast', price: [1899, 999, 449] },
      ],
      'Kids & Family': [
        { title: 'Grand Circus, Aerial Acrobatics & Magic Show', price: [2199, 1199, 499] },
        { title: 'Super Science Magic & Dinosaur Safari for Kids', price: [1899, 999, 399] },
        { title: 'Family Carnival, Puppet Theatre & Fairytale Adventure', price: [1699, 899, 349] },
        { title: 'Peppa Pig & Cartoon Characters Live Musical', price: [1999, 1099, 449] },
        { title: 'Interactive Science, Robotics & Space Explorers Camp', price: [2299, 1299, 549] },
        { title: 'Inflatable Water Wonderland & Family Carnival Games', price: [1799, 949, 399] },
      ],
    };

    const allEventsData = [];
    let offset = 8;

    for (const [cityName, cityVenues] of Object.entries(venueMapByCity)) {
      const venue = cityVenues[0];

      // For every city, generate 5-6 events for EVERY single category!
      for (const cat of categories) {
        const templates = categoryTemplates[cat] || categoryTemplates['Concert'];
        // Top major cities get 6 events per category, all other cities get 5 events per category!
        const isMajorCity = [
          'Bengaluru', 'Chennai', 'Coimbatore', 'Erode', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tiruppur', 'Tirunelveli',
          'Mumbai', 'New Delhi', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Goa', 'Jaipur', 'Kochi', 'Chandigarh', 'Lucknow', 'Indore'
        ].includes(cityName);

        const count = isMajorCity ? 6 : 5;

        for (let i = 0; i < count; i++) {
          const t = templates[i % templates.length];
          offset = (offset + 2) % 85 + 7;

          allEventsData.push({
            title: `${cityName} ${t.title} 2026`,
            description: `Experience the most exciting ${cat} event in ${cityName} featuring top artists, world-class staging, and unmatched audience energy.`,
            category: cat,
            venue: venue._id,
            city: cityName,
            date: addDays(offset),
            doorsOpen: addDays(offset),
            bannerUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
            thumbnailUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
            status: 'PUBLISHED',
            featured: i === 0 && (cat === 'Concert' || cat === 'Sports' || cat === 'Festival'),
            pricing: [
              { category: 'VIP', price: t.price[0] },
              { category: 'Premium', price: t.price[1] },
              { category: 'General', price: t.price[2] },
            ],
            cancellationPolicy: {
              allowCancellation: true,
              cutoffHours: 24,
            },
            totalSeats: 130,
            availableSeats: 130,
          });
        }
      }
    }

    console.log(`⚡ Fast bulk inserting ${allEventsData.length} events across all cities and all 13 categories (5-6 events per category per city)...`);
    const insertedEvents = await Event.insertMany(allEventsData);
    console.log(`✅ ${insertedEvents.length} Events inserted successfully!`);

    // Pre-generate seats for the top 50 featured events so they are immediately warm in DB
    console.log('⚡ Pre-generating seats for top events...');
    const topEvents = insertedEvents.slice(0, 50);
    for (const evt of topEvents) {
      const v = venues.find(v => v._id.toString() === evt.venue.toString());
      if (v) {
        await generateSeatsForEvent(evt, v, evt.pricing);
      }
    }

    console.log('\n======================================================================');
    console.log(`🎉 SUCCESS: ${insertedEvents.length} EVENTS SEEDED (5-6 EVENTS IN EVERY CATEGORY PER CITY)!`);
    console.log('======================================================================');
    console.log('📍 Including ERODE and all TAMIL NADU Districts:');
    console.log('   Chennai, Coimbatore, Cuddalore, Dindigul, Erode, Hosur,');
    console.log('   Kanchipuram, Kanyakumari, Karur, Madurai, Nagercoil,');
    console.log('   Namakkal, Puducherry, Ramanathapuram, Salem, Sivakasi,');
    console.log('   Thanjavur, Theni, Thoothukudi, Tiruchirappalli, Tirunelveli,');
    console.log('   Tiruppur, Tiruvannamalai, Vellore, Villupuram, Virudhunagar');
    console.log('🏷️ 13 Event Categories with 5 to 6 events each in EVERY city!');
    console.log('💰 All Priced in Authentic Indian Rupee (₹ INR)');
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
