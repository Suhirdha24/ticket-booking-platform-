import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Heart, Users } from 'lucide-react';
import { getEventImage } from '../../utils/categoryImages.js';
import { useFavoritesStore } from '../../store/favoritesStore.js';

// Realistic demo attendee avatars for social proof
const ATTENDEE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
];

export default function EventCard({ event, compact = false }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(event._id);

  const minPrice =
    event.pricing && event.pricing.length > 0
      ? Math.min(...event.pricing.map((p) => p.price))
      : 499;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Generate consistent attendee count based on event id hash
  const attendeeCount = Math.floor(
    (parseInt((event._id || '1234').slice(-4), 16) % 150) + 12
  );

  return (
    <div className="eventlinqs-card" style={{ height: '100%' }}>
      {/* 📸 Event Hero Cover (55-60% height) */}
      <div
        style={{
          position: 'relative',
          height: compact ? '170px' : '205px',
          width: '100%',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => navigate(`/event/${event._id}`)}
      >
        <img
          src={getEventImage(event)}
          alt={event.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Soft Dark Vignette Gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(17, 21, 28, 0.95) 0%, rgba(17, 21, 28, 0.2) 60%, transparent 100%)',
          }}
        />

        {/* Category Pill Tag (Top Left) */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
          }}
        >
          <span
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.74rem',
              fontWeight: 700,
              background: 'rgba(0, 0, 0, 0.65)',
              color: 'var(--primary-gold)',
              border: '1px solid var(--border-gold-subtle)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
            }}
          >
            {event.category}
          </span>
        </div>

        {/* Floating Heart Favorite Button (Top Right) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(event._id);
          }}
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: favorite ? '#f43f5e' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          aria-label={favorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={18} fill={favorite ? '#f43f5e' : 'none'} />
        </button>

        {/* Remaining Seats Pill (Bottom Left of Image) */}
        {event.availableSeats !== undefined && (
          <div
            style={{
              position: 'absolute',
              bottom: '0.65rem',
              left: '0.75rem',
            }}
          >
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.9)',
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              🔥 {event.availableSeats} Seats Left
            </span>
          </div>
        )}
      </div>

      {/* 📄 Content Area */}
      <div
        style={{
          padding: '1.15rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Date & Time Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: 'var(--primary-gold)',
            fontWeight: 700,
            marginBottom: '0.4rem',
          }}
        >
          <Calendar size={13} />
          <span>{formatDate(event.date)}</span>
        </div>

        {/* Event Title */}
        <h3
          style={{
            fontSize: '1.08rem',
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: '0.45rem',
            color: '#ffffff',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.7rem',
          }}
        >
          {event.title}
        </h3>

        {/* Venue Location */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            marginBottom: '0.9rem',
          }}
        >
          <MapPin size={13} color="var(--primary-gold)" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.venue?.name || 'Grand Complex'}, {event.city}
          </span>
        </div>

        {/* 👥 Social Proof Attendee Avatar Stack */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            padding: '0.45rem 0.75rem',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="avatar-group">
              {ATTENDEE_AVATARS.map((avatarUrl, idx) => (
                <img
                  key={idx}
                  src={avatarUrl}
                  alt="Attendee"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              +{attendeeCount}K joined
            </span>
          </div>

          <span style={{ fontSize: '0.68rem', color: 'var(--primary-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Selling Fast
          </span>
        </div>

        {/* 🏷️ Card Footer: Price & Gold Action Button */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.85rem',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-subtle)',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Starts from
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
              }}
            >
              ₹{minPrice.toLocaleString('en-IN')}
            </div>
          </div>

          <Link to={`/event/${event._id}`}>
            <button
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--gradient-gold)',
                color: '#000000',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-gold)',
                transition: 'all 0.2s ease',
              }}
              title="Book Tickets"
              aria-label={`Book tickets for ${event.title}`}
            >
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
