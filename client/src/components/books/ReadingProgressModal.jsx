import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { useBookshelfStore } from '../../store/bookshelfStore.js';

export default function ReadingProgressModal({ item, book: propBook, currentPages = 0, onClose }) {
  const { updateShelfItem } = useBookshelfStore();
  const book = item?.book || propBook;
  const totalPages = book?.pageCount || 300;

  const [pages, setPages] = useState(item?.progressPages || currentPages || 0);
  const [notes, setNotes] = useState(item?.personalNotes || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!book) return null;

  const percent = Math.min(100, Math.round((pages / totalPages) * 100));

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const isComplete = Number(pages) >= totalPages;
      await updateShelfItem(book._id, {
        progressPages: Number(pages),
        personalNotes: notes,
        status: isComplete ? 'COMPLETED' : 'CURRENTLY_READING',
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="card-clean"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-medium)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-dropdown)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              Update Reading Progress
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-subtle)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Book Title Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.75rem 1rem',
            background: 'var(--bg-subtle)',
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}
        >
          <img
            src={book.coverImage}
            alt={book.title}
            style={{ width: '38px', height: '54px', objectFit: 'cover', borderRadius: '4px' }}
          />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1.25 }}>
              {book.title}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              by {book.author} • {totalPages} total pages
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Progress Slider & Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                Pages Read
              </label>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                {pages} / {totalPages} pages ({percent}%)
              </div>
            </div>

            <input
              type="range"
              min="0"
              max={totalPages}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: 'var(--primary)',
                marginBottom: '0.75rem',
                cursor: 'pointer',
              }}
            />

            <input
              type="number"
              min="0"
              max={totalPages}
              value={pages}
              onChange={(e) => setPages(Math.max(0, Math.min(totalPages, Number(e.target.value))))}
              className="form-input"
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.9rem' }}
            />
          </div>

          {/* Personal Notes */}
          <div>
            <label className="form-label">Reading Notes or Thoughts (Optional)</label>
            <textarea
              rows={3}
              placeholder="Record a favorite quote, note, or chapter reflection..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.65rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.65rem' }}
            >
              {isSaving ? 'Saving...' : 'Save Progress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
