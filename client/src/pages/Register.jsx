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

const REGISTER_SHOWCASE_BOOKS = [
  {
    title: 'Circe',
    author: 'Madeline Miller',
    genre: 'Mythological Fantasy',
    rating: 4.8,
    cover:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Sapiens: Brief History',
    author: 'Yuval Noah Harari',
    genre: 'Anthropology',
    rating: 4.9,
    cover:
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    genre: 'Historical Drama',
    rating: 4.9,
    cover:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
  },
  {
    title: 'Pachinko: Historical Epic',
    author: 'Min Jin Lee',
    genre: 'Literary Saga',
    rating: 4.8,
    cover:
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  },
];

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState(['Fiction', 'Sci-Fi']);

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
        preferredMoods: ['Mind-Bending', 'Inspirational'],
        annualReadingGoal: 15,
      });

      showSuccessToast('Account Created!', `Welcome to BookVerse, ${user.name}!`);
      navigate('/');
    } catch (err) {
      showErrorToast('Registration Failed', err.message);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-split-wrapper" style={{ maxWidth: '1120px' }}>
        {/* Left Visual Book Showcase */}
        <div className="auth-visual-side">
          <div>
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
              <span>FREE READER MEMBERSHIP</span>
            </div>

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
              Start Your Reading Journey
            </h2>
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                marginBottom: '1.5rem',
              }}
            >
              Join readers worldwide. Track books read, receive vibe-matched recommendations, and crush your reading goals.
            </p>

            {/* Book Photos Showcase Grid */}
            <div className="book-showcase-grid">
              {REGISTER_SHOWCASE_BOOKS.map((book) => (
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

          {/* Perks Pill Container */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.15rem 1.35rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-body)' }}>
              <Check size={16} color="var(--primary)" strokeWidth={3} />
              <span>Smart Vibe Matcher tuned to your tastes</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-body)' }}>
              <Check size={16} color="var(--primary)" strokeWidth={3} />
              <span>Page-by-page progress & reading challenge tracking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.85rem', color: 'var(--text-body)' }}>
              <Check size={16} color="var(--primary)" strokeWidth={3} />
              <span>Never lose track of books you want to read</span>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="auth-form-side">
          <div style={{ marginBottom: '1.5rem' }}>
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
              Create Your Account
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Sign up in 30 seconds and start discovering stories.
            </p>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {/* Full Name */}
            <div>
              <label
                className="form-label"
                htmlFor="register-name-input"
                style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)' }}
              >
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
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
                  id="register-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
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

            {/* Email Address */}
            <div>
              <label
                className="form-label"
                htmlFor="register-email-input"
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
                  id="register-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
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

            {/* Password */}
            <div>
              <label
                className="form-label"
                htmlFor="register-password-input"
                style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)' }}
              >
                Password
              </label>
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
                  id="register-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            {/* Favorite Genres Selection */}
            <div>
              <label
                className="form-label"
                style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)', marginBottom: '0.4rem' }}
              >
                Pick Your Favorite Genres
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {SUGGESTED_GENRES.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: isSelected
                          ? '1.5px solid var(--primary)'
                          : '1px solid var(--border-medium)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                        color: isSelected ? 'var(--primary)' : 'var(--text-body)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      {isSelected && <Check size={12} strokeWidth={3} />}
                      {genre}
                    </button>
                  );
                })}
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
                marginTop: '0.5rem',
                gap: '0.65rem',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
              }}
            >
              {isLoading ? 'Creating Account...' : 'Join BookVerse'}
              {!isLoading && <ArrowRight size={17} />}
            </button>
          </form>

          {/* Footer Switch */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.15rem',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
            }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--primary)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
