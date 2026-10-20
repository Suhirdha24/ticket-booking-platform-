import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, ArrowRight, Zap, Coffee, Moon, Heart, Brain, Flame } from 'lucide-react';

const MOODS = [
  { id: 'Mind-Bending', label: 'Mind-Bending', icon: Brain, desc: 'Twists & thought experiments', color: '#38BDF8' },
  { id: 'Emotional', label: 'Emotional & Moving', icon: Heart, desc: 'Tears, joy & heartstrings', color: '#F472B6' },
  { id: 'Fast-Paced', label: 'Fast & Unputdownable', icon: Zap, desc: 'Adrenaline from page one', color: '#F59E0B' },
  { id: 'Dark & Gripping', label: 'Dark & Gripping', icon: Moon, desc: 'Psychological & suspenseful', color: '#A78BFA' },
  { id: 'Cozy & Relaxing', label: 'Cozy & Comforting', icon: Coffee, desc: 'Warm blankets & gentle stories', color: '#34D399' },
  { id: 'Inspirational', label: 'Inspirational & Deep', icon: Flame, desc: 'Life shifts & big ideas', color: '#FBBF24' },
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
      className="glass-widget-card"
      style={{
        padding: '2rem',
        borderRadius: '24px',
        backgroundColor: 'rgba(20, 18, 34, 0.9)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 35px rgba(139, 92, 246, 0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A78BFA', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <Sparkles size={16} />
            <span>AI & Vibe Recommendation Engine</span>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', marginTop: '0.2rem' }}>
            What kind of story do you need right now?
          </h3>
        </div>

        <button
          onClick={handleMatch}
          className="btn-purple-glow"
          style={{ padding: '0.7rem 1.4rem', fontSize: '0.88rem' }}
        >
          <span>Find My Matches</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Mood Cards Selector */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
                padding: '1rem',
                borderRadius: '16px',
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.28) 0%, rgba(99, 102, 241, 0.15) 100%)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: isSelected ? `1.5px solid ${m.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? `0 0 20px ${m.color}40` : 'none',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: `${m.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.6rem',
                }}
              >
                <Icon size={18} color={m.color} />
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.2rem' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                {m.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Filters: Genre & Pace */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 800 }}>Genre Preference:</span>
          {['All', 'Sci-Fi', 'Mystery', 'Fantasy', 'Self-Help', 'Romance', 'Non-Fiction'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGenre(g)}
              style={{
                padding: '0.35rem 0.8rem',
                borderRadius: 'var(--radius-pill)',
                background: selectedGenre === g ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.05)',
                border: selectedGenre === g ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.08)',
                color: selectedGenre === g ? '#FFFFFF' : '#CBD5E1',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {g}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 800 }}>Pace:</span>
          {['Any', 'Fast', 'Moderate', 'Slow Burn'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPace(p)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-pill)',
                background: selectedPace === p ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                border: selectedPace === p ? '1px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.08)',
                color: selectedPace === p ? '#A78BFA' : '#94A3B8',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
