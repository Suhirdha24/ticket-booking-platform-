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
  Menu,
  X,
  Compass,
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
        backgroundColor: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.75)',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
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
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <BookOpen size={20} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-heading)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                display: 'block',
              }}
            >
              BookVerse
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-links">
          <Link
            to="/books"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/books') ? 'var(--primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'color 0.15s ease',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: isActive('/books') ? 'var(--primary-light)' : 'transparent',
            }}
          >
            <Compass size={16} />
            <span>Browse Catalog</span>
          </Link>

          <Link
            to="/recommendations"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/recommendations') ? 'var(--primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'color 0.15s ease',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: isActive('/recommendations') ? 'var(--primary-light)' : 'transparent',
            }}
          >
            <Sparkles size={16} />
            <span>Vibe Matcher</span>
          </Link>

          <Link
            to="/my-bookshelf"
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: isActive('/my-bookshelf') ? 'var(--primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'color 0.15s ease',
              padding: '0.4rem 0.6rem',
              borderRadius: '6px',
              backgroundColor: isActive('/my-bookshelf') ? 'var(--primary-light)' : 'transparent',
            }}
          >
            <Bookmark size={16} />
            <span>My Bookshelf</span>
            {stats.totalShelved > 0 && (
              <span
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '9999px',
                }}
              >
                {stats.totalShelved}
              </span>
            )}
          </Link>
        </nav>

        {/* Search Bar & User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={14}
                color="var(--text-subtle)"
                style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.48rem 0.75rem 0.48rem 2.2rem',
                  fontSize: '0.84rem',
                  borderRadius: '8px',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-heading)',
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
                  gap: '0.5rem',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-medium)',
                  padding: '0.3rem 0.65rem 0.3rem 0.35rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  color: 'var(--text-heading)',
                }}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user?.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={13} color="var(--text-muted)" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '210px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-dropdown)',
                    padding: '0.5rem',
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.35rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', margin: 0 }}>
                      {user?.name}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      color: 'var(--text-body)',
                      borderRadius: '6px',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <User size={15} />
                    <span>Reader Profile</span>
                  </Link>

                  <Link
                    to="/my-bookshelf"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      color: 'var(--text-body)',
                      borderRadius: '6px',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Bookmark size={15} />
                    <span>My Bookshelf</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      color: 'var(--accent-rose)',
                      background: 'none',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginTop: '0.25rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-rose-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link
                to="/login"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--text-body)',
                  padding: '0.45rem 0.85rem',
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  padding: '0.45rem 0.95rem',
                  fontSize: '0.86rem',
                }}
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-heading)',
              cursor: 'pointer',
              padding: '0.35rem',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid var(--border-subtle)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <Link
            to="/books"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontWeight: 600,
              color: 'var(--text-heading)',
              backgroundColor: isActive('/books') ? 'var(--bg-subtle)' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <Compass size={18} />
            <span>Browse Catalog</span>
          </Link>
          <Link
            to="/recommendations"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontWeight: 600,
              color: 'var(--text-heading)',
              backgroundColor: isActive('/recommendations') ? 'var(--bg-subtle)' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <Sparkles size={18} />
            <span>Vibe Matcher</span>
          </Link>
          <Link
            to="/my-bookshelf"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontWeight: 600,
              color: 'var(--text-heading)',
              backgroundColor: isActive('/my-bookshelf') ? 'var(--bg-subtle)' : 'transparent',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
            }}
          >
            <Bookmark size={18} />
            <span>My Bookshelf ({stats.totalShelved})</span>
          </Link>
        </div>
      )}
    </header>
  );
}
