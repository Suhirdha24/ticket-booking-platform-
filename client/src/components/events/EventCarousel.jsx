import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import EventCard from './EventCard.jsx';

export default function EventCarousel({
  title,
  subtitle,
  emoji = '🔥',
  viewAllLink = '/events',
  events = [],
  loading = false,
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!loading && (!events || events.length === 0)) {
    return null;
  }

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          padding: '0 0.25rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '1.45rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#ffffff',
            }}
          >
            <span>{title}</span>
            <span>{emoji}</span>
          </div>
          {subtitle && (
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--primary-gold)',
                transition: 'gap 0.2s ease',
              }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          )}

          {/* Desktop Left/Right Scroll Arrows */}
          <div className="desktop-arrows" style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => scroll('left')}
              className="btn-icon"
              style={{ width: '34px', height: '34px' }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="btn-icon"
              style={{ width: '34px', height: '34px' }}
              aria-label="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div ref={scrollRef} className="horizontal-scroll-container">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="horizontal-scroll-item"
                style={{
                  height: '380px',
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--bg-surface)',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))
          : events.map((event) => (
              <div key={event._id} className="horizontal-scroll-item">
                <EventCard event={event} />
              </div>
            ))}
      </div>
    </section>
  );
}
