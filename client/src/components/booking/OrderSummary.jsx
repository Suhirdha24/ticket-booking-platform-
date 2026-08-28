import React from 'react';
import { Calendar, MapPin, Ticket, ShieldCheck } from 'lucide-react';

export default function OrderSummary({ reservation, event, seats }) {
  const seatList = seats || reservation?.seats || [];
  const subtotal = seatList.reduce((sum, s) => sum + (s.price || 0), 0);
  const convenienceFee = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + convenienceFee) * 100) / 100;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <h3
        style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.85rem',
        }}
      >
        Order Summary
      </h3>

      {/* Event Details Snapshot */}
      <div>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {event?.title}
        </h4>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} color="#eab308" />
            <span>{formatDate(event?.date)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={14} color="#eab308" />
            <span>
              {event?.venue?.name || event?.venueName || 'Venue'}, {event?.city}
            </span>
          </div>
        </div>
      </div>

      {/* Reserved Seats List */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem',
        }}
      >
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-subtle)',
            marginBottom: '0.6rem',
          }}
        >
          RESERVED TICKETS ({seatList.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {seatList.map((seat) => (
            <div
              key={seat._id || seat.seatNumber}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ticket size={15} color="var(--text-muted)" />
                <span style={{ fontWeight: 600 }}>Seat {seat.seatNumber}</span>
                <span
                  className={`badge badge-${(seat.category || 'general').toLowerCase()}`}
                  style={{ fontSize: '0.65rem' }}
                >
                  {seat.category}
                </span>
              </div>
              <span style={{ fontWeight: 700 }}>₹{seat.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          fontSize: '0.9rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
          <span>Convenience & Processing Fee (5%)</span>
          <span>₹{convenienceFee.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: '#ffffff',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.75rem',
            marginTop: '0.25rem',
          }}
        >
          <span>Total Amount</span>
          <span style={{ color: '#34d399' }}>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Security Assurance */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-subtle)',
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '0.65rem',
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <ShieldCheck size={16} color="#34d399" />
        <span>256-bit encrypted checkout. Instant QR ticket delivery.</span>
      </div>
    </div>
  );
}
