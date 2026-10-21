import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Coffee, Moon, Heart, Brain, Flame } from 'lucide-react';

const MOODS = [
  { id: 'Mind-Bending', label: 'Mind-Bending', icon: Brain, desc: 'Twists & deep questions' },
  { id: 'Emotional', label: 'Emotional & Moving', icon: Heart, desc: 'Heartstrings & character depth' },
  { id: 'Fast-Paced', label: 'Fast-Paced', icon: Zap, desc: 'Unputdownable page-turner' },
  { id: 'Dark & Gripping', label: 'Dark & Gripping', icon: Moon, desc: 'Suspense & psychological thrill' },
  { id: 'Cozy & Relaxing', label: 'Cozy & Comforting', icon: Coffee, desc: 'Gentle, warm, and uplifting' },
  { id: 'Inspirational', label: 'Inspirational', icon: Flame, desc: 'Perspective shifts & big ideas' },
];

export default function MoodMatcherWidget() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('Mind-Bending');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedPace, setSelectedPace] = useState('Any');

  const handleMatch = () => {
    const params = new URLSearchParams();
    if (selectedMood) params.append('mood', selectedMood);
    if (selectedGenre && selectedGenre !== 'All') params.append('genre', selectedGenre);
    if (selectedPace && selectedPace !== 'Any') params.append('pace', selectedPace);
    navigate(`/recommendations?${params.toString()}`);
  };

  return (
    <div
      className="card-clean"
      style={{
        padding: '2rem',
        borderRadius: '16px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
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
              marginBottom: '0.25rem',
            }}
          >
            <Sparkles size={14} />
            <span>Vibe Matcher</span>
          </div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-heading)' }}>
            What kind of story do you feel like reading?
          </h3>
        </div>

        <button
          onClick={handleMatch}
          className="btn btn-primary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
        >
          <span>Find My Matches</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Mood Tiles Selector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
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
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0.9rem',
                borderRadius: '10px',
                background: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  background: isSelected ? '#FFFFFF' : 'var(--bg-subtle)',
                  color: isSelected ? 'var(--primary)' : 'var(--text-body)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.6rem',
                }}
              >
                <Icon size={16} />
              </div>

              <div
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: isSelected ? 'var(--primary)' : 'var(--text-heading)',
                  marginBottom: '0.2rem',
                }}
              >
                {m.label}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                {m.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Tweaks: Genre & Reading Pace */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Filter Genre:
          </span>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--border-medium)',
              background: '#FFFFFF',
              color: 'var(--text-heading)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Reading Pace:
          </span>
          <select
            value={selectedPace}
            onChange={(e) => setSelectedPace(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--border-medium)',
              background: '#FFFFFF',
              color: 'var(--text-heading)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <option value="Any">Any Pacing</option>
            <option value="Fast">Fast Paced</option>
            <option value="Moderate">Moderate</option>
            <option value="Slow Burn">Slow Burn & Epic</option>
          </select>
        </div>
      </div>
    </div>
  );
}
