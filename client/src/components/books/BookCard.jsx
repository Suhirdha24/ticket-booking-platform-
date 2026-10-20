import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Bookmark,
  Check,
  BookOpen,
  Sparkles,
  Clock,
  Flame,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { useBookshelfStore } from '../../store/bookshelfStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { showWarningToast } from '../../store/toastStore.js';

const GENRE_COLORS = {
  'Sci-Fi': { text: '#38BDF8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.35)' },
  Fantasy: { text: '#C084FC', bg: 'rgba(192, 132, 252, 0.15)', border: 'rgba(192, 132, 252, 0.35)' },
  Mystery: { text: '#F43F5E', bg: 'rgba(244, 63, 94, 0.15)', border: 'rgba(244, 63, 94, 0.35)' },
  Thriller: { text: '#FB7185', bg: 'rgba(251, 113, 133, 0.15)', border: 'rgba(251, 113, 133, 0.35)' },
  'Self-Help': { text: '#34D399', bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.35)' },
  'Non-Fiction': { text: '#FBBF24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.35)' },
  Fiction: { text: '#A78BFA', bg: 'rgba(167, 139, 250, 0.15)', border: 'rgba(167, 139, 250, 0.35)' },
  Romance: { text: '#F472B6', bg: 'rgba(244, 114, 182, 0.15)', border: 'rgba(244, 114, 182, 0.35)' },
  Classics: { text: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)' },
  Philosophy: { text: '#818CF8', bg: 'rgba(129, 140, 248, 0.15)', border: 'rgba(129, 140, 248, 0.35)' },
};

export default function BookCard({ book, matchPercentage, matchReasons }) {
  const { getBookShelfStatus, updateShelfItem } = useBookshelfStore();
  const { isAuthenticated } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!book) return null;

  const currentShelf = getBookShelfStatus(book._id);
  const primaryGenre = book.genres?.[0] || 'Fiction';
  const genreTheme = GENRE_COLORS[primaryGenre] || GENRE_COLORS.Fiction;

  const handleShelfClick = async (e, status) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(false);

    if (!isAuthenticated) {
      showWarningToast('Sign In Required', 'Please sign in to add books to your reading shelf.');
      return;
    }

    setIsUpdating(true);
    try {
      await updateShelfItem(book._id, { status });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="glass-widget-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '22px',
        backgroundColor: 'rgba(20, 18, 34, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = genreTheme.text;
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.8), 0 0 25px ${genreTheme.border}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      {/* Clickable Card Link */}
      <Link
        to={`/books/${book._id}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Book Cover Container with 3D Depth & Lighting */}
        <div
          style={{
            position: 'relative',
            height: '270px',
            width: '100%',
            overflow: 'hidden',
            backgroundColor: '#0D0C15',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, #08070D 85%)',
          }}
        >
          {/* Realistic 3D Book Graphic */}
          <div
            style={{
              position: 'relative',
              width: '145px',
              height: '215px',
              borderRadius: '6px 12px 12px 6px',
              boxShadow: '10px 15px 30px rgba(0, 0, 0, 0.8), 2px 0 10px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              transition: 'transform 0.4s ease',
            }}
          >
            {/* Book Spine Edge Highlight */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '6px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.3) 100%)',
                zIndex: 2,
              }}
            />
            <img
              src={book.coverImage}
              alt={book.title}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Recommendation Match Score Badge */}
          {(matchPercentage || book.matchPercentage) && (
            <div
              style={{
                position: 'absolute',
                top: '0.85rem',
                left: '0.85rem',
                background: 'rgba(16, 185, 129, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#FFFFFF',
                padding: '0.28rem 0.65rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.72rem',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
                zIndex: 3,
              }}
            >
              <Sparkles size={12} fill="#FFFFFF" />
              <span>{matchPercentage || book.matchPercentage}% Match</span>
            </div>
          )}

          {/* Quick Shelf Status Badge if already in list */}
          {currentShelf && (
            <div
              style={{
                position: 'absolute',
                top: '0.85rem',
                right: '0.85rem',
                background: 'rgba(139, 92, 246, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                color: '#FFFFFF',
                padding: '0.28rem 0.6rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.68rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                zIndex: 3,
              }}
            >
              <Check size={12} />
              <span>
                {currentShelf === 'CURRENTLY_READING'
                  ? 'Reading'
                  : currentShelf === 'COMPLETED'
                  ? 'Read'
                  : 'Want to Read'}
              </span>
            </div>
          )}
        </div>

        {/* Book Information Section */}
        <div
          style={{
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between',
            gap: '0.85rem',
          }}
        >
          <div>
            {/* Primary Genre & Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.45rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: genreTheme.text,
                  background: genreTheme.bg,
                  border: `1px solid ${genreTheme.border}`,
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                {primaryGenre}
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#F59E0B',
                }}
              >
                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                <span>{book.averageRating?.toFixed(1) || '4.5'}</span>
                <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                  ({book.ratingsCount || 0})
                </span>
              </div>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.3,
                marginBottom: '0.3rem',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
              title={book.title}
            >
              {book.title}
            </h3>

            {/* Author */}
            <div
              style={{
                fontSize: '0.84rem',
                fontWeight: 700,
                color: '#94A3B8',
                marginBottom: '0.55rem',
              }}
            >
              by {book.author}
            </div>

            {/* Synopsis snippet */}
            <p
              style={{
                fontSize: '0.8rem',
                color: '#94A3B8',
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {book.description}
            </p>
          </div>

          {/* Mood Tags & Page Count Footer */}
          <div>
            {book.moodTags && book.moodTags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.35rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.8rem',
                }}
              >
                {book.moodTags.slice(0, 2).map((mood) => (
                  <span
                    key={mood}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#C4B5FD',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px',
                    }}
                  >
                    ✦ {mood}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '0.85rem',
              }}
            >
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>
                {book.pageCount} pages • {book.readingPace || 'Moderate'}
              </div>

              {/* Shelf Action Dropdown Button */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: currentShelf
                      ? 'rgba(139, 92, 246, 0.25)'
                      : 'var(--gradient-purple)',
                    border: currentShelf
                      ? '1px solid #8B5CF6'
                      : 'none',
                    color: '#FFFFFF',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                  }}
                >
                  <Bookmark size={13} fill={currentShelf ? '#FFFFFF' : 'none'} />
                  <span>
                    {currentShelf === 'WANT_TO_READ'
                      ? 'On Shelf'
                      : currentShelf === 'CURRENTLY_READING'
                      ? 'Reading'
                      : currentShelf === 'COMPLETED'
                      ? 'Finished'
                      : 'Add to Shelf'}
                  </span>
                  <ChevronDown size={12} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 8px)',
                      right: 0,
                      background: '#151324',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      borderRadius: '14px',
                      padding: '0.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      minWidth: '160px',
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.7)',
                      zIndex: 100,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleShelfClick(e, 'WANT_TO_READ')}
                      style={{
                        padding: '0.55rem 0.75rem',
                        background: currentShelf === 'WANT_TO_READ' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        border: 'none',
                        color: currentShelf === 'WANT_TO_READ' ? '#A78BFA' : '#FFFFFF',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Want to Read</span>
                      {currentShelf === 'WANT_TO_READ' && <Check size={14} />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleShelfClick(e, 'CURRENTLY_READING')}
                      style={{
                        padding: '0.55rem 0.75rem',
                        background: currentShelf === 'CURRENTLY_READING' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        border: 'none',
                        color: currentShelf === 'CURRENTLY_READING' ? '#A78BFA' : '#FFFFFF',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Currently Reading</span>
                      {currentShelf === 'CURRENTLY_READING' && <Check size={14} />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleShelfClick(e, 'COMPLETED')}
                      style={{
                        padding: '0.55rem 0.75rem',
                        background: currentShelf === 'COMPLETED' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        border: 'none',
                        color: currentShelf === 'COMPLETED' ? '#A78BFA' : '#FFFFFF',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Completed / Read</span>
                      {currentShelf === 'COMPLETED' && <Check size={14} />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
