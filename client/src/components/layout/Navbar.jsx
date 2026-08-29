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
  CheckCircle2,
  Store,
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
  'Tirunelveli',
  'Tiruppur',
  'Kochi',
  'Goa',
  'Pune',
];

const CATEGORIES = [
  { name: 'Concert', icon: Music, desc: 'Live bands, acoustic & stadium concerts' },
  { name: 'Festival', icon: Flame, desc: 'Cultural fairs, art & food carnivals' },
  { name: 'Comedy', icon: Mic, desc: 'Stand-up comedy specials & improv nights' },
  { name: 'Sports', icon: Trophy, desc: 'Cricket, football, racing & esports matches' },
  { name: 'Conference', icon: Zap, desc: 'Tech summits, AI expos & leadership keynotes' },
  { name: 'Theatre', icon: Tv, desc: 'Broadway plays, drama & classical performances' },
  { name: 'Workshop', icon: Palette, desc: 'Hands-on masterclasses & skill building' },
  { name: 'Nightlife', icon: Wine, desc: 'DJ club nights, rooftop parties & lounges' },
  { name: 'Gaming', icon: Gamepad2, desc: 'LAN tournaments & esports battles' },
  { name: 'Meetup', icon: Users, desc: 'Networking, founder mixers & social clubs' },
  { name: 'Wellness', icon: Heart, desc: 'Yoga retreats, fitness camps & meditation' },
  { name: 'Kids & Family', icon: Smile, desc: 'Magic shows, puppet theatre & family fun' },
];

const TOP_ORGANISERS = [
  {
    name: 'Festival Masters',
    followers: '12.5K',
    events: 48,
    badge: 'Verified Partner',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    name: 'Food & Cultural Vibes',
    followers: '18.2K',
    events: 64,
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  {
    name: 'Urban Beats Live',
    followers: '24.1K',
    events: 92,
    badge: 'Premier Club',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
  },
  {
    name: 'TechConclave India',
    followers: '15.7K',
    events: 35,
    badge: 'Enterprise',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
  },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { activeReservation, remainingSeconds } = useReservationStore();
  const { selectedCity, openLocationModal } = useLocationStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeNavPopup, setActiveNavPopup] = useState(null); // 'discover' | 'categories' | 'organisers' | null

  const navRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveNavPopup(null);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close popup on escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setActiveNavPopup(null);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const togglePopup = (name) => {
    setActiveNavPopup((prev) => (prev === name ? null : name));
  };

  const closePopups = () => {
    setActiveNavPopup(null);
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
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
          position: 'relative',
        }}
      >
        {/* Brand Logo & Location Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/"
            onClick={closePopups}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
              }}
            >
              <Ticket size={18} color="#FFFFFF" />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#0F172A',
                }}
              >
                Event<span style={{ color: '#EAB308' }}>Linqs</span>
              </span>
            </div>
          </Link>

          {/* Location Selector Pill */}
          <button
            onClick={openLocationModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 'var(--radius-pill)',
              padding: '0.35rem 0.85rem',
              color: '#0F172A',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
              transition: 'all 0.2s ease',
            }}
            title="Choose your city"
          >
            <MapPin size={13} color="#EAB308" />
            <span>{selectedCity}</span>
            <ChevronDown size={12} color="#64748B" />
          </button>
        </div>

        {/* 🌟 DESKTOP NAV LINKS */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="desktop-links"
        >
          {/* 1. Discover */}
          <button
            onClick={() => togglePopup('discover')}
            style={{
              background: activeNavPopup === 'discover' ? '#F1F5F9' : 'transparent',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#0F172A',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Discover</span>
            <ChevronDown
              size={14}
              color="#64748B"
              style={{
                transform: activeNavPopup === 'discover' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {/* 2. Categories */}
          <button
            onClick={() => togglePopup('categories')}
            style={{
              background: activeNavPopup === 'categories' ? '#F1F5F9' : 'transparent',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#0F172A',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Categories</span>
            <ChevronDown
              size={14}
              color="#64748B"
              style={{
                transform: activeNavPopup === 'categories' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {/* 3. Organisers */}
          <button
            onClick={() => togglePopup('organisers')}
            style={{
              background: activeNavPopup === 'organisers' ? '#F1F5F9' : 'transparent',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#0F172A',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Organisers</span>
            <ChevronDown
              size={14}
              color="#64748B"
              style={{
                transform: activeNavPopup === 'organisers' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {/* 4. My Bookings */}
          <Link
            to="/my-bookings"
            onClick={closePopups}
            style={{
              fontSize: '0.92rem',
              fontWeight: 700,
              color: location.pathname === '/my-bookings' ? '#0F172A' : '#334155',
              background: location.pathname === '/my-bookings' ? '#F1F5F9' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Ticket size={16} color="#0F172A" />
            <span>My Bookings</span>
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={closePopups}
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '8px',
                textDecoration: 'none',
                background: '#FEF9C3',
              }}
            >
              <Shield size={16} color="#854D0E" />
              <span style={{ color: '#854D0E' }}>Admin Portal</span>
            </Link>
          )}
        </div>

        {/* Right Action Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Held Timer Pill */}
          {activeReservation && remainingSeconds > 0 && (
            <Link
              to={`/checkout/${activeReservation.reservationId}`}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                textDecoration: 'none',
                background: '#FEF08A',
                color: '#854D0E',
                borderRadius: 'var(--radius-pill)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: '1px solid #FDE047',
              }}
            >
              <Clock size={13} />
              <span>Held: {formatTimer(remainingSeconds)}</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/events" onClick={closePopups}>
                <button className="btn-primary" style={{ padding: '0.5rem 1.15rem', fontSize: '0.84rem' }}>
                  Explore Events
                </button>
              </Link>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.35rem 0.75rem',
                    color: '#0F172A',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#0F172A',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span>{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} color="#64748B" />
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '220px',
                      padding: '0.5rem',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 15px 35px rgba(15, 23, 42, 0.12)',
                      zIndex: 1000,
                    }}
                  >
                    <div
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderBottom: '1px solid #E2E8F0',
                        marginBottom: '0.35rem',
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>
                        {user?.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748B',
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
                        fontWeight: 700,
                        color: '#0F172A',
                        borderRadius: '8px',
                        textDecoration: 'none',
                      }}
                    >
                      <User size={15} color="#0F172A" />
                      <span>My Profile</span>
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
                        fontWeight: 700,
                        color: '#0F172A',
                        borderRadius: '8px',
                        textDecoration: 'none',
                      }}
                    >
                      <Heart size={15} color="#F43F5E" />
                      <span>Saved Favorites</span>
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
                        fontWeight: 700,
                        color: '#0F172A',
                        borderRadius: '8px',
                        textDecoration: 'none',
                      }}
                    >
                      <Ticket size={15} color="#0F172A" />
                      <span>My Bookings</span>
                    </Link>

                    <Link
                      to="/organizer"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        borderRadius: '8px',
                        textDecoration: 'none',
                      }}
                    >
                      <Store size={15} color="#FF8A00" />
                      <span>Organizer Hub</span>
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
                          color: '#854D0E',
                          background: '#FEF9C3',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          margin: '0.2rem 0',
                        }}
                      >
                        <Shield size={15} color="#854D0E" />
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
                        fontWeight: 700,
                        color: '#EF4444',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        marginTop: '0.25rem',
                        borderTop: '1px solid #E2E8F0',
                      }}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                to="/login"
                onClick={closePopups}
                style={{
                  color: '#0F172A',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  padding: '0.45rem 0.85rem',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Sign In
              </Link>
              <Link to="/events" onClick={closePopups}>
                <button className="btn-primary" style={{ padding: '0.5rem 1.15rem', fontSize: '0.84rem' }}>
                  Explore Events
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🔮 1. DISCOVER POPUP DIALOG */}
      {/* ========================================================================= */}
      {activeNavPopup === 'discover' && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)',
            padding: '2rem 0',
            zIndex: 99,
          }}
        >
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '3rem' }}>
            <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '2rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EAB308', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Quick Discovery
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A', marginBottom: '1.25rem' }}>
                Find Your Next Live Experience
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    closePopups();
                    navigate('/events');
                  }}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <span>Explore All Events</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => {
                    closePopups();
                    navigate('/events?category=Concert');
                  }}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <span>🔥 Trending Concerts & Music</span>
                  <ArrowRight size={14} color="#0F172A" />
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EAB308', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Browse by Location
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.85rem' }}>
                Popular Cities in India
              </h4>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      closePopups();
                      navigate(`/events?city=${encodeURIComponent(city)}`);
                    }}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      color: '#0F172A',
                      padding: '0.45rem 0.9rem',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <MapPin size={12} color="#EAB308" />
                    <span>{city}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🎭 2. CATEGORIES POPUP MEGA MENU */}
      {/* ========================================================================= */}
      {activeNavPopup === 'categories' && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)',
            padding: '2rem 0',
            zIndex: 99,
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EAB308', textTransform: 'uppercase' }}>
                  Curated Catalog
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>
                  Browse All Categories
                </h3>
              </div>
              <button
                onClick={() => {
                  closePopups();
                  navigate('/events');
                }}
                className="btn-secondary"
                style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }}
              >
                View Full Catalog &rarr;
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      closePopups();
                      navigate(`/events?category=${encodeURIComponent(cat.name)}`);
                    }}
                    style={{
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      padding: '0.85rem 1rem',
                      borderRadius: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} color="#0F172A" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        {cat.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 👥 3. ORGANISERS POPUP DIALOG */}
      {/* ========================================================================= */}
      {activeNavPopup === 'organisers' && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.1)',
            padding: '2rem 0',
            zIndex: 99,
          }}
        >
          <div className="container">
            <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EAB308', textTransform: 'uppercase' }}>
                Featured Creators
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>
                Top Event Curators & Organisers
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
              }}
            >
              {TOP_ORGANISERS.map((org, i) => (
                <div
                  key={i}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '14px',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                  }}
                >
                  <img
                    src={org.image}
                    alt={org.name}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                      {org.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      {org.followers} followers &bull; {org.events} events
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
