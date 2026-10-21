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
  BookOpen,
} from 'lucide-react';

const MOODS = [
  { id: 'Mind-Bending', label: 'Mind-Bending', icon: Brain },
  { id: 'Emotional', label: 'Emotional & Moving', icon: Heart },
  { id: 'Fast-Paced', label: 'Fast-Paced', icon: Zap },
  { id: 'Dark & Gripping', label: 'Dark & Gripping', icon: Moon },
  { id: 'Cozy & Relaxing', label: 'Cozy & Relaxing', icon: Coffee },
  { id: 'Inspirational', label: 'Inspirational', icon: Flame },
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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section
        style={{
          padding: '2.5rem 0 2rem',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.4rem',
            }}
          >
            <Sparkles size={16} />
            <span>Recommendation Engine</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
            Find Your Next Perfect Read
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '640px' }}>
            Match your exact emotional appetite, preferred pacing, and favorite genres to receive high-affinity book suggestions.
          </p>

          {/* Dual Recommendation Mode Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1.5rem',
            }}
          >
            <button
              onClick={() => setActiveTab('vibe')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                background: activeTab === 'vibe' ? 'var(--primary)' : '#FFFFFF',
                border: activeTab === 'vibe' ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                color: activeTab === 'vibe' ? '#FFFFFF' : 'var(--text-heading)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
              }}
            >
              <Sparkles size={15} />
              <span>Interactive Vibe Matcher</span>
            </button>

            <button
              onClick={() => setActiveTab('for-you')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.15rem',
                borderRadius: '8px',
                background: activeTab === 'for-you' ? 'var(--primary)' : '#FFFFFF',
                border: activeTab === 'for-you' ? '1px solid var(--primary)' : '1px solid var(--border-medium)',
                color: activeTab === 'for-you' ? '#FFFFFF' : 'var(--text-heading)',
                fontWeight: 600,
                fontSize: '0.86rem',
                cursor: 'pointer',
              }}
            >
              <Compass size={15} />
              <span>Personalized For You {isAuthenticated && `(${user?.name?.split(' ')[0]})`}</span>
            </button>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* TAB 1: VIBE MATCHER FILTERS */}
        {activeTab === 'vibe' && (
          <div
            className="card-clean"
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-medium)',
              marginBottom: '2rem',
            }}
          >
            {/* Step 1: Mood Choice */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                1. Select Desired Mood
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {MOODS.map((m) => {
                  const Icon = m.icon;
                  const isSelected = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMood(m.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '6px',
                        background: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                        border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
                        color: isSelected ? 'var(--primary)' : 'var(--text-body)',
                        fontSize: '0.82rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      <Icon size={14} />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Genre, Pace, Length */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Genre:</span>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)',
                    background: '#FFFFFF',
                    color: 'var(--text-heading)',
                    fontSize: '0.82rem',
                  }}
                >
                  <option value="All">All Genres</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Romance">Romance</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Classics">Classics</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Pacing:</span>
                <select
                  value={selectedPace}
                  onChange={(e) => setSelectedPace(e.target.value)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)',
                    background: '#FFFFFF',
                    color: 'var(--text-heading)',
                    fontSize: '0.82rem',
                  }}
                >
                  <option value="Any">Any Pacing</option>
                  <option value="Fast">Fast Paced</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Slow Burn">Slow Burn & Epic</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Length:</span>
                <select
                  value={selectedLength}
                  onChange={(e) => setSelectedLength(e.target.value)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)',
                    background: '#FFFFFF',
                    color: 'var(--text-heading)',
                    fontSize: '0.82rem',
                  }}
                >
                  <option value="all">Any Length</option>
                  <option value="short">Short (&lt; 280 p)</option>
                  <option value="medium">Medium (280–450 p)</option>
                  <option value="epic">Epic (&gt; 450 p)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS GRID */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              {activeTab === 'vibe' ? `Recommended for "${selectedMood}"` : 'Curated Just For You'}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {(activeTab === 'vibe' ? vibeResults : forYouResults).length} Recommendations
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {isLoading ? (
              [1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  style={{
                    height: '380px',
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                  }}
                />
              ))
            ) : (activeTab === 'vibe' ? vibeResults : forYouResults).length > 0 ? (
              (activeTab === 'vibe' ? vibeResults : forYouResults).map((item) => {
                const bookData = item.book || item;
                const matchPct = item.matchPercentage || item.recommendationScore;
                return (
                  <BookCard
                    key={bookData._id}
                    book={bookData}
                    matchPercentage={matchPct}
                    matchReasons={item.matchReasons}
                  />
                );
              })
            ) : (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '4rem 1rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-medium)',
                }}
              >
                <BookOpen size={40} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
                  No matches found for this specific combo
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Try adjusting your pacing or choosing "All Genres".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
