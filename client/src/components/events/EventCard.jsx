import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, ArrowRight, Heart } from 'lucide-react';
import { getEventImage } from '../../utils/categoryImages.js';

export default function EventCard({ event }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const minPrice =
    event.pricing && event.pricing.length > 0
      ? Math.min(...event.pricing.map((p) => p.price))
      : 499;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="eventlinqs-card" style={{ height: '100%' }}>
      {/* Banner Thumbnail with Category Overlay & Heart Action */}
      <div
        style={{
          position: 'relative',
          height: '210px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <img
          src={getEventImage(event)}
          alt={event.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="event-thumb"
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(14, 17, 23, 0.95) 0%, rgba(14, 17, 23, 0.2) 60%, transparent 100%)',
          }}
        />

        {/* Top-Left Category Badge */}
        <div
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
          }}
        >
          <span
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              background: 'rgba(234, 179, 8, 0.9)',
              color: '#000000',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            {event.category}
          </span>
        </div>

        {/* Top-Right Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          style={{
            position: 'absolute',
            top: '0.85rem',
            right: '0.85rem',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavorite ? '#f43f5e' : '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={16} fill={isFavorite ? '#f43f5e' : 'none'} />
        </button>

        {/* Available seats chip */}
        {event.availableSeats !== undefined && (
          <div
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              left: '0.85rem',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.85)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Ticket size={12} color="#eab308" />
              {event.availableSeats} Seats Left
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Date & Time */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.82rem',
            color: '#eab308',
            fontWeight: 600,
            marginBottom: '0.45rem',
          }}
        >
          <Calendar size={14} />
          <span>
            {formatDate(event.date)} &bull; {formatTime(event.date)}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '1.12rem',
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            color: '#ffffff',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
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
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginBottom: '1.25rem',
          }}
        >
          <MapPin size={14} color="#eab308" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.venue?.name || 'Grand Arena'}, {event.city}
          </span>
        </div>

        {/* Footer info: Price & CTA */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '0.85rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              From
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
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
                background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                color: '#000000',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)',
                transition: 'all 0.2s ease',
              }}
              title="Select Seats"
            >
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

