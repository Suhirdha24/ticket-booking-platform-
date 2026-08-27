import React from 'react';
import { Ticket, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(9, 10, 15, 0.95)',
        padding: '3.5rem 0 2rem 0',
        marginTop: 'auto',
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
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ticket size={18} color="#ffffff" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                EventHub
              </span>
            </div>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              The premier serverless event ticketing platform designed for high-concurrency seat reservation and instant verified digital passes.
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
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Explore
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
              }}
            >
              <li><a href="/events?category=Concert" style={{ transition: 'color 0.2s' }}>Live Concerts</a></li>
              <li><a href="/events?category=Conference" style={{ transition: 'color 0.2s' }}>Tech Conferences</a></li>
              <li><a href="/events?category=Theatre" style={{ transition: 'color 0.2s' }}>Broadway & Theatres</a></li>
              <li><a href="/events?category=Sports" style={{ transition: 'color 0.2s' }}>Esports & Tournaments</a></li>
              <li><a href="/events?category=Comedy" style={{ transition: 'color 0.2s' }}>Standup Comedy</a></li>
            </ul>
          </div>

          {/* Architecture */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Architecture
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                fontSize: '0.88rem',
                color: 'var(--text-muted)',
              }}
            >
              <li>⚡ Vercel Fluid Functions</li>
              <li>🍃 MongoDB Atlas Replica Set</li>
              <li>🔒 Atomic Concurrency Locking</li>
              <li>⏱️ 5-Minute Lazy Hold Expiry</li>
              <li>🎫 Verifiable HMAC QR Passes</li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.82rem',
            color: 'var(--text-subtle)',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} EventHub Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>24h Cancellation Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
