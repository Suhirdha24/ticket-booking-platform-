import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/client.js';
import { useAuthStore } from '../store/authStore.js';
import { useReservationStore } from '../store/reservationStore.js';
import { showSuccessToast, showErrorToast, showWarningToast } from '../store/toastStore.js';
import SeatMap from '../components/seats/SeatMap.jsx';
import SeatLegend from '../components/seats/SeatLegend.jsx';
import ReservationTimer from '../components/seats/ReservationTimer.jsx';
import { SeatMapSkeleton } from '../components/common/Skeleton.jsx';
import {
  Calendar,
  MapPin,
  ArrowLeft,
  RefreshCw,
  Ticket,
  ShieldCheck,
  ArrowRight,
  X,
  Clock,
  Crown,
  Sparkles,
  Layers,
  AlertCircle,
} from 'lucide-react';
import Button from '../components/common/Button.jsx';

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTier = searchParams.get('tier') || 'ALL';

  const { isAuthenticated } = useAuthStore();
  const { createReservation, clearSelectedSeats, selectedSeats, toggleSeatSelection, activeReservation } =
    useReservationStore();

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTier, setSelectedTier] = useState(initialTier);

  const fetchEventAndSeats = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const [eventRes, seatsRes] = await Promise.all([
        api.get(`/events/${id}`),
        api.get(`/events/${id}/seats`),
      ]);
      setEvent(eventRes.data.data?.event || eventRes.data.data);
      setSeats(seatsRes.data.data?.seats || seatsRes.data.data || []);
    } catch (err) {
      setFetchError(err.message || 'Failed to load seating map');
      showErrorToast('Failed to load seating map', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventAndSeats();
  }, [id]);

  useEffect(() => {
    const tierFromUrl = searchParams.get('tier');
    if (tierFromUrl) {
      setSelectedTier(tierFromUrl);
    }
  }, [searchParams]);

  const handleTierFilterChange = (tierName) => {
    setSelectedTier(tierName);
    if (tierName === 'ALL') {
      searchParams.delete('tier');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tier: tierName });
    }
  };

  const handleLockReservation = async () => {
    if (!isAuthenticated) {
      showWarningToast('Authentication Required', 'Please log in to reserve your seats.');
      navigate(`/login?redirect=/events/${id}/seats`);
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

  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <SeatMapSkeleton />
      </div>
    );
  }

  if (fetchError || !event) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '520px', margin: '0 auto' }}>
          <AlertCircle size={40} color="#fb7185" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#fb7185' }}>
            Unable to Load Seat Map
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {fetchError || 'Could not retrieve seating layout for this event.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button variant="primary" onClick={fetchEventAndSeats}>
              Retry Loading Seats
            </Button>
            <Link to={`/event/${id}`}>
              <Button variant="secondary">Back to Event</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter seats if a specific tier is selected
  const displayedSeats =
    selectedTier && selectedTier !== 'ALL'
      ? seats.filter((s) => s.category?.toUpperCase() === selectedTier.toUpperCase())
      : seats;

  // Extract unique tiers for filter pills
  const availableTiers = ['ALL', ...new Set(seats.map((s) => s.category).filter(Boolean))];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', paddingBottom: '6rem' }}>
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
              <Calendar size={14} color="#A78BFA" />
              {new Date(event?.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="#A78BFA" />
              {event?.venue?.name}, {event?.city}
            </span>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCw}
          onClick={fetchEventAndSeats}
        >
          Refresh Availability
        </Button>
      </div>

      {/* 5-Min Timer If Active */}
      <ReservationTimer onExpire={fetchEventAndSeats} />

      {/* Legend */}
      <div style={{ marginBottom: '3rem' }}>
        <SeatLegend />
      </div>

      {/* Tier Filter Pills Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          background: 'rgba(20, 18, 34, 0.85)',
          padding: '0.75rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 800, color: '#A78BFA', marginRight: '0.5rem' }}>
          <Layers size={16} /> View Tier:
        </div>
        {availableTiers.map((tierName) => {
          const isSelected = selectedTier === tierName;
          const tierSeats = tierName === 'ALL' ? seats : seats.filter((s) => s.category?.toUpperCase() === tierName.toUpperCase());
          const availableCount = tierSeats.filter((s) => s.status === 'AVAILABLE').length;

          return (
            <button
              key={tierName}
              type="button"
              onClick={() => handleTierFilterChange(tierName)}
              style={{
                background: isSelected
                  ? 'var(--gradient-purple)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '0.45rem 0.9rem',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 800 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease',
              }}
            >
              {tierName === 'VIP' && <Crown size={14} />}
              {tierName === 'Premium' && <Sparkles size={14} />}
              {tierName === 'General' && <Ticket size={14} />}
              <span>{tierName === 'ALL' ? 'All Sections' : `${tierName} Tier`}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  opacity: isSelected ? 0.85 : 0.6,
                  marginLeft: '2px',
                }}
              >
                ({availableCount} avail)
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Seat Map Area + Floating Sticky Checkout Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '2.5rem',
          alignItems: 'start',
        }}
        className="seat-selection-layout"
      >
        {/* Interactive Stadium / Hall Seating Grid */}
        <div className="glass-panel" style={{ padding: '2rem 1.5rem', minHeight: '600px', backgroundColor: 'rgba(20, 18, 34, 0.75)' }}>
          <SeatMap
            seats={displayedSeats}
            selectedTier={selectedTier}
          />
        </div>

        {/* Sticky Sidebar: Order Summary & 5-Min Lock CTA */}
        <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            className="glass-panel"
            style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(20, 18, 34, 0.85)',
              borderColor: selectedSeats.length > 0 ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.08)',
              boxShadow: selectedSeats.length > 0 ? '0 15px 35px -5px rgba(0, 0, 0, 0.6), 0 0 25px -5px rgba(139, 92, 246, 0.3)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ticket size={20} color="#A78BFA" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  Selected Seats
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.6rem',
                  borderRadius: '9999px',
                  background: selectedSeats.length > 0 ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                }}
              >
                {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
              </span>
            </div>

            {/* Empty State vs Selected Seats List */}
            {selectedSeats.length === 0 ? (
              <div
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  margin: '1.25rem 0',
                }}
              >
                <Ticket size={32} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto', opacity: 0.6 }} />
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                  No seats selected yet
                </p>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Click on any available seat in the map
                </span>
              </div>
            ) : (
              <div
                style={{
                  margin: '1.25rem 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  paddingRight: '4px',
                }}
              >
                {selectedSeats.map((seat) => {
                  const displayNum = seat.seatNumber.split('-')[1] || seat.seatNumber;
                  const isVip = seat.category === 'VIP';
                  const isPrem = seat.category === 'Premium';

                  return (
                    <div
                      key={seat._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.7rem 0.95rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: '12px',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            background: isVip
                              ? 'rgba(139, 92, 246, 0.25)'
                              : isPrem
                              ? 'rgba(99, 102, 241, 0.25)'
                              : 'rgba(56, 189, 248, 0.25)',
                            color: isVip ? '#C4B5FD' : isPrem ? '#A5B4FC' : '#7DD3FC',
                            border: `1px solid ${
                              isVip
                                ? 'rgba(139, 92, 246, 0.5)'
                                : isPrem
                                ? 'rgba(99, 102, 241, 0.5)'
                                : 'rgba(56, 189, 248, 0.5)'
                            }`,
                          }}
                        >
                          {seat.category}
                        </span>
                        <div>
                          <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>
                            Row {seat.row} &bull; Seat {displayNum}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            {seat.section}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '0.95rem' }}>
                          ₹{seat.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSeatSelection(seat)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '6px',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                          }}
                          title="Remove seat"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Subtotal & Lock Button */}
            {selectedSeats.length > 0 && (
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.6rem',
                    fontWeight: 900,
                    color: '#ffffff',
                  }}
                >
                  ₹{subtotal}
                </div>
              </div>
            )}

            {/* 5-Min Lock Guarantee Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                fontSize: '0.8rem',
                color: '#CBD5E1',
                background: 'rgba(139, 92, 246, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '0.75rem 0.95rem',
                borderRadius: '12px',
              }}
            >
              <Clock size={16} color="#A78BFA" style={{ flexShrink: 0 }} />
              <span>Seats are locked exclusively for you for 5 minutes during checkout</span>
            </div>

            {/* Checkout Action Button */}
            <Button
              variant="primary"
              size="lg"
              loading={isSubmitting}
              disabled={selectedSeats.length === 0}
              onClick={handleLockReservation}
              icon={ArrowRight}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
              }}
            >
              {selectedSeats.length > 0
                ? `Lock Seats & Pay (₹${subtotal})`
                : 'Select Seats on Map'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
