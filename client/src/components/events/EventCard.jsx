import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Ticket,
  ArrowRight,
  Music,
  Trophy,
  Film,
  Smile,
  Sparkles,
  Briefcase,
  Layers,
  Gamepad2,
  Heart,
  Moon,
  Users,
  BookOpen,
} from 'lucide-react';
import { getEventImage, getCategoryTheme } from '../../utils/categoryImages.js';

const ICON_MAP = {
  Music,
  Trophy,
  Film,
  Smile,
  Sparkles,
  Briefcase,
  Layers,
  Gamepad2,
  Heart,
  Moon,
  Users,
  BookOpen,
};

export default function EventCard({ event }) {
  if (!event) return null;

  const eventDate = event.startDate ? new Date(event.startDate) : event.date ? new Date(event.date) : new Date();
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const lowestPrice = event.tiers?.length
    ? Math.min(...event.tiers.map((t) => t.price))
    : event.price || 499;

  const category = event.category || 'Concert';
  const theme = getCategoryTheme(category);
  const imageUrl = getEventImage(event);
  const CategoryIcon = ICON_MAP[theme.iconName] || Ticket;

  return (
    <Link
      to={`/events/${event._id}`}
      className="sonora-event-card"
      style={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        backgroundColor: 'rgba(20, 18, 34, 0.85)',
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = theme.color;
        e.currentTarget.style.boxShadow = `0 15px 35px -5px rgba(0, 0, 0, 0.8), 0 0 25px -5px ${theme.glow}`;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Event Photo Cover with Per-Category Curated Photography */}
      <div
        className="sonora-card-photo"
        style={{
          position: 'relative',
          height: '210px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#0D0C15',
        }}
      >
        <img
          src={imageUrl}
          alt={event.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onError={(e) => {
            // Fallback gracefully if an image fails
            e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div
          className="sonora-photo-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(20, 18, 34, 0.95) 0%, transparent 60%)',
          }}
        />

        {/* Dynamic Category Pill (Top Left) */}
        <div
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            background: theme.bgBadge,
            border: `1px solid ${theme.borderBadge}`,
            backdropFilter: 'blur(10px)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.74rem',
            fontWeight: 800,
            color: theme.textColor,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: `0 2px 10px ${theme.glow}`,
          }}
        >
          <CategoryIcon size={12} color={theme.color} />
          <span>{category}</span>
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
            <MapPin size={13} color={theme.color} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {event.location?.venue || event.venue?.name || 'Live Stadium'}, {event.location?.city || event.city || 'India'}
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '1.12rem',
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
              color: '#94A3B8',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.description || `Experience the most exciting ${category} event featuring top performers and live seating.`}
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
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              From
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF' }}>
              ₹{lowestPrice}
            </div>
          </div>

          <div
            style={{
              background: `linear-gradient(135deg, ${theme.color} 0%, #6366F1 100%)`,
              color: '#FFFFFF',
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.82rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: `0 4px 15px ${theme.glow}`,
            }}
          >
            <span>Get Ticket</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </Link>
  );
}
