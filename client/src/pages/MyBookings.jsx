import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  X,
  MapPin,
  QrCode,
  Calendar,
  Ticket as TicketIcon,
  ChevronRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Printer,
  Clock,
  Ban,
  ShieldCheck,
} from 'lucide-react';
import api from '../api/client.js';
import { useAuthStore } from '../store/authStore.js';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import { getEventImage, getCategoryTheme } from '../utils/categoryImages.js';
import TicketCard from '../components/booking/TicketCard.jsx';
import Button from '../components/common/Button.jsx';

export default function MyBookings() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeModalBooking, setActiveModalBooking] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await api.get('/bookings');
      const data = res.data?.data;
      if (Array.isArray(data)) {
        setBookings(data);
      } else if (data?.bookings && Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will release your seats.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      showSuccessToast('Booking Cancelled', 'Your reservation has been cancelled and seats released.');
      fetchBookings();
    } catch (err) {
      showErrorToast('Cancellation Failed', err.message || 'Could not cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBA';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Filter Bookings by search query and category
  const filteredBookings = bookings.filter((b) => {
    const title = b.eventSnapshot?.title || b.event?.title || '';
    const venue = b.venueSnapshot?.name || '';
    const ref = b.bookingReference || '';
    const category = b.eventSnapshot?.category || b.event?.category || '';

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || category.toUpperCase() === selectedCategory.toUpperCase();

    return matchesSearch && matchesCategory;
  });

  const categories = ['ALL', 'Concert', 'Sports', 'Theatre', 'Comedy', 'Festival'];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '6rem', position: 'relative' }}>
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '2.5rem' }}>
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/events" style={{ textDecoration: 'none' }}>
              <button
                className="sonora-btn-modern"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label="Back"
              >
                <ArrowLeft size={18} color="#A78BFA" />
              </button>
            </Link>

            <div>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2 }}>
                My Active Tickets & Passes 🎟️
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                View your confirmed digital passes, scan gate QR codes, and manage live event admissions.
              </p>
            </div>
          </div>

          <Link to="/events" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">
              <Sparkles size={16} />
              <span>Explore More Events</span>
            </Button>
          </Link>
        </div>

        {/* Search & Category Filter Bar */}
        <div
          className="glass-widget-card"
          style={{
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Search Input */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 280px',
              maxWidth: '400px',
            }}
          >
            <Search
              size={17}
              color="#A78BFA"
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search by event, venue, or #REF code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{
                paddingLeft: '2.6rem',
                paddingRight: searchQuery ? '2.5rem' : '1rem',
                fontSize: '0.88rem',
                background: 'rgba(15, 13, 25, 0.75)',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`sonora-filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                style={{ fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
              >
                {cat === 'ALL' ? 'All Passes' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Grid or Empty State */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="glass-widget-card"
                style={{ height: '260px', opacity: 0.5, animation: 'pulse 1.5s infinite' }}
              />
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div
            className="glass-widget-card"
            style={{
              textAlign: 'center',
              padding: '4.5rem 2rem',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1.5px solid rgba(139, 92, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                boxShadow: '0 0 25px rgba(139, 92, 246, 0.35)',
              }}
            >
              <TicketIcon size={30} color="#A78BFA" />
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.6rem' }}>
              {searchQuery || selectedCategory !== 'ALL' ? 'No Matching Tickets' : 'No Active Tickets Found'}
            </h2>

            <p style={{ fontSize: '0.92rem', color: '#94A3B8', maxWidth: '420px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
              {searchQuery || selectedCategory !== 'ALL'
                ? 'Try adjusting your search terms or category filters above.'
                : 'You have not booked any festival or event tickets yet. Explore our curated events and claim your seat!'}
            </p>

            <Link to="/events" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="md">
                <Sparkles size={16} />
                <span>Discover Live Events</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '2rem',
            }}
          >
            {filteredBookings.map((booking) => {
              const eventSnapshot = booking.eventSnapshot || booking.event || {};
              const venueSnapshot = booking.venueSnapshot || {};
              const eventTitle = eventSnapshot.title || 'Live Experience Pass';
              const venueName = venueSnapshot.name || 'Grand Arena';
              const city = venueSnapshot.city || eventSnapshot.city || 'India';
              const eventDate = eventSnapshot.date || eventSnapshot.startDate;
              const theme = getCategoryTheme(eventSnapshot.category);
              const imageUrl = getEventImage(eventSnapshot);
              const isConfirmed = booking.bookingStatus === 'CONFIRMED';

              return (
                <div
                  key={booking._id}
                  className="glass-widget-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 25px rgba(139, 92, 246, 0.15)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Card Cover Header */}
                  <div style={{ position: 'relative', width: '100%', height: '170px' }}>
                    <img
                      src={imageUrl}
                      alt={eventTitle}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(20, 18, 34, 0.98) 0%, rgba(20, 18, 34, 0.4) 60%, transparent 100%)',
                      }}
                    />

                    {/* Status Pill Badge */}
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.3rem 0.75rem',
                          borderRadius: 'var(--radius-pill)',
                          background: isConfirmed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                          border: `1px solid ${isConfirmed ? '#10B981' : '#EF4444'}`,
                          color: isConfirmed ? '#6EE7B7' : '#FCA5A5',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {isConfirmed ? <CheckCircle2 size={13} /> : <Ban size={13} />}
                        {booking.bookingStatus}
                      </span>
                    </div>

                    {/* Reference Tag */}
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          padding: '0.3rem 0.7rem',
                          borderRadius: '8px',
                          background: 'rgba(13, 12, 21, 0.85)',
                          border: '1px solid rgba(139, 92, 246, 0.4)',
                          color: '#A78BFA',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {booking.bookingReference}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3, marginBottom: '0.5rem' }}>
                        {eventTitle}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#A78BFA', fontSize: '0.88rem', fontWeight: 700 }}>
                        <Calendar size={15} />
                        <span>
                          {formatDate(eventDate)} &bull; {formatTime(eventDate)}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                      <MapPin size={16} color="#A78BFA" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#E2E8F0' }}>{venueName}</div>
                        <div style={{ fontSize: '0.78rem' }}>{city}</div>
                      </div>
                    </div>

                    {/* Allocated Seats Badges */}
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div style={{ fontSize: '0.72rem', color: '#A78BFA', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.45rem', letterSpacing: '0.08em' }}>
                        Allocated Seats ({booking.priceSnapshot?.length || booking.seats?.length})
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {(booking.priceSnapshot || []).map((s, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              padding: '0.25rem 0.65rem',
                              borderRadius: '8px',
                              background:
                                s.category === 'VIP'
                                  ? 'rgba(139, 92, 246, 0.2)'
                                  : s.category === 'Premium'
                                  ? 'rgba(99, 102, 241, 0.2)'
                                  : 'rgba(56, 189, 248, 0.2)',
                              border: `1px solid ${
                                s.category === 'VIP'
                                  ? 'rgba(139, 92, 246, 0.4)'
                                  : s.category === 'Premium'
                                  ? 'rgba(99, 102, 241, 0.4)'
                                  : 'rgba(56, 189, 248, 0.4)'
                              }`,
                              color:
                                s.category === 'VIP'
                                  ? '#C4B5FD'
                                  : s.category === 'Premium'
                                  ? '#A5B4FC'
                                  : '#7DD3FC',
                            }}
                          >
                            {s.seatNumber} ({s.category})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Total Price & Action Buttons */}
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: '1rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Total Paid</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                          ₹{booking.total?.toFixed(2)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {isConfirmed && (
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={QrCode}
                            onClick={() => setActiveModalBooking(booking)}
                          >
                            QR Pass
                          </Button>
                        )}

                        {isConfirmed && (
                          <Button
                            variant="danger"
                            size="sm"
                            loading={cancellingId === booking._id}
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
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
            padding: '1.5rem',
            background: 'rgba(8, 7, 13, 0.85)',
            backdropFilter: 'blur(16px)',
          }}
          onClick={() => setActiveModalBooking(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '92vh',
              overflowY: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
              <button
                onClick={() => setActiveModalBooking(null)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
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
