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
  AlertTriangle,
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
      const errorMsg = err.message || '';
      if (
        errorMsg.toLowerCase().includes('already exists') ||
        errorMsg.toLowerCase().includes('duplicate') ||
        errorMsg.toLowerCase().includes('user_exists') ||
        err.code === 'USER_EXISTS'
      ) {
        setAlreadyExists(true);
        showErrorToast('User Already Exists', `An account with ${email} is already registered. Please sign in.`);
      } else {
        showErrorToast('Registration Failed', errorMsg);
      }
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
              url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80')
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div>
            <div
              className="hero-tag-pill"
              style={{ marginBottom: '1.5rem' }}
            >
              <Sparkles size={13} color="#A78BFA" />
              <span>Join EventLinqs Club</span>
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
              Discover &<br />
              Experience Live Moments<br />
              <span className="hero-script-subtitle" style={{ fontSize: '2.4rem', margin: '0.2rem 0' }}>
                Across Tamil Nadu & India.
              </span>
            </h1>

            <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Create your account in seconds to unlock early-bird tickets, interactive seat maps, and cryptographic mobile QR passes.
            </p>

            {/* Feature Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap size={15} color="#A78BFA" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 600 }}>
                  4,750+ Live Events in 60+ Cities & Districts
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ShieldCheck size={15} color="#A78BFA" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 600 }}>
                  100% Guaranteed Seat Allocation & 24h Full Refunds
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ticket size={15} color="#A78BFA" />
                </div>
                <span style={{ fontSize: '0.9rem', color: '#E2E8F0', fontWeight: 600 }}>
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
                12,000+ Curated Events
              </div>
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#94A3B8' }}>
              Rated <strong style={{ color: '#A78BFA' }}>4.9 / 5.0</strong>
            </div>
          </div>
        </div>

        {/* 🔐 RIGHT FORM COLUMN: USER REGISTRATION CARD */}
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
          {/* Header */}
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
              Create an Account
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginTop: '0.3rem', marginBottom: '1.5rem' }}>
              Join EventLinqs to start booking verified live experiences
            </p>
          </div>

          {/* Already exists notification banner */}
          {alreadyExists && (
            <div
              style={{
                padding: '0.9rem 1.15rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <AlertTriangle size={18} color="#FB7185" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.86rem', color: '#FFFFFF' }}>
                An account with this email exists.{' '}
                <Link to={`/login?email=${encodeURIComponent(email)}`} style={{ color: '#A78BFA', fontWeight: 800 }}>
                  Click to Sign In &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Form Fields */}
          <form
            onSubmit={handleRegister}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '0.45rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#A78BFA" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

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
                  placeholder="name@example.com"
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '0.45rem' }}>
                Phone Number (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="#A78BFA" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="form-input"
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-purple-glow"
              style={{ width: '100%', padding: '0.9rem', marginTop: '0.5rem' }}
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Account & Get Started'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Switch to Login */}
          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.88rem', color: '#94A3B8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#A78BFA', fontWeight: 700 }}>
              Sign In &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
