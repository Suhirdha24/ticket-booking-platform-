import React, { useState } from 'react';
import { X, BookOpen, CheckCircle2, Bookmark } from 'lucide-react';
import { useBookshelfStore } from '../../store/bookshelfStore.js';

export default function ReadingProgressModal({ item, onClose }) {
  const { updateShelfItem } = useBookshelfStore();
  const book = item?.book;
  const totalPages = book?.pageCount || 300;

  const [pages, setPages] = useState(item?.progressPages || 0);
  const [notes, setNotes] = useState(item?.personalNotes || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!item || !book) return null;

  const percent = Math.min(100, Math.round((pages / totalPages) * 100));

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const isComplete = pages >= totalPages;
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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="glass-widget-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2rem',
          backgroundColor: '#151324',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 92, 246, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={20} color="#8B5CF6" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
              Update Reading Progress
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#FFFFFF',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Book Title & Mini Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.85rem 1rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            marginBottom: '1.5rem',
          }}
        >
          <img
            src={book.coverImage}
            alt={book.title}
            style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
          />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF' }}>{book.title}</div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>by {book.author}</div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 800 }}>
              <span style={{ color: '#E2E8F0' }}>Current Page</span>
              <span style={{ color: '#A78BFA' }}>
                {pages} of {totalPages} ({percent}%)
              </span>
            </div>

            <input
              type="range"
              min="0"
              max={totalPages}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#8B5CF6',
                cursor: 'pointer',
                marginBottom: '0.6rem',
              }}
            />

            <input
              type="number"
              min="0"
              max={totalPages}
              value={pages}
              onChange={(e) => setPages(Math.min(totalPages, Math.max(0, Number(e.target.value))))}
              className="form-input"
              style={{ textAlign: 'center', fontWeight: 800, fontSize: '1.1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#E2E8F0', marginBottom: '0.5rem' }}>
              Personal Reading Notes & Thoughts (Optional)
            </label>
            <textarea
              className="form-input"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record favorite quotes, thoughts on the latest chapter..."
              style={{ resize: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-purple-glow"
            style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem' }}
          >
            {pages >= totalPages ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={16} />
                <span>Mark Book as Completed! 🎉</span>
              </div>
            ) : (
              <span>Save Progress</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
