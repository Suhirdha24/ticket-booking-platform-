import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, ArrowRight } from 'lucide-react';

export default function EventCard({ event }) {
  const minPrice =
    event.pricing && event.pricing.length > 0
      ? Math.min(...event.pricing.map((p) => p.price))
      : 50;

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

  const getCategoryClass = (category) => {
    switch (category) {
      case 'Concert':
        return 'badge-primary';
      case 'Conference':
        return 'badge-general';
      case 'Theatre':
        return 'badge-premium';
      case 'Sports':
        return 'badge-vip';
      case 'Comedy':
        return 'badge-success';
      case 'Festival':
        return 'badge-primary';
      case 'Workshop':
        return 'badge-general';
      case 'Gaming':
        return 'badge-vip';
      case 'Meetup':
        return 'badge-premium';
      case 'Wellness':
        return 'badge-success';
      case 'Nightlife':
        return 'badge-primary';
      case 'Kids & Family':
        return 'badge-success';
      default:
        return 'badge-primary';
    }
  };

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Banner Thumbnail with Category Overlay */}
      <div
        style={{
          position: 'relative',
          height: '200px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <img
          src={event.thumbnailUrl || event.bannerUrl}
          alt={event.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="event-thumb"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(18, 20, 31, 1) 0%, rgba(18, 20, 31, 0.2) 60%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
          }}
        >
          <span className={`badge ${getCategoryClass(event.category)}`}>
            {event.category}
          </span>
        </div>
        {event.availableSeats !== undefined && (
          <div
            style={{
              position: 'absolute',
              top: '0.85rem',
              right: '0.85rem',
            }}
          >
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(4px)',
                color: event.availableSeats > 10 ? '#34d399' : '#fb7185',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Ticket size={12} />
              {event.availableSeats} Left
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
            color: '#818cf8',
            fontWeight: 600,
            marginBottom: '0.5rem',
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
            fontSize: '1.15rem',
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            color: '#ffffff',
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
            marginBottom: '1rem',
          }}
        >
          <MapPin size={14} color="var(--text-subtle)" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.venue?.name || 'Venue'}, {event.city}
          </span>
        </div>

        {/* Footer info: Price & CTA */}
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
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
              From
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              ₹{minPrice}
            </div>
          </div>

          <Link to={`/event/${event._id}`}>
            <button className="btn btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
              <span>Select Seats</span>
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
