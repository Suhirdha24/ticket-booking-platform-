import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client.js';
import BookCard from '../components/books/BookCard.jsx';
import {
  Search,
  X,
  BookOpen,
  ArrowUpDown,
  RotateCcw,
  Globe,
  Sparkles,
} from 'lucide-react';

const LANGUAGES = [
  { label: '🌐 All Languages (30M+)', value: 'All' },
  { label: '🇺🇸 English', value: 'English' },
  { label: '🇮🇳 Tamil (தமிழ்)', value: 'Tamil' },
  { label: '🇮🇳 Hindi (हिन्दी)', value: 'Hindi' },
  { label: '🇪🇸 Spanish (Español)', value: 'Spanish' },
  { label: '🇫🇷 French (Français)', value: 'French' },
  { label: '🇩🇪 German (Deutsch)', value: 'German' },
  { label: '🇯🇵 Japanese (日本語)', value: 'Japanese' },
  { label: '🇸🇦 Arabic (العربية)', value: 'Arabic' },
  { label: '🇮🇳 Telugu (తెలుగు)', value: 'Telugu' },
  { label: '🇮🇳 Bengali (বাংলা)', value: 'Bengali' },
  { label: '🇮🇹 Italian (Italiano)', value: 'Italian' },
  { label: '🇷🇺 Russian (Русский)', value: 'Russian' },
  { label: '🇨🇳 Chinese (中文)', value: 'Chinese' },
  { label: '🇮🇳 Malayalam (മലയാളം)', value: 'Malayalam' },
];

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
  const initialLanguage = searchParams.get('language') || 'All';

  const [search, setSearch] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedMood, setSelectedMood] = useState(initialMood);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
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
    const l = searchParams.get('language');
    if (s !== null) setSearch(s);
    if (g !== null) setSelectedGenre(g);
    if (m !== null) setSelectedMood(m);
    if (l !== null) setSelectedLanguage(l);
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
        if (selectedLanguage !== 'All') params.append('language', selectedLanguage);
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
  }, [search, selectedGenre, selectedMood, selectedLanguage, selectedPace, selectedLength, minRating, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedGenre('All');
    setSelectedMood('All');
    setSelectedLanguage('All');
    setSelectedPace('All');
    setSelectedLength('');
    setMinRating('');
    setSort('rating');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '4rem' }}>
      {/* Header Banner */}
      <section
        style={{
          padding: '2.5rem 0 2rem',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-light)',
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.65rem',
            }}
          >
            <Globe size={14} />
            <span>30M+ Books Worldwide • Global Multi-Language Catalog</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
            Explore All Masterpieces
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '680px' }}>
            Act like Amazon’s global bookstore: Search any title in English, Tamil (தமிழ்), Hindi (हिन्दी), Spanish, French, German, Japanese, and more.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '1.75rem' }}>
        {/* Language Quick Pills Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
            <Globe size={15} color="var(--primary)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              Browse By Language:
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '0.45rem',
              overflowX: 'auto',
              paddingBottom: '0.35rem',
            }}
          >
            {LANGUAGES.slice(0, 10).map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => {
                  setSelectedLanguage(l.value);
                  setPage(1);
                }}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  border: selectedLanguage === l.value ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
                  backgroundColor: selectedLanguage === l.value ? 'var(--primary-light)' : '#FFFFFF',
                  color: selectedLanguage === l.value ? 'var(--primary)' : 'var(--text-body)',
                  transition: 'all 0.15s ease',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort Controls Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <Search
              size={16}
              color="var(--text-subtle)"
              style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search any book worldwide by title, author, ISBN..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="form-input"
              style={{ paddingLeft: '2.5rem', paddingRight: '2rem' }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '0.8rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort Dropdown & Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {total.toLocaleString()} {total === 1 ? 'Book' : 'Books Available'}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <ArrowUpDown size={14} color="var(--primary)" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-heading)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest Published</option>
                <option value="title">Title (A-Z)</option>
                <option value="pages_asc">Shortest First</option>
                <option value="pages_desc">Longest (Epic)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Genre Chips */}
        <div
          style={{
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setSelectedGenre(g);
                setPage(1);
              }}
              className={`genre-chip ${selectedGenre === g ? 'active' : ''}`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Secondary Filters Bar */}
        <div
          className="card-clean"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            padding: '0.85rem 1.15rem',
            marginBottom: '2rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* Language Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Globe size={15} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                background: '#FFFFFF',
                color: 'var(--text-heading)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mood filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Mood:</span>
            <select
              value={selectedMood}
              onChange={(e) => {
                setSelectedMood(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                background: '#FFFFFF',
                color: 'var(--text-heading)',
                fontSize: '0.8rem',
              }}
            >
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Pace filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pace:</span>
            <select
              value={selectedPace}
              onChange={(e) => {
                setSelectedPace(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                background: '#FFFFFF',
                color: 'var(--text-heading)',
                fontSize: '0.8rem',
              }}
            >
              <option value="All">All Paces</option>
              <option value="Fast">Fast Paced</option>
              <option value="Moderate">Moderate</option>
              <option value="Slow Burn">Slow Burn</option>
            </select>
          </div>

          {/* Length filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Length:</span>
            <select
              value={selectedLength}
              onChange={(e) => {
                setSelectedLength(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                background: '#FFFFFF',
                color: 'var(--text-heading)',
                fontSize: '0.8rem',
              }}
            >
              <option value="">Any Length</option>
              <option value="short">Short (&lt; 280 p)</option>
              <option value="medium">Medium (280–450 p)</option>
              <option value="epic">Epic (&gt; 450 p)</option>
            </select>
          </div>

          {/* Min rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Rating:</span>
            <select
              value={minRating}
              onChange={(e) => {
                setMinRating(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                background: '#FFFFFF',
                color: 'var(--text-heading)',
                fontSize: '0.8rem',
              }}
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.7">4.7+ Stars</option>
              <option value="4.8">4.8+ Stars</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid var(--border-medium)',
              background: '#FFFFFF',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>

        {/* Books Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((n) => (
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
          ) : books.length > 0 ? (
            books.map((book) => <BookCard key={book._id} book={book} />)
          ) : (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '4rem 1rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid var(--border-medium)',
              }}
            >
              <BookOpen size={40} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                No books match your filters
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Try loosening your filters or resetting your search.
              </p>
              <button onClick={handleResetFilters} className="btn btn-secondary">
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            >
              Previous
            </button>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0 0.5rem' }}>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
