import React, { useEffect } from 'react';
import { useReservationStore } from '../../store/reservationStore.js';
import { Clock, AlertTriangle } from 'lucide-react';

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

  return (
    <div
      className={`glass-panel animate-fade-in ${isUrgent ? 'timer-warning' : ''}`}
      style={{
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: isUrgent ? 'rgba(244, 63, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)',
        background: isUrgent ? 'rgba(244, 63, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        marginBottom: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {isUrgent ? (
          <AlertTriangle size={18} color="#fb7185" />
        ) : (
          <Clock size={18} color="#fbbf24" />
        )}
        <div>
          <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
            {isUrgent
              ? 'Hurry! Reservation hold is about to expire:'
              : 'Your seats are locked for the next:'}
          </span>
        </div>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.25rem',
          fontWeight: 800,
          color: isUrgent ? '#fb7185' : '#fbbf24',
          letterSpacing: '0.05em',
        }}
      >
        {timeFormatted}
      </div>
    </div>
  );
}
