/**
 * Comprehensive Event Details & Genre Helper
 * Provides rich metadata, genres, line-ups, schedules, highlights,
 * and venue amenities for all events across all 13 categories.
 */

export const ALL_GENRES = [
  { id: '', name: 'All Genres', emoji: '🎟️', count: '4,700+' },
  { id: 'Concert', name: 'Concerts & Live Music', emoji: '🎸', count: '400+' },
  { id: 'Festival', name: 'Festivals & Carnivals', emoji: '🎪', count: '380+' },
  { id: 'Nightlife', name: 'DJ & Nightlife', emoji: '🍸', count: '350+' },
  { id: 'Comedy', name: 'Stand-up Comedy', emoji: '🎤', count: '370+' },
  { id: 'Sports', name: 'Sports & Matches', emoji: '🏆', count: '420+' },
  { id: 'Theatre', name: 'Theatre & Broadway', emoji: '🎭', count: '340+' },
  { id: 'Conference', name: 'Tech & Summits', emoji: '💻', count: '360+' },
  { id: 'Exhibition', name: 'Art & Expos', emoji: '🏛️', count: '350+' },
  { id: 'Workshop', name: 'Bootcamps & Workshops', emoji: '🎨', count: '380+' },
  { id: 'Gaming', name: 'Esports & Gaming', emoji: '🎮', count: '360+' },
  { id: 'Meetup', name: 'Community & Meetups', emoji: '👥', count: '340+' },
  { id: 'Wellness', name: 'Yoga & Retreats', emoji: '🧘', count: '330+' },
  { id: 'Kids & Family', name: 'Kids & Family', emoji: '🎠', count: '320+' },
];

const GENRE_DETAILS_MAP = {
  Concert: {
    subgenres: ['Live Symphony', 'Bollywood Acoustic', 'Indie Rock Fusion', 'Pop & EDM Beats', 'Soulful Sufi & Ghazal'],
    languages: ['Hindi & English', 'Tamil & English', 'Multi-Lingual Live', 'Instrumental'],
    durations: ['3 Hours 30 Mins', '3 Hours', '4 Hours'],
    ageLimits: ['All Ages Welcome', '12+ Years (Accompanied by Adult)', '16+ Only'],
    artists: [
      { name: 'Arijit Singh & Ensemble', role: 'Headliner / Vocals', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=80' },
      { name: 'Anirudh Ravichander Live', role: 'Music Director & Band', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80' },
      { name: 'The Indian Ocean Trio', role: 'Opening Indie Act', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80' },
      { name: 'Symphony Strings Ensemble', role: 'Classical Orchestra', image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      '360° Immersive Stadium Dolby Atmos Acoustic Sound System',
      'Synchronized Laser Lights & Pyro Stage Production',
      'Designated VIP Lounge with Complimentary Mocktails & Snacks',
      'Live HD Megascreens & Multi-Angle Stage Feeds',
      'Official Artist Merchandise & Souvenir Booths',
      'Dedicated Box Office Check-In & Bag Drop Lockers',
    ],
    schedule: [
      { time: '05:30 PM', title: 'Box Office & Fast-Track Gates Open', desc: 'Security screening, wristband pickup & merch stalls' },
      { time: '06:45 PM', title: 'Opening Artist Live Warm-up Act', desc: 'Indie instrumental & crowd rhythm warmup' },
      { time: '07:45 PM', title: 'Main Headline Concert Performance', desc: 'Full band, electric stage effects & fan favorites' },
      { time: '10:15 PM', title: 'Grand Encore & Fireworks Spectacular', desc: 'Closing anthem & stadium farewell' },
    ],
  },

  Sports: {
    subgenres: ['T20 Cricket Derby', 'Pro Kabaddi High Stakes', 'Football League Clash', 'National Badminton Cup', 'Marathon Championship'],
    languages: ['Live Hindi & English Commentary', 'Multi-Lingual Stadium Feed'],
    durations: ['3 Hours 45 Mins', '2 Hours', 'Full Day Tournament'],
    ageLimits: ['All Ages Welcome (Kids Under 3 Free)', 'Family Friendly'],
    artists: [
      { name: 'Championship First XI Squad', role: 'Home Contenders', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=300&auto=format&fit=crop&q=80' },
      { name: 'National Challenger Titans', role: 'Visiting Contenders', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300&auto=format&fit=crop&q=80' },
      { name: 'Live Dugout Commentators', role: 'Stadium Announcers', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      'Floodlit Stadium Match with Ultra-HD Replay Jumbotron',
      'Atomic Seat Allocation with Guaranteed Sightline Clearance',
      'Food Concourse with Team Snacks & Sports Beverages',
      'Fan Zone with Face Painting, Jerseys & Foam Fingers',
      'Multi-Level Stadium Parking & Shuttle Transit Drop-Off',
      'First-Aid Medical Booths & Emergency Paramedic Support',
    ],
    schedule: [
      { time: '04:00 PM', title: 'Stadium Concourse & Fan Village Opens', desc: 'Practice viewing, team store & interactive games' },
      { time: '06:30 PM', title: 'Toss & National Anthem Ceremony', desc: 'Official lineup announcement & anthem tribute' },
      { time: '07:00 PM', title: 'First Innings / Match Kick-Off', desc: 'High-octane action & crowd cheer cheering' },
      { time: '10:30 PM', title: 'Post-Match Trophy & Presentation Ceremony', desc: 'Player of the Match & captain address' },
    ],
  },

  Comedy: {
    subgenres: ['Standup Comedy Special', 'Crowd Work & Roast', 'Uncensored Improv', 'Bollywood Satire', 'Midnight Comedy Club'],
    languages: ['Hindi & English (Hinglish)', 'Tamil & English (Tanglish)', 'English'],
    durations: ['1 Hour 45 Mins', '2 Hours', '2 Hours 15 Mins'],
    ageLimits: ['16+ Only (Contains Mature Humor)', '18+ Strict Photo ID'],
    artists: [
      { name: 'Zakir Khan / Vir Das Special', role: 'Headline Comedian', image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=300&auto=format&fit=crop&q=80' },
      { name: 'Laugh Factory All-Stars', role: 'Opening Comedians', image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      'Intimate Auditorium Seating with Crystal Clear Vocal Microphones',
      'No Outside Cellphone Recording (Yondr Pouch Environment)',
      'Cocktail & Mocktail Service before the show',
      'Brand New Unreleased Material from the Artist Tour',
      'Meet & Greet Photo Opportunity for VIP Pass holders',
    ],
    schedule: [
      { time: '06:30 PM', title: 'Doors Open & Foyer Social Hour', desc: 'Ticket scanning, beverage collection & seating' },
      { time: '07:30 PM', title: 'Opening Comedian Set', desc: '15-minute quick-fire opening routine' },
      { time: '07:50 PM', title: 'Headline Standup Special Live', desc: '80 minutes of non-stop new tour material' },
      { time: '09:20 PM', title: 'Show Wrap & VIP Fan Meet-and-Greet', desc: 'Photo session for front-row VIP pass holders' },
    ],
  },

  Festival: {
    subgenres: ['Food, Flea & Music Carnival', 'Illuminated Night DJ Fest', 'Grand Arts & Cultural Fest', 'Spring Bloom Fest'],
    languages: ['Multi-Lingual Celebration', 'English & Regional'],
    durations: ['Full Day (11:00 AM - 10:00 PM)', '2-Day Weekend Pass', '8 Hours'],
    ageLimits: ['All Ages Welcome (Family Friendly)', 'Free for Under 6 Years'],
    artists: [
      { name: 'International Stage Collective', role: 'Headlining Acts', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&auto=format&fit=crop&q=80' },
      { name: 'Artisan Food Curators & Chefs', role: 'Gourmet Flea Market', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      '50+ Curated Gourmet Street Food & Dessert Stalls',
      'Multiple Stages: Main Arena, Indie Acoustic Tent, Silent Disco',
      'Handcrafted Artisan Flea Market & Indie Apparel Brands',
      'Interactive Giant Art Installations & Photo Booths',
      'Kids Play Wonderland with Inflatables & Balloon Artists',
    ],
    schedule: [
      { time: '11:00 AM', title: 'Gates Open & Flea Market Commences', desc: 'Culinary stroll, handicraft shopping & lawn seating' },
      { time: '03:00 PM', title: 'Acoustic Stage & Interactive Art Shows', desc: 'Live buskers, puppet theater & painting workshops' },
      { time: '06:30 PM', title: 'Main Stage Sundowner Music Sets', desc: 'Live indie bands & electronic soundscape' },
      { time: '09:30 PM', title: 'Grand Carnival Lantern Launch & Finale', desc: 'Festival illumination & closing beats' },
    ],
  },

  Theatre: {
    subgenres: ['Broadway Stage Musical', 'Classical Epic Drama', 'Contemporary Play', 'Ballet & Dance Drama', 'Historical Monologues'],
    languages: ['English', 'Hindi', 'Tamil Drama', 'Classical Bilingual'],
    durations: ['2 Hours 30 Mins (With 15 Min Intermission)', '2 Hours'],
    ageLimits: ['8+ Years Welcome', 'All Ages'],
    artists: [
      { name: 'National Repertory Ensemble', role: 'Lead Cast & Protagonists', image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=300&auto=format&fit=crop&q=80' },
      { name: 'Acclaimed Stage Director & Crew', role: 'Scenic & Set Design', image: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      'Grand Proscenium Arch Theatre with Tiered Balcony Seating',
      'Live Orchestral Pit Performance with Acoustic Amplification',
      'Lavish Period Costumes & Dynamic Rotating Stage Sets',
      'Souvenir Program Booklet included with VIP & Premium Passes',
      'Full Wheelchair Accessible Seating on Ground Stalls',
    ],
    schedule: [
      { time: '06:00 PM', title: 'Foyer Box Office & Programme Collection', desc: 'Coat check, refreshment lounge & auditorium bell' },
      { time: '06:50 PM', title: 'Curtain Call & Auditorium Doors Lock', desc: 'Latecomers seated only during intermission' },
      { time: '07:00 PM', title: 'Act I - The Drama Begins', desc: 'Opening scenes, musical overture & plot unveiling' },
      { time: '08:15 PM', title: '15-Minute Intermission', desc: 'Refreshments & restroom break in foyer' },
      { time: '08:30 PM', title: 'Act II - Climax & Standing Ovation', desc: 'Dazzling finale & full cast curtain call' },
    ],
  },

  Conference: {
    subgenres: ['Global AI & Cloud Summit', 'FinTech & Leadership Conclave', 'Green Energy & EV Expo', 'Product & Design Conclave'],
    languages: ['English'],
    durations: ['Full Day (9:00 AM - 6:00 PM)', '2-Day Master Summit'],
    ageLimits: ['Professionals & Students (18+)', 'All Delegates'],
    artists: [
      { name: 'Global VP of Artificial Intelligence', role: 'Keynote Speaker', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&auto=format&fit=crop&q=80' },
      { name: 'FinTech Founders & Unicorn Panel', role: 'Panel Discussion Leads', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      '30+ Keynotes, Fireside Chats & Real-World Case Studies',
      'Networking Buffet Lunch & Executive Coffee Breaks',
      'Startup Pitch Arena & Venture Capital Demo Days',
      'Official Certificate of Attendance & Slide Deck Access',
      'Dedicated High-Speed Enterprise Wi-Fi & Charging Lounges',
    ],
    schedule: [
      { time: '08:30 AM', title: 'Delegate Registration & Welcome Breakfast', desc: 'Badge printing, gift kit distribution & coffee' },
      { time: '09:30 AM', title: 'Opening Keynote Address', desc: 'State of tech, AI breakthroughs & industry roadmap' },
      { time: '01:00 PM', title: 'Gourmet Networking Lunch & Startup Expo', desc: 'Interactive booths, product demos & executive dining' },
      { time: '02:30 PM', title: 'Deep-Dive Breakout Tracks & Workshops', desc: 'Technical labs, security architecture & founder firesides' },
      { time: '05:30 PM', title: 'Closing Mixer & Drinks Reception', desc: 'Peer networking & executive mixer' },
    ],
  },

  Exhibition: {
    subgenres: ['Auto, EV & Smart Mobility', 'Handloom & Fine Jewellery', 'Luxury Architecture & Interiors', 'Modern Art Gallery'],
    languages: ['English & Regional', 'Multi-Lingual Guides'],
    durations: ['Full Day Entry (10:00 AM - 7:00 PM)', 'Flexible Multi-Day Pass'],
    ageLimits: ['All Ages Welcome', 'Children Free Below 10'],
    artists: [
      { name: 'Renowned Curators & Master Artisans', role: 'Exhibiting Craftsmen', image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=300&auto=format&fit=crop&q=80' },
      { name: 'Industrial Designers & Innovators', role: 'Lead Exhibitors', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      '200+ International Brand Showcases & Interactive Pavilions',
      'Exclusive Launch Discounts & Live Product Demonstrations',
      'Guided Gallery Tours with Art Historians & Architects',
      'Climate-Controlled Convention Halls with Escalators & Ramps',
      'Packaging, Secure Delivery & Valet Parking Assistance',
    ],
    schedule: [
      { time: '10:00 AM', title: 'Exhibition Hall Opens to Public', desc: 'Fast-track badge scanning & digital catalog access' },
      { time: '01:30 PM', title: 'Live Product Launch & Runway Showcase', desc: 'Unveiling new automotive & design collections' },
      { time: '04:00 PM', title: 'Expert Q&A & Curator Guided Walkthrough', desc: 'Detailed discussion on craftsmanship and materials' },
      { time: '07:00 PM', title: 'Halls Close for Evening Maintenance', desc: 'Last admissions 30 minutes before closure' },
    ],
  },

  Workshop: {
    subgenres: ['Hands-on AI Agent Coding', 'Artisan Coffee & Baking', 'Ceramic Pottery & Clay Art', 'DSLR Photography Masterclass'],
    languages: ['English & Hindi', 'English'],
    durations: ['3 Hours Intensive', '4 Hours Hands-on Bootcamp'],
    ageLimits: ['14+ Years Welcome', 'Beginner to Advanced'],
    artists: [
      { name: 'Master Craftsman / Tech Mentor', role: 'Lead Instructor', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      '100% Hands-on Practice with All Materials & Tools Provided',
      'Take-Home Completed Project & Digital Resource Toolkit',
      '1-on-1 Guidance from Certified Industry Experts',
      'Complimentary Artisan Refreshments & Beverages',
      'Personalized Completion Certificate & Community Group Access',
    ],
    schedule: [
      { time: '10:00 AM', title: 'Kit Distribution & Mentor Introduction', desc: 'Workstation setup, tool introduction & safety briefing' },
      { time: '10:30 AM', title: 'Live Concept Demonstration', desc: 'Step-by-step masterclass on techniques & theory' },
      { time: '11:15 AM', title: 'Individual Hands-on Creation Time', desc: 'Guided practical building with mentor feedback' },
      { time: '01:00 PM', title: 'Showcase, Critique & Certificate Award', desc: 'Showcasing your creation & final group photo' },
    ],
  },

  Gaming: {
    subgenres: ['Esports National Championship', 'Valorant & Tactical FPS Pro LAN', 'Retro Arcade & Cosplay', 'BGMI Mobile Royale', 'EA Sports FC 26'],
    languages: ['English & Hindi Live Shoutcasting'],
    durations: ['5 Hours Esports Day', 'Full Day Tournament'],
    ageLimits: ['12+ Years (Parental Guidance for Under 16)', 'All Gamers Welcome'],
    artists: [
      { name: 'Championship Pro Roster Teams', role: 'Esports Finalists', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&auto=format&fit=crop&q=80' },
      { name: 'Pro Shoutcasters & Streamers', role: 'Arena Casters', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      '240Hz High Refresh Tournament Displays & Soundproof Booths',
      'Massive Center Stage Jumbotron with Multi-POV Live Streams',
      'Free-Play Gaming Zone: PS5, Sim-Racing Rigs & VR Headsets',
      'Cosplay Runway Contest with Cash Prizes',
      'Gaming Peripherals & Merchandise Giveaways',
    ],
    schedule: [
      { time: '12:00 PM', title: 'Doors Open & Freeplay Arena Begins', desc: 'Check-in, VR demo booths & community 1v1 challenges' },
      { time: '02:00 PM', title: 'Semi-Finals Broadcast on Main Stage', desc: 'Fast-paced tactical matches with live shoutcasters' },
      { time: '05:30 PM', title: 'Cosplay Showcase & Halftime Giveaways', desc: 'Community costume awards & gaming rig raffle' },
      { time: '06:30 PM', title: 'Grand Finals & Trophy Lift', desc: 'Best-of-5 championship decider & winning ceremony' },
    ],
  },

  Meetup: {
    subgenres: ['Tech Founders & VC Mixer', 'Product & UX Creators Circle', 'Book Lovers & Writers Hub', 'Singles Evening & Mixer'],
    languages: ['English'],
    durations: ['2 Hours 30 Mins', '3 Hours'],
    ageLimits: ['18+ Professionals', 'All Open-Minded Creators'],
    artists: [
      { name: 'Community Host & Facilitators', role: 'Networking Leads', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      'Curated Crowd of 50-100 Like-Minded Creators & Founders',
      'Structured Icebreakers to Ensure Smooth, Pressure-Free Conversations',
      'Unlimited Gourmet Coffee, Craft Beers & Finger Snacks',
      'Direct Digital Contact Sharing Directory after the event',
      'Rooftop / Garden Venue with Relaxed Background Music',
    ],
    schedule: [
      { time: '06:00 PM', title: 'Check-In & Name Tag Customization', desc: 'Grab a welcome drink & choose your interest tags' },
      { time: '06:30 PM', title: 'Curated 5-Minute Lightning Icebreakers', desc: 'Rapid fun round-robin discussions with attendees' },
      { time: '07:30 PM', title: 'Open Casual Networking & Grazing Tables', desc: 'Deep dive into projects, collaborations & social chat' },
      { time: '08:45 PM', title: 'Group Photo & Community Directory Exchange', desc: 'Connect on LinkedIn / Instagram & wrap up' },
    ],
  },

  Wellness: {
    subgenres: ['Sunrise Yoga & Sound Healing', 'Mindful Breathwork Retreat', 'Ayurvedic Zen Wellness', 'Ice Bath & Immunity'],
    languages: ['English & Sanskrit Chants', 'English'],
    durations: ['2 Hours 30 Mins', '3 Hours Morning Session'],
    ageLimits: ['14+ Years Welcome', 'Suitable for All Fitness Levels'],
    artists: [
      { name: 'Certified Sound Healer & Yogacharya', role: 'Lead Wellness Guide', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      'Tibetan Singing Bowls, Symphonic Gongs & Ocean Chimes',
      'Organic Herbal Teas, Detox Cold-Pressed Juices & Fruit Bowls',
      'Complimentary Eco-Friendly Yoga Mats & Meditation Cushions',
      'Lush Green Outdoor Lawn or Climate-Controlled Zen Studio',
      'Guided Pranayama & Stress-Relief Take-Home Techniques',
    ],
    schedule: [
      { time: '06:30 AM', title: 'Silent Entry & Herbal Tea Welcome', desc: 'Choose your mat, calm your senses & gentle aroma oils' },
      { time: '07:00 AM', title: 'Mindful Vinyasa Flow & Gentle Mobility', desc: 'Awakening stretches guided by licensed yogis' },
      { time: '08:00 AM', title: 'Tibetan Sound Bath & Deep Savasana', desc: 'Full-body vibration immersion for nervous system reset' },
      { time: '08:45 AM', title: 'Detox Juices & Community Reflections', desc: 'Mindful conversation & healthy breakfast bites' },
    ],
  },

  Nightlife: {
    subgenres: ['Rooftop Sunset Sundowner', 'Neon Silent Disco', 'Underground Techno Wave', 'Midnight 80s Disco & Synthwave'],
    languages: ['Electronic / House / Beats', 'English'],
    durations: ['5 Hours (08:00 PM - 01:00 AM)', '4 Hours'],
    ageLimits: ['21+ Only (Government Physical ID Mandatory)', 'Strict Dress Code: Smart Casual / Neon'],
    artists: [
      { name: 'Headline DJ & Music Producer', role: 'Main Club Resident', image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=300&auto=format&fit=crop&q=80' },
      { name: 'Opening Deep House Act', role: 'Sunset Warm-up', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      'Bespoke Funktion-One / Void Acoustics Club Sound Rig',
      'Craft Cocktail Bars with Mixologists & Bottle Service',
      'Neon UV Body Painting & Glow Sticks Included on Entry',
      'VIP Rooftop Cabanas with Private Butler & Valet Parking',
      'Zero-Tolerance Safe Space with Trained Security Staff',
    ],
    schedule: [
      { time: '08:00 PM', title: 'Doors Open & Sundowner Cocktail Hour', desc: 'Sunset drinks, chill progressive house & neon glow' },
      { time: '09:30 PM', title: 'Direct Support DJ Sets the Floor', desc: 'Melodic techno, groovy baselines & visual lighting' },
      { time: '11:00 PM', title: 'Headline DJ Set & Main Club Drop', desc: 'Peak energy club beats, laser choreography & CO2 cannons' },
      { time: '01:00 AM', title: 'Closing Cool-Down & Cab Coordination', desc: 'Designated driver assistance & safe exit' },
    ],
  },

  'Kids & Family': {
    subgenres: ['Grand Circus & Aerial Acrobatics', 'Science Magic & Dinosaur Safari', 'Family Puppet Carnival', 'Water Wonderland'],
    languages: ['Hindi & English', 'Tamil & English', 'Universal Visual Comedy'],
    durations: ['2 Hours (With 15 Min Break)', 'Full Day Carnival'],
    ageLimits: ['All Ages (Free for Under 2 on Parent Lap)', 'Child-Safe Environment'],
    artists: [
      { name: 'Master Illusionist & Circus Troupe', role: 'Star Entertainers', image: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=300&auto=format&fit=crop&q=80' },
      { name: 'Cartoon Mascot Characters', role: 'Photo Pals', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=300&auto=format&fit=crop&q=80' },
    ],
    highlights: [
      'Gravity-Defying Aerial Trapeze, Juggling & Clown Acts',
      'Interactive Giant Dinosaur Walkaround & Fossil Dig Zone',
      'Complimentary Popcorn, Cotton Candy & Fruit Slushies for Kids',
      'Photo Opps with Lifesize Cartoon Mascots after the show',
      'Stroller Parking & Dedicated Nursing / Family Restrooms',
    ],
    schedule: [
      { time: '03:30 PM', title: 'Family Foyer & Mascot Welcomes', desc: 'Photo booth, face painting & balloon sculpting' },
      { time: '04:15 PM', title: 'Auditorium Seating & Safety Welcome', desc: 'Fun interactive games to get the kids ready' },
      { time: '04:30 PM', title: 'Part 1: Spectacular Magic & Circus Acts', desc: 'Hilarious clowns, jaw-dropping acrobatics & bubbles' },
      { time: '05:20 PM', title: '15-Minute Popcorn & Ice Cream Break', desc: 'Snack stretch & toy souvenir shopping' },
      { time: '05:35 PM', title: 'Part 2: Dinosaur Safari & Confetti Finale', desc: 'Giant friendly dinos on stage & confetti shower' },
    ],
  },
};

/**
 * Extracts or synthesizes rich, reliable happening details for ANY event
 */
export function getRichEventDetails(event) {
  if (!event) return null;

  const category = (event.category || 'Concert').trim();
  const catConfig = GENRE_DETAILS_MAP[category] || GENRE_DETAILS_MAP['Concert'];

  // Compute a deterministic hash based on event ID or title
  const key = (event._id || '') + (event.title || '') + (event.city || '');
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  // Pick deterministic subgenre
  const subgenre = event.genre || catConfig.subgenres[absHash % catConfig.subgenres.length];
  const language = event.language || catConfig.languages[absHash % catConfig.languages.length];
  const duration = event.duration || catConfig.durations[absHash % catConfig.durations.length];
  const ageLimit = event.ageRestriction || catConfig.ageLimits[absHash % catConfig.ageLimits.length];

  // Pick deterministic lineup/artists
  const artists = event.performers && event.performers.length > 0
    ? event.performers.map((p) => ({ name: p, role: 'Featured Artist', image: catConfig.artists[0]?.image }))
    : catConfig.artists;

  const highlights = event.highlights && event.highlights.length > 0
    ? event.highlights
    : catConfig.highlights;

  const schedule = event.schedule && event.schedule.length > 0
    ? event.schedule
    : catConfig.schedule;

  return {
    category,
    subgenre,
    language,
    duration,
    ageLimit,
    artists,
    highlights,
    schedule,
  };
}

export const TIER_PERKS_MAP = {
  VIP: [
    'Front Row Guaranteed Atomic Seating with Prime Unobstructed Sightline',
    'Dedicated VIP Red-Carpet Express Lane (Skip General Queues)',
    'Air-Conditioned VIP Hospitality Lounge with Welcome Drinks & Gourmet Bites',
    'Collectible Physical Souvenir Holographic Pass & Event Lanyard',
    'VIP Reserved Parking Bay right beside the Stadium Gate',
  ],
  Premium: [
    'Elevated Central Grandstand Seating with Panoramic Stage View',
    'Dedicated Fast-Track Entrance Gate & Direct Usher Escort',
    'Access to Premium Concourse Food & Beverage Counters',
    'Cushioned Stadium Seats with Extra Legroom',
  ],
  General: [
    'Access to Full Arena Stadium Atmosphere & Main Soundstage',
    'Freedom to choose best available seats within the General Tier Section',
    'Full access to concourse merchandise kiosks, food courts & restrooms',
    'Guaranteed Atomic Reservation - No double bookings',
  ],
};

export const VENUE_AMENITIES = [
  { label: 'Paid Parking Available', icon: 'Car' },
  { label: 'Wheelchair Accessible Ramps', icon: 'Accessibility' },
  { label: 'Food & Beverage Courts', icon: 'Utensils' },
  { label: 'Air-Conditioned Areas', icon: 'Wind' },
  { label: 'First-Aid Medical Booth', icon: 'Cross' },
  { label: 'ATM & Digital Payments', icon: 'CreditCard' },
];
