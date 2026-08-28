import React, { useState, useEffect, useRef } from 'react';
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeNavPopup, setActiveNavPopup] = useState(null); // 'discover' | 'categories' | 'organisers' | 'sell' | null

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
      className="glass-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        backgroundColor: 'rgba(10, 12, 16, 0.95)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
          position: 'relative',
        }}
      >
        {/* Brand Logo */}
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
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)',
            }}
          >
            <Ticket size={20} color="#000000" />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              Event<span style={{ color: '#eab308' }}>Linqs</span>
            </span>
          </div>
        </Link>

        {/* 🌟 DESKTOP NAV LINKS (WITH INTERACTIVE POPUP TOGGLES) */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.8rem',
          }}
          className="desktop-links"
        >
          {/* 1. DISCOVER POPUP TOGGLE */}
          <button
            onClick={() => togglePopup('discover')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: activeNavPopup === 'discover' ? '#eab308' : '#e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Discover</span>
            <ChevronDown
              size={15}
              style={{
                transform: activeNavPopup === 'discover' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {/* 2. CATEGORIES POPUP TOGGLE */}
          <button
            onClick={() => togglePopup('categories')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: activeNavPopup === 'categories' ? '#eab308' : '#e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Categories</span>
            <ChevronDown
              size={15}
              style={{
                transform: activeNavPopup === 'categories' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {/* 3. ORGANISERS POPUP TOGGLE */}
          <button
            onClick={() => togglePopup('organisers')}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: activeNavPopup === 'organisers' ? '#eab308' : '#e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Organisers</span>
            <ChevronDown
              size={15}
              style={{
                transform: activeNavPopup === 'organisers' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {/* 4. MY BOOKINGS / MY TICKETS DIRECT LINK */}
          <Link
            to="/my-bookings"
            onClick={closePopups}
            style={{
              fontSize: '0.95rem',
              fontWeight: 600,
              color: location.pathname === '/my-bookings' ? '#eab308' : '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== '/my-bookings') e.currentTarget.style.color = '#eab308';
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/my-bookings') e.currentTarget.style.color = '#e2e8f0';
            }}
          >
            <Ticket size={16} color={location.pathname === '/my-bookings' ? '#eab308' : '#94a3b8'} />
            <span>My Bookings</span>
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={closePopups}
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: location.pathname.startsWith('/admin') ? '#eab308' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              <Shield size={16} color="#eab308" />
              <span>Admin Portal</span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/events" onClick={closePopups}>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '0.45rem 1rem',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(234, 179, 8, 0.3)',
                    transition: 'all 0.2s',
                  }}
                >
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
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.35rem 0.75rem',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #eab308, #f59e0b)',
                      color: '#000000',
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
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.name}</div>
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
                          color: '#eab308',
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
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link
                to="/login"
                onClick={closePopups}
                style={{
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  padding: '0.4rem 0.8rem',
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
              <Link to="/events" onClick={closePopups}>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    padding: '0.5rem 1.15rem',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(234, 179, 8, 0.3)',
                    transition: 'all 0.2s',
                  }}
                >
                  Explore Events
                </button>
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

      {/* ========================================================================= */}
      {/* 🔮 1. DISCOVER POPUP DIALOG */}
      {/* ========================================================================= */}
      {activeNavPopup === 'discover' && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: '74px',
            left: 0,
            width: '100%',
            backgroundColor: '#0c0f16',
            borderBottom: '2px solid rgba(234, 179, 8, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            padding: '2rem 0',
            zIndex: 99,
          }}
        >
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '3rem' }}>
            {/* Left Highlights */}
            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.08)', paddingRight: '2rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Quick Discovery
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
                Find Your Next Live Experience
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    closePopups();
                    navigate('/events');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Explore All 4,750+ Events</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => {
                    closePopups();
                    navigate('/events?category=Concert');
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    padding: '0.7rem 1.1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>🔥 Trending Concerts & Music</span>
                  <ArrowRight size={14} color="#eab308" />
                </button>
              </div>
            </div>

            {/* Right: Browse by City */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Browse by Location
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
                Popular Cities & Tamil Nadu Districts
              </h4>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      closePopups();
                      navigate(`/events?city=${encodeURIComponent(city)}`);
                    }}
                    style={{
                      background: city === 'Erode' ? 'rgba(234, 179, 8, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                      border: city === 'Erode' ? '1px solid #eab308' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: city === 'Erode' ? '#eab308' : '#ffffff',
                      padding: '0.45rem 0.9rem',
                      borderRadius: '9999px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <MapPin size={12} color={city === 'Erode' ? '#eab308' : '#94a3b8'} />
                    {city}
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
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: '74px',
            left: 0,
            width: '100%',
            backgroundColor: '#0c0f16',
            borderBottom: '2px solid rgba(234, 179, 8, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            padding: '2.5rem 0',
            zIndex: 99,
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Curated Catalog
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
                  Browse All 12 Event Categories
                </h3>
              </div>
              <button
                onClick={() => {
                  closePopups();
                  navigate('/events');
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  padding: '0.4rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                View Full Catalog &rarr;
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1rem',
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
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '1rem',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#eab308';
                      e.currentTarget.style.background = 'rgba(234, 179, 8, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(234, 179, 8, 0.15)',
                        border: '1px solid rgba(234, 179, 8, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} color="#eab308" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
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
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: '74px',
            left: 0,
            width: '100%',
            backgroundColor: '#0c0f16',
            borderBottom: '2px solid rgba(234, 179, 8, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            padding: '2.5rem 0',
            zIndex: 99,
          }}
        >
          <div className="container">
            <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Featured Creators
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
                Top Event Curators & Organisers
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {TOP_ORGANISERS.map((org, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <img
                    src={org.image}
                    alt={org.name}
                    style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eab308' }}
                  />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#eab308', background: 'rgba(234, 179, 8, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                      {org.badge}
                    </span>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', marginTop: '0.35rem' }}>
                      {org.name}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                      {org.followers} Followers &bull; {org.events} Events
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '2rem',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                background: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid rgba(234, 179, 8, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ fontSize: '0.9rem', color: '#ffffff' }}>
                Are you an event producer, artist, or organizer looking to sell tickets?
              </div>
              <button
                onClick={() => {
                  closePopups();
                  navigate('/admin');
                }}
                style={{
                  background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                  color: '#000000',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Access Organizer Portal &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 4. SELL TICKET POPUP DIALOG */}
      {/* ========================================================================= */}
      {activeNavPopup === 'sell' && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: '74px',
            left: 0,
            width: '100%',
            backgroundColor: '#0c0f16',
            borderBottom: '2px solid rgba(234, 179, 8, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            padding: '2.5rem 0',
            zIndex: 99,
          }}
        >
          <div className="container" style={{ maxWidth: '850px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#eab308', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Host & Launch with Zero Friction
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                List & Manage Your Event in 3 Easy Steps
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eab308', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                  1
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.3rem' }}>Create Event</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Set your title, category, date, and ticket tiers.</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eab308', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                  2
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.3rem' }}>130-Seat Map</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Visual layout builder with VIP, Balcony & Standard pricing.</div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eab308', color: '#000', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
                  3
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.3rem' }}>Instant QR Passes</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Live gate scan validation & real-time analytics.</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => {
                  closePopups();
                  navigate(user?.role === 'admin' ? '/admin' : '/login?redirect=/admin');
                }}
                style={{
                  background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  padding: '0.8rem 2rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(234, 179, 8, 0.3)',
                }}
              >
                {user?.role === 'admin' ? 'Open Admin Portal' : 'Start Selling as Organizer'} &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            position: 'absolute',
            top: '74px',
            left: 0,
            width: '100%',
            padding: '1.5rem',
            backgroundColor: '#0c0f16',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 999,
          }}
        >
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}
          >
            Discover All Events
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}
          >
            Browse Categories
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 600, color: '#eab308' }}
          >
            Sell Tickets / Organizer Portal
          </Link>
          {isAuthenticated && (
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}
            >
              My Bookings
            </Link>
          )}
        </div>
      )}

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
