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
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Star,
  Bookmark,
  Quote,
} from 'lucide-react';

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
      showSuccessToast('Welcome Back! 📚', `Logged in as ${user.name}`);
      navigate(redirect);
    } catch (err) {
      showErrorToast('Login Failed', err.message);
    }
  };

  const handleFillDemo = () => {
    setEmail('reader@example.com');
    setPassword('Password@123');
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
      {/* Background ambient purple aura */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '750px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

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
        {/* LEFT COLUMN: BRANDING & LITERARY QUOTE */}
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
            position: 'relative',
            overflow: 'hidden',
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
              Welcome Back Reader
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.25, marginBottom: '1.25rem' }}>
              Step Into Your Next Great Story
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
                &ldquo;A reader lives a thousand lives before he dies. The man who never reads lives only one.&rdquo;
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94A3B8', marginTop: '0.5rem' }}>
                — George R.R. Martin
              </div>
            </div>
          </div>

          {/* Features list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1', fontSize: '0.85rem' }}>
              <Sparkles size={16} color="#A78BFA" />
              <span>Smart Vibe & Mood Matcher</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1', fontSize: '0.85rem' }}>
              <Bookmark size={16} color="#38BDF8" />
              <span>Virtual Reading Shelves & Page Tracker</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1', fontSize: '0.85rem' }}>
              <Star size={16} color="#F59E0B" />
              <span>Verified Community Reader Reviews</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
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
              Sign In to Your Bookshelf
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '0.88rem' }}>
              Enter your credentials or click demo account to sign in immediately.
            </p>
          </div>

          {/* Quick Demo Credentials Button */}
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.15)',
              border: '1px dashed #8B5CF6',
              color: '#DDD6FE',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
            }}
          >
            <Zap size={15} color="#A78BFA" />
            <span>Use Demo Account: reader@example.com</span>
          </button>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
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
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
                Password
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

            <button
              type="submit"
              disabled={isLoading}
              className="btn-purple-glow"
              style={{ width: '100%', padding: '1rem', fontSize: '1rem', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: '#94A3B8' }}>
            New to BookVerse?{' '}
            <Link to="/register" style={{ color: '#A78BFA', fontWeight: 800, textDecoration: 'none' }}>
              Create a free account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
