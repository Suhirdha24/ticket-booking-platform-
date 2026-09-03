import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useReservationStore } from '../../store/reservationStore.js';
import { useLocationStore, TAMIL_NADU_CITIES, OTHER_MAJOR_CITIES } from '../../store/locationStore.js';
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
  Search,
  Check,
  Navigation,
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

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { activeReservation, remainingSeconds } = useReservationStore();
  const {
    selectedCity,
    setCity,
    openLocationModal,
    detectCurrentLocation,
    isDetecting,
  } = useLocationStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeNavPopup, setActiveNavPopup] = useState(null); // 'discover' | 'categories' | null
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setUserMenuOpen(false);
        setActiveNavPopup(null);
        setMobileMenuOpen(false);
        setCityDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setActiveNavPopup(null);
    setMobileMenuOpen(false);
    setCityDropdownOpen(false);
    navigate('/');
  };

  const togglePopup = (name) => {
    setCityDropdownOpen(false);
    setActiveNavPopup((prev) => (prev === name ? null : name));
  };

  const closePopups = () => {
    setActiveNavPopup(null);
    setMobileMenuOpen(false);
    setCityDropdownOpen(false);
  };

  const toggleCityDropdown = () => {
    setCityDropdownOpen((prev) => !prev);
    setActiveNavPopup(null);
    setUserMenuOpen(false);
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
        backgroundColor: 'rgba(8, 7, 13, 0.9)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            to="/"
            onClick={closePopups}
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

          {/* Location Selector Pill & Interactive Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleCityDropdown}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: cityDropdownOpen ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.12)',
                border: cityDropdownOpen ? '1px solid rgba(139, 92, 246, 0.6)' : '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 'var(--radius-pill)',
                padding: '0.35rem 0.85rem',
                color: '#A78BFA',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title="Choose city"
              aria-expanded={cityDropdownOpen}
              id="all-cities-dropdown-btn"
            >
              <MapPin size={12} color="#A78BFA" />
              <span>{selectedCity}</span>
              <ChevronDown
                size={12}
                style={{
                  transform: cityDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>

            {/* City Dropdown Menu */}
            {cityDropdownOpen && (
              <div
                className="glass-widget-card"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '320px',
                  maxHeight: '440px',
                  zIndex: 1000,
                  background: '#0D0C15',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  borderRadius: '16px',
                  padding: '1rem',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.9), 0 0 25px rgba(139, 92, 246, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {/* Search Input */}
                <div style={{ position: 'relative' }}>
                  <Search
                    size={14}
                    color="#A78BFA"
                    style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    placeholder="Search city or district..."
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '8px',
                      padding: '0.45rem 0.6rem 0.45rem 2.2rem',
                      fontSize: '0.8rem',
                      color: '#FFFFFF',
                      outline: 'none',
                    }}
                    autoFocus
                  />
                  {citySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCitySearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '2px',
                      }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* All Cities Option */}
                {(!citySearchQuery || 'all cities'.includes(citySearchQuery.toLowerCase().trim())) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCity('All Cities');
                      setCityDropdownOpen(false);
                      setCitySearchQuery('');
                      if (location.pathname === '/events') {
                        navigate('/events');
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '8px',
                      background:
                        selectedCity === 'All Cities'
                          ? 'var(--gradient-purple)'
                          : 'rgba(255, 255, 255, 0.04)',
                      border:
                        selectedCity === 'All Cities'
                          ? 'none'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                      fontSize: '0.82rem',
                      fontWeight: selectedCity === 'All Cities' ? 800 : 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={13} color={selectedCity === 'All Cities' ? '#FFFFFF' : '#A78BFA'} />
                      <span>All Cities (Pan India Discovery)</span>
                    </div>
                    {selectedCity === 'All Cities' && <Check size={14} color="#FFFFFF" />}
                  </button>
                )}

                {/* Cities Scroll Area */}
                <div
                  className="no-scrollbar"
                  style={{
                    overflowY: 'auto',
                    maxHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    paddingRight: '2px',
                  }}
                >
                  {/* Filtered cities if searching */}
                  {citySearchQuery ? (
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#A78BFA', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                        Matching Cities
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {[...TAMIL_NADU_CITIES, ...OTHER_MAJOR_CITIES]
                          .filter((c) => c.toLowerCase().includes(citySearchQuery.toLowerCase()))
                          .map((city) => {
                            const isSel = selectedCity === city;
                            return (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setCity(city);
                                  setCityDropdownOpen(false);
                                  setCitySearchQuery('');
                                  if (location.pathname === '/events') {
                                    navigate(`/events?city=${encodeURIComponent(city)}`);
                                  }
                                }}
                                style={{
                                  background: isSel ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.05)',
                                  border: isSel ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                                  color: '#FFFFFF',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: 'var(--radius-pill)',
                                  fontSize: '0.78rem',
                                  fontWeight: isSel ? 800 : 500,
                                  cursor: 'pointer',
                                }}
                              >
                                {city}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Popular Tamil Nadu Cities */}
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#A78BFA', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          📍 Tamil Nadu
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Erode', 'Tiruchirappalli', 'Tirunelveli', 'Vellore', 'Puducherry'].map((city) => {
                            const isSel = selectedCity === city;
                            return (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setCity(city);
                                  setCityDropdownOpen(false);
                                  if (location.pathname === '/events') {
                                    navigate(`/events?city=${encodeURIComponent(city)}`);
                                  }
                                }}
                                style={{
                                  background: isSel ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.05)',
                                  border: isSel ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                                  color: '#FFFFFF',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: 'var(--radius-pill)',
                                  fontSize: '0.78rem',
                                  fontWeight: isSel ? 800 : 500,
                                  cursor: 'pointer',
                                }}
                              >
                                {city}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Major Metro Cities */}
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#A78BFA', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          🏙️ Metro Cities
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {['Bengaluru', 'Mumbai', 'New Delhi', 'Hyderabad', 'Kolkata', 'Pune', 'Kochi', 'Goa'].map((city) => {
                            const isSel = selectedCity === city;
                            return (
                              <button
                                key={city}
                                type="button"
                                onClick={() => {
                                  setCity(city);
                                  setCityDropdownOpen(false);
                                  if (location.pathname === '/events') {
                                    navigate(`/events?city=${encodeURIComponent(city)}`);
                                  }
                                }}
                                style={{
                                  background: isSel ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.05)',
                                  border: isSel ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                                  color: '#FFFFFF',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: 'var(--radius-pill)',
                                  fontSize: '0.78rem',
                                  fontWeight: isSel ? 800 : 500,
                                  cursor: 'pointer',
                                }}
                              >
                                {city}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Dropdown Footer: GPS Detection & Full Modal Link */}
                <div
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      detectCurrentLocation();
                      setCityDropdownOpen(false);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#A78BFA',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.2rem 0',
                    }}
                  >
                    <Navigation size={12} />
                    <span>{isDetecting ? 'Detecting...' : 'Near Me'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCityDropdownOpen(false);
                      openLocationModal();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94A3B8',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem',
                    }}
                  >
                    <span>All 60+ Cities &rarr;</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🌟 Center: Responsive Desktop Nav Links */}
        <div className="desktop-links">
          {/* 1. Explore Events / Tickets Link */}
          <Link
            to="/events"
            onClick={closePopups}
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: location.pathname === '/events' && !activeNavPopup ? '#FFFFFF' : '#94A3B8',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              transition: 'color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => {
              if (location.pathname !== '/events' || activeNavPopup) e.currentTarget.style.color = '#94A3B8';
            }}
          >
            <Ticket size={16} color="#A78BFA" />
            <span>Explore Events</span>
          </Link>

          {/* 2. Discover Dropdown Toggle */}
          <button
            onClick={() => togglePopup('discover')}
            style={{
              background: activeNavPopup === 'discover' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: activeNavPopup === 'discover' ? '#A78BFA' : '#94A3B8',
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
              style={{
                transform: activeNavPopup === 'discover' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {/* 3. Categories Dropdown Toggle */}
          <button
            onClick={() => togglePopup('categories')}
            style={{
              background: activeNavPopup === 'categories' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: activeNavPopup === 'categories' ? '#A78BFA' : '#94A3B8',
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
              style={{
                transform: activeNavPopup === 'categories' ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </button>

          {/* 4. Experience / My Bookings Direct Link */}
          <Link
            to="/my-bookings"
            onClick={closePopups}
            style={{
              fontSize: '0.95rem',
              fontWeight: 700,
              color: location.pathname === '/my-bookings' ? '#FFFFFF' : '#94A3B8',
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => {
              if (location.pathname !== '/my-bookings') e.currentTarget.style.color = '#94A3B8';
            }}
          >
            My Passes
          </Link>

          {user?.role === 'admin' && (
            <Link
              to="/admin"
              onClick={closePopups}
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#A78BFA',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                textDecoration: 'none',
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              <Shield size={15} />
              <span>Admin Portal</span>
            </Link>
          )}
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
          <Link to="/events" onClick={closePopups}>
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

      {/* ========================================================================= */}
      {/* 🔮 1. DISCOVER POPUP MEGA MENU */}
      {/* ========================================================================= */}
      {activeNavPopup === 'discover' && (
        <div
          style={{
            position: 'absolute',
            top: '76px',
            left: 0,
            width: '100%',
            backgroundColor: '#0D0C15',
            borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            padding: '2rem 0',
            zIndex: 99,
          }}
        >
          <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '3rem' }}>
            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.08)', paddingRight: '2rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Quick Discovery
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '1.25rem' }}>
                Find Your Next Live Experience
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => {
                    closePopups();
                    navigate('/events');
                  }}
                  className="btn-purple-glow"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
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
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    padding: '0.75rem 1.15rem',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>🎵 Trending Concerts & Music</span>
                  <ArrowRight size={14} color="#A78BFA" />
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Browse by Location
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.85rem' }}>
                Popular Cities
              </h4>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    closePopups();
                    setCity('All Cities');
                    navigate('/events');
                  }}
                  style={{
                    background: selectedCity === 'All Cities' ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.05)',
                    border: selectedCity === 'All Cities' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFFFFF',
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
                  <MapPin size={12} color={selectedCity === 'All Cities' ? '#FFFFFF' : '#A78BFA'} />
                  <span>All Cities</span>
                </button>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      closePopups();
                      setCity(city);
                      navigate(`/events?city=${encodeURIComponent(city)}`);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
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
                    <MapPin size={12} color="#A78BFA" />
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
            top: '76px',
            left: 0,
            width: '100%',
            backgroundColor: '#0D0C15',
            borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)',
            padding: '2rem 0',
            zIndex: 99,
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase' }}>
                  Curated Catalog
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF' }}>
                  Browse All Categories
                </h3>
              </div>
              <button
                onClick={() => {
                  closePopups();
                  navigate('/events');
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  padding: '0.4rem 1rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
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
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
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
                        background: 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={18} color="#A78BFA" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
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

      {/* 📱 Mobile Slide-Down Menu */}
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
            onClick={closePopups}
            style={{ color: '#FFFFFF', fontWeight: 700, padding: '0.5rem 0' }}
          >
            Explore Events
          </Link>
          <Link
            to="/events?category=Concert"
            onClick={closePopups}
            style={{ color: '#E2E8F0', fontWeight: 600, padding: '0.5rem 0' }}
          >
            Concerts & Music
          </Link>
          <Link
            to="/events?category=Festival"
            onClick={closePopups}
            style={{ color: '#E2E8F0', fontWeight: 600, padding: '0.5rem 0' }}
          >
            Festivals
          </Link>
          <Link
            to="/my-bookings"
            onClick={closePopups}
            style={{ color: '#E2E8F0', fontWeight: 600, padding: '0.5rem 0' }}
          >
            My Passes & Tickets
          </Link>
        </div>
      )}
    </nav>
  );
}
