import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { showErrorToast } from '../store/toastStore.js';
import { Building, MapPin, Users, ArrowLeft } from 'lucide-react';

export default function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVenues() {
      try {
        const res = await api.get('/venues');
        setVenues(res.data.data || []);
      } catch (err) {
        showErrorToast('Failed to load venues', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadVenues();
  }, []);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <Link
          to="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            marginBottom: '0.5rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
          Registered Venues & Layouts
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Seating capacity, section maps, and architectural configurations for event creation.
        </p>
      </div>

      {/* Venues Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
        }}
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '300px', borderRadius: 'var(--radius-lg)' }} />
          ))
        ) : venues.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No venues configured.</p>
        ) : (
          venues.map((venue) => (
            <div key={venue._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={venue.imageUrl}
                  alt={venue.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                  }}
                >
                  <span className="badge badge-primary">
                    <Users size={12} /> {venue.capacity} Total Capacity
                  </span>
                </div>
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
                    {venue.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <MapPin size={14} color="var(--text-subtle)" />
                    <span>{venue.address}, {venue.city}, {venue.state}</span>
                  </div>
                </div>

                {/* Sections List */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Section Blueprint Layout
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {(venue.sections || []).map((sec, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.85rem',
                          background: 'rgba(255, 255, 255, 0.02)',
                          padding: '0.4rem 0.65rem',
                          borderRadius: '6px',
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{sec.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={`badge badge-${sec.category.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                            {sec.category}
                          </span>
                          <span style={{ color: 'var(--text-subtle)', fontSize: '0.78rem' }}>
                            {sec.rows}R &times; {sec.seatsPerRow}S ({sec.rows * sec.seatsPerRow})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
