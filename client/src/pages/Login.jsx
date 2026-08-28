import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import {
  Ticket,
  Lock,
  Mail,
  UserCheck,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Star,
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

  const fillAdmin = () => {
    setEmail('admin@example.com');
    setPassword('Admin@123456');
  };

  const fillUser = () => {
    setEmail('user@example.com');
    setPassword('User@123456');
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
              url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80')
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
              <Sparkles size={13} /> VIP Member Access
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
              Every Culture.<br />
              Every Event.<br />
              <span className="gold-gradient-text" style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                One Seamless Pass.
              </span>
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Sign in to reserve premium seats across 60+ Indian cities with instant QR tickets and zero double-booking locks.
            </p>

            {/* Feature Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={15} color="#eab308" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#f1f5f9', fontWeight: 600 }}>
                  Live 130-Seat Interactive Stadium Grid
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={15} color="#eab308" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#f1f5f9', fontWeight: 600 }}>
                  5-Minute Atomic Concurrency Hold Protection
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ticket size={15} color="#eab308" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#f1f5f9', fontWeight: 600 }}>
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
                Trusted by 350,000+ Fans
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#94a3b8' }}>
              Across <strong style={{ color: '#eab308' }}>60+ Cities</strong>
            </div>
          </div>
        </div>

        {/* 🔐 RIGHT FORM COLUMN: SIGN IN CARD */}
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
              Sign In
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.3rem' }}>
              Enter your credentials to access your tickets and reservations
            </p>
          </div>

          {/* Explicit Example Credentials Box */}
          <div
            style={{
              background: 'rgba(234, 179, 8, 0.06)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              borderRadius: '16px',
              padding: '1.2rem',
              marginBottom: '1.75rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.85rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: '#eab308',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Sparkles size={14} /> Example Login Credentials
              </div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Click to Auto-Fill</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
              {/* Admin Example Card */}
              <div
                onClick={fillAdmin}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background:
                    email === 'admin@example.com'
                      ? 'rgba(234, 179, 8, 0.18)'
                      : 'rgba(255, 255, 255, 0.04)',
                  border:
                    email === 'admin@example.com'
                      ? '1.5px solid #eab308'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Shield size={13} /> Admin Account
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: '#000000',
                      background: '#eab308',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                    }}
                  >
                    Use Admin
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  <span style={{ color: '#94a3b8' }}>Email:</span> <strong style={{ color: '#ffffff' }}>admin@example.com</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, marginTop: '0.2rem' }}>
                  <span style={{ color: '#94a3b8' }}>Password:</span> <strong style={{ color: '#ffffff' }}>Admin@123456</strong>
                </div>
              </div>

              {/* Standard User Example Card */}
              <div
                onClick={fillUser}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background:
                    email === 'user@example.com'
                      ? 'rgba(234, 179, 8, 0.18)'
                      : 'rgba(255, 255, 255, 0.04)',
                  border:
                    email === 'user@example.com'
                      ? '1.5px solid #eab308'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <UserCheck size={13} /> Standard User
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      background: 'rgba(255, 255, 255, 0.15)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                    }}
                  >
                    Use User
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  <span style={{ color: '#94a3b8' }}>Email:</span> <strong style={{ color: '#ffffff' }}>user@example.com</strong>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4, marginTop: '0.2rem' }}>
                  <span style={{ color: '#94a3b8' }}>Password:</span> <strong style={{ color: '#ffffff' }}>User@123456</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form
            onSubmit={handleLogin}
            autoComplete="off"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* Decoy fields to trap browser autofill algorithms */}
            <input
              type="text"
              name="fake_username_prevent_autofill"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />
            <input
              type="password"
              name="fake_password_prevent_autofill"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600, color: '#e2e8f0' }}>
                Email Address
              </label>
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
                  name="eventlinqs_login_email_input"
                  id="eventlinqs_login_email_input"
                  className="input-field"
                  style={{
                    paddingLeft: '2.75rem',
                    background: '#12151e',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    fontSize: '0.95rem',
                  }}
                  placeholder="e.g. admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="input-label" style={{ fontWeight: 600, color: '#e2e8f0' }}>
                  Password
                </label>
              </div>
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
                  name="eventlinqs_login_password_input"
                  id="eventlinqs_login_password_input"
                  className="input-field"
                  style={{
                    paddingLeft: '2.75rem',
                    paddingRight: '2.75rem',
                    background: '#12151e',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    fontSize: '0.95rem',
                  }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
              <span>{isLoading ? 'Signing In...' : 'Sign In to EventLinqs'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Switch */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--text-muted)',
              marginTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1.25rem',
            }}
          >
            Don't have an account?{' '}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              style={{ color: '#eab308', fontWeight: 700 }}
            >
              Create an Account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
