import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import EventModal from '../components/admin/EventModal.jsx';
import Button from '../components/common/Button.jsx';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Ticket,
  ArrowLeft,
} from 'lucide-react';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsRes, venuesRes] = await Promise.all([
        api.get('/admin/events'),
        api.get('/venues'),
      ]);
      setEvents(eventsRes.data.data || []);
      setVenues(venuesRes.data.data || []);
    } catch (err) {
      showErrorToast('Failed to load events', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event and all its seats?')) {
      return;
    }
    try {
      await api.delete(`/events/${id}`);
      showSuccessToast('Event Deleted', 'Event and its seats were removed.');
      loadData();
    } catch (err) {
      showErrorToast('Delete Failed', err.message);
    }
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900 }}>Event Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Create events, manage seating plans, and adjust pricing tiers.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => {
            setEditingEvent(null);
            setModalOpen(true);
          }}
        >
          Create New Event
        </Button>
      </div>

      {/* Events Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-subtle)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
              <th style={{ padding: '1rem 1.25rem' }}>Event Title</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Venue & City</th>
              <th style={{ padding: '1rem' }}>Date</th>
              <th style={{ padding: '1rem' }}>Available Seats</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading events...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No events found. Click "Create New Event" to get started.
                </td>
              </tr>
            ) : (
              events.map((evt) => (
                <tr
                  key={evt._id}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.2s',
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 700, color: '#ffffff' }}>
                    {evt.title}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {evt.category}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    {evt.venue?.name || 'Venue'}, {evt.city}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    {new Date(evt.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: evt.availableSeats > 0 ? '#34d399' : '#fb7185', fontWeight: 700 }}>
                      {evt.availableSeats}
                    </span>{' '}
                    / {evt.totalSeats}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>
                      {evt.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setEditingEvent(evt);
                          setModalOpen(true);
                        }}
                        className="btn-ghost"
                        style={{
                          padding: '6px',
                          border: 'none',
                          color: '#eab308',
                          cursor: 'pointer',
                          borderRadius: '6px',
                        }}
                        title="Edit Event"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(evt._id)}
                        className="btn-ghost"
                        style={{
                          padding: '6px',
                          border: 'none',
                          color: '#fb7185',
                          cursor: 'pointer',
                          borderRadius: '6px',
                        }}
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Event Create / Edit Modal */}
      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        onEventSaved={loadData}
        eventToEdit={editingEvent}
        venues={venues}
      />
    </div>
  );
}
