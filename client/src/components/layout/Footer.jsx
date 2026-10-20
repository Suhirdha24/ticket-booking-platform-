import React from 'react';
import { BookOpen, Sparkles, Heart, Bookmark, ShieldCheck, Compass } from 'lucide-react';
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
                gap: '0.65rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'var(--gradient-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
                }}
              >
                <BookOpen size={18} color="#FFFFFF" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                }}
              >
                Book<span style={{ color: '#A78BFA' }}>Verse</span>
              </span>
            </div>
            <p
              style={{
                fontSize: '0.86rem',
                color: '#94A3B8',
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}
            >
              Discover stories you will never forget. Intelligent content-based book recommendations, real-time mood vibe matching, personal reading goals, and community reviews.
            </p>
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
                <Link to="/books" style={{ color: '#CBD5E1', fontSize: '0.88rem', textDecoration: 'none' }}>
                  All Curated Books
                </Link>
              </li>
              <li>
                <Link to="/books?genre=Sci-Fi" style={{ color: '#CBD5E1', fontSize: '0.88rem', textDecoration: 'none' }}>
                  Sci-Fi & Speculative
                </Link>
              </li>
              <li>
                <Link to="/books?genre=Mystery" style={{ color: '#CBD5E1', fontSize: '0.88rem', textDecoration: 'none' }}>
                  Mystery & Thrillers
                </Link>
              </li>
              <li>
                <Link to="/books?genre=Self-Help" style={{ color: '#CBD5E1', fontSize: '0.88rem', textDecoration: 'none' }}>
                  Personal Growth & Habits
                </Link>
              </li>
            </ul>
          </div>

          {/* Smart Features */}
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
              Recommendation AI
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: 0 }}>
              <li>
                <Link to="/recommendations" style={{ color: '#CBD5E1', fontSize: '0.88rem', textDecoration: 'none' }}>
                  Interactive Vibe Matcher
                </Link>
              </li>
              <li>
                <Link to="/my-bookshelf" style={{ color: '#CBD5E1', fontSize: '0.88rem', textDecoration: 'none' }}>
                  Annual Reading Challenge
                </Link>
              </li>
              <li>
                <Link to="/my-bookshelf" style={{ color: '#CBD5E1', fontSize: '0.88rem', textDecoration: 'none' }}>
                  Personalized Reading Shelves
                </Link>
              </li>
            </ul>
          </div>

          {/* Reader Community */}
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
              Reader Guarantee
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: 0 }}>
              <li style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
                ✨ 98% Match Accuracy
              </li>
              <li style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
                🎯 Zero Filler, High-Signal Reads
              </li>
              <li style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
                📖 Verified Community Ratings
              </li>
              <li style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
                ⚡ Instant Progress Tracking
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
            &copy; {new Date().getFullYear()} BookVerse AI. Inspiring reader journeys everywhere.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#A78BFA' }}>
            <span>Curated with passion for avid readers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
