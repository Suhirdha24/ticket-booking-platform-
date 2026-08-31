import React from 'react';
import { Calendar, MapPin, Ticket, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
      className="glass-widget-card"
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        backgroundColor: 'rgba(20, 18, 34, 0.85)',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(139, 92, 246, 0.15)',
      }}
    >
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: '#FFFFFF',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1rem',
        }}
      >
        Order Summary
      </h3>

      {/* Event Details Snapshot */}
      <div>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3, marginBottom: '0.6rem' }}>
          {event?.title}
        </h4>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            fontSize: '0.88rem',
            color: '#CBD5E1',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A78BFA', fontWeight: 700 }}>
            <Calendar size={15} />
            <span>{formatDate(event?.date || event?.startDate)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8' }}>
            <MapPin size={15} color="#A78BFA" />
            <span>
              {event?.venue?.name || event?.venueName || 'Grand Arena'}, {event?.city || 'India'}
            </span>
          </div>
        </div>
      </div>

      {/* Reserved Seats List */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.1rem',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: '#A78BFA',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Reserved Passes ({seatList.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {seatList.map((seat) => {
            const isVip = seat.category === 'VIP';
            const isPrem = seat.category === 'Premium';
            const displayNum = seat.seatNumber.split('-')[1] || seat.seatNumber;

            return (
              <div
                key={seat._id || seat.seatNumber}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Ticket size={16} color="#A78BFA" />
                  <div>
                    <span style={{ fontWeight: 800, color: '#FFFFFF', fontSize: '0.88rem' }}>
                      Seat {seat.seatNumber}
                    </span>
                    <span
                      style={{
                        marginLeft: '0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                        background: isVip
                          ? 'rgba(139, 92, 246, 0.25)'
                          : isPrem
                          ? 'rgba(99, 102, 241, 0.25)'
                          : 'rgba(56, 189, 248, 0.25)',
                        color: isVip ? '#C4B5FD' : isPrem ? '#A5B4FC' : '#7DD3FC',
                      }}
                    >
                      {seat.category}
                    </span>
                  </div>
                </div>
                <span style={{ fontWeight: 900, color: '#FFFFFF', fontSize: '0.95rem' }}>
                  ₹{seat.price}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing Breakdown */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          fontSize: '0.92rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
          <span>Subtotal</span>
          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>₹{subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
          <span>Convenience & Processing Fee (5%)</span>
          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>₹{convenienceFee.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.35rem',
            fontWeight: 900,
            color: '#FFFFFF',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1rem',
            marginTop: '0.25rem',
          }}
        >
          <span>Total Amount</span>
          <span style={{ color: '#34D399' }}>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Security Assurance */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.78rem',
          color: '#94A3B8',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '0.85rem 1rem',
          borderRadius: '12px',
        }}
      >
        <ShieldCheck size={18} color="#34D399" style={{ flexShrink: 0 }} />
        <span>256-bit encrypted checkout. Instant QR ticket delivery.</span>
      </div>
    </div>
  );
}
