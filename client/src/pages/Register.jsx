import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import {
  Ticket,
  Lock,
  Mail,
  User,
  Phone,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alreadyExists, setAlreadyExists] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setAlreadyExists(false);
    try {
      const user = await register({ name, email, password, phone });
      showSuccessToast('Registration Successful!', `Welcome to EventLinqs, ${user.name}`);
      navigate(redirect);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('already exists')) {
        setAlreadyExists(true);
      }
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
      }}
    >
      {/* Background ambient gold aura */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '750px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="container"
        style={{
          maxWidth: '1080px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2.5rem',
          alignItems: 'stretch',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* 🌟 LEFT SHOWCASE COLUMN: BRANDING & SOCIAL PROOF */}
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2.5rem',
            backgroundColor: 'rgba(14, 17, 24, 0.9)',
            border: '1px solid rgba(234, 179, 8, 0.2)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: `
              linear-gradient(to bottom, rgba(14, 17, 24, 0.85) 0%, rgba(14, 17, 24, 0.98) 100%),
              url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Top Brand Header */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid rgba(234, 179, 8, 0.35)',
                color: '#eab308',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={13} /> Join EventLinqs Club
            </div>

            <h1
              className="font-serif-editorial"
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.7rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '1.25rem',
              }}
            >
              Discover & Experience<br />
              Live Moments<br />
              <span className="gold-gradient-text" style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                Across Tamil Nadu & India.
              </span>
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Create your account in seconds to unlock early-bird tickets, interactive seat maps, and cryptographic mobile QR passes.
            </p>

            {/* Feature Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={15} color="#eab308" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#f1f5f9', fontWeight: 600 }}>
                  4,750+ Live Events in 60+ Cities & Districts
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={15} color="#eab308" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#f1f5f9', fontWeight: 600 }}>
                  100% Guaranteed Seat Allocation & 24h Full Refunds
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ticket size={15} color="#eab308" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#f1f5f9', fontWeight: 600 }}>
                  Instant Automated Digital Tickets & Receipts
                </span>
              </div>
            </div>
          </div>

          {/* Social Proof Footer Pill */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#eab308', marginBottom: '0.2rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#eab308" />
                ))}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 700 }}>
                12,000+ Curated Events
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8' }}>
              Rated <strong style={{ color: '#eab308' }}>4.9 / 5.0</strong>
            </div>
          </div>
        </div>

        {/* 🔐 RIGHT FORM COLUMN: SIGN UP CARD */}
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2.5rem',
            backgroundColor: '#0c0f16',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 35px -10px rgba(234, 179, 8, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Form Header */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 0 20px rgba(234, 179, 8, 0.45)',
              }}
            >
              <Ticket size={22} color="#000000" />
            </div>
            <h2 className="font-serif-editorial" style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
              Create an Account
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.3rem' }}>
              Join EventLinqs to start booking verified live experiences
            </p>
          </div>

          {alreadyExists && (
            <div
              style={{
                background: 'rgba(234, 179, 8, 0.12)',
                border: '1px solid rgba(234, 179, 8, 0.35)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
              }}
            >
              <div style={{ fontSize: '0.88rem', color: '#fbbf24', fontWeight: 600 }}>
                ⚠️ An account with <strong>{email}</strong> already exists.
              </div>
              <Link
                to={`/login?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}`}
                style={{
                  fontSize: '0.85rem',
                  padding: '0.5rem 0.75rem',
                  background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                  color: '#000000',
                  fontWeight: 700,
                  borderRadius: '8px',
                  textAlign: 'center',
                }}
              >
                👉 Sign In with {email} instead
              </Link>
            </div>
          )}

          <form onSubmit={handleRegister} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600, color: '#e2e8f0' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-subtle)',
                  }}
                />
                <input
                  type="text"
                  className="input-field"
                  style={{
                    paddingLeft: '2.75rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  }}
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600, color: '#e2e8f0' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-subtle)',
                  }}
                />
                <input
                  type="email"
                  className="input-field"
                  style={{
                    paddingLeft: '2.75rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  }}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600, color: '#e2e8f0' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-subtle)',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  style={{
                    paddingLeft: '2.75rem',
                    paddingRight: '2.75rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  }}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
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
                    color: 'var(--text-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600, color: '#e2e8f0' }}>Phone Number (Optional)</label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-subtle)',
                  }}
                />
                <input
                  type="tel"
                  className="input-field"
                  style={{
                    paddingLeft: '2.75rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  }}
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                marginTop: '0.75rem',
                background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                color: '#000000',
                fontWeight: 800,
                fontSize: '1.02rem',
                padding: '0.9rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(234, 179, 8, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Account & Get Started'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Switch */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              marginTop: '1.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1.25rem',
            }}
          >
            Already have an account?{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              style={{ color: '#eab308', fontWeight: 700 }}
            >
              Sign In &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
