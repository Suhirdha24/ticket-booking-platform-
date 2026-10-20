import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client.js';
import BookCard from '../components/books/BookCard.jsx';
import {
  Search,
  Filter,
  X,
  Star,
  BookOpen,
  ArrowUpDown,
  Sparkles,
  Layers,
  Clock,
} from 'lucide-react';

const GENRES = [
  'All',
  'Sci-Fi',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Self-Help',
  'Non-Fiction',
  'Fiction',
  'Romance',
  'Philosophy',
  'Classics',
];

const MOODS = [
  'All',
  'Mind-Bending',
  'Emotional',
  'Fast-Paced',
  'Dark & Gripping',
  'Cozy & Relaxing',
  'Inspirational',
];

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialGenre = searchParams.get('genre') || 'All';
  const initialMood = searchParams.get('mood') || 'All';

  const [search, setSearch] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedMood, setSelectedMood] = useState(initialMood);
  const [selectedPace, setSelectedPace] = useState('All');
  const [selectedLength, setSelectedLength] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sort, setSort] = useState('rating');
  const [page, setPage] = useState(1);

  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    const s = searchParams.get('search');
    const g = searchParams.get('genre');
    const m = searchParams.get('mood');
    if (s !== null) setSearch(s);
    if (g !== null) setSelectedGenre(g);
    if (m !== null) setSelectedMood(m);
  }, [searchParams]);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (selectedGenre !== 'All') params.append('genre', selectedGenre);
        if (selectedMood !== 'All') params.append('mood', selectedMood);
        if (selectedPace !== 'All') params.append('pace', selectedPace);
        if (selectedLength) params.append('length', selectedLength);
        if (minRating) params.append('minRating', minRating);
        params.append('sort', sort);
        params.append('page', page);
        params.append('limit', '12');

        const res = await api.get(`/books?${params.toString()}`);
        setBooks(res.data.data?.books || []);
        setTotal(res.data.data?.total || 0);
        setTotalPages(res.data.data?.totalPages || 1);
      } catch (err) {
        console.error('Failed to load books catalog', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [search, selectedGenre, selectedMood, selectedPace, selectedLength, minRating, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedGenre('All');
    setSelectedMood('All');
    setSelectedPace('All');
    setSelectedLength('');
    setMinRating('');
    setSort('rating');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08070D', color: '#FFFFFF', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section
        style={{
          padding: '3rem 0 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.18) 0%, transparent 60%)',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A78BFA', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            <BookOpen size={17} />
            <span>Curated Library Catalog</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Explore Masterpiece Reads
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', maxWidth: '600px' }}>
            Filter by genre, emotional mood, pacing, and length to find the exact book tailored for your next reading journey.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Search & Sort Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search
              size={17}
              color="#94A3B8"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search title, author, or keyword..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="form-input"
              style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-pill)' }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort Dropdown & Results Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 800 }}>
              {total} {total === 1 ? 'Book' : 'Books'} Found
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <ArrowUpDown size={15} color="#A78BFA" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="rating" style={{ background: '#151324' }}>Highest Rated</option>
                <option value="popular" style={{ background: '#151324' }}>Most Popular</option>
                <option value="newest" style={{ background: '#151324' }}>Newest Published</option>
                <option value="title" style={{ background: '#151324' }}>Title (A-Z)</option>
                <option value="pages_asc" style={{ background: '#151324' }}>Shortest First</option>
                <option value="pages_desc" style={{ background: '#151324' }}>Longest (Epic)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters Row: Genre Chips */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
            Filter by Genre
          </div>
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
            }}
          >
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedGenre(g);
                  setPage(1);
                }}
                className={`sonora-filter-chip ${selectedGenre === g ? 'active' : ''}`}
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Row: Mood Vibes */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
            Filter by Mood & Vibe
          </div>
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
            }}
          >
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSelectedMood(m);
                  setPage(1);
                }}
                style={{
                  padding: '0.45rem 0.95rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: selectedMood === m ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                  border: selectedMood === m ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: selectedMood === m ? '#FFFFFF' : '#CBD5E1',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedMood === m ? '0 0 15px rgba(56, 189, 248, 0.4)' : 'none',
                }}
              >
                {m !== 'All' && <span>✦ </span>}
                {m}
              </button>
            ))}
          </div>
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="glass-widget-card"
                style={{ height: '440px', opacity: 0.5, animation: 'pulse 1.5s infinite' }}
              />
            ))}
          </div>
        ) : books.length === 0 ? (
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
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF' }}>
              No books match your criteria
            </h3>
            <p style={{ color: '#94A3B8', maxWidth: '420px', lineHeight: 1.5 }}>
              Try adjusting your search query, or clear your genre and mood filters to see all available books.
            </p>
            <button onClick={handleResetFilters} className="btn-purple-glow">
              Reset All Filters
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
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              marginTop: '3.5rem',
            }}
          >
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', opacity: page === 1 ? 0.4 : 1 }}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setPage(num)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: page === num ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.05)',
                  border: page === num ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary"
              style={{ padding: '0.55rem 1rem', fontSize: '0.85rem', opacity: page === totalPages ? 0.4 : 1 }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
