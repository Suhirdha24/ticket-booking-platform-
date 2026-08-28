import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import TicketCard from '../components/booking/TicketCard.jsx';
import Modal from '../components/common/Modal.jsx';
import Button from '../components/common/Button.jsx';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import {
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Frown,
} from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.data || []);
    } catch (err) {
      showErrorToast('Failed to load bookings', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!cancelModalBooking) return;
    setIsCancelling(true);
    try {
      await api.post(`/bookings/${cancelModalBooking._id}/cancel`);
      showSuccessToast(
        'Booking Cancelled',
        'Your tickets have been cancelled and refund initiated.'
      );
      setCancelModalBooking(null);
      fetchBookings();
    } catch (err) {
      showErrorToast('Cancellation Failed', err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) =>
      b.bookingStatus === 'CONFIRMED' &&
      new Date(b.eventSnapshot?.date || b.event?.date || now) >= now
  );
  const pastBookings = bookings.filter(
    (b) =>
      b.bookingStatus === 'CANCELLED' ||
      new Date(b.eventSnapshot?.date || b.event?.date || now) < now
  );

  const displayedList = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          My Booked Passes
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Manage your active event tickets, view digital gate passes, or handle cancellations.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.75rem',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'upcoming' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'upcoming' ? '#ffffff' : 'var(--text-muted)',
            fontSize: '1rem',
            fontWeight: 700,
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Calendar size={18} />
          <span>Upcoming Events ({upcomingBookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'past' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'past' ? '#ffffff' : 'var(--text-muted)',
            fontSize: '1rem',
            fontWeight: 700,
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Clock size={18} />
          <span>Past & Cancelled ({pastBookings.length})</span>
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : displayedList.length === 0 ? (
        <div
          className="glass-panel"
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Frown size={42} color="var(--text-subtle)" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
            {activeTab === 'upcoming'
              ? 'No Upcoming Events'
              : 'No Past or Cancelled Bookings'}
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.95rem' }}>
            {activeTab === 'upcoming'
              ? 'You do not have any active upcoming event bookings. Browse our live events and grab your seats!'
              : 'You have no historical or cancelled bookings.'}
          </p>
          {activeTab === 'upcoming' && (
            <Link to="/events">
              <Button variant="primary" size="md" icon={ArrowRight}>
                Explore Live Events
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {displayedList.map((booking) => {
            const isConfirmed = booking.bookingStatus === 'CONFIRMED';
            const eventDate = new Date(booking.eventSnapshot?.date || booking.createdAt);

            return (
              <div
                key={booking._id}
                className="glass-panel"
                style={{
                  padding: '1.5rem 1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  borderColor: isConfirmed
                    ? 'var(--border-subtle)'
                    : 'rgba(244, 63, 94, 0.25)',
                }}
              >
                {/* Left side: Reference & Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        color: '#eab308',
                      }}
                    >
                      {booking.bookingReference}
                    </span>
                    <span
                      className={`badge ${
                        isConfirmed ? 'badge-success' : 'badge-danger'
                      }`}
                      style={{ fontSize: '0.68rem' }}
                    >
                      {booking.bookingStatus}
                    </span>
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                      {booking.eventSnapshot?.category || 'Event'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                    {booking.eventSnapshot?.title}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Calendar size={14} color="#eab308" />
                      {eventDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>&bull;</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} color="#eab308" />
                      {booking.venueSnapshot?.name || 'Venue'}, {booking.venueSnapshot?.city}
                    </span>
                    <span>&bull;</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Ticket size={14} color="#eab308" />
                      {booking.priceSnapshot?.length || booking.seats?.length} Seats
                    </span>
                  </div>
                </div>

                {/* Right side: Amount & Actions */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ textAlign: 'right', marginRight: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      Total Paid
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: isConfirmed ? '#ffffff' : 'var(--text-subtle)',
                        textDecoration: isConfirmed ? 'none' : 'line-through',
                      }}
                    >
                      ₹{booking.total?.toFixed(2)}
                    </div>
                  </div>

                  {/* View Ticket Action */}
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={QrCode}
                    onClick={() => setSelectedTicket(booking)}
                  >
                    View E-Ticket
                  </Button>

                  {/* Cancel Button (if active confirmed) */}
                  {isConfirmed && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setCancelModalBooking(booking)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <Modal
          isOpen={Boolean(selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          title="Digital Ticket Pass"
          maxWidth="720px"
        >
          <TicketCard booking={selectedTicket} />
        </Modal>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalBooking && (
        <Modal
          isOpen={Boolean(cancelModalBooking)}
          onClose={() => setCancelModalBooking(null)}
          title="Confirm Booking Cancellation"
          maxWidth="500px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <AlertTriangle size={24} color="#fb7185" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.88rem', color: '#fb7185', lineHeight: 1.4 }}>
                Are you sure you want to cancel this booking ({cancelModalBooking.bookingReference})? Your reserved seats will be immediately released.
              </p>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <div>Event: <strong style={{ color: '#ffffff' }}>{cancelModalBooking.eventSnapshot?.title}</strong></div>
              <div>Refund Amount: <strong style={{ color: '#34d399' }}>₹{cancelModalBooking.total?.toFixed(2)}</strong></div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-subtle)' }}>
                * Refund policy requires cancellation at least 24 hours prior to event start.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="ghost"
                onClick={() => setCancelModalBooking(null)}
                disabled={isCancelling}
              >
                Keep Booking
              </Button>
              <Button
                variant="danger"
                onClick={handleCancelBooking}
                loading={isCancelling}
              >
                Confirm Cancellation & Refund
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
