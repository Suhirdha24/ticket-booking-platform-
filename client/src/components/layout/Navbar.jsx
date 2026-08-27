import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useReservationStore } from '../../store/reservationStore.js';
import {
  Ticket,
  Calendar,
  User,
  LogOut,
  Shield,
  Clock,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import Button from '../common/Button.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { activeReservation, remainingSeconds } = useReservationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="glass-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
            }}
          >
            <Ticket size={20} color="#ffffff" />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 40%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              EventHub
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-links"
        >
          <Link
            to="/"
            style={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: isActive('/') ? '#ffffff' : 'var(--text-muted)',
              transition: 'color 0.2s',
            }}
          >
            Home
          </Link>
          <Link
            to="/events"
            style={{
              fontSize: '0.95rem',
              fontWeight: 500,
              color: isActive('/events') ? '#ffffff' : 'var(--text-muted)',
              transition: 'color 0.2s',
            }}
          >
            Browse Events
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-bookings"
              style={{
                fontSize: '0.95rem',
                fontWeight: 500,
                color: isActive('/my-bookings') ? '#ffffff' : 'var(--text-muted)',
                transition: 'color 0.2s',
              }}
            >
              My Tickets
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Shield size={16} />
              Admin Portal
            </Link>
          )}
        </div>

        {/* Right Action Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Active Reservation Lock Pill */}
          {activeReservation && remainingSeconds > 0 && (
            <Link
              to={`/checkout/${activeReservation.reservationId}`}
              className={`badge ${remainingSeconds < 60 ? 'timer-warning' : 'badge-vip'}`}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <Clock size={14} />
              <span>Held: {formatTimer(remainingSeconds)}</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.4rem 0.85rem',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {userMenuOpen && (
                <div
                  className="glass-panel animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    padding: '0.5rem',
                    backgroundColor: '#161926',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {user?.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user?.email}
                    </div>
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.88rem',
                      color: 'var(--text-main)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                    className="btn-ghost"
                  >
                    <Ticket size={16} />
                    <span>My Bookings</span>
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.88rem',
                        color: '#c084fc',
                        borderRadius: 'var(--radius-sm)',
                      }}
                      className="btn-ghost"
                    >
                      <Shield size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.88rem',
                      color: '#fb7185',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginTop: '0.25rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                    className="btn-ghost"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-links {
            display: flex !important;
          }
        }
        @media (max-width: 767px) {
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
