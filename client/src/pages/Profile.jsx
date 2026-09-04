import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Ticket,
  Heart,
  Store,
  Shield,
  LogOut,
  ChevronRight,
  Edit3,
  CheckCircle,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { useLocationStore } from '../store/locationStore.js';
import { useToastStore } from '../store/toastStore.js';
import api from '../api/client.js';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, setUser } = useAuthStore();
  const { selectedCity, openLocationModal } = useLocationStore();
  const { addToast } = useToastStore();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: '',
  });
  const [saving, setSaving] = useState(false);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await api.put('/auth/profile', payload);
      if (res.data?.data?.user) {
        setUser(res.data.data.user);
      }
      addToast('Profile updated successfully!', 'success');
      setEditModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    addToast('Signed out successfully', 'success');
    navigate('/');
  };

  return (
    <div className="mobile-safe-bottom" style={{ minHeight: '100vh', paddingTop: '1.75rem' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        {/* Profile Card Header */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: '#0F172A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              fontWeight: 800,
              margin: '0 auto 1rem auto',
              boxShadow: '0 8px 24px rgba(15, 23, 42, 0.15)',
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '0.25rem', color: '#0F172A' }}>
            {user?.name}
          </h1>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            {user?.email}
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: user?.role === 'admin' ? 'rgba(245, 185, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${user?.role === 'admin' ? 'var(--border-gold)' : 'var(--border-subtle)'}`,
              padding: '0.3rem 0.85rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: user?.role === 'admin' ? 'var(--primary-gold)' : 'var(--text-main)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {user?.role === 'admin' ? <Shield size={13} /> : <User size={13} />}
            <span>{user?.role === 'admin' ? 'Platform Administrator' : 'Verified Member'}</span>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button
              onClick={() => {
                setFormData({
                  name: user?.name || '',
                  phone: user?.phone || '',
                  password: '',
                });
                setEditModalOpen(true);
              }}
              className="btn-secondary"
              style={{ padding: '0.5rem 1.15rem', fontSize: '0.82rem' }}
            >
              <Edit3 size={14} color="var(--primary-gold)" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Quick Links Menu */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '1.5rem',
          }}
        >
          <Link
            to="/my-bookings"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.15rem 1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              transition: 'background 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--gradient-gold-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-gold)',
                }}
              >
                <Ticket size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>My Bookings</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  View confirmed e-tickets, QR passes & calendar events
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-subtle)" />
          </Link>

          <Link
            to="/favorites"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.15rem 1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              transition: 'background 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f43f5e',
                }}
              >
                <Heart size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>My Favorites</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Events and festivals saved to your personal wishlist
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-subtle)" />
          </Link>

          <div
            onClick={openLocationModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.15rem 1.25rem',
              borderBottom: user?.role === 'admin' ? '1px solid var(--border-subtle)' : 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
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
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Current City</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Selected: {selectedCity}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-gold)', fontSize: '0.82rem', fontWeight: 700 }}>
              <span>Change</span>
              <ChevronRight size={18} />
            </div>
          </div>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.15rem 1.25rem',
                color: 'var(--text-main)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--gradient-gold-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-gold)',
                  }}
                >
                  <Shield size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Admin Dashboard</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Revenue metrics, event approvals, and user oversight
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-subtle)" />
            </Link>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            width: '100%',
            padding: '1rem',
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: 'var(--radius-xl)',
            color: '#f43f5e',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* ✏️ EDIT PROFILE MODAL */}
      {editModalOpen && (
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
          }}
          onClick={() => setEditModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              width: '100%',
              maxWidth: '440px',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-floating)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Edit Profile</h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="btn-icon"
                style={{ width: '32px', height: '32px' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'block' }}>
                  New Password (optional)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary"
                  style={{ flex: 1 }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
