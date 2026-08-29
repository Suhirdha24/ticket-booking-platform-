import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Compass, Trash2 } from 'lucide-react';
import api from '../api/client.js';
import { useFavoritesStore } from '../store/favoritesStore.js';
import EventCard from '../components/events/EventCard.jsx';

export default function Favorites() {
  const { favoriteIds, clearFavorites } = useFavoritesStore();
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (favoriteIds.length === 0) {
        setFavoriteEvents([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch all favorite event details in parallel
        const promises = favoriteIds.map((id) =>
          api.get(`/events/${id}`).then((res) => res.data?.data?.event).catch(() => null)
        );
        const results = await Promise.all(promises);
        setFavoriteEvents(results.filter(Boolean));
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [favoriteIds]);

  return (
    <div className="mobile-safe-bottom" style={{ minHeight: '100vh', paddingTop: '1.75rem' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#f43f5e',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Heart size={14} fill="#f43f5e" />
              <span>Saved Events</span>
            </span>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginTop: '0.15rem',
              }}
            >
              My Favorites
            </h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {favoriteIds.length} {favoriteIds.length === 1 ? 'event' : 'events'} saved to your wishlist
            </p>
          </div>

          {favoriteIds.length > 0 && (
            <button
              onClick={clearFavorites}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1rem',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: 'var(--radius-pill)',
                color: '#f43f5e',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* List Content */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
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
        ) : favoriteEvents.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1.5rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-subtle)',
              maxWidth: '500px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(244, 63, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: '#f43f5e',
              }}
            >
              <Heart size={32} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              No Favorites Yet
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Tap the heart icon on any event card to save shows, concerts, and festivals to your personal wishlist.
            </p>
            <Link to="/events" className="btn-primary">
              <Compass size={18} />
              <span>Explore Live Events</span>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {favoriteEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
