import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBookshelfStore } from '../store/bookshelfStore.js';
import { useAuthStore } from '../store/authStore.js';
import BookCard from '../components/books/BookCard.jsx';
import ReadingProgressModal from '../components/books/ReadingProgressModal.jsx';
import {
  Bookmark,
  BookOpen,
  Target,
  Edit3,
  Trash2,
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
            <Bookmark size={16} />
            <span>Personal Library</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.4rem' }}>
            My Reading Bookshelf
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Track current reads, log page progress, and celebrate your reading milestones.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Annual Reading Challenge & Stats Card */}
        <div
          className="card-clean"
          style={{
            padding: '1.75rem',
            borderRadius: '14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-medium)',
            marginBottom: '2rem',
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-amber)', fontSize: '0.85rem', fontWeight: 700 }}>
                  <Target size={16} />
                  <span>2026 Reading Challenge</span>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {completedCount} of {annualGoal} Books
                </span>
              </div>

              {/* Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--bg-subtle)',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '0.65rem',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${goalPercent}%`,
                    background: 'var(--primary)',
                    borderRadius: '9999px',
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {goalPercent >= 100
                  ? '🎉 Challenge completed! Outstanding reading achievement.'
                  : `${annualGoal - completedCount} more books to reach your annual goal.`}
              </div>
            </div>

            {/* Quick Metrics Columns */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
              }}
            >
              <div style={{ padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {stats.currentlyReading}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Reading
                </div>
              </div>

              <div style={{ padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  {stats.completed}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Finished
                </div>
              </div>

              <div style={{ padding: '0.85rem', background: 'var(--bg-subtle)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                  {stats.totalPagesRead.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
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
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1.75rem',
          }}
        >
          <button
            onClick={() => setActiveTab('ALL')}
            className={`genre-chip ${activeTab === 'ALL' ? 'active' : ''}`}
          >
            All Shelved ({shelfItems.length})
          </button>

          <button
            onClick={() => setActiveTab('CURRENTLY_READING')}
            className={`genre-chip ${activeTab === 'CURRENTLY_READING' ? 'active' : ''}`}
          >
            Currently Reading ({stats.currentlyReading})
          </button>

          <button
            onClick={() => setActiveTab('WANT_TO_READ')}
            className={`genre-chip ${activeTab === 'WANT_TO_READ' ? 'active' : ''}`}
          >
            Want to Read ({stats.wantToRead})
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`genre-chip ${activeTab === 'COMPLETED' ? 'active' : ''}`}
          >
            Finished ({stats.completed})
          </button>

          <button
            onClick={() => setActiveTab('FAVORITES')}
            className={`genre-chip ${activeTab === 'FAVORITES' ? 'active' : ''}`}
          >
            Favorites ({stats.favorites})
          </button>
        </div>

        {/* Shelf Items Grid */}
        {filteredItems.length === 0 ? (
          <div
            className="card-clean"
            style={{
              padding: '4rem 1.5rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid var(--border-medium)',
            }}
          >
            <BookOpen size={40} color="var(--text-subtle)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              No books on this shelf yet
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', fontSize: '0.9rem' }}>
              Explore our library catalog or launch the Vibe Matcher to find books you will love.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/books" className="btn btn-primary">
                Browse Catalog
              </Link>
              <Link to="/recommendations" className="btn btn-secondary">
                Vibe Matcher
              </Link>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem',
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

                  {/* Shelf Item Custom Progress / Actions Footer */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid var(--border-medium)',
                      borderTop: 'none',
                      borderRadius: '0 0 14px 14px',
                      padding: '0.75rem 0.9rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                    }}
                  >
                    {isReading && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                          <span>Page {item.progressPages || 0} of {book.pageCount}</span>
                          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{progressPct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '5px', background: 'var(--bg-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--primary)', borderRadius: '9999px' }} />
                        </div>
                      </div>
                    )}

                    {item.personalNotes && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-body)', fontStyle: 'italic', background: 'var(--bg-subtle)', padding: '0.35rem 0.55rem', borderRadius: '4px' }}>
                        &ldquo;{item.personalNotes}&rdquo;
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
                      <button
                        onClick={() => setEditingItem(item)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
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
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-rose)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
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
