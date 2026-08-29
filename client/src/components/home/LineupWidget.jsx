import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const LINEUP = [
  {
    name: 'Tiësto',
    stage: 'Main Stage',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Anyma',
    stage: 'Live Stage',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    name: 'Peggy Gou',
    stage: 'Sunset Stage',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

export default function LineupWidget() {
  return (
    <div
      className="glass-widget-card"
      style={{
        padding: '1.15rem 1.4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 900,
            color: '#A78BFA',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Latest Lineup
        </span>
        <Link
          to="/events"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#94A3B8',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
        >
          <span>View All</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {LINEUP.map((artist, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid rgba(139, 92, 246, 0.4)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                marginBottom: '0.35rem',
                position: 'relative',
              }}
            >
              <img
                src={artist.image}
                alt={artist.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap' }}>
              {artist.name}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94A3B8', whiteSpace: 'nowrap' }}>
              {artist.stage}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
