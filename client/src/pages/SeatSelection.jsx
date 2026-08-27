import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/client.js';
import { useAuthStore } from '../store/authStore.js';
import { useReservationStore } from '../store/reservationStore.js';
import { showSuccessToast, showErrorToast, showWarningToast } from '../store/toastStore.js';
import SeatMap from '../components/seats/SeatMap.jsx';
import SeatLegend from '../components/seats/SeatLegend.jsx';
import ReservationTimer from '../components/seats/ReservationTimer.jsx';
import { SeatMapSkeleton } from '../components/common/Skeleton.jsx';
import { Calendar, MapPin, ArrowLeft, RefreshCw } from 'lucide-react';
import Button from '../components/common/Button.jsx';

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { createReservation, clearSelectedSeats, selectedSeats, activeReservation } =
    useReservationStore();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEventAndSeats = async () => {
    try {
      const [eventRes, seatsRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/seats`),
      ]);
      setEvent(eventRes.data.data);
      setSeats(seatsRes.data.data || []);
    } catch (err) {
      showErrorToast('Failed to load seating map', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventAndSeats();
  }, [id]);

  const handleLockReservation = async () => {
    if (!isAuthenticated) {
      showWarningToast('Authentication Required', 'Please log in to reserve your seats.');
      navigate(`/login?redirect=/event/${id}/seats`);
      return;
    }

    if (selectedSeats.length === 0) {
      showWarningToast('No Seats Selected', 'Please click on available seats to select them.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await createReservation(id);
      showSuccessToast(
        'Seats Locked!',
        'Your selected seats are held for 5 minutes. Proceeding to checkout.'
      );
      navigate(`/checkout/${data.reservationId}`);
    } catch (err) {
      if (err.code === 'SEAT_ALREADY_HELD' || err.status === 409) {
        showErrorToast(
          'Seat Conflict',
          'One or more of your selected seats were just claimed by another attendee. Please choose different seats.'
        );
        clearSelectedSeats();
        fetchEventAndSeats();
      } else {
        showErrorToast('Reservation Error', err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <SeatMapSkeleton />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Top Breadcrumb & Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <Link
            to={`/event/${id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              marginBottom: '0.5rem',
            }}
          >
            <ArrowLeft size={16} /> Back to Event Details
          </Link>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
            {event?.title}
          </h1>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              marginTop: '0.25rem',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} color="#818cf8" />
              {new Date(event?.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="#818cf8" />
              {event?.venue?.name}, {event?.city}
            </span>
          </div>
        </div>

        <button
          onClick={fetchEventAndSeats}
          className="btn btn-secondary"
          style={{ padding: '0.55rem 0.9rem', fontSize: '0.85rem' }}
        >
          <RefreshCw size={14} />
          <span>Refresh Availability</span>
        </button>
      </div>

      {/* 5-Min Timer If Active */}
      <ReservationTimer onExpire={fetchEventAndSeats} />

      {/* Legend */}
      <div style={{ marginBottom: '2.5rem' }}>
        <SeatLegend />
      </div>

      {/* Interactive Stadium Seat Map */}
      <SeatMap
        seats={seats}
        onLockReservation={handleLockReservation}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
