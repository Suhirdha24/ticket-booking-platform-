import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client.js';
import { useReservationStore } from '../store/reservationStore.js';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import OrderSummary from '../components/booking/OrderSummary.jsx';
import PaymentForm from '../components/booking/PaymentForm.jsx';
import ReservationTimer from '../components/seats/ReservationTimer.jsx';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
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
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '300px', maxWidth: '700px', margin: '0 auto' }} />
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem 2rem', maxWidth: '540px', margin: '0 auto' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
            }}
          >
            <Clock size={30} color="#fb7185" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Reservation Hold Expired
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            The 5-minute temporary lock on your selected seats has expired and the seats have been released back to general availability.
          </p>
          <Link to="/events">
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
    <div className="container" style={{ padding: '2.5rem 1.5rem', paddingBottom: '5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={`/event/${reservationData?.event?._id || ''}/seats`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginBottom: '0.5rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Seat Map
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>
          Checkout & Payment
        </h1>
      </div>

      {/* 5-Minute Countdown Lock */}
      <ReservationTimer onExpire={() => setIsExpired(true)} />

      {/* Checkout Columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
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
  );
}
