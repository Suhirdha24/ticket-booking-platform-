import React, { useState } from 'react';
import { useReservationStore } from '../../store/reservationStore.js';
import { showSuccessToast, showWarningToast } from '../../store/toastStore.js';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Lock, Clock, Info } from 'lucide-react';
import Button from '../common/Button.jsx';

export default function SeatMap({ seats, onLockReservation, isSubmitting }) {
  const { selectedSeats, toggleSeatSelection } = useReservationStore();
  const [hoveredSeat, setHoveredSeat] = useState(null);

  // Group seats by Section and then by Row
  const sectionMap = {};
  seats.forEach((seat) => {
    if (!sectionMap[seat.section]) {
      sectionMap[seat.section] = {
        name: seat.section,
        category: seat.category,
        price: seat.price,
        rows: {},
      };
    }
    if (!sectionMap[seat.section].rows[seat.row]) {
      sectionMap[seat.section].rows[seat.row] = [];
    }
    sectionMap[seat.section].rows[seat.row].push(seat);
  });

  if (!seats || seats.length === 0) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
        <Sparkles size={36} color="#8B5CF6" style={{ margin: '0 auto 1rem auto', opacity: 0.8 }} />
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
          No Seats in this View
        </h4>
        <p style={{ fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto' }}>
          Select &ldquo;All Sections&rdquo; in the tier filter above to view the full stadium seating map.
        </p>
      </div>
    );
  }

  const isSelected = (seat) => selectedSeats.some((s) => s._id === seat._id);

  const handleSeatClick = (seat) => {
    if (seat.status === 'BOOKED' || seat.status === 'OCCUPIED') {
      showWarningToast('Seat Unavailable', `Seat ${seat.seatNumber} is already booked and sold out.`);
      return;
    }

    if (seat.status === 'HELD' && !seat.isHeldByCurrentUser) {
      showWarningToast('Seat Locked', `Seat ${seat.seatNumber} is currently held by another user in checkout.`);
      return;
    }

    const alreadySelected = isSelected(seat);
    toggleSeatSelection(seat);

    if (alreadySelected) {
      showSuccessToast('Seat Deselected', `Removed ${seat.category} seat ${seat.seatNumber}`);
    } else {
      showSuccessToast(
        'Seat Selected! 🎉',
        `Added ${seat.category} seat ${seat.seatNumber} (₹${seat.price}). Checkout on the right.`
      );
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Stadium / Theatre Stage Indicator with Electric Purple Glow */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            width: '75%',
            maxWidth: '650px',
            height: '14px',
            background: 'linear-gradient(90deg, transparent 0%, #8B5CF6 50%, transparent 100%)',
            borderRadius: '100px 100px 0 0',
            boxShadow: '0 -10px 30px rgba(139, 92, 246, 0.8)',
            marginBottom: '0.75rem',
          }}
        />
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#A78BFA',
          }}
        >
          STAGE / PERFORMANCE AREA
        </div>

        {/* Live Interactive Seat Hover / Status Bar */}
        <div
          style={{
            marginTop: '1rem',
            minHeight: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {hoveredSeat ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.4rem 1rem',
                borderRadius: 'var(--radius-pill)',
                background: isSelected(hoveredSeat)
                  ? 'rgba(139, 92, 246, 0.3)'
                  : hoveredSeat.status === 'AVAILABLE'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${
                  isSelected(hoveredSeat)
                    ? '#8B5CF6'
                    : hoveredSeat.status === 'AVAILABLE'
                    ? '#10B981'
                    : '#EF4444'
                }`,
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#FFFFFF',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              {isSelected(hoveredSeat) ? (
                <>
                  <CheckCircle2 size={16} color="#A78BFA" />
                  <span>
                    <strong>{hoveredSeat.category} Tier</strong> • Row {hoveredSeat.row}, Seat{' '}
                    {hoveredSeat.seatNumber.split('-')[1] || hoveredSeat.seatNumber} • ₹{hoveredSeat.price}{' '}
                    <span style={{ color: '#C4B5FD' }}>(SELECTED - Click to remove)</span>
                  </span>
                </>
              ) : hoveredSeat.status === 'AVAILABLE' ? (
                <>
                  <Sparkles size={16} color="#34D399" />
                  <span>
                    <strong>{hoveredSeat.category} Tier</strong> • Row {hoveredSeat.row}, Seat{' '}
                    {hoveredSeat.seatNumber.split('-')[1] || hoveredSeat.seatNumber} • ₹{hoveredSeat.price}{' '}
                    <span style={{ color: '#6EE7B7' }}>(AVAILABLE - Click to Select)</span>
                  </span>
                </>
              ) : hoveredSeat.status === 'HELD' ? (
                <>
                  <Clock size={16} color="#FBBF24" />
                  <span>
                    <strong>{hoveredSeat.category} Tier</strong> • Row {hoveredSeat.row}, Seat{' '}
                    {hoveredSeat.seatNumber.split('-')[1] || hoveredSeat.seatNumber} •{' '}
                    <span style={{ color: '#FCD34D' }}>(HELD in Checkout)</span>
                  </span>
                </>
              ) : (
                <>
                  <Lock size={16} color="#F87171" />
                  <span>
                    <strong>{hoveredSeat.category} Tier</strong> • Row {hoveredSeat.row}, Seat{' '}
                    {hoveredSeat.seatNumber.split('-')[1] || hoveredSeat.seatNumber} •{' '}
                    <span style={{ color: '#FCA5A5' }}>(BOOKED / SOLD OUT)</span>
                  </span>
                </>
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                color: '#94A3B8',
              }}
            >
              <Info size={14} color="#A78BFA" />
              <span>Hover over or click any seat below to select or view status</span>
            </div>
          )}
        </div>
      </div>

      {/* Seat Map Sections Grid */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          alignItems: 'center',
          overflowX: 'auto',
          paddingBottom: '2rem',
        }}
      >
        {Object.values(sectionMap).map((sec) => (
          <div
            key={sec.name}
            className="glass-widget-card"
            style={{
              padding: '1.75rem',
              width: '100%',
              maxWidth: '920px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(20, 18, 34, 0.75)',
            }}
          >
            {/* Section Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: '1.25rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {sec.name}
                </span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-pill)',
                    background:
                      sec.category === 'VIP'
                        ? 'rgba(139, 92, 246, 0.25)'
                        : sec.category === 'Premium'
                        ? 'rgba(99, 102, 241, 0.25)'
                        : 'rgba(56, 189, 248, 0.25)',
                    color:
                      sec.category === 'VIP'
                        ? '#C4B5FD'
                        : sec.category === 'Premium'
                        ? '#A5B4FC'
                        : '#7DD3FC',
                    border: `1px solid ${
                      sec.category === 'VIP'
                        ? 'rgba(139, 92, 246, 0.5)'
                        : sec.category === 'Premium'
                        ? 'rgba(99, 102, 241, 0.5)'
                        : 'rgba(56, 189, 248, 0.5)'
                    }`,
                  }}
                >
                  {sec.category}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#ffffff',
                }}
              >
                ₹{sec.price}
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginLeft: '4px' }}>
                  / seat
                </span>
              </div>
            </div>

            {/* Rows Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                alignItems: 'center',
                width: '100%',
              }}
            >
              {Object.keys(sec.rows)
                .sort()
                .map((rowKey) => {
                  const rowSeats = sec.rows[rowKey].sort((a, b) =>
                    a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true })
                  );

                  return (
                    <div
                      key={rowKey}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                      }}
                    >
                      {/* Row Label Left */}
                      <span
                        style={{
                          width: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#94A3B8',
                          textAlign: 'center',
                        }}
                      >
                        {rowKey}
                      </span>

                      {/* Row Seats */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {rowSeats.map((seat) => {
                          const selected = isSelected(seat);
                          const isHeld = seat.status === 'HELD';
                          const isBooked = seat.status === 'BOOKED' || seat.status === 'OCCUPIED';

                          let nodeClass = `seat-node ${seat.status} category-${seat.category}`;
                          if (selected) nodeClass = 'seat-node SELECTED';
                          if (seat.isHeldByCurrentUser) nodeClass = 'seat-node HELD_BY_ME';

                          const seatDisplayNumber = seat.seatNumber.split('-')[1] || seat.seatNumber;

                          return (
                            <div
                              key={seat._id}
                              className={nodeClass}
                              onClick={() => handleSeatClick(seat)}
                              onMouseEnter={() => setHoveredSeat(seat)}
                              onMouseLeave={() => setHoveredSeat(null)}
                              title={`${seat.section} • Row ${seat.row}, Seat ${seatDisplayNumber} • ₹${
                                seat.price
                              } (${selected ? 'Selected' : seat.status})`}
                            >
                              {seatDisplayNumber.replace(/^[A-Z]+/, '')}
                            </div>
                          );
                        })}
                      </div>

                      {/* Row Label Right */}
                      <span
                        style={{
                          width: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#94A3B8',
                          textAlign: 'center',
                        }}
                      >
                        {rowKey}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
