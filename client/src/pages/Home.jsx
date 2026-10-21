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
  TrendingUp,
  Award,
} from 'lucide-react';

const GENRES = [
  'All',
  'Sci-Fi',
  'Mystery',
  'Thriller',
  'Fantasy',
  'Self-Help',
  'Non-Fiction',
  'Romance',
  'Philosophy',
  'Classics',
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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* ========================================================================= */}
      {/* 1. CLEAN MODERN HERO */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: '3.5rem 0 3rem',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Headline, Search & CTAs */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                <Sparkles size={13} />
                <span>Smart Reading & Vibe Matcher</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
                  fontWeight: 800,
                  color: 'var(--text-heading)',
                  lineHeight: 1.15,
                  marginBottom: '1rem',
                  letterSpacing: '-0.03em',
                }}
              >
                Find books that fit your mood and pacing.
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  maxWidth: '520px',
                  marginBottom: '1.75rem',
                }}
              >
                Discover personalized reads based on your current vibe, genres you love, and reading pace — without endless scrolling or decision fatigue.
              </p>

              {/* Instant Search Bar */}
              <form onSubmit={handleSearchSubmit} style={{ maxWidth: '460px', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={17}
                    color="var(--text-subtle)"
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    placeholder="Search by title, author, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-input"
                    style={{
                      paddingLeft: '2.7rem',
                      paddingRight: '6.5rem',
                      height: '48px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      position: 'absolute',
                      right: '5px',
                      top: '5px',
                      bottom: '5px',
                      padding: '0 1rem',
                      fontSize: '0.84rem',
                      borderRadius: '6px',
                    }}
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/recommendations" className="btn btn-primary">
                  <Sparkles size={16} />
                  <span>Launch Vibe Matcher</span>
                </Link>

                <Link to="/books" className="btn btn-secondary">
                  <Compass size={16} />
                  <span>Browse Full Library</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Clean Book Spotlight Card */}
            {spotlightBook && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className="card-clean"
                  style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: '1.75rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: '#FFFFFF',
                    boxShadow: 'var(--shadow-card)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 700 }}>
                      <Award size={15} />
                      <span>Featured Spotlight</span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--primary)',
                        background: 'var(--primary-light)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}
                    >
                      {spotlightBook.genres?.[0]}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '100px',
                        height: '145px',
                        borderRadius: '4px 8px 8px 4px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                        flexShrink: 0,
                        backgroundColor: '#F1F5F9',
                      }}
                    >
                      <img
                        src={spotlightBook.coverImage}
                        alt={spotlightBook.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: 700,
                          color: 'var(--text-heading)',
                          lineHeight: 1.3,
                          marginBottom: '0.25rem',
                        }}
                      >
                        {spotlightBook.title}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                        by {spotlightBook.author}
                      </div>
                      <div style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Star size={14} fill="#F59E0B" color="#F59E0B" />
                        <span style={{ fontWeight: 700, color: 'var(--text-heading)' }}>
                          {spotlightBook.averageRating}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>({spotlightBook.ratingsCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {spotlightBook.quotes?.[0] && (
                    <div
                      style={{
                        padding: '0.75rem 0.85rem',
                        background: 'var(--bg-subtle)',
                        borderLeft: '3px solid var(--primary)',
                        borderRadius: '0 6px 6px 0',
                        fontSize: '0.82rem',
                        fontStyle: 'italic',
                        color: 'var(--text-body)',
                        marginBottom: '1.25rem',
                      }}
                    >
                      &ldquo;{spotlightBook.quotes[0]}&rdquo;
                    </div>
                  )}

                  <Link
                    to={`/books/${spotlightBook._id}`}
                    className="btn btn-secondary"
                    style={{ width: '100%', padding: '0.65rem' }}
                  >
                    <span>View Synopsis & Reviews</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. INTERACTIVE VIBE MATCHER SECTION */}
      {/* ========================================================================= */}
      <section style={{ padding: '3rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <MoodMatcherWidget />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TRENDING BOOKS WITH CLEAN GENRE CHIPS */}
      {/* ========================================================================= */}
      <section style={{ padding: '2rem 0 4rem', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.75rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.25rem',
                }}
              >
                <TrendingUp size={14} />
                <span>Reader Favorites</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Popular & Highly Rated
              </h2>
            </div>

            <Link
              to="/books"
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>View all books</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Clean Genre Chips */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(g)}
                className={`genre-chip ${selectedGenre === g ? 'active' : ''}`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Book Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {isLoading ? (
              [1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  style={{
                    height: '380px',
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                  }}
                />
              ))
            ) : filteredTrending.length > 0 ? (
              filteredTrending.slice(0, 8).map((book) => (
                <BookCard key={book._id} book={book} />
              ))
            ) : (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <p style={{ color: 'var(--text-muted)' }}>No books found in this genre.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. VALUE PROPOSITION: CLEAN MINIMALIST FEATURE GRID */}
      {/* ========================================================================= */}
      <section
        style={{
          padding: '3.5rem 0',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
              Built for how you actually read.
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              Everything you need to find your next favorite story and build a consistent reading habit.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div
              className="card-clean"
              style={{
                padding: '1.75rem',
                borderRadius: '12px',
                border: '1px solid var(--border-medium)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Sparkles size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                Mood & Vibe Matcher
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Filter books by how you want to feel — from mind-bending sci-fi to wholesome cozy reads, with custom pacing filters.
              </p>
            </div>

            <div
              className="card-clean"
              style={{
                padding: '1.75rem',
                borderRadius: '12px',
                border: '1px solid var(--border-medium)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--accent-emerald-light)',
                  color: 'var(--accent-emerald)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Bookmark size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                Shelves & Page Tracker
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Organize books into Want to Read, Currently Reading, and Completed with an easy page progress slider.
              </p>
            </div>

            <div
              className="card-clean"
              style={{
                padding: '1.75rem',
                borderRadius: '12px',
                border: '1px solid var(--border-medium)',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--accent-sky-light)',
                  color: 'var(--accent-sky)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <BookOpen size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
                Annual Challenge Goals
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Set your reading goal for the year and watch your percentage climb as you complete books and record pages.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
