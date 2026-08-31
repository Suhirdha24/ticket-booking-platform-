import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client.js';
import { useReservationStore } from '../store/reservationStore.js';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import OrderSummary from '../components/booking/OrderSummary.jsx';
import PaymentForm from '../components/booking/PaymentForm.jsx';
import ReservationTimer from '../components/seats/ReservationTimer.jsx';
import { ArrowLeft, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export default function Checkout() {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { fetchReservation, activeReservation, clearReservation } =
    useReservationStore();

  const [reservationData, setReservationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchReservation(reservationId);
        if (!res || res.status === 'EXPIRED') {
          setIsExpired(true);
        } else {
          setReservationData(res);
        }
      } catch (err) {
        setIsExpired(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [reservationId]);

  const handlePaymentSubmit = async ({
    paymentMethod,
    paymentDetails,
    simulateFailure,
  }) => {
    setIsProcessing(true);
    try {
      const res = await api.post('/bookings', {
        reservationId,
        paymentMethod,
        paymentDetails,
        simulateFailure,
      });

      const booking = res.data.data;
      clearReservation();
      showSuccessToast(
        'Booking Confirmed!',
        `Your tickets have been confirmed with reference: ${booking.bookingReference}`
      );
      navigate(`/success/${booking._id}`, { state: { booking, isNew: true } });
    } catch (err) {
      if (err.code === 'RESERVATION_EXPIRED') {
        setIsExpired(true);
        showErrorToast(
          'Reservation Expired',
          'Your 5-minute hold on these seats has expired. Please select seats again.'
        );
      } else {
        showErrorToast('Payment Failed', err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="soundwave-bar" style={{ height: '30px', margin: '0 auto 1.5rem auto' }} />
        <p style={{ color: '#94A3B8', fontSize: '1rem', fontWeight: 600 }}>Securing 5-minute seat lock & payment portal...</p>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div
          className="glass-widget-card"
          style={{ padding: '3.5rem 2rem', maxWidth: '540px', margin: '0 auto', textAlign: 'center' }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.18)',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              boxShadow: '0 0 25px rgba(239, 68, 68, 0.35)',
            }}
          >
            <Clock size={32} color="#F87171" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
            Reservation Hold Expired
          </h2>
          <p style={{ color: '#94A3B8', lineHeight: 1.6, marginBottom: '2rem', fontSize: '0.92rem' }}>
            The 5-minute temporary lock on your selected seats has expired and the seats have been released back to general availability.
          </p>
          <Link to="/events" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">
              Choose Another Event / Seats
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const seats = reservationData?.seats || [];
  const subtotal = seats.reduce((sum, s) => sum + (s.price || 0), 0);
  const fee = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + fee;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '6rem', position: 'relative' }}>
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '750px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to={`/events/${reservationData?.event?._id || ''}/seats`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#94A3B8',
              fontSize: '0.9rem',
              fontWeight: 700,
              textDecoration: 'none',
              marginBottom: '0.75rem',
              transition: 'color 0.2s ease',
            }}
          >
            <ArrowLeft size={16} color="#A78BFA" />
            <span>Back to Stadium Seat Map</span>
          </Link>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, color: '#FFFFFF' }}>
            Checkout & Secure Payment 🔒
          </h1>
        </div>

        {/* 5-Minute Countdown Lock */}
        <div style={{ marginBottom: '2rem' }}>
          <ReservationTimer onExpire={() => setIsExpired(true)} />
        </div>

        {/* Checkout Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Left Col: Order Summary */}
          <div>
            <OrderSummary
              reservation={reservationData}
              event={reservationData?.event}
              seats={seats}
            />
          </div>

          {/* Right Col: Payment Form */}
          <div>
            <PaymentForm
              total={total}
              onSubmit={handlePaymentSubmit}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
