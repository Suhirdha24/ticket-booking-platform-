import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, ArrowUpRight, Check, Utensils, Trophy, Music, Sparkles } from 'lucide-react';
import { getEventImage } from '../../utils/categoryImages.js';
import { useFavoritesStore } from '../../store/favoritesStore.js';

export default function EventCard({ event, compact = false }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const favorite = isFavorite(event?._id);

  if (!event) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '15 Sep 2024';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Generate capacity numbers matching the ( 14 / 50 ) style
  const totalCapacity = event.totalSeats || 50;
  const available = event.availableSeats !== undefined ? event.availableSeats : 24;
  const booked = Math.max(1, totalCapacity - available);

  const getCategoryEmoji = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'sports':
        return '🏀';
      case 'food':
      case 'festival':
        return '🍴';
      case 'concert':
      case 'music':
        return '🎵';
      case 'comedy':
        return '🎤';
      case 'workshop':
        return '🎨';
      default:
        return '✨';
    }
  };

  return (
    <div
      className="template-event-card"
      onClick={() => navigate(`/event/${event._id}`)}
      style={{ cursor: 'pointer' }}
    >
      {/* 📸 Image Container with Badges */}
      <div className="card-photo-container">
        <img
          src={getEventImage(event)}
          alt={event.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Soft Vignette Gradient */}
        <div className="card-gradient-overlay" />

        {/* 🟡 Yellow Date Badge (Top Left) */}
        <div className="yellow-date-badge">
          <span>{getCategoryEmoji(event.category)}</span>
          <span>{formatDate(event.date)}</span>
        </div>

        {/* ⚪ Capacity Fraction Circle (Top Right) */}
        <div className="capacity-circle-badge">
          <span>{booked}</span>
          <div className="fraction-line" />
          <span className="denominator">{totalCapacity}</span>
        </div>

        {/* 🔤 Bold Title Overlaid on Photo */}
        <div className="card-overlay-title">
          {event.title}
        </div>
      </div>

      {/* 📍 Bottom Venue & "Wants Join" Pill Button */}
      <div className="card-bottom-info">
        <div className="card-address-block">
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MapPin size={14} color="#0F172A" />
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A', display: 'block' }}>
              {event.venue?.name || 'Grand Arena'}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>
              {event.city}
            </span>
          </div>
        </div>

        <button
          className="btn-wants-join"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/event/${event._id}`);
          }}
        >
          <span>👏</span>
          <span>Wants Join</span>
        </button>
      </div>
    </div>
  );
}
