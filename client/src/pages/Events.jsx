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
  Ticket,
} from 'lucide-react';
import api from '../api/client.js';
import { useLocationStore } from '../store/locationStore.js';
import EventCard from '../components/events/EventCard.jsx';
import CategoryPillList from '../components/events/CategoryPillList.jsx';
import Pagination from '../components/common/Pagination.jsx';

const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended ⭐' },
  { value: 'popular', label: 'Most Popular 🔥' },
  { value: 'newest', label: 'Newest Added 📅' },
  { value: 'price_asc', label: 'Price: Low to High 💰' },
  { value: 'price_desc', label: 'Price: High to Low 🏷️' },
];

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCity, setCity: setStoreCity, openLocationModal } = useLocationStore();

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
    const urlCity = searchParams.get('city');
    setSearch(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || '');
    setCity(urlCity || '');
    setSort(searchParams.get('sort') || 'recommended');
    setPage(parseInt(searchParams.get('page') || '1', 10));

    if (urlCity && urlCity !== selectedCity) {
      setStoreCity(urlCity);
    }
  }, [searchParams]);

  // Sync store selectedCity changes to searchParams
  useEffect(() => {
    const urlCity = searchParams.get('city') || '';
    if (selectedCity === 'All Cities' && urlCity) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('city');
      newParams.set('page', '1');
      setSearchParams(newParams);
    } else if (selectedCity && selectedCity !== 'All Cities' && urlCity !== selectedCity) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('city', selectedCity);
      newParams.set('page', '1');
      setSearchParams(newParams);
    }
  }, [selectedCity]);

  // Fetch events on filter change
  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);

        // If city filter is specified in URL, use it; otherwise use location store selectedCity
        const activeCity =
          selectedCity && selectedCity !== 'All Cities'
            ? selectedCity
            : city && city !== 'All Cities'
            ? city
            : '';
        if (activeCity) params.set('city', activeCity);

        if (sort) params.set('sort', sort);
        params.set('page', page.toString());
        params.set('limit', '12');

        const res = await api.get(`/events?${params.toString()}`);
        setEvents(res.data?.data?.events || res.data?.events || []);
        setPagination(
          res.data?.data?.pagination || res.data?.pagination || { page: 1, pages: 1, total: 0 }
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
    setStoreCity('All Cities');
    setSearchParams(new URLSearchParams());
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08070D', color: '#FFFFFF', padding: '2.5rem 0 5rem' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#A78BFA',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.35rem',
            }}
          >
            Explore Catalog
          </div>
          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            {category ? `${category} Events` : 'All Live Experiences'}
          </h1>
          <p style={{ fontSize: '0.92rem', color: '#94A3B8', marginTop: '0.3rem' }}>
            Showing {pagination.total || events.length} live festivals, concerts & stages across India
          </p>
        </div>

        {/* 🔍 Search & Filter Controls Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          {/* Main Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(22, 20, 36, 0.85)',
              border: '1.5px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.45rem 0.6rem 0.45rem 1.25rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
            }}
          >
            <Search size={18} color="#A78BFA" style={{ flexShrink: 0 }} />
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
                color: '#FFFFFF',
                fontSize: '0.95rem',
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
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px',
                }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="submit"
              className="btn-purple-glow"
              style={{ padding: '0.65rem 1.4rem', fontSize: '0.86rem' }}
            >
              Search
            </button>
          </form>

          {/* Category Chips Bar */}
          <CategoryPillList
            activeCategory={category}
            onSelectCategory={handleCategoryChange}
          />

          {/* Location & Sorting Sub-Bar */}
          <div
            className="glass-widget-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              padding: '0.85rem 1.25rem',
              borderRadius: '16px',
            }}
          >
            {/* Location Pill & Reset */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button
                onClick={openLocationModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.9rem',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  color: '#A78BFA',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <MapPin size={13} color="#A78BFA" />
                <span>{selectedCity}</span>
                <ChevronDown size={12} />
              </button>

              {(search || category || city) && (
                <button
                  onClick={resetAllFilters}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    background: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    color: '#FB7185',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={14} color="#94A3B8" />
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                style={{
                  background: '#14121F',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0.45rem 0.9rem',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} style={{ background: '#14121F', color: '#FFFFFF' }}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 🎪 Events Grid Display */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="glass-widget-card"
                style={{ height: '360px', opacity: 0.5, animation: 'pulse 1.5s infinite' }}
              ></div>
            ))}
          </div>
        ) : error ? (
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
            <div style={{ color: '#FB7185', fontSize: '1.2rem', fontWeight: 800 }}>{error}</div>
            <button onClick={resetAllFilters} className="btn-purple-glow">
              Try Again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div
            className="glass-widget-card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
            }}
          >
            <Ticket size={48} color="#8B5CF6" />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
              No Events Found
            </h3>
            <p style={{ color: '#94A3B8', maxWidth: '400px' }}>
              We couldn't find any events matching your selected search query or city filters.
            </p>
            <button onClick={resetAllFilters} className="btn-purple-glow">
              Show All Events
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={(p) => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('page', p.toString());
                    setSearchParams(newParams);
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
