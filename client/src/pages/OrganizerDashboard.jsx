import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Calendar,
  Ticket,
  DollarSign,
  Users,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import api from '../api/client.js';
import { useAuthStore } from '../store/authStore.js';
import { useToastStore } from '../store/toastStore.js';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrganizerEvents() {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const res = await api.get('/events?limit=20');
        setEvents(res.data?.data?.events || []);
      } catch (err) {
        console.error('Error fetching organizer events:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrganizerEvents();
  }, [isAuthenticated, navigate]);

  const totalEvents = events.length;
  const totalTickets = events.reduce((acc, ev) => acc + (160 - (ev.availableSeats || 0)), 0);
  const totalRevenue = events.reduce((acc, ev) => {
    const minP = ev.pricing?.[0]?.price || 499;
    const sold = 160 - (ev.availableSeats || 0);
    return acc + sold * minP;
  }, 0);

  return (
    <div className="mobile-safe-bottom" style={{ minHeight: '100vh', paddingTop: '1.75rem' }}>
      <div className="container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: 'var(--primary-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Organizer Hub
            </span>
            <h1
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                marginTop: '0.15rem',
              }}
            >
              Event Management
            </h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Create, publish, and monitor real-time ticket sales and capacity
            </p>
          </div>

          <Link to="/organizer/create-event">
            <button className="btn-primary" style={{ padding: '0.75rem 1.35rem' }}>
              <Plus size={18} />
              <span>Create New Event</span>
            </button>
          </Link>
        </div>

        {/* Analytics Overview Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              padding: '1.25rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Active Events
              </span>
              <Calendar size={18} color="var(--primary-gold)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {totalEvents}
            </div>
          </div>

          <div
            style={{
              padding: '1.25rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Tickets Sold
              </span>
              <Ticket size={18} color="#06b6d4" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              {totalTickets.toLocaleString('en-IN')}
            </div>
          </div>

          <div
            style={{
              padding: '1.25rem',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Estimated Revenue
              </span>
              <TrendingUp size={18} color="#22c55e" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Events Table / Card List */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Your Published Events</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Showing {events.length} events
            </span>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading organizer events...
            </div>
          ) : events.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                You haven't created any events yet.
              </p>
              <Link to="/organizer/create-event" className="btn-primary">
                Create First Event
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-subtle)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '1rem 1.25rem' }}>Event</th>
                    <th style={{ padding: '1rem' }}>Category</th>
                    <th style={{ padding: '1rem' }}>Date</th>
                    <th style={{ padding: '1rem' }}>City</th>
                    <th style={{ padding: '1rem' }}>Capacity</th>
                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr
                      key={ev._id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '0.88rem',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#ffffff' }}>
                        {ev.title}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            background: 'rgba(245, 185, 0, 0.12)',
                            color: 'var(--primary-gold)',
                          }}
                        >
                          {ev.category}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                        {new Date(ev.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{ev.city}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontWeight: 700, color: '#22c55e' }}>
                          {ev.availableSeats || 0}
                        </span>{' '}
                        / {ev.totalSeats || 160}
                      </td>
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <Link
                          to={`/event/${ev._id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            color: 'var(--primary-gold)',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
