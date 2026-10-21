import React from 'react';
import { BookOpen, Sparkles, Bookmark, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: '#FFFFFF',
        padding: '3rem 0 2rem 0',
        marginTop: 'auto',
        color: 'var(--text-muted)',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '0.85rem',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <BookOpen size={18} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: 'var(--text-heading)',
                  letterSpacing: '-0.02em',
                }}
              >
                BookVerse
              </span>
            </div>
            <p style={{ fontSize: '0.86rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>
              Intelligent reading recommendations, mood matching quizzes, and virtual reading tracker for readers everywhere.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
              Discovery
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem' }}>
              <li>
                <Link to="/books" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Browse All Books
                </Link>
              </li>
              <li>
                <Link to="/recommendations" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Vibe & Mood Matcher
                </Link>
              </li>
              <li>
                <Link to="/books?genre=Sci-Fi" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Science Fiction & Fantasy
                </Link>
              </li>
              <li>
                <Link to="/books?genre=Mystery" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Mystery & Thrillers
                </Link>
              </li>
            </ul>
          </div>

          {/* Reading Tools */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
              Reading Tools
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem' }}>
              <li>
                <Link to="/my-bookshelf" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  My Bookshelf
                </Link>
              </li>
              <li>
                <Link to="/my-bookshelf" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Reading Page Tracker
                </Link>
              </li>
              <li>
                <Link to="/profile" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Annual Reading Goals
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Legal */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
              BookVerse
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.86rem' }}>
              <li>
                <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Reader Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                  Create Free Account
                </Link>
              </li>
              <li style={{ color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
                Open recommendation platform
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
            color: 'var(--text-subtle)',
          }}
        >
          <p>© {new Date().getFullYear()} BookVerse. All rights reserved.</p>
          <p>Clean, accessible book discovery for everyone.</p>
        </div>
      </div>
    </footer>
  );
}
