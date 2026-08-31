import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../api/client.js';
import TicketCard from '../components/booking/TicketCard.jsx';
import Button from '../components/common/Button.jsx';
import { CheckCircle2, ArrowRight, Sparkles, Layers } from 'lucide-react';

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
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="soundwave-bar" style={{ height: '30px', margin: '0 auto 1.5rem auto' }} />
        <p style={{ color: '#94A3B8', fontSize: '1rem', fontWeight: 600 }}>Loading confirmed ticket pass...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', paddingBottom: '6rem' }}>
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.18)',
            border: '2px solid rgba(16, 185, 129, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
            animation: 'fadeIn 0.4s ease',
          }}
        >
          <CheckCircle2 size={38} color="#34D399" />
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, marginBottom: '0.6rem', color: '#FFFFFF' }}>
          Booking Confirmed! 🎉
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '1rem', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
          Your digital access pass is locked in. Save or print your pass and present the QR code at the venue gate for instant admission.
        </p>
      </div>

      {/* Ticket Card with QR Code */}
      <div style={{ marginBottom: '3rem' }}>
        <TicketCard booking={booking} isNew={isNew} />
      </div>

      {/* Footer Navigation Buttons */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          flexWrap: 'wrap',
        }}
      >
        <Link to="/my-bookings" style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="md" icon={Layers}>
            View All My Bookings
          </Button>
        </Link>
        <Link to="/events" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md" icon={ArrowRight}>
            Explore More Events
          </Button>
        </Link>
      </div>
    </div>
  );
}
