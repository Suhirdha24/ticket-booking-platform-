import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import EventCard from '../components/events/EventCard.jsx';
import { EventCardSkeleton } from '../components/common/Skeleton.jsx';
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const CITIES = [
  'All',
  'Chennai',
  'Bengaluru',
  'Coimbatore',
  'Erode',
  'Madurai',
  'Mumbai',
  'New Delhi',
  'Hyderabad',
  'Kolkata',
  'Salem',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tiruppur',
  'Goa',
  'Kochi',
  'Pune',
  'Jaipur',
];

const VISUAL_CATEGORIES = [
  {
    name: 'Music',
    category: 'Concert',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Conference',
    category: 'Conference',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Food & Dining',
    category: 'Festival',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sports',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Comedy',
    category: 'Comedy',
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Festivals',
    category: 'Festival',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Workshops',
    category: 'Workshop',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Theatre',
    category: 'Theatre',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&auto=format&fit=crop&q=80',
  },
];

const FEATURED_ORGANISERS = [
  {
    name: 'Festival Masters',
    followers: '12.5K',
    events: 48,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Food & Cultural Vibes',
    followers: '18.2K',
    events: 64,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Urban Beats Live',
    followers: '24.1K',
    events: 92,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'TechConclave India',
    followers: '15.7K',
    events: 35,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.get('/events?limit=8');
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
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCity && selectedCity !== 'All') params.append('city', selectedCity);
    if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);

    const qs = params.toString();
    navigate(qs ? `/events?${qs}` : '/events');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '4rem' }}>
      {/* 🌟 HERO SECTION */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 0 5.5rem 0',
          overflow: 'hidden',
          backgroundImage: `
            linear-gradient(to bottom, rgba(10, 12, 16, 0.75) 0%, rgba(10, 12, 16, 0.98) 100%),
            url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&auto=format&fit=crop&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center 25%',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.16) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

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
          {/* Top Social Proof Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.25rem',
              flexWrap: 'wrap',
              marginBottom: '2rem',
            }}
          >
            {/* Attendees Proof */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
              }}
            >
              <div style={{ display: 'flex', marginLeft: '-4px' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                  alt="avatar"
                  style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #000' }}
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80"
                  alt="avatar"
                  style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #000', marginLeft: '-6px' }}
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&auto=format&fit=crop&q=80"
                  alt="avatar"
                  style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #000', marginLeft: '-6px' }}
                />
              </div>
              <div style={{ textAlign: 'left', fontSize: '0.8rem' }}>
                <strong style={{ color: '#ffffff' }}>350K+ Attendees</strong>{' '}
                <span style={{ color: '#94a3b8' }}>Trust EventLinqs</span>
              </div>
            </div>

            {/* Events Proof */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '0.35rem 0.9rem',
                borderRadius: '9999px',
              }}
            >
              <div style={{ display: 'flex', marginLeft: '-4px' }}>
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80"
                  alt="avatar"
                  style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #000' }}
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80"
                  alt="avatar"
                  style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #000', marginLeft: '-6px' }}
                />
              </div>
              <div style={{ textAlign: 'left', fontSize: '0.8rem' }}>
                <strong style={{ color: '#eab308' }}>12,000+ Events</strong>{' '}
                <span style={{ color: '#94a3b8' }}>Across India</span>
              </div>
            </div>
          </div>

          {/* Editorial Headline */}
          <h1
            className="font-serif-editorial"
            style={{
              fontSize: 'clamp(2.6rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              maxWidth: '920px',
              marginBottom: '1.25rem',
              color: '#ffffff',
              letterSpacing: '-0.01em',
            }}
          >
            Every{' '}
            <span className="gold-gradient-text" style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
              Culture
            </span>
            , Every{' '}
            <span className="gold-gradient-text" style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
              Event
            </span>
            ,<br />
            One{' '}
            <span className="gold-gradient-text" style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
              Platform
            </span>
            .
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: '#cbd5e1',
              maxWidth: '680px',
              lineHeight: 1.6,
              marginBottom: '2.5rem',
            }}
          >
            Discover concerts, festivals, conferences, food experiences, and cultural celebrations happening across India.
          </p>

          {/* 🔍 UNIFIED HORIZONTAL SEARCH CAPSULE */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              padding: '0.4rem 0.5rem 0.4rem 1.4rem',
              borderRadius: '9999px',
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              width: '100%',
              maxWidth: '920px',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
            className="search-capsule"
          >
            {/* Segment 1: Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1.4', minWidth: '180px', textAlign: 'left' }}>
              <Search size={18} color="#64748b" />
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Search Event
                </div>
                <input
                  type="text"
                  placeholder="What's on your mind?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    width: '100%',
                    padding: 0,
                    fontWeight: 500,
                  }}
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '32px', backgroundColor: '#e2e8f0', flexShrink: 0 }} />

            {/* Segment 2: Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1', minWidth: '140px', textAlign: 'left' }}>
              <MapPin size={18} color="#64748b" />
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Location
                </div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    width: '100%',
                    padding: 0,
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  <option value="">All Cities</option>
                  {CITIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: '1px', height: '32px', backgroundColor: '#e2e8f0', flexShrink: 0 }} />

            {/* Segment 3: Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: '1', minWidth: '140px', textAlign: 'left' }}>
              <Calendar size={18} color="#64748b" />
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Category
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    width: '100%',
                    padding: 0,
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="Concert">Concert</option>
                  <option value="Festival">Festival</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Sports">Sports</option>
                  <option value="Conference">Conference</option>
                  <option value="Theatre">Theatre</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
              }}
            >
              Explore Nearby
            </button>
          </form>
        </div>
      </section>

      {/* 🏷️ CURATED VISUAL CATEGORIES GRID */}
      <section id="categories" className="container">
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Explore Categories
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Popular Experiences</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {VISUAL_CATEGORIES.map((cat, idx) => (
            <Link key={idx} to={`/events?category=${cat.category}`} className="category-tile-card">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <div className="tile-overlay" />
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 🎪 CULTURAL CELEBRATIONS & FEATURED EVENTS */}
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
            <h2 className="font-serif-editorial" style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              Cultural Celebrations
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Celebrating diversity and live energy across Indian cities
            </p>
          </div>

          <Link to="/events">
            <button
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '0.5rem 1.1rem',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              View All Events <ArrowRight size={14} />
            </button>
          </Link>
        </div>

        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 👥 FEATURED ORGANISERS SECTION */}
      <section id="organisers" className="container">
        <div style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Creators & Curators
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Featured Organisers</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Trusted event creators bringing authentic experiences to life
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {FEATURED_ORGANISERS.map((org, i) => (
            <div
              key={i}
              className="eventlinqs-card"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Cover Header */}
              <div style={{ height: '90px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <img src={org.cover} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.4)' }} />
              </div>

              {/* Avatar & Content */}
              <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', marginTop: '-30px', position: 'relative' }}>
                <img
                  src={org.image}
                  alt={org.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '3px solid var(--bg-card)',
                    objectFit: 'cover',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                  }}
                />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.75rem', color: '#ffffff' }}>
                  {org.name}
                </h4>
                <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <div>
                    <strong style={{ color: '#ffffff' }}>{org.followers}</strong> Followers
                  </div>
                  <div>
                    <strong style={{ color: '#ffffff' }}>{org.events}</strong> Events
                  </div>
                </div>

                <Link to="/events" style={{ marginTop: '1.25rem', display: 'block' }}>
                  <button
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    View Events
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🚀 COMMUNITY CTA & HOST EVENT */}
      <section className="container">
        <div
          style={{
            padding: '3.5rem 2.5rem',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.12) 0%, rgba(18, 21, 30, 0.95) 100%)',
            border: '1px solid rgba(234, 179, 8, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <h3 className="font-serif-editorial" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              Host Your Event on Event<span style={{ color: '#eab308' }}>Linqs</span>
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6 }}>
              Reach thousands of eager attendees across India with interactive seat maps, real-time ticket sales, and instant automated QR check-in passes.
            </p>
          </div>

          <Link to="/admin">
            <button
              style={{
                background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                color: '#000000',
                padding: '0.9rem 2rem',
                borderRadius: '9999px',
                fontSize: '1rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(234, 179, 8, 0.35)',
              }}
            >
              Get Started as Organizer &rarr;
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
