import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  X,
  MapPin,
  QrCode,
  Calendar,
  Send,
  Ticket as TicketIcon,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import api from '../api/client.js';
import { useAuthStore } from '../store/authStore.js';
import { getEventImage } from '../utils/categoryImages.js';
import TicketCard from '../components/booking/TicketCard.jsx';

export default function MyBookings() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTags, setSearchTags] = useState(['🍤 Food', '🍌 Sport', '🎻 Orchestra']);
  const [activeModalBooking, setActiveModalBooking] = useState(null);

  useEffect(() => {
    async function loadBookings() {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const res = await api.get('/bookings/my-bookings');
        setBookings(res.data?.data?.bookings || []);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [isAuthenticated, navigate]);

  const handleRemoveTag = (tag) => {
    setSearchTags(searchTags.filter((t) => t !== tag));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '15 Sep 2024';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDay = (dateStr) => {
    if (!dateStr) return '16 Sep';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="mobile-safe-bottom" style={{ minHeight: '100vh', paddingTop: '1rem' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        {/* Header (Back + "Your Active Ticket") */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
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
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
            Your Active Ticket
          </h1>
        </div>

        {/* Search Bar with Tag Pills */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="template-search-bar">
            <button type="button" className="search-icon-btn" aria-label="Search">
              <Search size={18} />
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                overflowX: 'auto',
                flex: 1,
              }}
              className="no-scrollbar"
            >
              {searchTags.map((tag) => (
                <div key={tag} className="search-tag-chip">
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(tag)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings Feed / Timeline */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '180px',
                  borderRadius: 'var(--radius-xl)',
                  background: '#FFFFFF',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3.5rem 1.5rem',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                color: '#0F172A',
              }}
            >
              <TicketIcon size={24} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              No Active Tickets
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
              You don't have any booked events yet. Explore upcoming experiences!
            </p>
            <Link to="/events" className="btn-primary">
              Discover Events
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {bookings.map((booking, index) => {
              const isFirst = index === 0;
              const eventTitle = booking.eventSnapshot?.title || 'Event Pass';
              const venueName = booking.venueSnapshot?.name || 'Grand Arena';
              const city = booking.venueSnapshot?.city || booking.eventSnapshot?.city || 'Bengaluru';
              const eventDate = booking.eventSnapshot?.date;

              if (isFirst) {
                // 🌟 HERO ACTIVE TICKET (TOP OF TIMELINE)
                return (
                  <div key={booking._id} style={{ position: 'relative' }}>
                    {/* "NOW" Pill Badge */}
                    <div style={{ position: 'absolute', top: '-10px', left: '12px', zIndex: 10 }}>
                      <span
                        style={{
                          background: '#EF4444',
                          color: '#FFFFFF',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-pill)',
                          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                        }}
                      >
                        NOW
                      </span>
                    </div>

                    <div
                      className="template-event-card"
                      style={{ cursor: 'pointer' }}
                      onClick={() => setActiveModalBooking(booking)}
                    >
                      <div className="card-photo-container">
                        <img
                          src={getEventImage(booking.eventSnapshot)}
                          alt={eventTitle}
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="card-gradient-overlay" />

                        {/* Yellow Date Badge */}
                        <div className="yellow-date-badge">
                          <span>🍴</span>
                          <span>{formatDate(eventDate)}</span>
                        </div>

                        {/* White Title */}
                        <div className="card-overlay-title">{eventTitle}</div>
                      </div>

                      {/* Bottom Info with Address & Directions Icon */}
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
                              {venueName}
                            </span>
                            <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block' }}>
                              {city}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn-icon"
                            style={{ width: '36px', height: '36px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveModalBooking(booking);
                            }}
                            title="Show QR Ticket"
                          >
                            <QrCode size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // 🕒 SUBSEQUENT TIMELINE TICKETS
              return (
                <div key={booking._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  {/* Left Date Label */}
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: '#64748B',
                      width: '45px',
                      paddingTop: '0.5rem',
                      flexShrink: 0,
                    }}
                  >
                    {formatDay(eventDate)}
                  </div>

                  {/* Compact Ticket Card */}
                  <div
                    style={{
                      flex: 1,
                      background: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-card)',
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => setActiveModalBooking(booking)}
                  >
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={getEventImage(booking.eventSnapshot)}
                        alt={eventTitle}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.25 }}>
                        {eventTitle}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                        {venueName}, {city}
                      </p>
                    </div>

                    <button
                      className="btn-icon"
                      style={{ width: '34px', height: '34px', flexShrink: 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalBooking(booking);
                      }}
                    >
                      <QrCode size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 🎟️ TICKET QR PASS MODAL */}
      {activeModalBooking && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(12px)',
          }}
          onClick={() => setActiveModalBooking(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <button
                onClick={() => setActiveModalBooking(null)}
                className="btn-icon"
                style={{ background: '#FFFFFF' }}
              >
                <X size={18} />
              </button>
            </div>
            <TicketCard booking={activeModalBooking} isNew={false} />
          </div>
        </div>
      )}
    </div>
  );
}
