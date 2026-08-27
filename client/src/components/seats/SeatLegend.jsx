import React from 'react';

export default function SeatLegend() {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.75rem',
        flexWrap: 'wrap',
        fontSize: '0.82rem',
        fontWeight: 600,
      }}
    >
      {/* Available */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="seat-node AVAILABLE" style={{ width: '20px', height: '20px', fontSize: '0' }} />
        <span style={{ color: 'var(--text-muted)' }}>Available</span>
      </div>

      {/* Selected */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="seat-node SELECTED" style={{ width: '20px', height: '20px', fontSize: '0' }} />
        <span style={{ color: '#ffffff' }}>Selected</span>
      </div>

      {/* Held / Locked */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="seat-node HELD" style={{ width: '20px', height: '20px', fontSize: '0' }} />
        <span style={{ color: '#f59e0b' }}>Held (5m Lock)</span>
      </div>

      {/* Booked */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="seat-node BOOKED" style={{ width: '20px', height: '20px', fontSize: '0' }} />
        <span style={{ color: 'var(--text-subtle)' }}>Sold Out</span>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '16px', background: 'var(--border-subtle)' }} />

      {/* VIP Tier */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="badge badge-vip" style={{ fontSize: '0.7rem' }}>VIP</span>
      </div>

      {/* Premium Tier */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="badge badge-premium" style={{ fontSize: '0.7rem' }}>Premium</span>
      </div>

      {/* General Tier */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="badge badge-general" style={{ fontSize: '0.7rem' }}>General</span>
      </div>
    </div>
  );
}
