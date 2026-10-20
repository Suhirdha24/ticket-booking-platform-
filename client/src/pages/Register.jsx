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
  Sparkles,
  ArrowRight,
  Check,
  Quote,
} from 'lucide-react';

const SUGGESTED_GENRES = [
  'Sci-Fi',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Self-Help',
  'Non-Fiction',
  'Fiction',
  'Romance',
  'Philosophy',
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
        preferredMoods: ['Mind-Bending', 'Emotional'],
        annualReadingGoal: 15,
      });

      showSuccessToast('Account Created! 📚', `Welcome to BookVerse, ${user.name}!`);
      navigate('/recommendations');
    } catch (err) {
      showErrorToast('Registration Failed', err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        position: 'relative',
        backgroundColor: '#08070D',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1040px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'stretch',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* LEFT SHOWCASE COLUMN */}
        <div
          className="glass-widget-card"
          style={{
            padding: '3rem 2.5rem',
            backgroundColor: 'rgba(20, 18, 34, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--gradient-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
                }}
              >
                <BookOpen size={20} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF' }}>
                Book<span style={{ color: '#A78BFA' }}>Verse</span>
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#A78BFA', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
              Join Free Today
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25, marginBottom: '1.25rem' }}>
              Start Your Personalized Reading Odyssey
            </h2>

            {/* Literary Quote */}
            <div
              style={{
                padding: '1.25rem 1.4rem',
                background: 'rgba(139, 92, 246, 0.1)',
                borderLeft: '4px solid #8B5CF6',
                borderRadius: '0 16px 16px 0',
                marginBottom: '2rem',
              }}
            >
              <Quote size={20} color="#A78BFA" style={{ transform: 'rotate(180deg)', marginBottom: '0.4rem' }} />
              <div style={{ fontSize: '0.92rem', fontStyle: 'italic', color: '#DDD6FE', lineHeight: 1.6 }}>
                &ldquo;There is no friend as loyal as a book.&rdquo;
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', marginTop: '0.5rem' }}>
                — Ernest Hemingway
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6 }}>
              ✨ Over 10,000+ avid readers discovering stories through AI and mood matching every day.
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTRATION FORM */}
        <div
          className="glass-widget-card"
          style={{
            padding: '2.8rem 2.2rem',
            backgroundColor: 'rgba(20, 18, 34, 0.95)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            borderRadius: '28px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.35rem' }}>
              Create Reader Account
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
              Select your favorite genres for instant personalized recommendations.
            </p>
          </div>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.45rem' }}>
                Your Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Lin"
                  className="form-input"
                  style={{ paddingLeft: '2.6rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.45rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="form-input"
                  style={{ paddingLeft: '2.6rem' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.45rem' }}>
                Password (min. 6 characters)
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '2.6rem', paddingRight: '2.6rem' }}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Favorite Genres Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Pick 2+ Favorite Genres:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {SUGGESTED_GENRES.map((g) => {
                  const isSel = selectedGenres.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGenre(g)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-pill)',
                        background: isSel ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSel ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.08)',
                        color: isSel ? '#FFFFFF' : '#CBD5E1',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <span>{g}</span>
                      {isSel && <Check size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-purple-glow"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              <span>{isLoading ? 'Creating Account...' : 'Join BookVerse'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: '#94A3B8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#A78BFA', fontWeight: 800, textDecoration: 'none' }}>
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
