import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Star, Users, ArrowRight } from 'lucide-react';

export default function EventCard({ event }) {
  if (!event) return null;

  const eventDate = event.startDate ? new Date(event.startDate) : new Date();
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const lowestPrice = event.tiers?.length
    ? Math.min(...event.tiers.map((t) => t.price))
    : event.price || 499;

  return (
    <Link
      to={`/events/${event._id}`}
      className="sonora-event-card"
      style={{ textDecoration: 'none' }}
    >
      {/* Event Photo Cover */}
      <div className="sonora-card-photo">
        <img
          src={
            event.coverImage ||
            event.banner ||
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80'
          }
          alt={event.title}
          loading="lazy"
        />
        <div className="sonora-photo-overlay"></div>

        {/* Category Tag */}
        <div className="sonora-category-tag">
          {event.category || 'Live Music'}
        </div>

        {/* Date Pill (Top Right) */}
        <div
          style={{
            position: 'absolute',
            top: '0.85rem',
            right: '0.85rem',
            background: 'rgba(8, 7, 13, 0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <Calendar size={11} color="#A78BFA" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Card Content Details */}
      <div
        style={{
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          {/* Location / Venue */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#94A3B8',
              marginBottom: '0.4rem',
            }}
          >
            <MapPin size={13} color="#8B5CF6" />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.location?.venue || 'Live Stadium'}, {event.location?.city || 'India'}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.3,
              marginBottom: '0.5rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.title}
          </h3>

          {/* Short description */}
          <p
            style={{
              fontSize: '0.82rem',
              color: '#64748B',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.description || 'Join thousands of fans for this incredible live showcase.'}
          </p>
        </div>

        {/* Bottom Price & Action Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '0.85rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
              From
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF' }}>
              ₹{lowestPrice}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'var(--gradient-purple)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 800,
              padding: '0.55rem 1rem',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.35)',
            }}
          >
            <span>Get Ticket</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
