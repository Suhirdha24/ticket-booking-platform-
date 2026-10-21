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
  Zap,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

// Featured Book Highlights for visual side
const FEATURED_BOOKS = [
  {
    title: 'Tomorrow, and Tomorrow, and Tomorrow',
    author: 'Gabrielle Zevin',
    genre: 'Literary Fiction',
    rating: 4.9,
    cover:
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Dune: Deluxe Edition',
    author: 'Frank Herbert',
    genre: 'Sci-Fi Classic',
    rating: 4.8,
    cover:
      'https://images.unsplash.com/photo-1618609377864-68609b857e90?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Growth',
    rating: 4.9,
    cover:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Magical Realism',
    rating: 4.7,
    cover:
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
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
  const [demoFilled, setDemoFilled] = useState(false);

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

  const handleFillDemo = () => {
    setEmail('reader@example.com');
    setPassword('Password@123');
    setDemoFilled(true);
    setTimeout(() => setDemoFilled(false), 2500);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper">
        {/* Visual Showcase Side with Real Book Photos */}
        <div className="auth-visual-side">
          <div>
            {/* Top Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-medium)',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--primary)',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.08)',
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={14} />
              <span>OVER 12,000+ CURATED BOOKS</span>
            </div>

            {/* Headline */}
            <h2
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: 'var(--text-heading)',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem',
              }}
            >
              Step Into Your Next Great Story
            </h2>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                marginBottom: '1.5rem',
              }}
            >
              Personalized book matches, mood-based discovery, and virtual bookshelf tracking in one clean place.
            </p>

            {/* Book Photos Showcase Grid */}
            <div className="book-showcase-grid">
              {FEATURED_BOOKS.map((book) => (
                <div key={book.title} className="showcase-book-card">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="showcase-book-img"
                    loading="lazy"
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {book.genre}
                    </div>
                    <div
                      style={{
                        fontSize: '0.82rem',
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
                        fontSize: '0.75rem',
                        color: 'var(--text-subtle)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {book.author}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        marginTop: '0.3rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#D97706',
                      }}
                    >
                      <Star size={11} fill="#F59E0B" color="#F59E0B" />
                      <span>{book.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Pull Quote */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.15rem 1.35rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
              marginTop: '1.5rem',
            }}
          >
            <p
              style={{
                fontSize: '0.86rem',
                fontStyle: 'italic',
                color: 'var(--text-body)',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              “A reader lives a thousand lives before he dies. The man who never reads lives only one.”
            </p>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginTop: '0.45rem',
              }}
            >
              — George R.R. Martin
            </div>
          </div>
        </div>

        {/* Clean Form Side */}
        <div className="auth-form-side">
          {/* Mobile-only Book Preview Header */}
          <div
            className="mobile-book-preview"
            style={{
              display: 'none',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '-10px',
                marginBottom: '0.85rem',
              }}
            >
              {FEATURED_BOOKS.slice(0, 3).map((b, idx) => (
                <img
                  key={b.title}
                  src={b.cover}
                  alt={b.title}
                  style={{
                    width: '46px',
                    height: '66px',
                    borderRadius: '6px',
                    objectFit: 'cover',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    marginLeft: idx > 0 ? '-14px' : '0',
                    transform: idx === 1 ? 'scale(1.1) translateY(-4px)' : 'none',
                    zIndex: idx === 1 ? 2 : 1,
                    border: '2px solid #FFFFFF',
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>
              Join 25,000+ Readers on BookVerse
            </div>
          </div>

          {/* Form Brand Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--primary)',
                color: '#FFFFFF',
                marginBottom: '1rem',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              <BookOpen size={22} />
            </div>
            <h1
              style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: 'var(--text-heading)',
                letterSpacing: '-0.02em',
                marginBottom: '0.35rem',
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Sign in to access your personal bookshelf & recommendations.
            </p>
          </div>

          {/* Demo Account Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              backgroundColor: demoFilled ? '#ECFDF5' : '#EEF2FF',
              border: `1px solid ${demoFilled ? '#A7F3D0' : '#C7D2FE'}`,
              borderRadius: '12px',
              marginBottom: '1.5rem',
              transition: 'all 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  background: demoFilled ? '#10B981' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                {demoFilled ? <CheckCircle2 size={16} /> : <Zap size={16} />}
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: demoFilled ? '#065F46' : 'var(--text-heading)',
                  }}
                >
                  {demoFilled ? 'Credentials Auto-Filled!' : 'Demo Reader Account'}
                </div>
                <div style={{ fontSize: '0.74rem', color: demoFilled ? '#047857' : 'var(--text-muted)' }}>
                  reader@example.com
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-medium)',
                color: demoFilled ? '#059669' : 'var(--primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease',
              }}
            >
              {demoFilled ? 'Filled ✓' : 'Auto-Fill'}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Field */}
            <div>
              <label
                className="form-label"
                htmlFor="login-email-input"
                style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)' }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={17}
                  color="var(--text-subtle)"
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@example.com"
                  className="form-input"
                  style={{
                    paddingLeft: '2.65rem',
                    height: '46px',
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.4rem',
                }}
              >
                <label
                  className="form-label"
                  htmlFor="login-password-input"
                  style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: 0 }}
                >
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={17}
                  color="var(--text-subtle)"
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  style={{
                    paddingLeft: '2.65rem',
                    paddingRight: '2.65rem',
                    height: '46px',
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: '48px',
                fontSize: '0.96rem',
                fontWeight: 700,
                borderRadius: '10px',
                marginTop: '0.4rem',
                gap: '0.65rem',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In to Your Shelf'}
              {!isLoading && <ArrowRight size={17} />}
            </button>
          </form>

          {/* Footer Switch */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
            }}
          >
            New to BookVerse?{' '}
            <Link
              to="/register"
              style={{
                color: 'var(--primary)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Create a free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
