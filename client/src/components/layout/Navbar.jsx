import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useReservationStore } from '../../store/reservationStore.js';
import { useLocationStore } from '../../store/locationStore.js';
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
  MapPin,
  Music,
  Flame,
  Tv,
  Trophy,
  Zap,
  Mic,
  Palette,
  Wine,
  Gamepad2,
  Users,
  Heart,
  Smile,
  ArrowRight,
  Store,
  Star,
} from 'lucide-react';

const CITIES = [
  'Chennai',
  'Bengaluru',
  'Coimbatore',
  'Erode',
  'Madurai',
  'Mumbai',
  'New Delhi',
  'Hyderabad',
  'Salem',
  'Tiruchirappalli',
  'Kochi',
  'Goa',
  'Pune',
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { activeReservation, remainingSeconds } = useReservationStore();
  const { selectedCity, openLocationModal } = useLocationStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setUserMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <nav
      ref={navRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        backgroundColor: 'rgba(8, 7, 13, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Left: Sonora Waveform Logo & City Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
            }}
          >
            {/* Audio Soundwave Bars Logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                height: '24px',
                padding: '0 4px',
              }}
            >
              <div className="soundwave-bar" style={{ height: '10px', background: '#8B5CF6' }}></div>
              <div className="soundwave-bar" style={{ height: '18px', background: '#A78BFA' }}></div>
              <div className="soundwave-bar" style={{ height: '24px', background: '#8B5CF6' }}></div>
              <div className="soundwave-bar" style={{ height: '14px', background: '#C4B5FD' }}></div>
              <div className="soundwave-bar" style={{ height: '20px', background: '#8B5CF6' }}></div>
            </div>

            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '0.04em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
              }}
            >
              Event<span style={{ color: '#A78BFA' }}>Linqs</span>
            </span>
          </Link>

          {/* Location Selector Pill */}
          <button
            onClick={openLocationModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 'var(--radius-pill)',
              padding: '0.35rem 0.85rem',
              color: '#A78BFA',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title="Choose city"
          >
            <MapPin size={12} color="#A78BFA" />
            <span>{selectedCity}</span>
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Center: Sonora Nav Links (Desktop) */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="desktop-links"
        >
          <Link
            to="/events"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: location.pathname === '/events' ? '#FFFFFF' : '#94A3B8',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => {
              if (location.pathname !== '/events') e.currentTarget.style.color = '#94A3B8';
            }}
          >
            Tickets
          </Link>

          <Link
            to="/events?category=Concert"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: '#94A3B8',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            Lineup
          </Link>

          <Link
            to="/events?category=Festival"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: '#94A3B8',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            Schedule
          </Link>

          <Link
            to="/my-bookings"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: location.pathname === '/my-bookings' ? '#FFFFFF' : '#94A3B8',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => {
              if (location.pathname !== '/my-bookings') e.currentTarget.style.color = '#94A3B8';
            }}
          >
            Experience
          </Link>

          <Link
            to="/organizer"
            style={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: '#94A3B8',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#94A3B8')}
          >
            Contact
          </Link>
        </div>

        {/* Right: Get Tickets Button & User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Active Reservation Lock Pill */}
          {activeReservation && remainingSeconds > 0 && (
            <Link
              to={`/checkout/${activeReservation.reservationId}`}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                textDecoration: 'none',
                background: 'rgba(244, 63, 94, 0.2)',
                color: '#FB7185',
                borderRadius: 'var(--radius-pill)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: '1px solid rgba(244, 63, 94, 0.4)',
              }}
            >
              <Clock size={13} />
              <span>Held: {formatTimer(remainingSeconds)}</span>
            </Link>
          )}

          {/* ⭐ Get Tickets Main CTA */}
          <Link to="/events">
            <button
              className="btn-purple-glow"
              style={{
                padding: '0.65rem 1.35rem',
                fontSize: '0.88rem',
              }}
            >
              <Star size={14} fill="#FFFFFF" color="#FFFFFF" />
              <span>Get Tickets</span>
            </button>
          </Link>

          {/* User Profile or Sign In */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1.5px solid rgba(139, 92, 246, 0.4)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </button>

              {userMenuOpen && (
                <div
                  className="glass-widget-card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 10px)',
                    right: 0,
                    width: '220px',
                    padding: '0.6rem',
                    zIndex: 1000,
                    background: '#12101E',
                  }}
                >
                  <div
                    style={{
                      padding: '0.6rem 0.75rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#FFFFFF' }}>
                      {user?.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: '#94A3B8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user?.email}
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#E2E8F0',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    <User size={15} color="#A78BFA" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/my-bookings"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#E2E8F0',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    <Ticket size={15} color="#A78BFA" />
                    <span>My Passes & Tickets</span>
                  </Link>

                  <Link
                    to="/favorites"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#E2E8F0',
                      borderRadius: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    <Heart size={15} color="#F43F5E" />
                    <span>Saved Favorites</span>
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
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        color: '#A78BFA',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        background: 'rgba(139, 92, 246, 0.15)',
                      }}
                    >
                      <Shield size={15} color="#A78BFA" />
                      <span>Admin Portal</span>
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
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: '#FB7185',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginTop: '0.25rem',
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                color: '#E2E8F0',
                fontSize: '0.9rem',
                fontWeight: 700,
                padding: '0.45rem 0.85rem',
                textDecoration: 'none',
              }}
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#0D0C15',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#FFFFFF', fontWeight: 700, padding: '0.5rem 0' }}
          >
            Tickets
          </Link>
          <Link
            to="/events?category=Concert"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#E2E8F0', fontWeight: 600, padding: '0.5rem 0' }}
          >
            Lineup
          </Link>
          <Link
            to="/events?category=Festival"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#E2E8F0', fontWeight: 600, padding: '0.5rem 0' }}
          >
            Schedule
          </Link>
          <Link
            to="/my-bookings"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#E2E8F0', fontWeight: 600, padding: '0.5rem 0' }}
          >
            My Passes & Experience
          </Link>
        </div>
      )}
    </nav>
  );
}
