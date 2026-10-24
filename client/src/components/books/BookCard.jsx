import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Bookmark,
  Check,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useBookshelfStore } from '../../store/bookshelfStore.js';
import { useAuthStore } from '../../store/authStore.js';
import { showWarningToast } from '../../store/toastStore.js';

export default function BookCard({ book, matchPercentage, matchReasons }) {
  const { getBookShelfStatus, updateShelfItem } = useBookshelfStore();
  const { isAuthenticated } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!book) return null;

  const currentShelf = getBookShelfStatus(book._id);
  const primaryGenre = book.genres?.[0] || 'Fiction';

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
      className="card-clean"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '14px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-medium)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        const bookItem = e.currentTarget.querySelector('.book-3d-item');
        if (bookItem) {
          bookItem.style.transform = 'scale(1.08) translateY(-4px)';
          bookItem.style.boxShadow = 'var(--book-shadow-hover)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-medium)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        const bookItem = e.currentTarget.querySelector('.book-3d-item');
        if (bookItem) {
          bookItem.style.transform = 'scale(1) translateY(0)';
          bookItem.style.boxShadow = 'var(--book-shadow)';
        }
      }}
    >
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
        {/* Book Cover Container */}
        <div
          style={{
            position: 'relative',
            height: '264px',
            width: '100%',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at 50% 45%, #F8FAFC 0%, #E2E8F0 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* 3D Book Graphic */}
          <div
            className="book-3d-item"
            style={{
              position: 'relative',
              width: '154px',
              height: '226px',
              borderRadius: '4px 10px 10px 4px',
              boxShadow: 'var(--book-shadow)',
              overflow: 'hidden',
              backgroundColor: '#1E293B',
              transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease',
            }}
          >
            <img
              src={book.coverImage}
              alt={book.title}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
              }}
            />
            <div className="book-3d-spine-crease" />
          </div>

          {/* Recommendation Match Score Badge */}
          {(matchPercentage || book.matchPercentage) && (
            <div
              style={{
                position: 'absolute',
                top: '0.75rem',
                left: '0.75rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--accent-emerald)',
                color: 'var(--accent-emerald)',
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                boxShadow: 'var(--shadow-xs)',
                zIndex: 2,
              }}
            >
              <Sparkles size={11} />
              <span>{matchPercentage || book.matchPercentage}% Match</span>
            </div>
          )}

          {/* Shelf Status Pill */}
          {currentShelf && (
            <div
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                color: 'var(--primary)',
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                zIndex: 2,
              }}
            >
              <Check size={11} />
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
            padding: '1.15rem',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div>
            {/* Primary Genre & Rating */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.4rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                }}
              >
                {primaryGenre}
              </span>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text-heading)',
                }}
              >
                <Star size={13} fill="#F59E0B" color="#F59E0B" />
                <span>{Number(book.averageRating || 4.5).toFixed(1)}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 400 }}>
                  ({book.ratingsCount || 0})
                </span>
              </div>
            </div>

            {/* Title */}
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-heading)',
                lineHeight: 1.35,
                marginBottom: '0.25rem',
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
                fontSize: '0.82rem',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
              }}
            >
              by {book.author}
            </div>

            {/* Synopsis snippet */}
            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-body)',
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

          {/* Footer Info & Shelf Button */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <span>{book.pageCount || 320}p</span>
                <span>•</span>
                <span
                  style={{
                    color: book.language && book.language !== 'English' ? '#B45309' : 'inherit',
                    fontWeight: book.language && book.language !== 'English' ? 700 : 500,
                    backgroundColor: book.language && book.language !== 'English' ? '#FEF3C7' : 'transparent',
                    padding: book.language && book.language !== 'English' ? '0.1rem 0.35rem' : '0',
                    borderRadius: '4px',
                  }}
                >
                  {book.language || 'English'}
                </span>
              </div>

              {/* Shelf Dropdown */}
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
                    background: currentShelf ? 'var(--primary-light)' : '#FFFFFF',
                    border: currentShelf ? '1px solid var(--primary-border)' : '1px solid var(--border-medium)',
                    color: currentShelf ? 'var(--primary)' : 'var(--text-heading)',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Bookmark size={12} fill={currentShelf ? 'currentColor' : 'none'} />
                  <span>
                    {currentShelf === 'WANT_TO_READ'
                      ? 'On Shelf'
                      : currentShelf === 'CURRENTLY_READING'
                      ? 'Reading'
                      : currentShelf === 'COMPLETED'
                      ? 'Read'
                      : 'Shelf'}
                  </span>
                  <ChevronDown size={11} />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 6px)',
                      right: 0,
                      background: '#FFFFFF',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '0.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      minWidth: '155px',
                      boxShadow: 'var(--shadow-dropdown)',
                      zIndex: 100,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => handleShelfClick(e, 'WANT_TO_READ')}
                      style={{
                        padding: '0.45rem 0.65rem',
                        background: currentShelf === 'WANT_TO_READ' ? 'var(--bg-subtle)' : 'transparent',
                        border: 'none',
                        color: 'var(--text-heading)',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: currentShelf === 'WANT_TO_READ' ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Want to Read</span>
                      {currentShelf === 'WANT_TO_READ' && <Check size={13} color="var(--primary)" />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleShelfClick(e, 'CURRENTLY_READING')}
                      style={{
                        padding: '0.45rem 0.65rem',
                        background: currentShelf === 'CURRENTLY_READING' ? 'var(--bg-subtle)' : 'transparent',
                        border: 'none',
                        color: 'var(--text-heading)',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: currentShelf === 'CURRENTLY_READING' ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Currently Reading</span>
                      {currentShelf === 'CURRENTLY_READING' && <Check size={13} color="var(--primary)" />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleShelfClick(e, 'COMPLETED')}
                      style={{
                        padding: '0.45rem 0.65rem',
                        background: currentShelf === 'COMPLETED' ? 'var(--bg-subtle)' : 'transparent',
                        border: 'none',
                        color: 'var(--text-heading)',
                        borderRadius: '4px',
                        fontSize: '0.78rem',
                        fontWeight: currentShelf === 'COMPLETED' ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Completed / Read</span>
                      {currentShelf === 'COMPLETED' && <Check size={13} color="var(--primary)" />}
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
