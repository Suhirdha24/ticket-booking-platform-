import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  LogIn,
  UserPlus,
  Sparkles,
  ArrowRight,
  Calendar,
  MapPin,
} from 'lucide-react';
import Modal from './Modal.jsx';

export default function AuthPromptModal({
  isOpen,
  onClose,
  event,
  targetPath,
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const destination = targetPath || (event ? `/events/${event._id}/seats` : '/events');
  const loginUrl = `/login?redirect=${encodeURIComponent(destination)}`;
  const registerUrl = `/register?redirect=${encodeURIComponent(destination)}`;

  const eventDate = event?.startDate
    ? new Date(event.startDate)
    : event?.date
    ? new Date(event.date)
    : null;

  const dateStr = eventDate
    ? eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="480px">
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        {/* Top Glow Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            color: '#A78BFA',
            fontSize: '0.78rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            marginBottom: '1.25rem',
          }}
        >
          <Sparkles size={13} color="#A78BFA" />
          <span>SIGN IN TO BOOK TICKETS</span>
        </div>

        {/* Header Title */}
        <h2
          style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            color: '#FFFFFF',
            marginBottom: '0.6rem',
            lineHeight: 1.25,
          }}
        >
          Join EventLinqs to Reserve Seats
        </h2>

        <p
          style={{
            color: '#94A3B8',
            fontSize: '0.88rem',
            lineHeight: 1.55,
            marginBottom: '1.5rem',
          }}
        >
          Please sign in or create an account to choose your seats, lock tickets in real-time, and get your digital event pass.
        </p>

        {/* Mini Event Preview Card */}
        {event && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1.75rem',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <Ticket size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {event.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#94A3B8',
                  fontSize: '0.76rem',
                  marginTop: '0.2rem',
                }}
              >
                {dateStr && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={11} color="#A78BFA" /> {dateStr}
                  </span>
                )}
                {event.city && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={11} color="#A78BFA" /> {event.city}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button
            className="btn-purple-glow"
            onClick={() => {
              onClose();
              navigate(loginUrl);
            }}
            style={{
              width: '100%',
              padding: '0.9rem',
              fontSize: '0.95rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <LogIn size={17} />
            <span>Sign In to Continue</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => {
              onClose();
              navigate(registerUrl);
            }}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(167, 139, 250, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            <UserPlus size={16} color="#A78BFA" />
            <span>Create New Account</span>
          </button>
        </div>

        {/* Continue browsing option */}
        <div style={{ marginTop: '1.25rem' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94A3B8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
          >
            Continue browsing event details first
          </button>
        </div>
      </div>
    </Modal>
  );
}
