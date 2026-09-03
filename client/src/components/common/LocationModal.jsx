import React, { useState } from 'react';
import { MapPin, Navigation, X, Check, Search, Sparkles } from 'lucide-react';
import {
  useLocationStore,
  TAMIL_NADU_CITIES,
  OTHER_MAJOR_CITIES,
  MAJOR_CITIES,
} from '../../store/locationStore.js';

export default function LocationModal() {
  const {
    selectedCity,
    setCity,
    isLocationModalOpen,
    closeLocationModal,
    detectCurrentLocation,
    isDetecting,
  } = useLocationStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'TN' | 'METRO'

  if (!isLocationModalOpen) return null;

  const filteredTN = TAMIL_NADU_CITIES.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredOther = OTHER_MAJOR_CITIES.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={closeLocationModal}
    >
      <div
        className="glass-widget-card"
        style={{
          background: '#0D0C15',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          padding: '1.75rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 30px rgba(139, 92, 246, 0.25)',
          maxHeight: '85vh',
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
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--gradient-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
              }}
            >
              <MapPin size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF' }}>Select City</h3>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Discover live events across Tamil Nadu & India
              </p>
            </div>
          </div>

          <button
            onClick={closeLocationModal}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
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
            padding: '0.75rem',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            color: '#C4B5FD',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '1rem',
            transition: 'all 0.2s',
          }}
        >
          <Navigation size={15} color="#A78BFA" />
          <span>{isDetecting ? 'Detecting Location...' : 'Use My Current Location'}</span>
        </button>

        {/* Search Box */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search
            size={16}
            color="#A78BFA"
            style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Tamil Nadu & Indian cities..."
            className="form-input"
            style={{
              paddingLeft: '2.5rem',
              paddingTop: '0.6rem',
              paddingBottom: '0.6rem',
              fontSize: '0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '12px',
            }}
          />
        </div>

        {/* Category Group Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          {[
            { id: 'ALL', label: 'All Cities' },
            { id: 'TN', label: '📍 Tamil Nadu Hubs' },
            { id: 'METRO', label: '🏙️ Metro Cities' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '0.45rem 0.5rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '8px',
                border: activeTab === tab.id ? '1px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.08)',
                background: activeTab === tab.id ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                color: activeTab === tab.id ? '#FFFFFF' : '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Cities List */}
        <div
          style={{
            overflowY: 'auto',
            maxHeight: '340px',
            paddingRight: '0.3rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* All Cities Option */}
          {((activeTab === 'ALL' && !searchQuery) || (searchQuery && 'all cities'.includes(searchQuery.toLowerCase().trim()))) && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setCity('All Cities')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background:
                    selectedCity === 'All Cities'
                      ? 'var(--gradient-purple)'
                      : 'rgba(255, 255, 255, 0.04)',
                  border:
                    selectedCity === 'All Cities'
                      ? 'none'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#FFFFFF',
                  fontSize: '0.88rem',
                  fontWeight: selectedCity === 'All Cities' ? 800 : 600,
                  cursor: 'pointer',
                  boxShadow: selectedCity === 'All Cities' ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={14} color={selectedCity === 'All Cities' ? '#FFFFFF' : '#A78BFA'} />
                  <span>All Cities (Pan India Discovery)</span>
                </div>
                {selectedCity === 'All Cities' && <Check size={16} color="#FFFFFF" />}
              </button>
            </div>
          )}

          {/* Tamil Nadu Cities Section */}
          {(activeTab === 'ALL' || activeTab === 'TN') && filteredTN.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#A78BFA',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.6rem',
                }}
              >
                📍 Tamil Nadu Districts & Cities ({filteredTN.length})
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.5rem',
                }}
              >
                {filteredTN.map((city) => {
                  const isSelected = selectedCity === city;
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setCity(city)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        background: isSelected
                          ? 'var(--gradient-purple)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected
                          ? 'none'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#FFFFFF' : '#CBD5E1',
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {city}
                      </span>
                      {isSelected && <Check size={13} color="#FFFFFF" style={{ flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* National Metros Section */}
          {(activeTab === 'ALL' || activeTab === 'METRO') && filteredOther.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#A78BFA',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.6rem',
                }}
              >
                🏙️ Metro Cities & Major Hubs ({filteredOther.length})
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.5rem',
                }}
              >
                {filteredOther.map((city) => {
                  const isSelected = selectedCity === city;
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setCity(city)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        background: isSelected
                          ? 'var(--gradient-purple)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: isSelected
                          ? 'none'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#FFFFFF' : '#CBD5E1',
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 4px 15px rgba(139, 92, 246, 0.4)' : 'none',
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {city}
                      </span>
                      {isSelected && <Check size={13} color="#FFFFFF" style={{ flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
