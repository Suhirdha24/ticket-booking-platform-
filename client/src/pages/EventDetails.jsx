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
  Crown,
  Layers,
} from 'lucide-react';
import api from '../api/client.js';
import { useFavoritesStore } from '../store/favoritesStore.js';
import { useToastStore } from '../store/toastStore.js';
import CountdownWidget from '../components/home/CountdownWidget.jsx';
import { getEventImage, getCategoryTheme } from '../utils/categoryImages.js';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { addToast } = useToastStore();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);

  useEffect(() => {
    async function fetchEventDetails() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/events/${id}`);
        const data = res.data.data?.event || res.data.data;
        setEvent(data);
        if (data.pricing && data.pricing.length > 0) {
          setSelectedTier(data.pricing[0]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#94A3B8' }}>
        <div className="soundwave-bar" style={{ height: '30px', margin: '0 auto 1rem auto' }}></div>
        <p style={{ fontSize: '1rem', fontWeight: 600 }}>Loading festival details & tier passes...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fb7185', marginBottom: '1rem' }}>
          Event Not Found
        </h2>
        <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>
          {error || 'This live event might have ended or is no longer available.'}
        </p>
        <Link to="/events">
          <button className="btn-purple-glow">
            <ArrowLeft size={16} />
            <span>Explore All Live Events</span>
          </button>
        </Link>
      </div>
    );
  }

  const theme = getCategoryTheme(event.category);
  const imageUrl = getEventImage(event);
  const eventDate = event.startDate ? new Date(event.startDate) : event.date ? new Date(event.date) : new Date();
  const fullDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const minPrice = event.pricing?.length
    ? Math.min(...event.pricing.map((p) => p.price))
    : event.price || 499;

  const available = event.availableSeats !== undefined ? event.availableSeats : 130;

  return (
    <div style={{ paddingBottom: '6rem', position: 'relative' }}>
      {/* Background ambient purple backglow */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          height: '500px',
          background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '2rem' }}>
        {/* Back navigation & Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
          }}
        >
          <Link
            to="/events"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#94A3B8',
              fontSize: '0.9rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={16} color="#A78BFA" />
            <span>Back to Events Catalog</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => {
                toggleFavorite(event._id);
                addToast({
                  type: 'success',
                  title: isFavorite(event._id) ? 'Removed' : 'Saved to Wishlist',
                  message: `${event.title} saved to your favorites.`,
                });
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: isFavorite(event._id) ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: isFavorite(event._id) ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isFavorite(event._id) ? '#f43f5e' : '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <Heart size={18} fill={isFavorite(event._id) ? '#f43f5e' : 'none'} />
            </button>

            <button
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  addToast({
                    type: 'success',
                    title: 'Link Copied',
                    message: 'Event link copied to clipboard.',
                  });
                }
              }}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Cover Banner, Title, Countdown, Venue & Description */}
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
                src={imageUrl}
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(8, 7, 13, 0.95) 0%, rgba(139, 92, 246, 0.1) 60%, transparent 100%)',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  left: '1.25rem',
                }}
              >
                <div
                  className="hero-tag-pill"
                  style={{
                    background: theme.bgBadge,
                    borderColor: theme.borderBadge,
                    color: theme.textColor,
                  }}
                >
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
            <CountdownWidget
              targetDate={event.date || event.startDate}
              label={`⚡ ${event.category || 'Event'} Doors Open In`}
            />

            {/* Event Description & Location Information */}
            <div className="glass-widget-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
                About the Event
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                {event.description ||
                  `Join thousands of live event fans for an unforgettable experience in ${event.city}. Featuring state-of-the-art stadium sound, curated artist performances, and guaranteed atomic seat reservations.`}
              </p>

              {/* Date & Location Highlights */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
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
                    {selectedTier ? `${selectedTier.category} Pass Price` : 'Passes Starting At'}
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
                  {available} Seats Available
                </div>
              </div>

              {/* Tier Selection Cards (VIP, Premium, General) */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Layers size={15} color="#A78BFA" />
                  <span>Choose Your Pass Tier:</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {(event.pricing && event.pricing.length > 0
                    ? event.pricing
                    : [
                        { category: 'VIP', price: 4999 },
                        { category: 'Premium', price: 2799 },
                        { category: 'General', price: 1199 },
                      ]
                  ).map((tier, idx) => {
                    const isSelected = selectedTier?.category === tier.category;
                    const tierColor = tier.category === 'VIP' ? '#8B5CF6' : tier.category === 'Premium' ? '#6366F1' : '#38BDF8';

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedTier(tier)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.9rem 1.15rem',
                          borderRadius: '14px',
                          background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: isSelected ? `1.5px solid ${tierColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isSelected ? `0 0 20px rgba(139, 92, 246, 0.3)` : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              background: isSelected ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.06)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: isSelected ? '#FFFFFF' : '#94A3B8',
                            }}
                          >
                            {tier.category === 'VIP' ? <Crown size={16} /> : tier.category === 'Premium' ? <Sparkles size={16} /> : <Ticket size={16} />}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
                              {tier.category} Pass
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                              {tier.category === 'VIP' ? 'Front Row + VIP Lounge' : tier.category === 'Premium' ? 'Central Prime View' : 'Upper Tier Stadium'}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF' }}>
                          ₹{tier.price}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Direct Booking CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <Link
                  to={`/events/${event._id}/seats?tier=${selectedTier?.category || 'ALL'}`}
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <button
                    className="btn-purple-glow"
                    style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
                  >
                    <Star size={16} fill="#FFFFFF" />
                    <span>Book {selectedTier ? `${selectedTier.category} Pass` : 'Tickets'} Now</span>
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
                    marginTop: '0.25rem',
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
