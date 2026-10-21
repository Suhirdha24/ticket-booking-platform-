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
      showSuccessToast('Profile Updated!', 'Your reading preferences and challenge goal have been saved.');
    } catch (err) {
      showErrorToast('Failed to update profile', err.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '5rem' }}>
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
            <User size={16} />
            <span>Account Settings</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
            Reader Profile & Preferences
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Customize your recommendation preferences, genres, and annual reading goal.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* 1. Basic Info Card */}
            <div
              className="card-clean"
              style={{
                padding: '2rem',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-medium)',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1.25rem' }}>
                Personal Information
              </h3>

              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                  alt={name}
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                    {name || 'Reader'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {user?.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label className="form-label" htmlFor="profile-name">
                    Display Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="profile-bio">
                    Reader Bio
                  </label>
                  <textarea
                    id="profile-bio"
                    rows={3}
                    placeholder="Tell other readers about your favorite tropes, authors, and reading habits..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Annual Goal Card */}
            <div
              className="card-clean"
              style={{
                padding: '2rem',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-medium)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Target size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  2026 Annual Reading Challenge
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Set the number of books you aspire to read and complete this year.
              </p>

              <div>
                <label className="form-label" htmlFor="annual-goal-input">
                  Goal Target (Books)
                </label>
                <input
                  id="annual-goal-input"
                  type="number"
                  min="1"
                  max="365"
                  value={annualGoal}
                  onChange={(e) => setAnnualGoal(e.target.value)}
                  className="form-input"
                  style={{ maxWidth: '180px' }}
                />
              </div>
            </div>

            {/* 3. Favorite Genres Card */}
            <div
              className="card-clean"
              style={{
                padding: '2rem',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-medium)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <BookOpen size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Favorite Genres
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Selected genres heavily influence your "For You" personalized recommendation feed.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {ALL_GENRES.map((genre) => {
                  const isSelected = preferredGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                        color: isSelected ? 'var(--primary)' : 'var(--text-body)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isSelected && <Check size={12} />}
                      <span>{genre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Mood Preferences Card */}
            <div
              className="card-clean"
              style={{
                padding: '2rem',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-medium)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  Preferred Moods & Vibes
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Select what emotions you gravitate toward most when choosing books.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {ALL_MOODS.map((mood) => {
                  const isSelected = preferredMoods.includes(mood);
                  return (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => toggleMood(mood)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-medium)',
                        backgroundColor: isSelected ? 'var(--primary-light)' : '#FFFFFF',
                        color: isSelected ? 'var(--primary)' : 'var(--text-body)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isSelected && <Check size={12} />}
                      <span>{mood}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}
              >
                <Save size={16} />
                <span>{isLoading ? 'Saving...' : 'Save Preferences'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
