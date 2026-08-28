import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client.js';
import EventCard from '../components/events/EventCard.jsx';
import EventFilter from '../components/events/EventFilter.jsx';
import Pagination from '../components/common/Pagination.jsx';
import { EventCardSkeleton } from '../components/common/Skeleton.jsx';
import { Sparkles, Calendar, Frown } from 'lucide-react';

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'date-asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'All') params.append('category', category);
        if (city && city !== 'All') params.append('city', city);
        if (sort) params.append('sort', sort);
        params.append('page', page);
        params.append('limit', 12);

        const res = await api.get(`/events?${params.toString()}`);
        setEvents(res.data.data.events || []);
        setPagination(res.data.data.pagination || { page: 1, pages: 1, total: 0 });
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [search, category, city, sort, page]);

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setCity('All');
    setSort('date-asc');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'rgba(234, 179, 8, 0.15)',
            color: '#eab308',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <Calendar size={13} /> Live Event Catalog
        </div>
        <h1 className="font-serif-editorial" style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
          Explore Upcoming Events
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Filter through concerts, conferences, comedy shows, festivals, and cultural celebrations across India.
        </p>
      </div>

      {/* Filter Bar */}
      <EventFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        city={city}
        setCity={setCity}
        sort={sort}
        setSort={setSort}
        onReset={handleReset}
      />

      {/* Results Section */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Frown size={48} color="var(--text-subtle)" />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>No Events Found</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '420px', fontSize: '0.95rem' }}>
            We could not find any events matching your selected criteria. Try adjusting your filters or search terms.
          </p>
          <button onClick={handleReset} className="btn btn-secondary" style={{ marginTop: '0.5rem' }}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem',
            }}
          >
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {/* Smart Pagination with Range Display & Jump Dialog */}
          <Pagination
            currentPage={page}
            totalPages={pagination.pages}
            totalItems={pagination.total}
            pageSize={12}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}
