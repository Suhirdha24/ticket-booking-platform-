import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useLocationStore } from '../store/locationStore.js';
import EventCard from '../components/events/EventCard.jsx';
import MusicPlayerWidget from '../components/home/MusicPlayerWidget.jsx';
import CountdownWidget from '../components/home/CountdownWidget.jsx';
import LineupWidget from '../components/home/LineupWidget.jsx';
import PerforatedTicketWidget from '../components/home/PerforatedTicketWidget.jsx';
import {
  Sparkles,
  Star,
  Zap,
  Play,
  ArrowRight,
  Search,
  MapPin,
  Calendar,
  Flame,
  Music,
  Plus,
  X,
} from 'lucide-react';
import { ALL_GENRES } from '../utils/eventDetailsHelper.js';

const CATEGORIES = ALL_GENRES.map((g) => g.id || 'All');

export default function Home() {
  const navigate = useNavigate();
  const { selectedCity } = useLocationStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Close modal on Escape key and manage body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showVideoModal) {
        setShowVideoModal(false);
      }
    };
    if (showVideoModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showVideoModal]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCity && selectedCity !== 'All Cities') params.append('city', selectedCity);
        params.append('limit', '12');

        const res = await api.get(`/events?${params.toString()}`, {
          signal: controller.signal,
        });
        setEvents(res.data?.data?.events || res.data?.events || []);
      } catch (err) {
        if (
          err.isCanceled ||
          err.name === 'CanceledError' ||
          err.code === 'ERR_CANCELED' ||
          err.message === 'canceled'
        ) {
          return;
        }
        console.error('Failed to load events', err);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();
    return () => controller.abort();
  }, [selectedCategory, searchQuery, selectedCity]);

  const featuredEvent = events[0] || null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08070D', color: '#FFFFFF' }}>
      {/* ========================================================================= */}
      {/* 🚀 1. SONORA HERO SECTION (MATCHING REFERENCE UI) */}
      {/* ========================================================================= */}
      <section
        style={{
          position: 'relative',
          padding: '2.5rem 0 3.5rem',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundImage: 'radial-gradient(circle at 75% 30%, rgba(139, 92, 246, 0.22) 0%, transparent 55%)',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          {/* Main Hero Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              minHeight: '520px',
            }}
          >
            {/* Left Column: Headlines & Action CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              {/* Live Platform Activity Ticker Bar */}
              <div className="hero-ticker-bar">
                <span className="live-pulse-dot" />
                <span>Sonora Cyber-Violet Festival 2026 Live Now • Over 2,400+ Passes Booked</span>
              </div>

              {/* Top Floating Badge Tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div className="hero-tag-pill">
                  <span className="tag-icon">✦</span>
                  <span>Live Music</span>
                </div>
                <div className="hero-tag-pill">
                  <span className="tag-icon">★</span>
                  <span>Good Vibes</span>
                </div>
              </div>

              {/* Massive Bold Headline */}
              <h1 className="hero-huge-title">
                Feel<br />The Sound
              </h1>

              {/* Script Calligraphy Subtitle */}
              <span className="hero-script-subtitle">
                Live the Moment
              </span>

              {/* Sub-paragraph */}
              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#94A3B8',
                  maxWidth: '460px',
                  lineHeight: 1.6,
                  marginBottom: '2rem',
                }}
              >
                Join thousands of music lovers for an unforgettable festival experience. Every beat, every stage, all in one place.
              </p>

              {/* Double Hero CTA Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <Link to="/events">
                  <button className="btn-purple-glow">
                    <Star size={16} fill="#FFFFFF" color="#FFFFFF" />
                    <span>Get Your Tickets</span>
                  </button>
                </Link>

                <button
                  onClick={() => setShowVideoModal(true)}
                  className="btn-frosted-play"
                >
                  <div className="play-circle">
                    <Play size={15} fill="#FFFFFF" style={{ marginLeft: '2px' }} />
                  </div>
                  <span>Watch Aftermovie</span>
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual Backdrop + 120K+ & Perforated Ticket Widgets */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '480px',
              }}
            >
              {/* Central Concert Hero Image (Girl with Sunglasses & Purple Lighting) */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '420px',
                  height: '460px',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
                  alt="Festival Live Atmosphere"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(8, 7, 13, 0.85) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 100%)',
                  }}
                ></div>

                {/* Floating Tag over Image */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                  }}
                >
                  <div className="hero-tag-pill">
                    <span style={{ color: '#F59E0B' }}>⭐</span>
                    <span>Unforgettable</span>
                  </div>
                </div>
              </div>

              {/* Floating Top-Right Widget: 120K+ People Joined */}
              <div
                className="glass-widget-card"
                style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-10px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  minWidth: '170px',
                  zIndex: 2,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="avatar-group">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Attendee" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Attendee" />
                    <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80" alt="Attendee" />
                  </div>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--gradient-purple)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 900,
                    }}
                  >
                    +
                  </div>
                </div>

                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.1 }}>
                  120K+
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  People Joined Last Year
                </div>
              </div>

              {/* Floating Bottom-Right Widget: 3D Slanted Perforated Ticket Pass */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-25px',
                  right: '-20px',
                  zIndex: 3,
                }}
              >
                <PerforatedTicketWidget featuredEventId={featuredEvent?._id} />
              </div>
            </div>
          </div>

          {/* Bottom Hero Widgets Bar: Music Player | Countdown | Lineup */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginTop: '3.5rem',
              alignItems: 'stretch',
            }}
          >
            {/* Widget 1: Interactive Festival Music Player */}
            <MusicPlayerWidget />

            {/* Widget 2: Festival Starts In Countdown */}
            <CountdownWidget />

            {/* Widget 3: Latest Headliner Lineup */}
            <LineupWidget />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 2. ALL HAPPENING GENRES SHOWCASE */}
      {/* ========================================================================= */}
      <section style={{ padding: '2.5rem 0 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Browse by Category
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', marginTop: '0.2rem' }}>
                All Happening Genres
              </h2>
            </div>
            <Link
              to="/events"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: '#A78BFA',
                fontSize: '0.86rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <span>View Full Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div
            className="no-scrollbar"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '0.85rem',
              paddingBottom: '0.5rem',
            }}
          >
            {ALL_GENRES.filter((g) => g.id).map((g) => {
              const isSelected = selectedCategory === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedCategory(g.id)}
                  style={{
                    background: isSelected ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1.5px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.45rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#8B5CF6';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = isSelected ? '#8B5CF6' : 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ fontSize: '1.6rem' }}>{g.emoji}</span>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                      {g.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                      {g.count} Events
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🎪 3. CURATED EVENT DISCOVERY & CATEGORY EXPLORER */}
      {/* ========================================================================= */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          {/* Header & Search Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Live Experiences
                </div>
                {!isLoading && (
                  <span
                    style={{
                      background: 'rgba(139, 92, 246, 0.15)',
                      border: '1px solid rgba(139, 92, 246, 0.35)',
                      color: '#C4B5FD',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.55rem',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    {events.length} {events.length === 1 ? 'Event' : 'Events'}
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF', marginTop: '0.2rem' }}>
                Explore Trending Events
              </h2>
            </div>

            {/* Search Input Bar & Quick Trending Tags */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', width: '100%', maxWidth: '380px' }}>
              <div style={{ position: 'relative', width: '100%' }}>
                <Search
                  size={16}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  placeholder="Search artists, venues, festivals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-pill)' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
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

              {/* Trending Quick Search Tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700 }}>Trending:</span>
                {['Coldplay', 'Sunburn', 'Comedy', 'Rock', 'Electronic'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(tag)}
                    style={{
                      background: searchQuery === tag ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.05)',
                      border: searchQuery === tag ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.2rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: searchQuery === tag ? '#FFFFFF' : '#CBD5E1',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter Chips Bar */}
          <div
            className="no-scrollbar"
            style={{
              display: 'flex',
              gap: '0.6rem',
              overflowX: 'auto',
              paddingBottom: '1rem',
              marginBottom: '2.5rem',
            }}
          >
            {ALL_GENRES.map((g) => {
              const catKey = g.id || 'All';
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`sonora-filter-chip ${isSelected ? 'active' : ''}`}
                >
                  {g.emoji && <span>{g.emoji}</span>}
                  <span>{g.name}</span>
                </button>
              );
            })}
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="glass-widget-card"
                  style={{ height: '360px', opacity: 0.5, animation: 'pulse 1.5s infinite' }}
                ></div>
              ))}
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
                gap: '1rem',
              }}
            >
              <Music size={48} color="#8B5CF6" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
                No events found
              </h3>
              <p style={{ color: '#94A3B8', maxWidth: '400px' }}>
                We couldn't find events matching your search or category filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="btn-purple-glow"
              >
                Reset Filters
              </button>
            </div>
          ) : (
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
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🎬 3. AFTERMOVIE VIDEO MODAL POPUP */}
      {/* ========================================================================= */}
      {showVideoModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '1rem',
          }}
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="glass-widget-card"
            style={{
              width: '100%',
              maxWidth: '850px',
              overflow: 'hidden',
              position: 'relative',
              background: '#0D0C15',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={16} color="#8B5CF6" />
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Sonora Official Aftermovie
                </span>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Embedded Festival Aftermovie Video / Trailer Player */}
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000000' }}>
              <iframe
                title="Sonora Festival Aftermovie"
                src="https://www.youtube-nocookie.com/embed/fJ9rUzIMcZQ?autoplay=1&mute=0"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
