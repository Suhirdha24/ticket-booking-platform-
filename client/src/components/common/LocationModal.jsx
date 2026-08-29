import React from 'react';
import { MapPin, Navigation, X, Check } from 'lucide-react';
import { useLocationStore, MAJOR_CITIES } from '../../store/locationStore.js';

export default function LocationModal() {
  const {
    selectedCity,
    setCity,
    isLocationModalOpen,
    closeLocationModal,
    detectCurrentLocation,
    isDetecting,
  } = useLocationStore();

  if (!isLocationModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={closeLocationModal}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '460px',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-floating)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.85rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--gradient-gold-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-gold)',
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Select City</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Discover events happening near you
              </p>
            </div>
          </div>

          <button
            onClick={closeLocationModal}
            className="btn-icon"
            style={{ width: '32px', height: '32px' }}
            aria-label="Close location selector"
          >
            <X size={16} />
          </button>
        </div>

        {/* GPS Auto-detect Button */}
        <button
          onClick={detectCurrentLocation}
          disabled={isDetecting}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            width: '100%',
            padding: '0.85rem',
            background: 'var(--gradient-gold-subtle)',
            border: '1px solid var(--border-gold-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--primary-gold)',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '1.25rem',
            transition: 'all 0.2s ease',
          }}
        >
          <Navigation size={18} className={isDetecting ? 'animate-spin' : ''} />
          {isDetecting ? 'Detecting GPS Location...' : 'Use My Current Location'}
        </button>

        {/* Cities Grid */}
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Popular Cities
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.6rem',
            overflowY: 'auto',
            paddingRight: '0.25rem',
          }}
        >
          {MAJOR_CITIES.map((city) => {
            const isSelected = selectedCity.toLowerCase() === city.toLowerCase();
            return (
              <button
                key={city}
                onClick={() => setCity(city)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: isSelected ? 'rgba(245, 185, 0, 0.12)' : 'var(--bg-surface)',
                  border: `1px solid ${isSelected ? 'var(--primary-gold)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: isSelected ? 'var(--primary-gold)' : 'var(--text-main)',
                  fontSize: '0.88rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{city}</span>
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
