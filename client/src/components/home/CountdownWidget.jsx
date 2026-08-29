import React, { useState, useEffect } from 'react';

export default function CountdownWidget({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 27,
    hours: 14,
    minutes: 36,
    seconds: 52,
  });

  useEffect(() => {
    // Default festival target: 27 days ahead
    const target = targetDate || new Date(Date.now() + 27 * 24 * 60 * 60 * 1000 + 14 * 3600 * 1000 + 36 * 60000 + 52000);

    const updateTimer = () => {
      const diff = Math.max(0, target - new Date());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: d,
        hours: h,
        minutes: m,
        seconds: s,
      });
    };

    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div
      className="glass-widget-card"
      style={{
        padding: '1.25rem 1.6rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '0.65rem',
      }}
    >
      <div
        style={{
          fontSize: '0.75rem',
          fontWeight: 900,
          color: '#A78BFA',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        Festival Starts In
      </div>

      <div className="countdown-grid">
        <div className="countdown-box">
          <div className="countdown-number">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="countdown-label">Days</div>
        </div>

        <div className="countdown-divider"></div>

        <div className="countdown-box">
          <div className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="countdown-label">Hours</div>
        </div>

        <div className="countdown-divider"></div>

        <div className="countdown-box">
          <div className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="countdown-label">Minutes</div>
        </div>

        <div className="countdown-divider"></div>

        <div className="countdown-box">
          <div className="countdown-number" style={{ color: '#A78BFA' }}>
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="countdown-label">Seconds</div>
        </div>
      </div>
    </div>
  );
}
