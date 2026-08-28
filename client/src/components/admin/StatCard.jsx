import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color = '#eab308' }) {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}
    >
      <div>
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--text-subtle)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.35rem',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
          }}
        >
          {value}
        </div>
        {subtext && (
          <div
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              marginTop: '0.35rem',
            }}
          >
            {subtext}
          </div>
        )}
      </div>

      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '14px',
          background: `rgba(${color === '#eab308' ? '234, 179, 8' : color === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.15)`,
          border: `1px solid rgba(${color === '#eab308' ? '234, 179, 8' : color === '#10b981' ? '16, 185, 129' : '245, 158, 11'}, 0.3)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={24} color={color} />
      </div>
    </div>
  );
}
