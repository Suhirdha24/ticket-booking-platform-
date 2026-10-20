import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/Book.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import ReadingList from '../models/ReadingList.js';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket-booking-platform';

const BOOKS_DATA = [
  // 🚀 SCI-FI & SPECULATIVE
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    description: 'A lone astronaut must save the earth from disaster in this incredible new adventure from the bestselling author of The Martian. Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself are doomed.',
    coverImage: 'https://images.unsplash.com/photo-1618609377864-68609b857e90?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0593135204',
    genres: ['Sci-Fi', 'Adventure', 'Science'],
    publishedYear: 2021,
    publisher: 'Ballantine Books',
    pageCount: 496,
    language: 'English',
    averageRating: 4.8,
    ratingsCount: 4210,
    moodTags: ['Mind-Bending', 'Fast-Paced', 'Inspirational'],
    readingPace: 'Fast',
    featured: true,
    trending: true,
    quotes: ['Human beings have a remarkable ability to accept the abnormal and make it normal.'],
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0441172719',
    genres: ['Sci-Fi', 'Fantasy', 'Classics'],
    publishedYear: 1965,
    publisher: 'Chilton Books',
    pageCount: 688,
    language: 'English',
    averageRating: 4.7,
    ratingsCount: 8940,
    moodTags: ['Epic Worldbuilding', 'Philosophical', 'Dark & Gripping'],
    readingPace: 'Slow Burn',
    featured: true,
    trending: true,
    quotes: ['I must not fear. Fear is the mind-killer.'],
  },
  {
    title: 'Dark Matter',
    author: 'Blake Crouch',
    description: 'Jason Dessen is kidnapped and wakes up strapped to a gurney, surrounded by strangers in hazmat suits. A man Jason has never seen smiles down at him and says, "Welcome back, my friend." In this world, Jason\'s life is not the one he knows.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    isbn: '978-1101904244',
    genres: ['Sci-Fi', 'Thriller', 'Mystery'],
    publishedYear: 2016,
    publisher: 'Crown Publishing',
    pageCount: 352,
    language: 'English',
    averageRating: 4.6,
    ratingsCount: 3120,
    moodTags: ['Mind-Bending', 'Fast-Paced', 'Dark & Gripping'],
    readingPace: 'Fast',
    featured: false,
    trending: true,
    quotes: ['Are you happy with your life?'],
  },
  {
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    description: 'From the Nobel Prize-winning author, Klara and the Sun tells the story of Klara, an Artificial Friend with outstanding observational qualities, who, from her place in the store, watches carefully the behavior of those who come in to browse.',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0593318171',
    genres: ['Sci-Fi', 'Fiction', 'Philosophical'],
    publishedYear: 2021,
    publisher: 'Knopf',
    pageCount: 320,
    language: 'English',
    averageRating: 4.4,
    ratingsCount: 2150,
    moodTags: ['Emotional', 'Philosophical', 'Cozy & Relaxing'],
    readingPace: 'Moderate',
    featured: false,
    trending: false,
    quotes: ['Do you believe in the human heart?'],
  },

  // 🕵️ MYSTERY & PSYCHOLOGICAL THRILLER
  {
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description: 'Alicia Berenson’s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house. Then one evening she shoots her husband five times in the face and never speaks another word.',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    isbn: '978-1250301696',
    genres: ['Mystery', 'Thriller', 'Psychological'],
    publishedYear: 2019,
    publisher: 'Celadon Books',
    pageCount: 336,
    language: 'English',
    averageRating: 4.7,
    ratingsCount: 6540,
    moodTags: ['Dark & Gripping', 'Mind-Bending', 'Fast-Paced'],
    readingPace: 'Fast',
    featured: true,
    trending: true,
    quotes: ['Remember, love that doesn’t include honesty doesn’t deserve to be called love.'],
  },
  {
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    description: 'On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne’s fifth wedding anniversary. Presents are being wrapped and reservations made when Nick’s clever and beautiful wife disappears.',
    coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0307588371',
    genres: ['Mystery', 'Thriller', 'Psychological'],
    publishedYear: 2012,
    publisher: 'Crown',
    pageCount: 432,
    language: 'English',
    averageRating: 4.5,
    ratingsCount: 7890,
    moodTags: ['Dark & Gripping', 'Mind-Bending', 'Cynical'],
    readingPace: 'Fast',
    featured: false,
    trending: false,
    quotes: ['What are you thinking, Amy? How are you feeling? What have we done to each other?'],
  },
  {
    title: 'And Then There Were None',
    author: 'Agatha Christie',
    description: 'Ten strangers are lured to an isolated island mansion off the Devon coast by a mysterious host. One by one, the guests share the darkest secrets of their wicked pasts. And one by one, they die.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0062073488',
    genres: ['Mystery', 'Classics', 'Thriller'],
    publishedYear: 1939,
    publisher: 'Collins Crime Club',
    pageCount: 272,
    language: 'English',
    averageRating: 4.8,
    ratingsCount: 11200,
    moodTags: ['Dark & Gripping', 'Mind-Bending', 'Fast-Paced'],
    readingPace: 'Fast',
    featured: true,
    trending: false,
    quotes: ['Ten little soldier boys went out to dine; One choked his little self and then there were nine.'],
  },

  // ⚡ PERSONAL GROWTH & MINDSET
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master tiny behaviors that lead to remarkable results.',
    coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0735211292',
    genres: ['Self-Help', 'Non-Fiction', 'Psychology'],
    publishedYear: 2018,
    publisher: 'Avery',
    pageCount: 320,
    language: 'English',
    averageRating: 4.9,
    ratingsCount: 15400,
    moodTags: ['Inspirational', 'Productive', 'Life-Changing'],
    readingPace: 'Moderate',
    featured: true,
    trending: true,
    quotes: ['You do not rise to the level of your goals. You fall to the level of your systems.'],
  },
  {
    title: 'Deep Work',
    author: 'Cal Newport',
    description: 'Deep work is the ability to focus without distraction on a cognitively demanding task. It\'s a skill that allows you to quickly master complicated information and produce better results in less time.',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80',
    isbn: '978-1455586691',
    genres: ['Self-Help', 'Non-Fiction', 'Technology'],
    publishedYear: 2016,
    publisher: 'Grand Central Publishing',
    pageCount: 304,
    language: 'English',
    averageRating: 4.6,
    ratingsCount: 5200,
    moodTags: ['Productive', 'Inspirational', 'Philosophical'],
    readingPace: 'Moderate',
    featured: false,
    trending: true,
    quotes: ['If you don’t produce, you won’t thrive—no matter how skilled or talented you are.'],
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    description: 'In the international bestseller, Thinking, Fast and Slow, Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0374533557',
    genres: ['Non-Fiction', 'Psychology', 'Science'],
    publishedYear: 2011,
    publisher: 'Farrar, Straus and Giroux',
    pageCount: 512,
    language: 'English',
    averageRating: 4.6,
    ratingsCount: 6800,
    moodTags: ['Mind-Bending', 'Philosophical', 'Deep'],
    readingPace: 'Slow Burn',
    featured: false,
    trending: false,
    quotes: ['A reliable way to make people believe in falsehoods is frequent repetition.'],
  },

  // 🌍 HISTORY & BIG IDEAS
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'From a renowned historian comes a groundbreaking narrative of humanity’s creation and evolution—a #1 international bestseller—that explores how biology and history have defined us and enhanced our understanding of what it means to be "human."',
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0062316097',
    genres: ['Non-Fiction', 'History', 'Philosophy', 'Science'],
    publishedYear: 2015,
    publisher: 'Harper',
    pageCount: 464,
    language: 'English',
    averageRating: 4.8,
    ratingsCount: 13200,
    moodTags: ['Mind-Bending', 'Philosophical', 'Inspirational'],
    readingPace: 'Moderate',
    featured: true,
    trending: true,
    quotes: ['You could never convince a monkey to give you a banana by promising him limitless bananas after death in monkey heaven.'],
  },

  // 🧙 FANTASY & MAGIC
  {
    title: 'The Way of Kings',
    author: 'Brandon Sanderson',
    description: 'Roshar is a world of stone and storms. Uncanny tempests of incredible power sweep across the rocky terrain so frequently that they have shaped ecology and civilization alike. It is the beginning of the Stormlight Archive.',
    coverImage: 'https://images.unsplash.com/photo-1514894780887-121968d00567?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0765326355',
    genres: ['Fantasy', 'Adventure', 'Epic'],
    publishedYear: 2010,
    publisher: 'Tor Books',
    pageCount: 1007,
    language: 'English',
    averageRating: 4.9,
    ratingsCount: 9400,
    moodTags: ['Epic Worldbuilding', 'Inspirational', 'Emotional'],
    readingPace: 'Slow Burn',
    featured: true,
    trending: true,
    quotes: ['Life before death. Strength before weakness. Journey before destination.'],
  },
  {
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    description: 'Told in Kvothe\'s own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen. The intimate high fantasy debut of a legendary hero.',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0756404741',
    genres: ['Fantasy', 'Adventure', 'Fiction'],
    publishedYear: 2007,
    publisher: 'DAW Books',
    pageCount: 662,
    language: 'English',
    averageRating: 4.8,
    ratingsCount: 8200,
    moodTags: ['Epic Worldbuilding', 'Emotional', 'Cozy & Relaxing'],
    readingPace: 'Moderate',
    featured: false,
    trending: true,
    quotes: ['Words are pale shadows of forgotten names.'],
  },

  // 📖 CONTEMPORARY FICTION & EMOTIONAL
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices.',
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0525559474',
    genres: ['Fiction', 'Fantasy', 'Philosophical'],
    publishedYear: 2020,
    publisher: 'Viking',
    pageCount: 304,
    language: 'English',
    averageRating: 4.6,
    ratingsCount: 12100,
    moodTags: ['Emotional', 'Inspirational', 'Cozy & Relaxing'],
    readingPace: 'Fast',
    featured: true,
    trending: true,
    quotes: ['It is easy to mourn the lives we aren’t living.'],
  },
  {
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    description: 'Greece in the age of heroes. Patroclus, an awkward young prince, has been exiled to the court of King Peleus and his perfect son Achilles. Despite their differences, Achilles befriends the shamed prince.',
    coverImage: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0062060624',
    genres: ['Fiction', 'Romance', 'Historical Fiction', 'Mythology'],
    publishedYear: 2011,
    publisher: 'Ecco',
    pageCount: 416,
    language: 'English',
    averageRating: 4.7,
    ratingsCount: 9600,
    moodTags: ['Emotional', 'Heartwarming', 'Epic Worldbuilding'],
    readingPace: 'Moderate',
    featured: false,
    trending: true,
    quotes: ['I could recognize him by touch alone, by smell; I would know him blind.'],
  },
  {
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    description: 'On a bitter-cold day, in the December of his junior year at Harvard, Sam Masur exits a subway car and sees, amid the hordes of people waiting on the platform, Sadie Green. He calls her name. For a moment, she pretends not to hear him, but then she turns, and a game begins.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0593321201',
    genres: ['Fiction', 'Technology', 'Contemporary'],
    publishedYear: 2022,
    publisher: 'Knopf',
    pageCount: 416,
    language: 'English',
    averageRating: 4.6,
    ratingsCount: 5800,
    moodTags: ['Emotional', 'Heartwarming', 'Inspirational'],
    readingPace: 'Moderate',
    featured: false,
    trending: true,
    quotes: ['To allow yourself to play with another person is no small risk.'],
  },

  // 💖 ROMANCE & FEEL-GOOD
  {
    title: 'Book Lovers',
    author: 'Emily Henry',
    description: 'One summer. Two rivals. A plot twist they didn’t see coming... Nora Stephens’ life is books—she’s read them all—and she is not that type of heroine. Not the plucky one, not the laidback dream girl, and especially not the sweetheart.',
    coverImage: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0593440872',
    genres: ['Romance', 'Fiction', 'Contemporary'],
    publishedYear: 2022,
    publisher: 'Berkley',
    pageCount: 384,
    language: 'English',
    averageRating: 4.5,
    ratingsCount: 6700,
    moodTags: ['Cozy & Relaxing', 'Heartwarming', 'Fast-Paced'],
    readingPace: 'Fast',
    featured: false,
    trending: true,
    quotes: ['You are in the city they write books about.'],
  },
  {
    title: 'Red, White & Royal Blue',
    author: 'Casey McQuiston',
    description: 'What happens when America\'s First Son falls in love with the Prince of Wales? When his mother became President, Alex Claremont-Diaz was promptly cast as the American equivalent of a young royal.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
    isbn: '978-1250316776',
    genres: ['Romance', 'Fiction', 'Comedy'],
    publishedYear: 2019,
    publisher: 'St. Martin\'s Griffin',
    pageCount: 432,
    language: 'English',
    averageRating: 4.6,
    ratingsCount: 8400,
    moodTags: ['Heartwarming', 'Cozy & Relaxing', 'Emotional'],
    readingPace: 'Fast',
    featured: false,
    trending: false,
    quotes: ['History, huh? Bet we could make some.'],
  },

  // 🏛️ CLASSICS & PHILOSOPHY
  {
    title: '1984',
    author: 'George Orwell',
    description: 'Winston Smith toes the Party line, rewriting history to satisfy the Ministry of Truth. With each lie he writes, Winston grows to hate the Party that seeks power for its own sake and persecutes those who dare to commit thoughtcrimes.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0451524935',
    genres: ['Classics', 'Sci-Fi', 'Dystopian', 'Philosophy'],
    publishedYear: 1949,
    publisher: 'Secker & Warburg',
    pageCount: 328,
    language: 'English',
    averageRating: 4.8,
    ratingsCount: 16700,
    moodTags: ['Dark & Gripping', 'Philosophical', 'Mind-Bending'],
    readingPace: 'Moderate',
    featured: true,
    trending: false,
    quotes: ['War is peace. Freedom is slavery. Ignorance is strength.'],
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'Nearly two thousand years after it was written, Meditations remains profoundly relevant. The personal writings of the Roman Emperor Marcus Aurelius provide spiritual reflections and exercises developed as the emperor struggled to understand himself and the universe.',
    coverImage: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&auto=format&fit=crop&q=80',
    isbn: '978-0812968255',
    genres: ['Philosophy', 'Non-Fiction', 'Classics'],
    publishedYear: 180,
    publisher: 'Modern Library',
    pageCount: 256,
    language: 'English',
    averageRating: 4.7,
    ratingsCount: 9100,
    moodTags: ['Philosophical', 'Inspirational', 'Cozy & Relaxing'],
    readingPace: 'Slow Burn',
    featured: false,
    trending: true,
    quotes: ['You have power over your mind - not outside events. Realize this, and you will find strength.'],
  },
];

async function seedBooks() {
  try {
    console.log('📚 Connecting to MongoDB to seed Book Recommendation Database...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully to database');

    console.log('🧹 Clearing old book records, reviews, and shelves...');
    await Promise.all([
      Book.deleteMany({}),
      Review.deleteMany({}),
      ReadingList.deleteMany({}),
    ]);

    console.log(`📖 Inserting ${BOOKS_DATA.length} bestselling curated books...`);
    const insertedBooks = await Book.insertMany(BOOKS_DATA);
    console.log(`✅ Successfully seeded ${insertedBooks.length} books across 10+ genres!`);

    // Fetch demo users or create one
    let demoUser = await User.findOne({ email: 'reader@example.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Avid Reader Maya',
        email: 'reader@example.com',
        password: 'Password@123',
        role: 'user',
        preferredGenres: ['Sci-Fi', 'Mystery', 'Fiction', 'Self-Help'],
        preferredMoods: ['Mind-Bending', 'Emotional', 'Fast-Paced'],
        annualReadingGoal: 20,
        bio: 'Obsessed with hard sci-fi, fast thrillers, and behavioral psychology.',
      });
      console.log('👤 Created demo user: reader@example.com / Password@123');
    }

    // Add sample bookshelf for demo user
    console.log('📚 Adding sample shelves for demo user...');
    await ReadingList.create([
      {
        user: demoUser._id,
        book: insertedBooks[0]._id, // Project Hail Mary
        status: 'CURRENTLY_READING',
        progressPages: 248,
        isFavorite: true,
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        user: demoUser._id,
        book: insertedBooks[4]._id, // The Silent Patient
        status: 'COMPLETED',
        progressPages: insertedBooks[4].pageCount,
        userRating: 5,
        personalNotes: 'Unbelievable plot twist in the final chapters! 10/10.',
        isFavorite: true,
        completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      },
      {
        user: demoUser._id,
        book: insertedBooks[7]._id, // Atomic Habits
        status: 'COMPLETED',
        progressPages: insertedBooks[7].pageCount,
        userRating: 5,
        personalNotes: 'Practical framework. Applying the 2-minute rule daily.',
        completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      },
      {
        user: demoUser._id,
        book: insertedBooks[1]._id, // Dune
        status: 'WANT_TO_READ',
      },
      {
        user: demoUser._id,
        book: insertedBooks[10]._id, // Sapiens
        status: 'WANT_TO_READ',
      },
    ]);

    // Add sample reviews
    console.log('💬 Creating sample reviews...');
    await Review.create([
      {
        book: insertedBooks[0]._id,
        user: demoUser._id,
        userName: 'Maya Reader',
        rating: 5,
        title: 'One of the best sci-fi novels of the 21st century',
        content: 'Project Hail Mary was an absolute joy from start to finish. The blend of real science, humor, and heart between Grace and Rocky was masterclass storytelling. Could not put it down!',
        likesCount: 38,
      },
      {
        book: insertedBooks[4]._id,
        user: demoUser._id,
        userName: 'Maya Reader',
        rating: 5,
        title: 'That ending shook me to the core',
        content: 'The pacing was relentless. If you love unreliable narrators and psychological cat-and-mouse thrillers, do not hesitate.',
        likesCount: 22,
      },
    ]);

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedBooks();
