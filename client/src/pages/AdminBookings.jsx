import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import Button from '../components/common/Button.jsx';
import { showErrorToast } from '../store/toastStore.js';
import {
  Ticket,
  Search,
  Calendar,
  DollarSign,
  ArrowLeft,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
} from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/bookings', {
        params: {
          search,
          status: statusFilter,
          page,
          limit: 15,
        },
      });
      setBookings(res.data.data.bookings || []);
      setPagination(res.data.data.pagination || { total: 0, pages: 1 });
    } catch (err) {
      showErrorToast('Failed to load bookings', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Customer Bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Inspect all platform ticket sales, references, payment statuses, and attendee details.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'CONFIRMED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setPage(1);
              }}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: statusFilter === tab ? 'var(--primary)' : 'rgba(255, 255, 255, 0.04)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-subtle)',
              }}
            />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '2.4rem', fontSize: '0.85rem', padding: '0.5rem 0.5rem 0.5rem 2.4rem' }}
              placeholder="Search reference or event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
        </form>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr
              style={{
                borderBottom: '1px solid var(--border-subtle)',
                color: 'var(--text-subtle)',
                textTransform: 'uppercase',
                fontSize: '0.72rem',
              }}
            >
              <th style={{ padding: '1rem 1.25rem' }}>Booking Ref</th>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Event</th>
              <th style={{ padding: '1rem' }}>Seats</th>
              <th style={{ padding: '1rem' }}>Total Amount</th>
              <th style={{ padding: '1rem' }}>Payment Status</th>
              <th style={{ padding: '1rem' }}>Booking Status</th>
              <th style={{ padding: '1rem 1.25rem' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading bookings...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No bookings found matching your search.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b._id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.2s',
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', fontWeight: 700, color: '#818cf8' }}>
                    {b.bookingReference}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#ffffff' }}>
                      {b.user?.name || b.paymentDetails?.cardHolder || 'Guest Attendee'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                      {b.user?.email || 'N/A'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#ffffff' }}>
                      {b.eventSnapshot?.title || 'Event'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {b.venueSnapshot?.name || 'Venue'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-general" style={{ fontSize: '0.7rem' }}>
                      {b.seats?.length || 0} Seats
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 800, color: '#34d399' }}>
                    ${b.total?.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      className={`badge ${
                        b.paymentStatus === 'PAID' ? 'badge-success' : 'badge-danger'
                      }`}
                      style={{ fontSize: '0.68rem' }}
                    >
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      className={`badge ${
                        b.bookingStatus === 'CONFIRMED' ? 'badge-success' : 'badge-danger'
                      }`}
                      style={{ fontSize: '0.68rem' }}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(b.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            Previous
          </button>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
