import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import Button from '../components/common/Button.jsx';
import { Ticket, Lock, Mail, User, Phone } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { register, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [alreadyExists, setAlreadyExists] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setAlreadyExists(false);
    try {
      const user = await register({ name, email, password, phone });
      showSuccessToast('Registration Successful!', `Welcome to EventHub, ${user.name}`);
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
      className="container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2.5rem',
          backgroundColor: '#12141f',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px -10px var(--primary-glow)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
            }}
          >
            <Ticket size={24} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create an Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Join EventHub for verified passes and fast reservations
          </p>
        </div>

        {alreadyExists && (
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.25rem',
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
              className="btn btn-primary"
              style={{
                fontSize: '0.85rem',
                padding: '0.5rem 0.75rem',
                justifyContent: 'center',
                textAlign: 'center',
              }}
            >
              👉 Sign In with {email} instead
            </Link>
          </div>
        )}

        <form onSubmit={handleRegister} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
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
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
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
                style={{ paddingLeft: '2.75rem' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
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
                type="password"
                className="input-field"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number (Optional)</label>
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
                style={{ paddingLeft: '2.75rem' }}
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Create Account & Get Started
          </Button>
        </form>

        <div
          style={{
            textAlign: 'center',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            marginTop: '1.75rem',
          }}
        >
          Already have an account?{' '}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            style={{ color: '#818cf8', fontWeight: 600 }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
