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
              <Calendar size={14} color="#eab308" />
              {new Date(event?.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="#eab308" />
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
          background: 'rgba(14, 17, 24, 0.8)',
          padding: '0.75rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(234, 179, 8, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#eab308', marginRight: '0.5rem' }}>
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
                  ? 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                color: isSelected ? '#000000' : '#e2e8f0',
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
        <div className="glass-panel" style={{ padding: '2rem 1.5rem', minHeight: '600px' }}>
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
              borderColor: selectedSeats.length > 0 ? 'rgba(234, 179, 8, 0.4)' : 'var(--border-subtle)',
              boxShadow: selectedSeats.length > 0 ? '0 15px 35px -5px rgba(0, 0, 0, 0.6), 0 0 25px -5px rgba(234, 179, 8, 0.2)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ticket size={20} color="#eab308" />
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
                  background: selectedSeats.length > 0 ? 'linear-gradient(135deg, #eab308, #f59e0b)' : 'rgba(255, 255, 255, 0.08)',
                  color: selectedSeats.length > 0 ? '#000000' : '#ffffff',
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
                  border: '1px dashed var(--border-subtle)',
                }}
              >
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  Click any available seat on the stadium map to add it to your order.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {selectedSeats.map((seat) => (
                  <div
                    key={seat._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                        {seat.seatNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        {seat.section} &bull; Row {seat.row}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 800, color: '#eab308', fontSize: '0.95rem' }}>
                        ₹{seat.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleSeatSelection(seat)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#fb7185',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          borderRadius: '4px',
                        }}
                        title="Remove seat"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Price Calculation */}
            {selectedSeats.length > 0 && (
              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Estimated Total
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    (Taxes & fees calculated at checkout)
                  </div>
                </div>
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
                gap: '0.5rem',
                fontSize: '0.78rem',
                color: 'var(--text-subtle)',
                background: 'rgba(234, 179, 8, 0.08)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Clock size={15} color="#eab308" style={{ flexShrink: 0 }} />
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
