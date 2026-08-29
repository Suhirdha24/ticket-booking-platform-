import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Heart,
  ShieldCheck,
  Star,
  Users,
  Ticket,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import api from '../api/client.js';
import { useFavoritesStore } from '../store/favoritesStore.js';
import { useToastStore } from '../store/toastStore.js';
import CountdownWidget from '../components/home/CountdownWidget.jsx';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { addToast } = useToastStore();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);

  const favorite = isFavorite(id);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/events/${id}`);
        const ev = res.data?.data?.event || res.data?.event;
        setEvent(ev);
        if (ev?.pricing?.length > 0) {
          setSelectedTier(ev.pricing[0]);
        }
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
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="glass-widget-card" style={{ height: '500px', animation: 'pulse 1.5s infinite' }}></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container" style={{ paddingTop: '5rem', textAlign: 'center' }}>
        <div className="glass-widget-card" style={{ padding: '4rem 2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.75rem' }}>Event Not Found</h2>
          <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>{error || 'This event does not exist.'}</p>
          <button onClick={() => navigate('/events')} className="btn-purple-glow">
            Browse All Events
          </button>
        </div>
      </div>
    );
  }

  const d = new Date(event.date || Date.now());
  const fullDate = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const totalCapacity = event.totalSeats || 160;
  const available = event.availableSeats !== undefined ? event.availableSeats : 142;

  const minPrice =
    event.pricing && event.pricing.length > 0
      ? Math.min(...event.pricing.map((p) => p.price))
      : 499;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08070D', color: '#FFFFFF', padding: '2rem 0 6rem' }}>
      <div className="container">
        {/* Top Breadcrumb & Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.5rem 1.1rem',
              color: '#FFFFFF',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Events</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => {
                toggleFavorite(event);
                addToast(favorite ? 'Removed from favorites' : 'Saved to favorites! ❤️', 'success');
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: favorite ? '#F43F5E' : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Save to favorites"
            >
              <Heart size={18} fill={favorite ? '#F43F5E' : 'none'} />
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: event.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  addToast('Event link copied to clipboard! 📋', 'info');
                }
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              aria-label="Share event"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Cover Banner, Title, Countdown, Venue & Lineup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Main Visual Banner */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '380px',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 30px rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <img
                src={
                  event.coverImage ||
                  event.banner ||
                  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80'
                }
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(8, 7, 13, 0.9) 0%, rgba(139, 92, 246, 0.1) 60%, transparent 100%)',
                }}
              ></div>

              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: '1.25rem',
                }}
              >
                <div className="hero-tag-pill">
                  <span className="tag-icon">✦</span>
                  <span>{event.category || 'Live Experience'}</span>
                </div>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '1.5rem',
                  left: '1.5rem',
                  right: '1.5rem',
                }}
              >
                <h1
                  style={{
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.15,
                  }}
                >
                  {event.title}
                </h1>
              </div>
            </div>

            {/* Countdown Widget */}
            <CountdownWidget targetDate={d} />

            {/* Event Description */}
            <div className="glass-widget-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.85rem' }}>
                About This Experience
              </h3>
              <p style={{ color: '#94A3B8', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {event.description ||
                  'Join thousands of music and arts enthusiasts for a magical evening filled with world-class performances, state-of-the-art acoustics, and unforgettable memories.'}
              </p>
            </div>

            {/* Venue & Location Box */}
            <div className="glass-widget-card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
                Venue & Schedule
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'rgba(139, 92, 246, 0.15)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Calendar size={18} color="#A78BFA" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>{fullDate}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Doors open at {timeStr}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'rgba(139, 92, 246, 0.15)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={18} color="#A78BFA" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
                      {event.venue?.name || event.location?.venue || 'Grand Stadium Arena'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                      {event.venue?.address || event.location?.address || 'Main Complex'}, {event.city || 'India'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Tier Selector, Stadium Seat Map Link & Booking Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '100px' }}>
            {/* Booking Card */}
            <div
              className="glass-widget-card"
              style={{
                padding: '2rem',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 246, 0.2)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase' }}>
                    Passes Starting At
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF' }}>
                    ₹{selectedTier ? selectedTier.price : minPrice}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#10B981',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                  }}
                >
                  {available} Seats Left
                </div>
              </div>

              {/* Tier Selection Pills */}
              {event.pricing && event.pricing.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.75rem' }}>
                    Select Ticket Tier:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {event.pricing.map((tier, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedTier(tier)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1.15rem',
                          borderRadius: '14px',
                          background: selectedTier?.category === tier.category ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: selectedTier?.category === tier.category ? '1.5px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
                            {tier.category} Pass
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            {tier.category === 'VIP' ? 'Front Row + Lounge Access' : tier.category === 'Premium' ? 'Central Prime View' : 'Upper Tier Admission'}
                          </div>
                        </div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF' }}>
                          ₹{tier.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Stadium Seat Map Booking CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to={`/events/${event._id}/seats`} style={{ width: '100%' }}>
                  <button
                    className="btn-purple-glow"
                    style={{ width: '100%', padding: '0.95rem', fontSize: '1rem' }}
                  >
                    <Star size={16} fill="#FFFFFF" />
                    <span>Select Stadium Seats</span>
                    <ArrowRight size={16} />
                  </button>
                </Link>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    fontSize: '0.75rem',
                    color: '#94A3B8',
                    marginTop: '0.5rem',
                  }}
                >
                  <ShieldCheck size={14} color="#10B981" />
                  <span>5-Minute Atomic Seat Lock Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
