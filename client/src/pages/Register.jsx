import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import {
  BookOpen,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Star,
  Sparkles,
  Bookmark,
} from 'lucide-react';

const SUGGESTED_GENRES = [
  'Fiction',
  'Sci-Fi',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Self-Help',
  'Non-Fiction',
  'Philosophy',
  'Romance',
];

const REGISTER_SPOTLIGHT_BOOKS = [
  {
    title: 'Dune: Deluxe Edition',
    author: 'Frank Herbert',
    genre: 'Sci-Fi Classic',
    rating: 4.9,
    reviews: '34.8k',
    cover: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
    tag: 'Masterpiece',
  },
  {
    title: 'Circe',
    author: 'Madeline Miller',
    genre: 'Mythological Fantasy',
    rating: 4.8,
    reviews: '19.4k',
    cover: 'https://covers.openlibrary.org/b/isbn/9780316556347-L.jpg',
    tag: 'Staff Pick',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Growth',
    rating: 4.9,
    reviews: '52.3k',
    cover: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
    tag: 'Bestseller',
  },
];

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await register({
        name,
        email,
        password,
        preferredGenres: selectedGenres,
        preferredMoods: [],
        annualReadingGoal: 15,
      });

      showSuccessToast('Welcome to the Library!', `Account created for ${user.name}`);
      navigate('/');
    } catch (err) {
      showErrorToast('Registration Failed', err.message);
    }
  };

  return (
    <div className="fluid-stage">
      {/* Ambient Lighting Orbs */}
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
              LEFT: Apple Books Visual Literary Presentation
              ======================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
                  Complimentary Membership
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
                Where every book finds its reader.
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
                Discover curated literature, track your reading goals, and curate your personal library.
              </p>
            </div>

            {/* 3D Physical Books Showcase */}
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
              {REGISTER_SPOTLIGHT_BOOKS.map((book, idx) => (
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
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg';
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
                          background: 'linear-gradient(135deg, #4338CA, #312E81)',
                          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          zIndex: 4,
                        }}
                      />
                    )}
                  </div>

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
          </div>

          {/* ========================================================
              RIGHT: Fluid Glass Registration Sheet
              ======================================================== */}
          <div>
            <div
              className="fluid-glass-card"
              style={{
                padding: '3rem 2.6rem',
                maxWidth: '490px',
                margin: '0 auto',
              }}
            >
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
                  Create Your Reader Account
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                  Unlock personalized book curation in less than a minute.
                </p>
              </div>

              <form onSubmit={handleRegister} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {/* Full Name */}
                <div>
                  <label
                    className="form-label"
                    htmlFor="register-name-input"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-heading)',
                      marginBottom: '0.45rem',
                      display: 'block',
                    }}
                  >
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
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
                      id="register-name-input"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maya Lin"
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

                {/* Email Address */}
                <div>
                  <label
                    className="form-label"
                    htmlFor="register-email-input"
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
                      id="register-email-input"
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

                {/* Password */}
                <div>
                  <label
                    className="form-label"
                    htmlFor="register-password-input"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-heading)',
                      marginBottom: '0.45rem',
                      display: 'block',
                    }}
                  >
                    Password
                  </label>
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
                      id="register-password-input"
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

                {/* Pick Favorite Genres */}
                <div>
                  <label
                    className="form-label"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-heading)',
                      marginBottom: '0.45rem',
                      display: 'block',
                    }}
                  >
                    Select Your Favorite Genres
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {SUGGESTED_GENRES.map((genre) => {
                      const isSelected = selectedGenres.includes(genre);
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => toggleGenre(genre)}
                          style={{
                            padding: '0.4rem 0.85rem',
                            borderRadius: '999px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            border: isSelected
                              ? '1.5px solid #4338CA'
                              : '1px solid rgba(203, 213, 225, 0.8)',
                            backgroundColor: isSelected ? '#EEF2FF' : 'rgba(255, 255, 255, 0.9)',
                            color: isSelected ? '#4338CA' : 'var(--text-body)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            boxShadow: isSelected ? '0 2px 8px rgba(67, 56, 202, 0.15)' : 'none',
                          }}
                        >
                          {isSelected && <Check size={13} strokeWidth={3} />}
                          {genre}
                        </button>
                      );
                    })}
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
                    marginTop: '0.65rem',
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
                  {isLoading ? 'Creating Membership...' : 'Complete Free Registration'}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </form>

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
                Already have an account?{' '}
                <Link
                  to="/login"
                  style={{
                    color: '#4338CA',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Sign in here →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
