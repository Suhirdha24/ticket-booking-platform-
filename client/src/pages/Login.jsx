import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import {
  BookOpen,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Star,
  Bookmark,
  Sparkles,
} from 'lucide-react';

const SPOTLIGHT_BOOKS = [
  {
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    genre: 'Literary Fiction',
    rating: 4.9,
    reviews: '14.2k',
    cover:
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80',
    tag: "Reader's Choice",
  },
  {
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Sci-Fi Odyssey',
    rating: 4.9,
    reviews: '28.1k',
    cover:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    tag: 'Trending Vibe',
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Philosophical',
    rating: 4.8,
    reviews: '31.5k',
    cover:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    tag: 'Staff Favorite',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const queryEmail = searchParams.get('email') || '';
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (queryEmail) {
      setEmail(queryEmail);
    }
  }, [queryEmail]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      showSuccessToast('Welcome Back!', `Signed in as ${user.name}`);
      navigate(redirect);
    } catch (err) {
      showErrorToast('Sign In Failed', err.message);
    }
  };

  return (
    <div className="fluid-stage">
      {/* Ambient Atmospheric Lighting Blobs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '1220px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* ========================================================
              LEFT: Apple Books Editorial Literary Spotlight
              ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Editorial Eyebrow */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.95rem',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  marginBottom: '1.25rem',
                }}
              >
                <Sparkles size={14} color="#4338CA" />
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#4338CA',
                  }}
                >
                  Curated Literary Discovery
                </span>
              </div>

              <h1
                className="editorial-title"
                style={{
                  fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
                  lineHeight: 1.12,
                  fontWeight: 700,
                  color: 'var(--text-heading)',
                  letterSpacing: '-0.02em',
                  marginBottom: '1rem',
                }}
              >
                Step into stories crafted for your soul.
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.5,
                  color: 'var(--text-body)',
                  maxWidth: '520px',
                  margin: 0,
                }}
              >
                Step into curated stories, track your reading progress, and manage your library.
              </p>
            </div>

            {/* Realistic 3D Physical Books Showcase */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                gap: '1.75rem',
                padding: '1.5rem 0.5rem',
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {SPOTLIGHT_BOOKS.map((book, idx) => (
                <div
                  key={book.title}
                  className="book-3d-container"
                  style={{
                    transform:
                      idx === 0
                        ? 'translateY(-12px) scale(1.05)'
                        : idx === 1
                        ? 'translateY(0px) rotate(2deg)'
                        : 'translateY(-4px) rotate(-2deg)',
                    zIndex: idx === 0 ? 3 : 2,
                  }}
                >
                  <div
                    className="book-3d-item"
                    style={{
                      width: idx === 0 ? '160px' : '135px',
                      height: idx === 0 ? '235px' : '200px',
                    }}
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <div className="book-3d-spine-crease" />

                    {/* Bookmark Ribbon on Center Book */}
                    {idx === 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: '18px',
                          width: '18px',
                          height: '32px',
                          background: 'linear-gradient(135deg, #E11D48, #BE123C)',
                          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          zIndex: 4,
                        }}
                      />
                    )}
                  </div>

                  {/* Micro Info Below Book */}
                  <div style={{ marginTop: '0.85rem', width: idx === 0 ? '160px' : '135px' }}>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {book.tag}
                    </div>
                    <div
                      style={{
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        color: 'var(--text-heading)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '0.15rem',
                      }}
                    >
                      {book.title}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        marginTop: '0.25rem',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: 'var(--text-body)',
                      }}
                    >
                      <Star size={12} fill="#F59E0B" color="#F59E0B" />
                      <span>{book.rating}</span>
                      <span style={{ color: 'var(--text-subtle)', fontWeight: 500 }}>({book.reviews})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Artisanal Quote Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                borderRadius: '18px',
                padding: '1.25rem 1.6rem',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0,
                }}
              >
                <Bookmark size={20} />
              </div>
              <div>
                <p
                  className="editorial-italic"
                  style={{
                    fontSize: '0.96rem',
                    color: 'var(--text-heading)',
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  “I have always imagined that Paradise will be a kind of a library.”
                </p>
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.04em',
                    marginTop: '0.3rem',
                  }}
                >
                  JORGE LUIS BORGES • READER COMMUNITY
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT: Fluid Glass Sign-In Sheet
              ======================================================== */}
          <div>
            <div
              className="fluid-glass-card"
              style={{
                padding: '3rem 2.6rem',
                maxWidth: '470px',
                margin: '0 auto',
              }}
            >
              {/* Card Header */}
              <div style={{ marginBottom: '1.75rem' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #4338CA 0%, #312E81 100%)',
                    color: '#FFFFFF',
                    marginBottom: '1.15rem',
                    boxShadow: '0 8px 18px rgba(67, 56, 202, 0.28)',
                  }}
                >
                  <BookOpen size={24} />
                </div>
                <h2
                  className="editorial-title"
                  style={{
                    fontSize: '1.85rem',
                    fontWeight: 700,
                    color: 'var(--text-heading)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    marginBottom: '0.4rem',
                  }}
                >
                  Sign In to Your Shelf
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                  Enter your reader credentials to access your library.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Email Input */}
                <div>
                  <label
                    className="form-label"
                    htmlFor="login-email-input"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-heading)',
                      marginBottom: '0.45rem',
                      display: 'block',
                    }}
                  >
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail
                      size={18}
                      color="var(--text-subtle)"
                      style={{
                        position: 'absolute',
                        left: '1.1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      id="login-email-input"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      autoComplete="off"
                      className="form-input"
                      style={{
                        paddingLeft: '2.85rem',
                        height: '48px',
                        borderRadius: '12px',
                        fontSize: '0.94rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(203, 213, 225, 0.85)',
                        boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.03)',
                      }}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.45rem',
                    }}
                  >
                    <label
                      className="form-label"
                      htmlFor="login-password-input"
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--text-heading)',
                        marginBottom: 0,
                      }}
                    >
                      Password
                    </label>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock
                      size={18}
                      color="var(--text-subtle)"
                      style={{
                        position: 'absolute',
                        left: '1.1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      id="login-password-input"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      className="form-input"
                      style={{
                        paddingLeft: '2.85rem',
                        paddingRight: '3.1rem',
                        height: '48px',
                        borderRadius: '12px',
                        fontSize: '0.94rem',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(203, 213, 225, 0.85)',
                        boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.03)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.65rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        color: showPassword ? 'var(--primary)' : 'var(--text-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(67, 56, 202, 0.08)';
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = showPassword ? 'var(--primary)' : 'var(--text-subtle)';
                      }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    height: '50px',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    borderRadius: '12px',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    background: 'linear-gradient(135deg, #4338CA 0%, #3730A3 100%)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 8px 20px -4px rgba(67, 56, 202, 0.45)',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {isLoading ? 'Signing In...' : 'Sign In to Bookshelf'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </form>

              {/* Footer Switch */}
              <div
                style={{
                  marginTop: '1.85rem',
                  paddingTop: '1.35rem',
                  borderTop: '1px solid rgba(226, 232, 240, 0.8)',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  color: 'var(--text-muted)',
                }}
              >
                New reader?{' '}
                <Link
                  to="/register"
                  style={{
                    color: '#4338CA',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Begin your journey →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
