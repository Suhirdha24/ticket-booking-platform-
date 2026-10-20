import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import BookCard from '../components/books/BookCard.jsx';
import MoodMatcherWidget from '../components/books/MoodMatcherWidget.jsx';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Search,
  Star,
  Compass,
  Bookmark,
  Target,
  Flame,
  CheckCircle2,
  Heart,
  Quote,
} from 'lucide-react';

const GENRES = [
  { name: 'All', icon: '📚' },
  { name: 'Sci-Fi', icon: '🚀' },
  { name: 'Mystery', icon: '🕵️' },
  { name: 'Thriller', icon: '⚡' },
  { name: 'Fantasy', icon: '🧙' },
  { name: 'Self-Help', icon: '🌱' },
  { name: 'Non-Fiction', icon: '💡' },
  { name: 'Romance', icon: '💖' },
  { name: 'Philosophy', icon: '🏛️' },
  { name: 'Classics', icon: '📜' },
];

export default function Home() {
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [featuredRes, trendingRes] = await Promise.all([
          api.get('/books/featured'),
          api.get('/books/trending'),
        ]);
        setFeaturedBooks(featuredRes.data?.data || []);
        setTrendingBooks(trendingRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load home page books', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredTrending =
    selectedGenre === 'All'
      ? trendingBooks
      : trendingBooks.filter((b) => (b.genres || []).includes(selectedGenre));

  const spotlightBook = featuredBooks[0] || trendingBooks[0] || null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08070D', color: '#FFFFFF' }}>
      {/* ========================================================================= */}
      {/* 🚀 1. HERO SECTION WITH 3D BOOK SHOWCASE */}
      {/* ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: '3rem 0 4rem',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundImage:
            'radial-gradient(circle at 75% 30%, rgba(139, 92, 246, 0.25) 0%, transparent 60%), radial-gradient(circle at 15% 70%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              minHeight: '480px',
            }}
          >
            {/* Left Column: Headline & Search */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div className="hero-ticker-bar">
                <span className="live-pulse-dot" />
                <span>Smart AI & Vibe Recommendation Engine Active • 98% Match Accuracy</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                <div className="hero-tag-pill">
                  <span className="tag-icon">✦</span>
                  <span>Personalized Reads</span>
                </div>
                <div className="hero-tag-pill">
                  <span className="tag-icon">★</span>
                  <span>Curated Bestsellers</span>
                </div>
              </div>

              <h1 className="hero-huge-title" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)' }}>
                Discover Books<br />You'll Never Forget
              </h1>

              <span className="hero-script-subtitle" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
                Tailored to your current vibe
              </span>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#94A3B8',
                  maxWidth: '480px',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}
              >
                Stop wandering endless bestseller lists. Get hyper-personalized recommendations based on your favorite genres, emotional mood, and reading pace.
              </p>

              {/* Instant Search Bar */}
              <form onSubmit={handleSearchSubmit} style={{ width: '100%', maxWidth: '440px', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search
                    size={18}
                    color="#94A3B8"
                    style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search by title, author, or keyword (e.g. Andy Weir, Sci-Fi)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input"
                    style={{
                      paddingLeft: '3rem',
                      paddingRight: '6.5rem',
                      height: '52px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.92rem',
                    }}
                  />
                  <button
                    type="submit"
                    className="btn-purple-glow"
                    style={{
                      position: 'absolute',
                      right: '6px',
                      top: '6px',
                      bottom: '6px',
                      padding: '0 1.25rem',
                      fontSize: '0.84rem',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/recommendations">
                  <button className="btn-purple-glow">
                    <Sparkles size={16} />
                    <span>Launch Vibe Matcher</span>
                  </button>
                </Link>

                <Link to="/books">
                  <button className="btn-secondary" style={{ padding: '0.85rem 1.6rem', borderRadius: 'var(--radius-pill)', fontWeight: 800 }}>
                    <Compass size={16} />
                    <span>Browse All 20+ Masterpieces</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Spotlight Book & Statistics Card */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {spotlightBook && (
                <div
                  className="glass-widget-card"
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '420px',
                    padding: '2rem',
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, rgba(20, 18, 34, 0.95) 0%, rgba(13, 12, 21, 0.95) 100%)',
                    border: '1.5px solid rgba(139, 92, 246, 0.4)',
                    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.25)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#F59E0B', fontSize: '0.78rem', fontWeight: 800 }}>
                      <Star size={15} fill="#F59E0B" />
                      <span>Book of the Week</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#38BDF8', background: 'rgba(56, 189, 248, 0.15)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-pill)', fontWeight: 800 }}>
                      {spotlightBook.genres?.[0]}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '110px',
                        height: '160px',
                        borderRadius: '6px 10px 10px 6px',
                        overflow: 'hidden',
                        boxShadow: '8px 12px 25px rgba(0, 0, 0, 0.7)',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={spotlightBook.coverImage}
                        alt={spotlightBook.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.3, marginBottom: '0.3rem' }}>
                        {spotlightBook.title}
                      </h3>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#A78BFA', marginBottom: '0.5rem' }}>
                        by {spotlightBook.author}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span style={{ fontWeight: 800 }}>{spotlightBook.averageRating}</span>
                        <span style={{ color: '#64748B' }}>({spotlightBook.ratingsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {spotlightBook.quotes?.[0] && (
                    <div
                      style={{
                        padding: '0.85rem 1rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        borderLeft: '3px solid #8B5CF6',
                        borderRadius: '0 10px 10px 0',
                        fontSize: '0.82rem',
                        fontStyle: 'italic',
                        color: '#DDD6FE',
                        marginBottom: '1.25rem',
                      }}
                    >
                      &ldquo;{spotlightBook.quotes[0]}&rdquo;
                    </div>
                  )}

                  <Link to={`/books/${spotlightBook._id}`} style={{ textDecoration: 'none' }}>
                    <button
                      className="btn-purple-glow"
                      style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', justifyContent: 'center' }}
                    >
                      <span>Explore Synopsis & Reviews</span>
                      <ArrowRight size={15} />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🔮 2. INTERACTIVE MOOD & VIBE MATCHER WIDGET */}
      {/* ========================================================================= */}
      <section style={{ padding: '3.5rem 0', position: 'relative' }}>
        <div className="container">
          <MoodMatcherWidget />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📚 3. TRENDING MASTERPIECES WITH GENRE FILTERS */}
      {/* ========================================================================= */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A78BFA', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Flame size={16} />
                <span>Community Favorites</span>
              </div>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#FFFFFF', marginTop: '0.2rem' }}>
                Trending & Highly Rated Books
              </h2>
            </div>

            <Link to="/books" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#A78BFA',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                }}
              >
                <span>View Full Catalog</span>
                <ArrowRight size={15} />
              </div>
            </Link>
          </div>

          {/* Genre Chips */}
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '0.6rem',
              overflowX: 'auto',
              paddingBottom: '1rem',
              marginBottom: '2.5rem',
            }}
          >
            {GENRES.map((g) => (
              <button
                key={g.name}
                onClick={() => setSelectedGenre(g.name)}
                className={`sonora-filter-chip ${selectedGenre === g.name ? 'active' : ''}`}
              >
                <span>{g.icon}</span>
                <span>{g.name}</span>
              </button>
            ))}
          </div>

          {/* Books Grid */}
          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="glass-widget-card"
                  style={{ height: '420px', opacity: 0.5, animation: 'pulse 1.5s infinite' }}
                />
              ))}
            </div>
          ) : filteredTrending.length === 0 ? (
            <div
              className="glass-widget-card"
              style={{
                padding: '4rem 2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <BookOpen size={48} color="#8B5CF6" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
                No books in this category yet
              </h3>
              <p style={{ color: '#94A3B8', maxWidth: '400px' }}>
                Check out all books or try another genre filter.
              </p>
              <button onClick={() => setSelectedGenre('All')} className="btn-purple-glow">
                View All Books
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {filteredTrending.slice(0, 8).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🎯 4. ANNUAL READING CHALLENGE & COMMUNITY TEASER */}
      {/* ========================================================================= */}
      <section style={{ padding: '3rem 0 5rem' }}>
        <div className="container">
          <div
            className="glass-widget-card"
            style={{
              padding: '3rem 2rem',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(56, 189, 248, 0.08) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem',
            }}
          >
            <div style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#FBBF24', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <Target size={16} />
                <span>Build a Consistent Reading Habit</span>
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.75rem' }}>
                Track Your Reading Goal & Build Your Virtual Library
              </h3>
              <p style={{ color: '#CBD5E1', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Set an annual book goal, track live progress with page-by-page milestones, organize books across customizable shelves, and see your reading habits transform.
              </p>
            </div>

            <Link to="/my-bookshelf" style={{ textDecoration: 'none' }}>
              <button className="btn-purple-glow" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                <span>Open My Bookshelf</span>
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
