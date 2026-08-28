import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client.js';
import Button from '../components/common/Button.jsx';
import { getEventImage } from '../utils/categoryImages.js';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ShieldCheck,
  ArrowRight,
  Info,
  Building,
  UserCheck,
} from 'lucide-react';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      setLoading(true);
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.data);
      } catch (err) {
        setError(err.message || 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '360px', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }} />
        <div className="skeleton" style={{ height: '40px', width: '50%', margin: '0 auto 1rem auto' }} />
        <div className="skeleton" style={{ height: '100px', width: '70%', margin: '0 auto' }} />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fb7185' }}>
            Event Not Found
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {error || 'The requested event could not be located.'}
          </p>
          <Link to="/events">
            <Button variant="primary">Browse Other Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Immersive Event Hero Banner */}
      <div
        style={{
          position: 'relative',
          height: '420px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <img
          src={getEventImage(event)}
          alt={event.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(9, 10, 15, 1) 0%, rgba(9, 10, 15, 0.6) 50%, rgba(9, 10, 15, 0.3) 100%)',
          }}
        />
        <div
          className="container"
          style={{
            position: 'absolute',
            bottom: '2.5rem',
            left: 0,
            right: 0,
            zIndex: 2,
          }}
        >
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
            <span className="badge badge-primary">{event.category}</span>
            <span className="badge badge-success">
              <Ticket size={12} /> {event.availableSeats} Available Seats
            </span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              color: '#ffffff',
              maxWidth: '850px',
            }}
          >
            {event.title}
          </h1>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Left Column: Event Overview & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Meta Pill Grid */}
            <div
              className="glass-panel"
              style={{
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {/* Date */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'rgba(234, 179, 8, 0.15)',
                    color: '#eab308',
                  }}
                >
                  <Calendar size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Event Date
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                    {formatDate(event.date)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Starts at {formatTime(event.date)}
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    background: 'rgba(234, 179, 8, 0.15)',
                    color: '#eab308',
                  }}
                >
                  <Building size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Location
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                    {event.venue?.name || 'Grand Venue'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {event.venue?.address || ''}, {event.city}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
                About the Event
              </h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-line' }}>
                {event.description}
              </p>
            </div>

            {/* Cancellation Policy Banner */}
            <div
              className="glass-panel"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'rgba(16, 185, 129, 0.08)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
              }}
            >
              <ShieldCheck size={26} color="#34d399" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '0.2rem' }}>
                  Flexible 24-Hour Refund Policy
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Cancellations requested at least {event.cancellationPolicy?.cutoffHours || 24} hours before event start are eligible for instant full refunds.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing Tiers & Seat Selection CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              className="glass-panel"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                background: 'rgba(18, 20, 31, 0.85)',
                borderColor: 'var(--border-highlight)',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px -5px var(--primary-glow)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                Ticket Pricing Tiers
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {(event.pricing || []).map((tier) => (
                  <Link
                    key={tier.category}
                    to={`/event/${event._id}/seats?tier=${tier.category}`}
                    className="glass-card table-row-hover"
                    style={{
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <span className={`badge badge-${tier.category.toLowerCase()}`}>
                        {tier.category} Tier
                      </span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                        Click to Select {tier.category} Seats &rarr;
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.35rem',
                        fontWeight: 800,
                        color: '#ffffff',
                      }}
                    >
                      ₹{tier.price}
                    </div>
                  </Link>
                ))}
              </div>

              <Link to={`/event/${event._id}/seats`} style={{ width: '100%' }}>
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  style={{ width: '100%', padding: '1rem', fontSize: '1.05rem' }}
                >
                  Select Seats on Map
                </Button>
              </Link>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-subtle)',
                }}
              >
                <Clock size={14} color="#eab308" />
                <span>Selected seats are locked for 5 minutes during checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
