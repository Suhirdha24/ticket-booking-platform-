import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import { useBookshelfStore } from '../../store/bookshelfStore.js';
import {
  BookOpen,
  Sparkles,
  Bookmark,
  Search,
  User,
  LogOut,
  Target,
  Menu,
  X,
  Compass,
  Flame,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { stats, fetchShelf } = useBookshelfStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchShelf();
    }
  }, [isAuthenticated, fetchShelf]);

  // Click outside listener for user dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(8, 7, 13, 0.88)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '74px' }}>
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--gradient-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
            }}
          >
            <BookOpen size={22} color="#FFFFFF" />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.45rem',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1,
              }}
            >
              Book<span style={{ color: '#A78BFA' }}>Verse</span>
            </span>
            <span style={{ fontSize: '0.62rem', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Intelligent Reads
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-links">
          <Link
            to="/books"
            style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: isActive('/books') ? '#A78BFA' : '#CBD5E1',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'color 0.2s ease',
              padding: '0.4rem 0.6rem',
              borderRadius: '8px',
            }}
          >
            <Compass size={17} />
            <span>Browse Catalog</span>
          </Link>

          <Link
            to="/recommendations"
            style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: isActive('/recommendations') ? '#A78BFA' : '#CBD5E1',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'color 0.2s ease',
              padding: '0.4rem 0.6rem',
              borderRadius: '8px',
            }}
          >
            <Sparkles size={16} color="#A78BFA" />
            <span>Vibe Matcher</span>
          </Link>

          <Link
            to="/my-bookshelf"
            style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: isActive('/my-bookshelf') ? '#A78BFA' : '#CBD5E1',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'color 0.2s ease',
              padding: '0.4rem 0.6rem',
              borderRadius: '8px',
            }}
          >
            <Bookmark size={16} />
            <span>My Bookshelf</span>
            {stats.totalShelved > 0 && (
              <span
                style={{
                  background: 'rgba(139, 92, 246, 0.25)',
                  border: '1px solid #8B5CF6',
                  color: '#C4B5FD',
                  fontSize: '0.7rem',
                  fontWeight: 900,
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                {stats.totalShelved}
              </span>
            )}
          </Link>
        </nav>

        {/* Search Bar & User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'none', md: 'block', position: 'relative' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={15}
                color="#94A3B8"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.85rem 0.55rem 2.4rem',
                  fontSize: '0.82rem',
                  borderRadius: 'var(--radius-pill)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  outline: 'none',
                }}
              />
            </div>
          </form>

          {/* User Auth State */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  padding: '0.35rem 0.8rem 0.35rem 0.4rem',
                  borderRadius: 'var(--radius-pill)',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                }}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user?.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="#94A3B8" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '240px',
                    backgroundColor: '#151324',
                    border: '1px solid rgba(139, 92, 246, 0.35)',
                    borderRadius: '18px',
                    padding: '0.75rem',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
                    zIndex: 2000,
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>{user?.email}</div>
                  </div>

                  <Link
                    to="/my-bookshelf"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      color: '#E2E8F0',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <Bookmark size={16} color="#A78BFA" />
                    <span>My Reading Shelves</span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      color: '#E2E8F0',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    <Target size={16} color="#38BDF8" />
                    <span>Reading Challenge & Vibe</span>
                  </Link>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        width: '100%',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: '#F87171',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#CBD5E1',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: '0.5rem 0.85rem',
                  }}
                >
                  Sign In
                </button>
              </Link>

              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button className="btn-purple-glow" style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}>
                  <span>Get Started</span>
                </button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#0D0C15',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <form onSubmit={handleSearchSubmit}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search
                size={15}
                color="#94A3B8"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem', borderRadius: 'var(--radius-pill)' }}
              />
            </div>
          </form>

          <Link
            to="/books"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <Compass size={18} color="#A78BFA" />
            <span>Browse Catalog</span>
          </Link>

          <Link
            to="/recommendations"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <Sparkles size={18} color="#A78BFA" />
            <span>Smart Vibe Matcher</span>
          </Link>

          <Link
            to="/my-bookshelf"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}
          >
            <Bookmark size={18} color="#A78BFA" />
            <span>My Bookshelf ({stats.totalShelved})</span>
          </Link>
        </div>
      )}
    </header>
  );
}
