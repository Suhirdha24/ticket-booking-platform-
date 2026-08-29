import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, QrCode } from 'lucide-react';

export default function PerforatedTicketWidget({ featuredEventId }) {
  const navigate = useNavigate();

  const handleTicketClick = () => {
    if (featuredEventId) {
      navigate(`/events/${featuredEventId}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <div
      onClick={handleTicketClick}
      className="slanted-ticket-wrapper"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        minWidth: '260px',
        maxWidth: '300px',
      }}
    >
      {/* Top Slanted White Perforated Paper Pass */}
      <div className="perforated-ticket-paper">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.05em', color: '#08070D' }}>
            SONORA 2024
          </span>
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              background: '#8B5CF6',
              color: '#FFFFFF',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
            }}
          >
            VIP PASS
          </span>
        </div>

        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#08070D', lineHeight: 1.1 }}>
          3 DAY PASS
        </div>
        <div style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 700, marginBottom: '0.65rem' }}>
          GENERAL ADMISSION
        </div>

        {/* Realistic Barcode Graphic */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px dashed #CBD5E1',
            paddingTop: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '2px', height: '18px', alignItems: 'center' }}>
            {[4, 2, 6, 1, 3, 5, 2, 4, 1, 6, 3, 2, 5, 2, 4].map((w, i) => (
              <div
                key={i}
                style={{
                  width: `${w}px`,
                  height: '100%',
                  background: '#08070D',
                  borderRadius: '1px',
                }}
              ></div>
            ))}
          </div>
          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#64748B' }}>
            #SN-9428
          </span>
        </div>
      </div>

      {/* Bottom Pass Price & Round Arrow */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#E2E8F0' }}>
            Early Bird
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
            ₹4,999 <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600 }}>/ 3-Day Pass</span>
          </div>
        </div>

        <div className="btn-icon-round">
          <ArrowRight size={18} />
        </div>
      </div>
    </div>
  );
}
