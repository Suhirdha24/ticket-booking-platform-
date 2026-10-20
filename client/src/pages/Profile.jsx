import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { showSuccessToast, showErrorToast } from '../store/toastStore.js';
import {
  User,
  Target,
  Sparkles,
  BookOpen,
  Check,
  Save,
  Shield,
  Heart,
  Compass,
} from 'lucide-react';

const ALL_GENRES = [
  'Sci-Fi',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Self-Help',
  'Non-Fiction',
  'Fiction',
  'Romance',
  'Philosophy',
  'Classics',
];

const ALL_MOODS = [
  'Mind-Bending',
  'Emotional',
  'Fast-Paced',
  'Dark & Gripping',
  'Cozy & Relaxing',
  'Inspirational',
];

export default function Profile() {
  const { user, updateProfile, isLoading } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [annualGoal, setAnnualGoal] = useState(user?.annualReadingGoal || 15);
  const [preferredGenres, setPreferredGenres] = useState(user?.preferredGenres || ['Fiction', 'Sci-Fi']);
  const [preferredMoods, setPreferredMoods] = useState(user?.preferredMoods || ['Mind-Bending']);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAnnualGoal(user.annualReadingGoal || 15);
      setPreferredGenres(user.preferredGenres || ['Fiction', 'Sci-Fi']);
      setPreferredMoods(user.preferredMoods || ['Mind-Bending']);
    }
  }, [user]);

  const toggleGenre = (genre) => {
    if (preferredGenres.includes(genre)) {
      setPreferredGenres(preferredGenres.filter((g) => g !== genre));
    } else {
      setPreferredGenres([...preferredGenres, genre]);
    }
  };

  const toggleMood = (mood) => {
    if (preferredMoods.includes(mood)) {
      setPreferredMoods(preferredMoods.filter((m) => m !== mood));
    } else {
      setPreferredMoods([...preferredMoods, mood]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        bio,
        annualReadingGoal: Number(annualGoal),
        preferredGenres,
        preferredMoods,
      });
      showSuccessToast('Profile Updated! 🎉', 'Your reading preferences and challenge goal have been saved.');
    } catch (err) {
      showErrorToast('Failed to update profile', err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08070D', color: '#FFFFFF', paddingBottom: '6rem' }}>
      <section
        style={{
          padding: '3rem 0 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundImage: 'radial-gradient(circle at 80% 30%, rgba(139, 92, 246, 0.2) 0%, transparent 60%)',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A78BFA', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            <User size={17} />
            <span>Reader Account & Preferences</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            Customize Your Reading DNA
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
            Tailor your preferred genres and emotional moods to train the recommendation engine for your exact tastes.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '2.5rem', maxWidth: '780px' }}>
        <form
          onSubmit={handleSubmit}
          className="glass-widget-card"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            backgroundColor: 'rgba(20, 18, 34, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {/* User Basic Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
              alt={user?.name}
              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #8B5CF6' }}
            />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>{user?.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{user?.email}</div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
              Reader Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="form-input"
              rows="3"
              placeholder="Tell other readers what stories and themes captivate you..."
              style={{ resize: 'none' }}
            />
          </div>

          {/* Annual Goal */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Target size={16} color="#FBBF24" />
                <span>Annual Reading Goal (2026)</span>
              </label>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: '#A78BFA' }}>
                {annualGoal} Books
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={annualGoal}
              onChange={(e) => setAnnualGoal(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#8B5CF6', cursor: 'pointer' }}
            />
          </div>

          {/* Preferred Genres Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.75rem' }}>
              Your Favorite Genres (Influences Recommendations)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ALL_GENRES.map((g) => {
                const isSelected = preferredGenres.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-pill)',
                      background: isSelected ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#FFFFFF' : '#CBD5E1',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{g}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Moods Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.75rem' }}>
              Preferred Emotional Moods & Vibes
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {ALL_MOODS.map((m) => {
                const isSelected = preferredMoods.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleMood(m)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: 'var(--radius-pill)',
                      background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '1.5px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#FFFFFF' : '#CBD5E1',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>✦ {m}</span>
                    {isSelected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-purple-glow"
            style={{ padding: '1rem', fontSize: '1rem', justifyContent: 'center' }}
          >
            <Save size={18} />
            <span>Save Reading Preferences</span>
          </button>
        </form>
      </div>
    </div>
  );
}
