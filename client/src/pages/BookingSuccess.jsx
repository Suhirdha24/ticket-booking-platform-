import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../api/client.js';
import TicketCard from '../components/booking/TicketCard.jsx';
import Button from '../components/common/Button.jsx';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function BookingSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const isNew = location.state?.isNew ?? true;

  useEffect(() => {
    if (!booking) {
      async function loadBooking() {
        try {
          const res = await api.get(`/bookings/${id}`);
          setBooking(res.data.data);
        } catch (err) {
          console.error('Failed to load booking:', err);
        } finally {
          setLoading(false);
        }
      }
      loadBooking();
    }
  }, [id, booking]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '380px', maxWidth: '680px', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', paddingBottom: '6rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '2px solid rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)',
          }}
        >
          <CheckCircle2 size={36} color="#34d399" />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          Booking Confirmed!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto' }}>
          Your digital pass has been generated. Save or print your ticket and present the QR code at the venue gate.
        </p>
      </div>

      {/* Ticket Card with QR Code */}
      <div style={{ marginBottom: '3rem' }}>
        <TicketCard booking={booking} isNew={isNew} />
      </div>

      {/* Footer Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <Link to="/my-bookings">
          <Button variant="secondary" size="md">
            View All My Bookings
          </Button>
        </Link>
        <Link to="/events">
          <Button variant="primary" size="md" icon={ArrowRight}>
            Explore More Events
          </Button>
        </Link>
      </div>
    </div>
  );
}
