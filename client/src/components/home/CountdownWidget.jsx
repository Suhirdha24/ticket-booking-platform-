import React, { useState, useEffect } from 'react';

export default function CountdownWidget({ targetDate, label = 'Starts In' }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Parse target date safely (handles String ISO, Date object, timestamp, or fallback)
    let targetTime;
    if (targetDate) {
      targetTime = new Date(targetDate).getTime();
    }
    if (!targetTime || isNaN(targetTime)) {
      targetTime = Date.now() + (27 * 24 * 60 * 60 * 1000 + 14 * 3600 * 1000 + 36 * 60000 + 52000);
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: isNaN(d) ? 0 : d,
        hours: isNaN(h) ? 0 : h,
        minutes: isNaN(m) ? 0 : m,
        seconds: isNaN(s) ? 0 : s,
      });
    };

    updateTimer();
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
        width: '100%',
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
        {label}
      </div>

      <div className="countdown-grid" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
