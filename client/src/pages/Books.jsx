import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client.js';
import BookCard from '../components/books/BookCard.jsx';
import { BookCardSkeleton } from '../components/common/Skeleton.jsx';
import {
  Search,
  X,
  BookOpen,
  ArrowUpDown,
  RotateCcw,
  Globe,
  Filter,
  AlertTriangle,
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
  { label: '🇮🇳 Kannada (ಕನ್ನಡ)', value: 'Kannada' },
  { label: '🇮🇳 Marathi (मराठी)', value: 'Marathi' },
];

const GENRES = [
  'All',
  'Fantasy',
  'Sci-Fi',
  'Mystery',
  'Thriller',
  'Romance',
  'Fiction',
  'Non-Fiction',
  'Self-Help',
  'Philosophy',
  'Classics',
  'History',
  'Biography',
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
  const [showFilters, setShowFilters] = useState(false);

  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

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
    let isMounted = true;
    const fetchBooks = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const params = new URLSearchParams();
        if (search && search.trim()) params.append('search', search.trim());
        if (selectedGenre !== 'All') params.append('genre', selectedGenre);
        if (selectedMood !== 'All') params.append('mood', selectedMood);
        if (selectedLanguage !== 'All') params.append('language', selectedLanguage);
        if (selectedPace !== 'All') params.append('pace', selectedPace);
        if (selectedLength) params.append('length', selectedLength);
        if (minRating) params.append('minRating', minRating);
        params.append('sort', sort);
        params.append('page', page);
        params.append('limit', '24');

        const res = await api.get(`/books?${params.toString()}`);
        if (isMounted) {
          setBooks(res.data.data?.books || []);
          setTotal(res.data.data?.total || 0);
          setTotalPages(res.data.data?.totalPages || 1);
          setLoadError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load books catalog', err);
          setLoadError(err.message || 'Unable to load bookstore catalog. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBooks();
    return () => {
      isMounted = false;
    };
  }, [search, selectedGenre, selectedMood, selectedLanguage, selectedPace, selectedLength, minRating, sort, page, retryCount]);

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
    setShowFilters(false);
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(
    search ||
      selectedGenre !== 'All' ||
      selectedLanguage !== 'All' ||
      selectedMood !== 'All' ||
      selectedPace !== 'All' ||
      selectedLength ||
      minRating
  );

  const advancedFiltersActiveCount = [
    selectedMood !== 'All',
    selectedPace !== 'All',
    Boolean(selectedLength),
    Boolean(minRating),
  ].filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '4rem' }}>
      {/* Header Banner */}
      {/* Clean Minimal Header */}
      <section style={{ padding: '2rem 0 0.5rem' }}>
        <div className="container">
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              fontWeight: 800,
              color: 'var(--text-heading)',
              letterSpacing: '-0.025em',
              margin: 0,
            }}
          >
            Explore All Masterpieces
          </h1>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '1.5rem' }}>
        {/* Unified Search & Discovery Bar */}
        <div
          className="card-clean"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid var(--border-medium)',
            padding: '0.85rem 1rem',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                flex: '1 1 300px',
                minWidth: '240px',
              }}
            >
              <Search
                size={17}
                color="var(--text-subtle)"
                style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search 30,000,000+ books worldwide by title, author, topic, ISBN..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="form-input"
                style={{
                  width: '100%',
                  paddingLeft: '2.5rem',
                  paddingRight: search ? '2.4rem' : '1rem',
                  height: '42px',
                  fontSize: '0.88rem',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setPage(1);
                  }}
                  style={{
                    position: 'absolute',
                    right: '0.8rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-subtle)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Controls Group */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Language Selector */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '0 0.65rem',
                  height: '42px',
                }}
              >
                <Globe size={15} color="var(--primary)" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-heading)',
                    fontSize: '0.83rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                    paddingRight: '0.25rem',
                  }}
                  aria-label="Select catalog language"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Order Selector */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  padding: '0 0.65rem',
                  height: '42px',
                }}
              >
                <ArrowUpDown size={14} color="var(--primary)" />
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-heading)',
                    fontSize: '0.83rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                    paddingRight: '0.25rem',
                  }}
                  aria-label="Sort books catalog"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest Published</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="pages_asc">Shortest First</option>
                  <option value="pages_desc">Longest (Epic)</option>
                </select>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  height: '42px',
                  padding: '0 0.85rem',
                  borderRadius: '8px',
                  border:
                    advancedFiltersActiveCount > 0
                      ? '1.5px solid var(--primary)'
                      : '1px solid var(--border-medium)',
                  backgroundColor:
                    advancedFiltersActiveCount > 0 || showFilters
                      ? 'var(--primary-light)'
                      : 'var(--bg-main)',
                  color:
                    advancedFiltersActiveCount > 0 || showFilters
                      ? 'var(--primary)'
                      : 'var(--text-heading)',
                  fontSize: '0.83rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Filter size={14} />
                <span>Filters</span>
                {advancedFiltersActiveCount > 0 && (
                  <span
                    style={{
                      backgroundColor: 'var(--primary)',
                      color: '#FFFFFF',
                      borderRadius: '999px',
                      padding: '0.1rem 0.45rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {advancedFiltersActiveCount}
                  </span>
                )}
              </button>

              {/* Reset All Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  title="Reset all filters"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    height: '42px',
                    padding: '0 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'transparent',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Secondary Filters (Mood, Pace, Length, Min Rating) */}
          {showFilters && (
            <div
              style={{
                marginTop: '0.85rem',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap',
              }}
            >
              {/* Mood Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Mood:
                </span>
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

              {/* Pace Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Pace:
                </span>
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

              {/* Length Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Length:
                </span>
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

              {/* Rating Filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Rating:
                </span>
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
                  <option value="4.0">4.0+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.7">4.7+ Stars</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Category / Genre Pills Bar with no visible scrollbar */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            gap: '0.45rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '1.25rem',
            WebkitOverflowScrolling: 'touch',
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
              style={{
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Catalog Status & Active Filters Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              {isLoading ? 'Searching...' : `${total.toLocaleString()} Books Available`}
            </span>

            {/* Active filter pill badges (click to remove) */}
            {selectedGenre !== 'All' && (
              <button
                type="button"
                onClick={() => {
                  setSelectedGenre('All');
                  setPage(1);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span>Genre: {selectedGenre}</span>
                <X size={12} />
              </button>
            )}

            {selectedLanguage !== 'All' && (
              <button
                type="button"
                onClick={() => {
                  setSelectedLanguage('All');
                  setPage(1);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span>Language: {selectedLanguage}</span>
                <X size={12} />
              </button>
            )}

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span>"{search}"</span>
                <X size={12} />
              </button>
            )}
          </div>

          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Page {page} of {totalPages}
          </span>
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
          {loadError ? (
            <div
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '4rem 1.5rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid var(--border-medium)',
              }}
            >
              <AlertTriangle size={42} color="var(--accent-rose)" style={{ margin: '0 auto 1rem' }} />
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--text-heading)',
                  marginBottom: '0.4rem',
                }}
              >
                Error Loading Books
              </h3>
              <p
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  maxWidth: '460px',
                  margin: '0 auto 1.5rem',
                }}
              >
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => setRetryCount((c) => c + 1)}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
              >
                <RotateCcw size={15} />
                <span>Try Again</span>
              </button>
            </div>
          ) : isLoading ? (
            Array.from({ length: 8 }).map((_, idx) => <BookCardSkeleton key={idx} />)
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
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--text-heading)',
                  marginBottom: '0.4rem',
                }}
              >
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
