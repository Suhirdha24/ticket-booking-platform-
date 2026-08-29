import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import api from '../api/client.js';
import { useLocationStore } from '../store/locationStore.js';
import EventCard from '../components/events/EventCard.jsx';
import CategoryPillList from '../components/events/CategoryPillList.jsx';
import LocationModal from '../components/common/LocationModal.jsx';
import Pagination from '../components/common/Pagination.jsx';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended ✨' },
  { value: 'popular', label: 'Most Popular 🔥' },
  { value: 'newest', label: 'Newest Added 🕒' },
  { value: 'price_asc', label: 'Price: Low to High 🏷️' },
  { value: 'price_desc', label: 'Price: High to Low 💎' },
];

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCity, openLocationModal } = useLocationStore();

  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'recommended');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Sync state with URL params
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || '');
    setCity(searchParams.get('city') || '');
    setSort(searchParams.get('sort') || 'recommended');
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  // Fetch events on filter change
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        if (category) params.set('category', category);
        
        // If city filter is specified in URL, use it; otherwise use location store selectedCity
        const activeCity = city || (selectedCity !== 'All Cities' ? selectedCity : '');
        if (activeCity) params.set('city', activeCity);

        if (sort) params.set('sort', sort);
        params.set('page', page.toString());
        params.set('limit', '12');

        const res = await api.get(`/events?${params.toString()}`);
        setEvents(res.data?.data?.events || []);
        setPagination(
          res.data?.data?.pagination || { page: 1, pages: 1, total: 0 }
        );
      } catch (err) {
        console.error('Failed to load events:', err);
        setError(err.message || 'Could not load events. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [search, category, city, sort, page, selectedCity]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (search.trim()) {
      newParams.set('q', search.trim());
    } else {
      newParams.delete('q');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (newCategory) => {
    const newParams = new URLSearchParams(searchParams);
    if (newCategory) {
      newParams.set('category', newCategory);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (newSort) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const resetAllFilters = () => {
    setSearch('');
    setCategory('');
    setCity('');
    setSort('recommended');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="mobile-safe-bottom" style={{ minHeight: '100vh', paddingTop: '1.5rem' }}>
      <LocationModal />

      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--primary-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Explore Events
          </span>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginTop: '0.15rem',
            }}
          >
            {category ? `${category} Events` : 'All Live Events'}
          </h1>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Showing {pagination.total} experiences across India
          </p>
        </div>

        {/* 🔍 Search & Filter Controls Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          {/* Main Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.45rem 0.6rem 0.45rem 1.25rem',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <Search size={18} color="var(--primary-gold)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by artist, concert, city, or festival..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#0F172A',
                fontSize: '0.92rem',
                fontFamily: 'var(--font-body)',
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  const p = new URLSearchParams(searchParams);
                  p.delete('q');
                  setSearchParams(p);
                }}
                className="btn-icon"
                style={{ width: '28px', height: '28px' }}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
            >
              Search
            </button>
          </form>

          {/* Category Chips Bar */}
          <CategoryPillList
            activeCategory={category}
            onSelectCategory={handleCategoryChange}
          />

          {/* Filter Metadata & Sort Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Location Pill & Reset */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                onClick={openLocationModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--primary-gold)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <MapPin size={13} />
                <span>{city || selectedCity}</span>
                <ChevronDown size={12} />
              </button>

              {(category || search || city) && (
                <button
                  onClick={resetAllFilters}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.4rem 0.75rem',
                    background: 'rgba(244, 63, 94, 0.1)',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
                    borderRadius: 'var(--radius-pill)',
                    color: '#f43f5e',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Sort By:
              </span>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: '#11151C' }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 🎪 Event Cards Grid */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '380px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : error ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <p style={{ color: '#f43f5e', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
              {error}
            </p>
            <button onClick={resetAllFilters} className="btn-primary">
              Retry & Reset Filters
            </button>
          </div>
        ) : events.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--gradient-gold-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: 'var(--primary-gold)',
              }}
            >
              <Search size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              No Events Found
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                maxWidth: '420px',
                margin: '0 auto 1.5rem auto',
                lineHeight: 1.5,
              }}
            >
              We couldn't find any events matching your selected search query or city. Try choosing
              another city or resetting your filters.
            </p>
            <button onClick={resetAllFilters} className="btn-primary">
              View All Events
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2.5rem',
              }}
            >
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={(newPage) => {
                    const p = new URLSearchParams(searchParams);
                    p.set('page', newPage.toString());
                    setSearchParams(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
