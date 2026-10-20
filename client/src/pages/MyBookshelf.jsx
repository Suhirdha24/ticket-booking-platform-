import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBookshelfStore } from '../store/bookshelfStore.js';
import { useAuthStore } from '../store/authStore.js';
import BookCard from '../components/books/BookCard.jsx';
import ReadingProgressModal from '../components/books/ReadingProgressModal.jsx';
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  Heart,
  Target,
  Sparkles,
  Compass,
  TrendingUp,
  Edit3,
  Trash2,
  Star,
  Clock,
  Layers,
} from 'lucide-react';

export default function MyBookshelf() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { shelfItems, stats, fetchShelf, removeFromShelf } = useBookshelfStore();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'CURRENTLY_READING' | 'WANT_TO_READ' | 'COMPLETED' | 'FAVORITES'
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/my-bookshelf');
      return;
    }
    fetchShelf();
  }, [isAuthenticated]);

  const annualGoal = user?.annualReadingGoal || 15;
  const completedCount = stats.completed || 0;
  const goalPercent = Math.min(100, Math.round((completedCount / annualGoal) * 100));

  const filteredItems = shelfItems.filter((item) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'FAVORITES') return item.isFavorite;
    return item.status === activeTab;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08070D', color: '#FFFFFF', paddingBottom: '6rem' }}>
      {/* Header Banner */}
      <section
        style={{
          padding: '3rem 0 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundImage: 'radial-gradient(circle at 80% 30%, rgba(139, 92, 246, 0.2) 0%, transparent 60%)',
        }}
      >
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A78BFA', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            <Bookmark size={17} />
            <span>Personal Library & Tracking</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.5rem' }}>
            My Reading Bookshelf
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.98rem' }}>
            Track current reads, log daily page progress, and celebrate your annual reading milestones.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '2.5rem' }}>
        {/* Annual Reading Challenge & Stats Card */}
        <div
          className="glass-widget-card"
          style={{
            padding: '2rem',
            borderRadius: '24px',
            backgroundColor: 'rgba(20, 18, 34, 0.9)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            {/* Goal Progress Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#FBBF24', fontSize: '0.82rem', fontWeight: 800 }}>
                  <Target size={18} />
                  <span>2026 Reading Challenge</span>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#A78BFA' }}>
                  {completedCount} of {annualGoal} Books Completed
                </span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '0.75rem',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${goalPercent}%`,
                    background: 'var(--gradient-purple)',
                    borderRadius: '9999px',
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>

              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                {goalPercent >= 100
                  ? '🎉 Challenge completed! You are on fire.'
                  : `${annualGoal - completedCount} more books to reach your annual goal.`}
              </div>
            </div>

            {/* Quick Metrics Columns */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
              }}
            >
              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38BDF8' }}>
                  {stats.currentlyReading}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
                  Reading Now
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34D399' }}>
                  {stats.completed}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
                  Finished
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#C084FC' }}>
                  {stats.totalPagesRead.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>
                  Pages Read
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shelves Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.65rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '2rem',
          }}
          className="no-scrollbar"
        >
          <button
            onClick={() => setActiveTab('ALL')}
            className={`sonora-filter-chip ${activeTab === 'ALL' ? 'active' : ''}`}
          >
            <span>📚 All Shelved ({shelfItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CURRENTLY_READING')}
            className={`sonora-filter-chip ${activeTab === 'CURRENTLY_READING' ? 'active' : ''}`}
          >
            <span>📖 Currently Reading ({stats.currentlyReading})</span>
          </button>

          <button
            onClick={() => setActiveTab('WANT_TO_READ')}
            className={`sonora-filter-chip ${activeTab === 'WANT_TO_READ' ? 'active' : ''}`}
          >
            <span>🔖 Want to Read ({stats.wantToRead})</span>
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`sonora-filter-chip ${activeTab === 'COMPLETED' ? 'active' : ''}`}
          >
            <span>✅ Finished / Read ({stats.completed})</span>
          </button>

          <button
            onClick={() => setActiveTab('FAVORITES')}
            className={`sonora-filter-chip ${activeTab === 'FAVORITES' ? 'active' : ''}`}
          >
            <span>💖 Favorites ({stats.favorites})</span>
          </button>
        </div>

        {/* Shelf Items List / Grid */}
        {filteredItems.length === 0 ? (
          <div
            className="glass-widget-card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <BookOpen size={48} color="#8B5CF6" />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF' }}>
              No books on this shelf yet
            </h3>
            <p style={{ color: '#94A3B8', maxWidth: '400px' }}>
              Explore our curated library catalog or try the interactive Vibe Matcher to find books you will love.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <Link to="/books">
                <button className="btn-purple-glow">Browse All Books</button>
              </Link>
              <Link to="/recommendations">
                <button className="btn-secondary">Launch Vibe Matcher</button>
              </Link>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {filteredItems.map((item) => {
              const book = item.book;
              if (!book) return null;
              const isReading = item.status === 'CURRENTLY_READING';
              const progressPct = Math.min(100, Math.round(((item.progressPages || 0) / book.pageCount) * 100));

              return (
                <div key={item._id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1 }}>
                    <BookCard book={book} />
                  </div>

                  {/* Shelf Item Custom Progress / Actions Bar */}
                  <div
                    style={{
                      background: 'rgba(20, 18, 34, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderTop: 'none',
                      borderRadius: '0 0 20px 20px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                    }}
                  >
                    {isReading && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#CBD5E1', marginBottom: '0.35rem' }}>
                          <span>Page {item.progressPages || 0} of {book.pageCount}</span>
                          <span style={{ color: '#A78BFA', fontWeight: 800 }}>{progressPct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--gradient-purple)', borderRadius: '9999px' }} />
                        </div>
                      </div>
                    )}

                    {item.personalNotes && (
                      <div style={{ fontSize: '0.74rem', color: '#DDD6FE', fontStyle: 'italic', background: 'rgba(139, 92, 246, 0.1)', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                        &ldquo;{item.personalNotes}&rdquo;
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.3rem' }}>
                      <button
                        onClick={() => setEditingItem(item)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#A78BFA',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <Edit3 size={13} />
                        <span>Update Progress</span>
                      </button>

                      <button
                        onClick={() => removeFromShelf(book._id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#EF4444',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Update Progress Modal */}
      {editingItem && (
        <ReadingProgressModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}
