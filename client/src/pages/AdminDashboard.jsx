import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client.js';
import { useAuthStore } from '../store/authStore.js';
import StatCard from '../components/admin/StatCard.jsx';
import Button from '../components/common/Button.jsx';
import {
  DollarSign,
  Ticket,
  Calendar,
  Users,
  Shield,
  TrendingUp,
  Plus,
  Building,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    async function loadMetrics() {
      try {
        const res = await api.get('/admin/dashboard');
        setMetrics(res.data.data);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      </div>
    );
  }

  const maxCategoryRevenue = Math.max(
    ...(metrics?.revenueByCategory || []).map((c) => c.revenue),
    1
  );

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', paddingBottom: '6rem' }}>
      {/* Top Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div className="badge badge-premium" style={{ marginBottom: '0.4rem' }}>
            <Shield size={13} /> Administrator Portal
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>
            Platform Analytics & Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Live MongoDB aggregation statistics, real-time ticket sales, and event oversight.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/events">
            <Button variant="primary" size="md" icon={Plus}>
              Manage Events
            </Button>
          </Link>
          <Link to="/admin/bookings">
            <Button variant="secondary" size="md" icon={Ticket}>
              All Bookings
            </Button>
          </Link>
          <Link to="/admin/venues">
            <Button variant="secondary" size="md" icon={Building}>
              Venues
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row — Full Section 22 KPIs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem',
        }}
      >
        <StatCard
          title="Total Gross Revenue"
          value={`$${metrics?.totalRevenue?.toLocaleString() || '0.00'}`}
          subtext={`${metrics?.confirmedBookings || 0} confirmed orders`}
          icon={DollarSign}
          color="#10b981"
        />
        <StatCard
          title="Tickets Sold"
          value={metrics?.ticketsSold?.toLocaleString() || '0'}
          subtext="Allocated seats confirmed"
          icon={Ticket}
          color="#6366f1"
        />
        <StatCard
          title="Total Bookings"
          value={metrics?.totalBookings || '0'}
          subtext={`${metrics?.cancelledBookings || 0} cancelled`}
          icon={TrendingUp}
          color="#38bdf8"
        />
        <StatCard
          title="Live & Upcoming Events"
          value={metrics?.upcomingEvents || '0'}
          subtext={`${metrics?.totalEvents || 0} total events created`}
          icon={Calendar}
          color="#a855f7"
        />
        <StatCard
          title="Active Attendees"
          value={metrics?.totalUsers || '0'}
          subtext="Registered customer profiles"
          icon={Users}
          color="#f59e0b"
        />
      </div>

      {/* Analytics & Recent Bookings Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Category Revenue Breakdown */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Revenue by Event Category
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {(metrics?.revenueByCategory || []).map((cat) => {
              const percent = Math.round((cat.revenue / maxCategoryRevenue) * 100);
              return (
                <div key={cat.category}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      marginBottom: '0.4rem',
                    }}
                  >
                    <span>{cat.category}</span>
                    <span style={{ color: '#ffffff' }}>${cat.revenue.toLocaleString()}</span>
                  </div>
                  {/* Visual Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${percent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Bookings Stream */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Recent Booking Stream
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(metrics?.recentBookings || []).map((b) => (
              <div
                key={b._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                    {b.eventSnapshot?.title || 'Event'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {b.bookingReference} &bull; {b.user?.name || 'Customer'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399' }}>
                    ${b.total?.toFixed(2)}
                  </div>
                  <span
                    className={`badge ${
                      b.bookingStatus === 'CONFIRMED' ? 'badge-success' : 'badge-danger'
                    }`}
                    style={{ fontSize: '0.65rem' }}
                  >
                    {b.bookingStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
