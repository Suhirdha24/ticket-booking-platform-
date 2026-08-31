import React from 'react';
import { Crown, Sparkles, Ticket } from 'lucide-react';

export default function SeatLegend() {
  return (
    <div
      className="glass-widget-card"
      style={{
        padding: '0.9rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.75rem',
        flexWrap: 'wrap',
        fontSize: '0.82rem',
        fontWeight: 700,
        backgroundColor: 'rgba(20, 18, 34, 0.85)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
      }}
    >
      {/* Available */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="seat-node AVAILABLE" style={{ width: '22px', height: '22px', fontSize: '0', pointerEvents: 'none' }} />
        <span style={{ color: '#CBD5E1' }}>Available</span>
      </div>

      {/* Selected */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="seat-node SELECTED" style={{ width: '22px', height: '22px', fontSize: '0', pointerEvents: 'none' }} />
        <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Selected (In Cart)</span>
      </div>

      {/* Held / Locked */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="seat-node HELD" style={{ width: '22px', height: '22px', fontSize: '0', pointerEvents: 'none' }} />
        <span style={{ color: '#FBBF24' }}>Held (5m Lock)</span>
      </div>

      {/* Booked */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="seat-node BOOKED" style={{ width: '22px', height: '22px', fontSize: '0', pointerEvents: 'none' }} />
        <span style={{ color: '#F87171' }}>Booked / Sold Out</span>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '20px', background: 'rgba(255, 255, 255, 0.12)' }} />

      {/* VIP Tier */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#C4B5FD' }}>
        <Crown size={14} color="#A78BFA" />
        <span>VIP</span>
      </div>

      {/* Premium Tier */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#A5B4FC' }}>
        <Sparkles size={14} color="#818CF8" />
        <span>Premium</span>
      </div>

      {/* General Tier */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#7DD3FC' }}>
        <Ticket size={14} color="#38BDF8" />
        <span>General</span>
      </div>
    </div>
  );
}
