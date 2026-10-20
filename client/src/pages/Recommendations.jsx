import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client.js';
import { useAuthStore } from '../store/authStore.js';
import BookCard from '../components/books/BookCard.jsx';
import {
  Sparkles,
  Compass,
  Brain,
  Zap,
  Heart,
  Moon,
  Coffee,
  Flame,
  CheckCircle2,
  BookOpen,
  Filter,
} from 'lucide-react';

const MOODS = [
  { id: 'Mind-Bending', label: 'Mind-Bending', icon: Brain, color: '#38BDF8' },
  { id: 'Emotional', label: 'Emotional & Moving', icon: Heart, color: '#F472B6' },
  { id: 'Fast-Paced', label: 'Fast & Gripping', icon: Zap, color: '#F59E0B' },
  { id: 'Dark & Gripping', label: 'Dark & Psychological', icon: Moon, color: '#A78BFA' },
  { id: 'Cozy & Relaxing', label: 'Cozy & Relaxing', icon: Coffee, color: '#34D399' },
  { id: 'Inspirational', label: 'Inspirational & Habits', icon: Flame, color: '#FBBF24' },
];

export default function Recommendations() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();

  const urlMood = searchParams.get('mood') || 'Mind-Bending';
  const urlGenre = searchParams.get('genre') || 'All';
  const urlPace = searchParams.get('pace') || 'Any';

  const [activeTab, setActiveTab] = useState('vibe'); // 'vibe' | 'for-you'
  const [selectedMood, setSelectedMood] = useState(urlMood);
  const [selectedGenre, setSelectedGenre] = useState(urlGenre);
  const [selectedPace, setSelectedPace] = useState(urlPace);
  const [selectedLength, setSelectedLength] = useState('all');

  const [vibeResults, setVibeResults] = useState([]);
  const [forYouResults, setForYouResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Vibe Matches
  const fetchVibeMatches = async () => {
    setIsLoading(true);
    try {
      const res = await api.post('/recommendations/vibe-matcher', {
        mood: selectedMood,
        genre: selectedGenre !== 'All' ? selectedGenre : undefined,
        pace: selectedPace !== 'Any' ? selectedPace : undefined,
        length: selectedLength !== 'all' ? selectedLength : undefined,
        limit: 12,
      });
      setVibeResults(res.data?.data || []);
    } catch (err) {
      console.error('Failed to match vibe', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Personalized For-You Feed
  const fetchForYou = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/recommendations/for-you?limit=12');
      setForYouResults(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load personalized recommendations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'vibe') {
      fetchVibeMatches();
    } else {
      fetchForYou();
    }
  }, [activeTab, selectedMood, selectedGenre, selectedPace, selectedLength]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08070D', color: '#FFFFFF', paddingBottom: '6rem' }}>
      {/* Header Banner */}
      <section
        style={{
          padding: '3rem 0 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundImage:
            'radial-gradient(circle at 75% 25%, rgba(139, 92, 246, 0.22) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A78BFA', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            <Sparkles size={17} />
            <span>AI & Content-Based Recommendation Engine</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Find Your Next Perfect Read
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.98rem', maxWidth: '640px' }}>
            Our recommendation algorithm matches your exact emotional appetite, preferred pacing, and favorite genres to deliver high-affinity book suggestions.
          </p>

          {/* Dual Recommendation Mode Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '2rem',
            }}
          >
            <button
              onClick={() => setActiveTab('vibe')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.4rem',
                borderRadius: 'var(--radius-pill)',
                background: activeTab === 'vibe' ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.05)',
                border: activeTab === 'vibe' ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'vibe' ? '0 4px 20px rgba(139, 92, 246, 0.5)' : 'none',
              }}
            >
              <Sparkles size={16} />
              <span>Interactive Vibe Matcher</span>
            </button>

            <button
              onClick={() => setActiveTab('for-you')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.4rem',
                borderRadius: 'var(--radius-pill)',
                background: activeTab === 'for-you' ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.05)',
                border: activeTab === 'for-you' ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: activeTab === 'for-you' ? '0 4px 20px rgba(139, 92, 246, 0.5)' : 'none',
              }}
            >
              <Compass size={16} />
              <span>Personalized For You {isAuthenticated && `(${user?.name?.split(' ')[0]})`}</span>
            </button>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* ========================================================================= */}
        {/* TAB 1: VIBE MATCHER CRITERIA BAR */}
        {/* ========================================================================= */}
        {activeTab === 'vibe' && (
          <div
            className="glass-widget-card"
            style={{
              padding: '1.75rem',
              borderRadius: '24px',
              backgroundColor: 'rgba(20, 18, 34, 0.85)',
              border: '1px solid rgba(139, 92, 246, 0.35)',
              marginBottom: '2.5rem',
            }}
          >
            {/* Step 1: Mood Choice */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
                1. Select Reading Mood
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.65rem' }}>
                {MOODS.map((m) => {
                  const Icon = m.icon;
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMood(m.id)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '14px',
                        background: isSelected ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? `1.5px solid ${m.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                        color: isSelected ? '#FFFFFF' : '#CBD5E1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Icon size={16} color={m.color} />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 & 3: Genre & Pace & Length */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '1.25rem',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                >
                  {['All', 'Sci-Fi', 'Mystery', 'Thriller', 'Fantasy', 'Self-Help', 'Non-Fiction', 'Romance', 'Classics', 'Philosophy'].map((g) => (
                    <option key={g} value={g} style={{ background: '#151324' }}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Reading Pace
                </label>
                <select
                  value={selectedPace}
                  onChange={(e) => setSelectedPace(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                >
                  <option value="Any" style={{ background: '#151324' }}>Any Pace</option>
                  <option value="Fast" style={{ background: '#151324' }}>Fast & Gripping</option>
                  <option value="Moderate" style={{ background: '#151324' }}>Moderate</option>
                  <option value="Slow Burn" style={{ background: '#151324' }}>Slow Burn & Rich</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#94A3B8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Book Length
                </label>
                <select
                  value={selectedLength}
                  onChange={(e) => setSelectedLength(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    outline: 'none',
                  }}
                >
                  <option value="all" style={{ background: '#151324' }}>Any Length</option>
                  <option value="short" style={{ background: '#151324' }}>Quick Read (&lt; 280 pages)</option>
                  <option value="medium" style={{ background: '#151324' }}>Standard Novel (280 - 450 pages)</option>
                  <option value="epic" style={{ background: '#151324' }}>Epic Doorstopper (&gt; 450 pages)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Heading */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>
              {activeTab === 'vibe' ? `Matches for "${selectedMood}" Vibe` : 'Curated Just for You'}
            </h3>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Ranked by algorithm compatibility and reader reception
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="glass-widget-card"
                style={{ height: '420px', opacity: 0.5, animation: 'pulse 1.5s infinite' }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {(activeTab === 'vibe' ? vibeResults : forYouResults).map((book) => (
              <BookCard
                key={book._id}
                book={book}
                matchPercentage={book.matchPercentage}
                matchReasons={book.matchReasons}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
