import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Share2,
  Heart,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import api from '../api/client.js';
import { getEventImage } from '../utils/categoryImages.js';
import { useFavoritesStore } from '../store/favoritesStore.js';
import { useToastStore } from '../store/toastStore.js';

const GOING_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
];

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { addToast } = useToastStore();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const favorite = isFavorite(id);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data?.data?.event);
      } catch (err) {
        setError(err.message || 'Event not found');
      } finally {
        setLoading(false);
      }
    }

    if (id) loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mobile-safe-bottom" style={{ maxWidth: '480px', paddingTop: '2rem' }}>
        <div style={{ height: '400px', background: '#FFFFFF', borderRadius: 'var(--radius-xl)', animation: 'pulse 1.5s infinite' }} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mobile-safe-bottom" style={{ maxWidth: '480px', paddingTop: '3rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '2.5rem 1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Event Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={() => navigate('/events')} className="btn-primary">
            Browse All Events
          </button>
        </div>
      </div>
    );
  }

  const d = new Date(event.date || Date.now());
  const monthShort = d.toLocaleDateString('en-US', { month: 'short' });
  const dayNum = d.toLocaleDateString('en-US', { day: 'numeric' });
  const fullDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const totalCapacity = event.totalSeats || 50;
  const available = event.availableSeats !== undefined ? event.availableSeats : 24;
  const booked = Math.max(1, totalCapacity - available);

  const minPrice =
    event.pricing && event.pricing.length > 0
      ? Math.min(...event.pricing.map((p) => p.price))
      : 499;

  return (
    <div className="mobile-safe-bottom" style={{ minHeight: '100vh', paddingTop: '1rem' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        {/* Top Control Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="btn-icon"
            style={{ width: '40px', height: '40px' }}
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                addToast('Event link copied!', 'success');
              }}
              className="btn-icon"
              style={{ width: '40px', height: '40px' }}
              aria-label="Share"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => toggleFavorite(event._id)}
              className="btn-icon"
              style={{ width: '40px', height: '40px', color: favorite ? '#F43F5E' : '#0F172A' }}
              aria-label="Favorite"
            >
              <Heart size={16} fill={favorite ? '#F43F5E' : 'none'} />
            </button>
          </div>
        </div>

        {/* 🌟 1. EVENT HEADER CARD (Thumbnail + Title + 24/50 Circle) */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          {/* Thumbnail Box */}
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={getEventImage(event)}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Title */}
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.3,
              }}
            >
              {event.title}
            </h1>
          </div>

          {/* ⚪ Capacity Fraction Circle */}
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.82rem',
              fontWeight: 900,
              color: '#0F172A',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)',
            }}
          >
            <span>{booked}</span>
            <div style={{ width: '16px', height: '1px', background: '#CBD5E1', margin: '1px 0' }} />
            <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>{totalCapacity}</span>
          </div>
        </div>

        {/* 📅 2. DATE & TIME CARD */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '1.15rem',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          {/* Square Date Badge */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-md)',
              background: '#F1F5F9',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              {monthShort}
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
              {dayNum}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
              {fullDate}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
              <Clock size={13} color="#EAB308" />
              <span>{timeStr} onwards</span>
            </div>
          </div>
        </div>

        {/* 📍 3. LOCATION CARD WITH MINI MAP & GET DIRECTIONS */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '1.15rem',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          {/* Mini Map Thumbnail */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: 'var(--radius-md)',
              background: '#E2E8F0',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: '1px solid #CBD5E1',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(#CBD5E1 1px, transparent 1px), radial-gradient(#CBD5E1 1px, #E2E8F0 1px)',
                backgroundSize: '8px 8px',
              }}
            />
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                zIndex: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              <MapPin size={15} />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A' }}>
              {event.venue?.name || '4517 Washington Ave.'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.6rem' }}>
              {event.city}
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${event.venue?.name || ''} ${event.city}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#F1F5F9',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#0F172A',
                textDecoration: 'none',
              }}
            >
              <Navigation size={12} />
              <span>Get Direction</span>
            </a>
          </div>
        </div>

        {/* 👤 4. HOSTED BY & PEOPLE GOING */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '1.15rem',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>
              Hosted By
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                alt="Host"
                style={{ width: '22px', height: '22px', borderRadius: '50%' }}
              />
              <span>Mike Wazowki</span>
            </div>
          </div>

          <div style={{ height: '1px', background: '#F1F5F9' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>
              People Going ({booked} People)
            </span>
            <div className="avatar-group">
              {GOING_AVATARS.map((av, idx) => (
                <img key={idx} src={av} alt="Attendee" />
              ))}
            </div>
          </div>
        </div>

        {/* 📝 5. ABOUT EVENT */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '1.5rem',
          }}
        >
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            About Event
          </h3>
          <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6 }}>
            {event.description ||
              `Unlock your potential with our ${event.title} in ${event.city}! Designed for attendees of all skill levels, this hands-on session will help you sharpen your fundamentals, enhance your performance, and connect with vibrant creators.`}
          </p>
        </div>

        {/* 🏷️ STICKY BOTTOM BOOK TICKET BAR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '1rem 1.25rem',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
              Price
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>
              ₹{minPrice.toLocaleString('en-IN')}
            </div>
          </div>

          <Link to={`/event/${event._id}/seats`} style={{ flex: 1, maxWidth: '200px' }}>
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <span>Book Ticket</span>
              <ChevronRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
