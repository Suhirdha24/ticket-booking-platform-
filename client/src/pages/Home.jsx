import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import EventCard from '../components/events/EventCard.jsx';
import { EventCardSkeleton } from '../components/common/Skeleton.jsx';
import Button from '../components/common/Button.jsx';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Ticket,
  Clock,
  Music,
  Tv,
  Trophy,
  Flame,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.get('/events?limit=6');
        setFeaturedEvents(res.data.data.events || []);
      } catch (err) {
        console.error('Failed to load home events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0 4rem 0',
          overflow: 'hidden',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Tag Pill */}
          <div
            className="badge badge-primary animate-fade-in"
            style={{
              padding: '0.5rem 1.1rem',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Sparkles size={14} />
            <span>Next-Gen High Concurrency Ticketing</span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              maxWidth: '900px',
              marginBottom: '1.5rem',
              letterSpacing: '-0.03em',
            }}
          >
            Experience Live Moments with{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Zero Hassle
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-muted)',
              maxWidth: '680px',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
            }}
          >
            Instant interactive seat reservations, atomic concurrency protection, and cryptographic QR mobile passes powered by serverless architecture.
          </p>

          {/* Hero Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: '0.6rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2.5rem',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 30px -10px var(--primary-glow)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.75rem', color: 'var(--text-subtle)' }}>
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search concerts, festivals, conferences, or cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '1rem',
                width: '100%',
                outline: 'none',
              }}
            />
            <Button type="submit" variant="primary" size="md">
              <span>Find Events</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          {/* Quick Categories */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <Link to="/events?category=Concert">
              <span className="badge badge-primary" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                <Music size={13} /> Concerts
              </span>
            </Link>
            <Link to="/events?category=Conference">
              <span className="badge badge-general" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                <Zap size={13} /> Conferences
              </span>
            </Link>
            <Link to="/events?category=Theatre">
              <span className="badge badge-premium" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                <Tv size={13} /> Theatre
              </span>
            </Link>
            <Link to="/events?category=Sports">
              <span className="badge badge-vip" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                <Trophy size={13} /> Esports & Sports
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '2.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div className="badge badge-vip" style={{ marginBottom: '0.5rem' }}>
              <Flame size={13} /> Trending Now
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Featured Events</h2>
          </div>
          <Link to="/events">
            <Button variant="secondary" size="sm" icon={ArrowRight}>
              Explore All Events
            </Button>
          </Link>
        </div>

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
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Pillars */}
      <section className="container">
        <div
          className="glass-panel"
          style={{
            padding: '3.5rem 2rem',
            background: 'linear-gradient(180deg, rgba(24, 26, 40, 0.7) 0%, rgba(18, 20, 31, 0.9) 100%)',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Engineered for Instant Access
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Our booking system delivers zero-friction checkout with bank-grade concurrency guarantees.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Step 1 */}
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                <Search size={26} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                1. Discover & Pick
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Browse curated concerts, conferences, and festivals across top cities with real-time seat availability.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                <Clock size={26} color="#fbbf24" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                2. 5-Min Atomic Lock
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Select your preferred seats on our visual stadium grid. Claimed seats are atomically locked for 5 minutes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                }}
              >
                <Ticket size={26} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                3. Instant QR Pass
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                Complete mock payment seamlessly and get an instant, verifiable digital ticket pass ready for print or gate scan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
