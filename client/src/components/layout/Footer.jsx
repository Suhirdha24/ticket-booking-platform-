import React from 'react';
import { Ticket, Shield, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: '#08070D',
        padding: '3.5rem 0 2.5rem 0',
        marginTop: 'auto',
        color: '#94A3B8',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1rem',
              }}
            >
              {/* Soundwave Bars */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  height: '20px',
                }}
              >
                <div className="soundwave-bar" style={{ height: '8px', background: '#8B5CF6' }}></div>
                <div className="soundwave-bar" style={{ height: '16px', background: '#A78BFA' }}></div>
                <div className="soundwave-bar" style={{ height: '20px', background: '#8B5CF6' }}></div>
                <div className="soundwave-bar" style={{ height: '12px', background: '#C4B5FD' }}></div>
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                Event<span style={{ color: '#A78BFA' }}>Linqs</span>
              </span>
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                color: '#94A3B8',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              Feel the sound. Live the moment. Real-time ticket reservations, interactive seat maps, and secure digital event passes across India.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: '#34d399',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                  display: 'inline-block',
                }}
              />
              <span>Serverless Functions & MongoDB Atlas Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#A78BFA',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: 0 }}>
              <li>
                <Link to="/events" style={{ color: '#CBD5E1', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  All Live Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Concert" style={{ color: '#CBD5E1', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Concerts & Music
                </Link>
              </li>
              <li>
                <Link to="/events?category=Festival" style={{ color: '#CBD5E1', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Festivals & Carnivals
                </Link>
              </li>
              <li>
                <Link to="/events?category=Conference" style={{ color: '#CBD5E1', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Tech & Summits
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Passes */}
          <div>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#A78BFA',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              My Hub
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: 0 }}>
              <li>
                <Link to="/my-bookings" style={{ color: '#CBD5E1', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  My Passes & Tickets
                </Link>
              </li>
              <li>
                <Link to="/favorites" style={{ color: '#CBD5E1', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Saved Favorites
                </Link>
              </li>
              <li>
                <Link to="/organizer" style={{ color: '#CBD5E1', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Organizer Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: '#CBD5E1', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Security */}
          <div>
            <h4
              style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#A78BFA',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Security
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: 0 }}>
              <li style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
                ⚡ 5-Minute Atomic Seat Locks
              </li>
              <li style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
                🔒 HMAC-SHA256 QR Verification
              </li>
              <li style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
                🛡️ Verified Organizers Only
              </li>
              <li style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
                ✨ 24h Full Refund Protection
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} EventLinqs Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Designed for live moments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
