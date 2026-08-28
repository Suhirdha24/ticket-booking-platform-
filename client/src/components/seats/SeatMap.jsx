import React, { useState } from 'react';
import { useReservationStore } from '../../store/reservationStore.js';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
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
        <Sparkles size={36} color="#eab308" style={{ margin: '0 auto 1rem auto', opacity: 0.8 }} />
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

  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Stadium / Theatre Stage Indicator */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '3rem',
        }}
      >
        <div
          style={{
            width: '70%',
            maxWidth: '650px',
            height: '14px',
            background: 'linear-gradient(90deg, transparent 0%, #eab308 50%, transparent 100%)',
            borderRadius: '100px 100px 0 0',
            boxShadow: '0 -10px 25px rgba(234, 179, 8, 0.6)',
            marginBottom: '0.75rem',
          }}
        />
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: '#eab308',
          }}
        >
          STAGE / PERFORMANCE AREA
        </div>
      </div>

      {/* Seat Map Sections Grid */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem',
          alignItems: 'center',
          overflowX: 'auto',
          paddingBottom: '6rem',
        }}
      >
        {Object.values(sectionMap).map((sec) => (
          <div
            key={sec.name}
            className="glass-panel"
            style={{
              padding: '1.75rem',
              width: '100%',
              maxWidth: '920px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'rgba(18, 20, 31, 0.6)',
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
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>
                  {sec.name}
                </span>
                <span
                  className={`badge badge-${sec.category.toLowerCase()}`}
                  style={{ fontSize: '0.7rem' }}
                >
                  {sec.category}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                ₹{sec.price}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginLeft: '4px' }}>
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
                          color: 'var(--text-subtle)',
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
                          const isBooked = seat.status === 'BOOKED';

                          let nodeClass = `seat-node ${seat.status} category-${seat.category}`;
                          if (selected) nodeClass = 'seat-node SELECTED';
                          if (seat.isHeldByCurrentUser) nodeClass = 'seat-node HELD_BY_ME';

                          const seatDisplayNumber = seat.seatNumber.split('-')[1] || seat.seatNumber;

                          return (
                            <div
                              key={seat._id}
                              className={nodeClass}
                              onClick={() => {
                                if (seat.status === 'AVAILABLE') {
                                  toggleSeatSelection(seat);
                                }
                              }}
                              onMouseEnter={() => setHoveredSeat(seat)}
                              onMouseLeave={() => setHoveredSeat(null)}
                              title={`${seat.section} • Row ${seat.row}, Seat ${seatDisplayNumber} • ₹${seat.price} (${selected ? 'Selected' : seat.status})`}
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
                          color: 'var(--text-subtle)',
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
