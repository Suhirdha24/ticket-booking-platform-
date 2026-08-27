import React from 'react';

export function EventCardSkeleton() {
  return (
    <div className="glass-card" style={{ height: '390px', display: 'flex', flexDirection: 'column' }}>
      <div className="skeleton" style={{ height: '190px', width: '100%', borderRadius: 0 }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        <div className="skeleton" style={{ height: '18px', width: '35%' }} />
        <div className="skeleton" style={{ height: '24px', width: '80%' }} />
        <div className="skeleton" style={{ height: '16px', width: '60%', marginTop: 'auto' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <div className="skeleton" style={{ height: '22px', width: '30%' }} />
          <div className="skeleton" style={{ height: '34px', width: '35%', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
}

export function SeatMapSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
      <div className="skeleton" style={{ width: '60%', height: '36px', borderRadius: '12px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '8px', margin: '2rem 0' }}>
        {Array.from({ length: 48 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
        ))}
      </div>
    </div>
  );
}
