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
  Lock,
  LogIn,
  CheckCircle2,
  Car,
  Accessibility,
  Utensils,
  Wind,
  CreditCard,
  Info,
  Award,
  FileText,
} from 'lucide-react';
import api from '../api/client.js';
import { useAuthStore } from '../store/authStore.js';
import { useFavoritesStore } from '../store/favoritesStore.js';
import { useToastStore } from '../store/toastStore.js';
import CountdownWidget from '../components/home/CountdownWidget.jsx';
import AuthPromptModal from '../components/common/AuthPromptModal.jsx';
import { getEventImage, getCategoryTheme } from '../utils/categoryImages.js';
import { getRichEventDetails, TIER_PERKS_MAP, VENUE_AMENITIES } from '../utils/eventDetailsHelper.js';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { addToast } = useToastStore();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  // When an unauthenticated user opens this event, initially show the sign-in option
  useEffect(() => {
    if (!loading && event && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [loading, event, isAuthenticated]);

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
  const rich = getRichEventDetails(event);
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
              label={`⏰ ${event.category || 'Event'} Doors Open In`}
            />

            {/* Quick Key Happening Attributes Bar */}
            {rich && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                <div
                  className="glass-widget-card"
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    borderLeft: `3px solid ${theme.color}`,
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Genre
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {rich.subgenre}
                  </span>
                </div>

                <div
                  className="glass-widget-card"
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    borderLeft: '3px solid #10B981',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Duration
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {rich.duration}
                  </span>
                </div>

                <div
                  className="glass-widget-card"
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    borderLeft: '3px solid #38BDF8',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Language
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {rich.language}
                  </span>
                </div>

                <div
                  className="glass-widget-card"
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    borderLeft: '3px solid #F59E0B',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    Age Guide
                  </span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF' }}>
                    {rich.ageLimit}
                  </span>
                </div>
              </div>
            )}

            {/* Event Description & Location Information */}
            <div className="glass-widget-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Info size={18} color="#A78BFA" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  About the Event
                </h3>
              </div>
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

            {/* Featured Performers / Artists Lineup */}
            {rich?.artists && rich.artists.length > 0 && (
              <div className="glass-widget-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Users size={18} color="#A78BFA" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Featured Lineup & Performers
                  </h3>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  {rich.artists.map((artist, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '0.75rem',
                        borderRadius: '14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <img
                        src={artist.image}
                        alt={artist.name}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid rgba(139, 92, 246, 0.4)',
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                          {artist.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#A78BFA', marginTop: '0.15rem' }}>
                          {artist.role}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Highlights & Inclusions */}
            {rich?.highlights && (
              <div className="glass-widget-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Sparkles size={18} color="#A78BFA" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Event Experience Highlights
                  </h3>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '0.85rem',
                  }}
                >
                  {rich.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: '0.84rem', color: '#E2E8F0', lineHeight: 1.45 }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day-of-Event Timeline / Schedule */}
            {rich?.schedule && (
              <div className="glass-widget-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <Clock size={18} color="#A78BFA" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                    Event Day Schedule & Itinerary
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '20px',
                      top: '10px',
                      bottom: '20px',
                      width: '2px',
                      background: 'rgba(139, 92, 246, 0.3)',
                    }}
                  />
                  {rich.schedule.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1.25rem',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: 'rgba(20, 18, 34, 1)',
                          border: '2px solid #8B5CF6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#A78BFA',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          flexShrink: 0,
                          boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
                        }}
                      >
                        {idx + 1}
                      </div>

                      <div
                        style={{
                          flex: 1,
                          padding: '0.85rem 1.15rem',
                          borderRadius: '14px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
                            {item.title}
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              color: '#A78BFA',
                              background: 'rgba(139, 92, 246, 0.15)',
                              padding: '0.15rem 0.55rem',
                              borderRadius: 'var(--radius-pill)',
                            }}
                          >
                            {item.time}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.35rem', lineHeight: 1.4 }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Venue Amenities & Location Map Information */}
            <div className="glass-widget-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <MapPin size={18} color="#A78BFA" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Venue Facilities & Amenities
                </h3>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1.5rem',
                }}
              >
                {VENUE_AMENITIES.map((amenity, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#CBD5E1',
                    }}
                  >
                    <CheckCircle2 size={14} color="#A78BFA" />
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  background: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  fontSize: '0.82rem',
                  color: '#CBD5E1',
                  lineHeight: 1.5,
                }}
              >
                <strong style={{ color: '#FFFFFF' }}>Directions:</strong> Located at{' '}
                {event.venue?.address || 'Main City Complex'}, {event.city}. Accessible via city metro transit, ride-hailing cabs, and dedicated multi-tier parking.
              </div>
            </div>

            {/* Important Attendee Guidelines & Policies */}
            <div className="glass-widget-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <FileText size={18} color="#A78BFA" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  Important Guidelines & Policies
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5 }}>
                <p>• <strong>Photo Identification:</strong> Attendees must present a valid government-issued photo ID (Aadhaar, Passport, Driver's License) matching their booking name at gate entry.</p>
                <p>• <strong>Instant Digital E-Ticket:</strong> No physical printing required. You will receive an instant QR pass in your profile and via email.</p>
                <p>• <strong>Atomic Seat Allocation:</strong> Seats reserved during checkout are locked exclusively to your user account to guarantee zero double bookings.</p>
                <p>• <strong>Cancellation Policy:</strong> Free cancellation is supported up to 24 hours prior to event doors open time under your account dashboard.</p>
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

              {/* Selected Pass Perks & Inclusions */}
              {selectedTier && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Award size={14} color="#A78BFA" />
                    <span>{selectedTier.category} Pass Inclusions:</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(TIER_PERKS_MAP[selectedTier.category] || TIER_PERKS_MAP.General).map((perk, pIdx) => (
                      <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.78rem', color: '#CBD5E1', lineHeight: 1.4 }}>
                        <CheckCircle2 size={13} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Booking CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {!isAuthenticated && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(139, 92, 246, 0.12)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <Lock size={16} color="#A78BFA" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: 1.45 }}>
                      <strong style={{ color: '#FFFFFF' }}>Sign-in required:</strong> You must sign in or register to select seats and reserve tickets.
                    </div>
                  </div>
                )}

                <button
                  className="btn-purple-glow"
                  style={{ width: '100%', padding: '1rem', fontSize: '1rem', cursor: 'pointer' }}
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true);
                    } else {
                      navigate(`/events/${event._id}/seats?tier=${selectedTier?.category || 'ALL'}`);
                    }
                  }}
                >
                  {isAuthenticated ? (
                    <>
                      <Star size={16} fill="#FFFFFF" />
                      <span>Book {selectedTier ? `${selectedTier.category} Pass` : 'Tickets'} Now</span>
                      <ArrowRight size={16} />
                    </>
                  ) : (
                    <>
                      <LogIn size={16} />
                      <span>Sign In to Book Tickets</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

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

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        event={event}
        targetPath={`/events/${event._id}/seats?tier=${selectedTier?.category || 'ALL'}`}
      />
    </div>
  );
}
