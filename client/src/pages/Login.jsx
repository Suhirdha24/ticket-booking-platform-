import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import {
  Ticket,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Star,
  Shield,
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
      showSuccessToast('Welcome Back!', `Logged in as ${user.name}`);
      navigate(redirect);
    } catch (err) {
      showErrorToast('Login Failed', err.message);
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
          maxWidth: '1080px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2.5rem',
          alignItems: 'stretch',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* 🌟 LEFT SHOWCASE COLUMN: BRANDING & SOCIAL PROOF */}
        <div
          className="glass-widget-card"
          style={{
            padding: '3rem 2.5rem',
            backgroundColor: 'rgba(20, 18, 34, 0.85)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: `
              linear-gradient(to bottom, rgba(14, 12, 24, 0.85) 0%, rgba(14, 12, 24, 0.98) 100%),
              url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Top Brand Header */}
          <div>
            <div
              className="hero-tag-pill"
              style={{ marginBottom: '1.5rem' }}
            >
              <Sparkles size={13} color="#A78BFA" />
              <span>Attendee Member Access</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.7rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: '1.25rem',
              }}
            >
              Every Culture.<br />
              Every Event.<br />
              <span className="hero-script-subtitle" style={{ fontSize: '2.4rem', margin: '0.2rem 0' }}>
                One Seamless Pass.
              </span>
            </h1>

            <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Sign in to reserve premium seats across 60+ Indian cities with instant QR tickets and zero double-booking locks.
            </p>

            {/* Feature Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={15} color="#A78BFA" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 600 }}>
                  Live 160-Seat Interactive Stadium Grid
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={15} color="#A78BFA" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 600 }}>
                  5-Minute Atomic Concurrency Hold Protection
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ticket size={15} color="#A78BFA" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 600 }}>
                  Instant Cryptographic Mobile Passes & Receipts
                </span>
              </div>
            </div>
          </div>

          {/* Social Proof Footer Pill */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#A78BFA', marginBottom: '0.2rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#A78BFA" />
                ))}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 700 }}>
                Trusted by 350,000+ Fans
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#94A3B8' }}>
              Across <strong style={{ color: '#A78BFA' }}>60+ Cities</strong>
            </div>
          </div>
        </div>

        {/* 🔐 RIGHT FORM COLUMN: USER SIGN IN CARD */}
        <div
          className="glass-widget-card"
          style={{
            padding: '3rem 2.5rem',
            backgroundColor: '#0D0C15',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            borderRadius: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 35px -10px rgba(139, 92, 246, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Navigation URL Tabs: User vs Admin */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '0.35rem',
              borderRadius: '12px',
              marginBottom: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '0.55rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#FFFFFF',
                background: 'var(--gradient-purple)',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(139, 92, 246, 0.4)',
              }}
            >
              👤 User Sign In
            </div>
            <Link
              to="/admin/login"
              style={{
                textAlign: 'center',
                padding: '0.55rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#94a3b8',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              🛡️ Admin Portal
            </Link>
          </div>

          {/* Form Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'var(--gradient-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
              }}
            >
              <Ticket size={22} color="#FFFFFF" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>
              Attendee Sign In
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginTop: '0.3rem', marginBottom: '1.75rem' }}>
              Sign in to manage your tickets, bookings, and digital passes
            </p>
          </div>

          {/* Form Fields */}
          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '0.45rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#A78BFA" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@example.com"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '0.45rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#A78BFA" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-purple-glow"
              style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to EventLinqs'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Switch to Register */}
          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.88rem', color: '#94A3B8' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#A78BFA', fontWeight: 700 }}>
              Create an Account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
