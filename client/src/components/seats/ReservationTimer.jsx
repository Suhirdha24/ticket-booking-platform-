import React, { useEffect } from 'react';
import { useReservationStore } from '../../store/reservationStore.js';
import { Clock, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function ReservationTimer({ onExpire }) {
  const { remainingSeconds, tick, activeReservation } = useReservationStore();

  useEffect(() => {
    if (!activeReservation || remainingSeconds <= 0) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [activeReservation, remainingSeconds, tick]);

  useEffect(() => {
    if (activeReservation && remainingSeconds === 0 && onExpire) {
      onExpire();
    }
  }, [remainingSeconds, activeReservation, onExpire]);

  if (!activeReservation || remainingSeconds <= 0) return null;

  const m = Math.floor(remainingSeconds / 60);
  const s = remainingSeconds % 60;
  const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  const isUrgent = remainingSeconds < 60;
  // Total 5 minutes = 300 seconds
  const progressPercent = Math.min(100, Math.max(0, (remainingSeconds / 300) * 100));

  return (
    <div
      className="glass-widget-card"
      style={{
        padding: '1rem 1.4rem',
        borderRadius: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        border: isUrgent
          ? '1.5px solid rgba(244, 63, 94, 0.6)'
          : '1px solid rgba(139, 92, 246, 0.4)',
        background: isUrgent
          ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(20, 18, 34, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(20, 18, 34, 0.9) 100%)',
        boxShadow: isUrgent
          ? '0 0 25px rgba(244, 63, 94, 0.35)'
          : '0 0 20px rgba(139, 92, 246, 0.2)',
        marginBottom: '1.5rem',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: isUrgent ? 'rgba(244, 63, 94, 0.2)' : 'rgba(139, 92, 246, 0.2)',
              border: isUrgent ? '1px solid #F43F5E' : '1px solid #8B5CF6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isUrgent ? (
              <AlertTriangle size={18} color="#F43F5E" />
            ) : (
              <Clock size={18} color="#A78BFA" />
            )}
          </div>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
              {isUrgent
                ? 'Hurry! Your 5-Minute Seat Hold is Expiring'
                : 'Seats Temporarily Reserved & Locked for You'}
            </div>
            <div style={{ fontSize: '0.74rem', color: isUrgent ? '#FDA4AF' : '#94A3B8' }}>
              {isUrgent
                ? 'Complete your payment before time runs out to secure your booking.'
                : 'No other attendee can book these seats while your timer is active.'}
            </div>
          </div>
        </div>

        {/* Big Digital Countdown Timer Badge */}
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '1.45rem',
            fontWeight: 900,
            color: isUrgent ? '#F43F5E' : '#FFFFFF',
            background: 'rgba(8, 7, 13, 0.75)',
            border: isUrgent ? '1.5px solid #F43F5E' : '1px solid rgba(255, 255, 255, 0.12)',
            padding: '0.35rem 0.95rem',
            borderRadius: '12px',
            letterSpacing: '0.08em',
            boxShadow: isUrgent ? '0 0 15px rgba(244, 63, 94, 0.5)' : 'none',
          }}
        >
          {timeFormatted}
        </div>
      </div>

      {/* Mini Progress Bar showing remaining hold time */}
      <div
        style={{
          width: '100%',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginTop: '0.2rem',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: isUrgent
              ? 'linear-gradient(90deg, #F43F5E 0%, #FB7185 100%)'
              : 'var(--gradient-purple)',
            borderRadius: '9999px',
            transition: 'width 1s linear',
          }}
        />
      </div>
    </div>
  );
}
