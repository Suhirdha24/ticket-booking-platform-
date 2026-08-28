import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import {
  Shield,
  Lock,
  Mail,
  UserCheck,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  Star,
  Layers,
  BarChart3,
  Users,
} from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';
  const { login, isAuthenticated, user, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in as admin, redirect to /admin
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role !== 'admin') {
        showErrorToast(
          'Access Restricted',
          'This account does not have Admin privileges. Please use the User Sign In portal.'
        );
        navigate('/');
        return;
      }
      showSuccessToast('Admin Authorized', `Welcome back, Administrator ${loggedUser.name}`);
      navigate(redirect);
    } catch (err) {
      showErrorToast('Admin Login Failed', err.message);
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
          background: 'radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, transparent 70%)',
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
        {/* 🌟 LEFT SHOWCASE COLUMN: ADMIN OPERATIONS */}
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2.5rem',
            backgroundColor: 'rgba(14, 17, 24, 0.9)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: `
              linear-gradient(to bottom, rgba(10, 12, 16, 0.9) 0%, rgba(14, 17, 24, 0.98) 100%),
              url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80')
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
              <Shield size={13} /> Admin & Organizer Portal
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
              Control Center for<br />
              <span className="gold-gradient-text" style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>
                Live Experiences & Venues.
              </span>
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Manage 4,750+ live events across 60+ Indian cities, oversee 130-seat atomic reservations, monitor real-time ticket revenue, and validate QR gate passes.
            </p>

            {/* Feature Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <BarChart3 size={15} color="#eab308" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#f1f5f9', fontWeight: 600 }}>
                  Live Revenue Breakdown & Event Category Metrics
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Layers size={15} color="#eab308" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#f1f5f9', fontWeight: 600 }}>
                  Full Event Creation & Tiered Stadium Pricing Management
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={15} color="#eab308" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#f1f5f9', fontWeight: 600 }}>
                  Cryptographic QR Pass Verification & Audit Stream
                </span>
              </div>
            </div>
          </div>

          {/* Admin Badge Footer */}
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
              <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 700 }}>
                🛡️ Role-Based Access Control (RBAC)
              </div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                Restricted to verified system operators
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#eab308', fontWeight: 700 }}>
              v2.5 Security
            </div>
          </div>
        </div>

        {/* 🔐 RIGHT FORM COLUMN: ADMIN SIGN IN CARD */}
        <div
          className="glass-panel"
          style={{
            padding: '3rem 2.5rem',
            backgroundColor: '#0c0f16',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 35px -10px rgba(234, 179, 8, 0.3)',
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
            <Link
              to="/login"
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
              👤 User Sign In
            </Link>
            <div
              style={{
                textAlign: 'center',
                padding: '0.55rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: '#000000',
                background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(234, 179, 8, 0.35)',
              }}
            >
              🛡️ Admin Portal
            </div>
          </div>

          {/* Form Header */}
          <div style={{ marginBottom: '1.5rem' }}>
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
              <Shield size={24} color="#000000" />
            </div>
            <h2 className="font-serif-editorial" style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
              Admin Sign In
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.3rem', marginBottom: '1.75rem' }}>
              Enter your administrative credentials to access the management portal
            </p>
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
              name="fake_admin_username_prevent_autofill"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />
            <input
              type="password"
              name="fake_admin_password_prevent_autofill"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600, color: '#e2e8f0' }}>
                Admin Email Address
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
                  name="eventlinqs_admin_login_email_input"
                  id="eventlinqs_admin_login_email_input"
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
              <label className="input-label" style={{ fontWeight: 600, color: '#e2e8f0' }}>
                Admin Password
              </label>
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
                  name="eventlinqs_admin_login_password_input"
                  id="eventlinqs_admin_login_password_input"
                  className="input-field"
                  style={{
                    paddingLeft: '2.75rem',
                    paddingRight: '2.75rem',
                    background: '#12151e',
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    fontSize: '0.95rem',
                  }}
                  placeholder="Enter administrator password"
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
              <span>{isLoading ? 'Authorizing...' : 'Sign In as Administrator'}</span>
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
            Looking for attendee ticket booking?{' '}
            <Link to="/login" style={{ color: '#eab308', fontWeight: 700 }}>
              Go to User Sign In &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
