import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client.js';
import { useBookshelfStore } from '../store/bookshelfStore.js';
import { useAuthStore } from '../store/authStore.js';
import { showSuccessToast, showErrorToast, showWarningToast } from '../store/toastStore.js';
import BookCard from '../components/books/BookCard.jsx';
import ReadingProgressModal from '../components/books/ReadingProgressModal.jsx';
import {
  Star,
  Bookmark,
  Check,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  ArrowLeft,
  Quote,
  Clock,
  Heart,
  MessageSquare,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export default function BookDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const { getBookShelfItem, updateShelfItem, removeFromShelf } = useBookshelfStore();

  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Review form states
  const [newRating, setNewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data.data?.book);
        setSimilarBooks(res.data.data?.similarBooks || []);
        setReviews(res.data.data?.reviews || []);
      } catch (err) {
        console.error('Failed to load book details', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
    window.scrollTo(0, 0);
  }, [id]);

  const shelfItem = getBookShelfItem(book?._id);
  const currentShelf = shelfItem?.status;

  const handleShelfChange = async (status) => {
    if (!isAuthenticated) {
      showWarningToast('Sign In Required', 'Please sign in to save books to your reading shelves.');
      return;
    }
    await updateShelfItem(book._id, { status });
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      showWarningToast('Sign In Required', 'Please sign in to favorite this book.');
      return;
    }
    await updateShelfItem(book._id, {
      isFavorite: !shelfItem?.isFavorite,
      status: currentShelf || 'WANT_TO_READ',
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showWarningToast('Sign In Required', 'Please sign in to post your review.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await api.post(`/reviews/book/${book._id}`, {
        rating: newRating,
        title: reviewTitle,
        content: reviewContent,
      });

      setReviews([res.data.data, ...reviews]);
      setReviewTitle('');
      setReviewContent('');
      showSuccessToast('Review Published! 🎉', 'Thank you for sharing your thoughts with the reader community.');

      // Refresh book to get updated rating
      const bookRes = await api.get(`/books/${id}`);
      setBook(bookRes.data.data?.book);
    } catch (err) {
      showErrorToast('Failed to post review', err.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="soundwave-bar" style={{ height: '32px', margin: '0 auto 1.5rem auto' }} />
        <p style={{ color: '#94A3B8', fontSize: '1rem', fontWeight: 700 }}>Curating book showcase & recommendations...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <BookOpen size={48} color="#8B5CF6" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.75rem' }}>
          Book Not Found
        </h2>
        <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>
          This book could not be found in our recommendation catalog.
        </p>
        <Link to="/books">
          <button className="btn-purple-glow">Browse All Books</button>
        </Link>
      </div>
    );
  }

  const progressPercent = shelfItem
    ? Math.min(100, Math.round(((shelfItem.progressPages || 0) / book.pageCount) * 100))
    : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#08070D', color: '#FFFFFF', paddingBottom: '6rem' }}>
      {/* Back Button & Breadcrumbs */}
      <div className="container" style={{ paddingTop: '2rem', marginBottom: '1.5rem' }}>
        <Link
          to="/books"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#94A3B8',
            fontSize: '0.88rem',
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} color="#A78BFA" />
          <span>Back to Library Catalog</span>
        </Link>
      </div>

      {/* Main Book Hero Showcase */}
      <div className="container">
        <div
          className="glass-widget-card"
          style={{
            padding: '2.5rem',
            borderRadius: '28px',
            backgroundColor: 'rgba(20, 18, 34, 0.9)',
            border: '1.5px solid rgba(139, 92, 246, 0.35)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(139, 92, 246, 0.2)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
            marginBottom: '3.5rem',
          }}
        >
          {/* Left Column: 3D Book Cover & Shelf Action */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                position: 'relative',
                width: '240px',
                height: '350px',
                borderRadius: '8px 16px 16px 8px',
                boxShadow: '18px 25px 50px rgba(0, 0, 0, 0.9), 2px 0 15px rgba(139, 92, 246, 0.3)',
                overflow: 'hidden',
                marginBottom: '2rem',
              }}
            >
              {/* Spine highlight */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: '8px',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.45) 0%, rgba(0,0,0,0.4) 100%)',
                  zIndex: 2,
                }}
              />
              <img
                src={book.coverImage}
                alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Reading Status Buttons */}
            <div style={{ width: '100%', maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => handleShelfChange('WANT_TO_READ')}
                className={currentShelf === 'WANT_TO_READ' ? 'btn-purple-glow' : 'btn-secondary'}
                style={{ width: '100%', padding: '0.85rem', borderRadius: '14px', justifyContent: 'center' }}
              >
                <Bookmark size={16} fill={currentShelf === 'WANT_TO_READ' ? '#FFFFFF' : 'none'} />
                <span>{currentShelf === 'WANT_TO_READ' ? 'On Want to Read Shelf' : 'Want to Read'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleShelfChange('CURRENTLY_READING')}
                className={currentShelf === 'CURRENTLY_READING' ? 'btn-purple-glow' : 'btn-secondary'}
                style={{ width: '100%', padding: '0.85rem', borderRadius: '14px', justifyContent: 'center' }}
              >
                <BookOpen size={16} />
                <span>{currentShelf === 'CURRENTLY_READING' ? 'Currently Reading' : 'Mark Currently Reading'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleShelfChange('COMPLETED')}
                className={currentShelf === 'COMPLETED' ? 'btn-purple-glow' : 'btn-secondary'}
                style={{ width: '100%', padding: '0.85rem', borderRadius: '14px', justifyContent: 'center' }}
              >
                <CheckCircle2 size={16} />
                <span>{currentShelf === 'COMPLETED' ? 'Read / Finished' : 'Mark as Read'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleFavorite}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.7rem',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: shelfItem?.isFavorite ? '#F43F5E' : '#94A3B8',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: '0.4rem',
                }}
              >
                <Heart size={15} fill={shelfItem?.isFavorite ? '#F43F5E' : 'none'} />
                <span>{shelfItem?.isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Title, Author, Specs, Synopsis */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Genre & Mood Chips */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {(book.genres || []).map((genre) => (
                <span
                  key={genre}
                  style={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid #8B5CF6',
                    color: '#C4B5FD',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  {genre}
                </span>
              ))}
              {(book.moodTags || []).map((mood) => (
                <span
                  key={mood}
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#7DD3FC',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  ✦ {mood}
                </span>
              ))}
            </div>

            {/* Title & Author */}
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#FFFFFF', lineHeight: 1.2, marginBottom: '0.4rem' }}>
              {book.title}
            </h1>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#A78BFA', marginBottom: '1.25rem' }}>
              by {book.author}
            </div>

            {/* Rating Star Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1.25rem',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '16px',
                width: 'fit-content',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={18}
                    fill={s <= Math.round(book.averageRating || 4.5) ? '#F59E0B' : 'none'}
                    color="#F59E0B"
                  />
                ))}
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF' }}>
                {book.averageRating?.toFixed(1) || '4.5'}
              </span>
              <span style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                ({book.ratingsCount || 0} reviews)
              </span>
            </div>

            {/* Active Reading Progress (if currently reading) */}
            {currentShelf === 'CURRENTLY_READING' && (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(99, 102, 241, 0.08) 100%)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  marginBottom: '1.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>
                    Your Reading Progress
                  </div>
                  <button
                    onClick={() => setShowProgressModal(true)}
                    style={{
                      background: 'var(--gradient-purple)',
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-pill)',
                      cursor: 'pointer',
                    }}
                  >
                    Update Page
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#CBD5E1', marginBottom: '0.4rem' }}>
                  <span>Page {shelfItem?.progressPages || 0} of {book.pageCount}</span>
                  <span style={{ fontWeight: 800, color: '#A78BFA' }}>{progressPercent}% Complete</span>
                </div>

                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--gradient-purple)', borderRadius: '9999px' }} />
                </div>
              </div>
            )}

            {/* Metadata Badges Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '0.85rem',
                marginBottom: '1.75rem',
              }}
            >
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Pages</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#FFFFFF' }}>{book.pageCount}</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Published</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#FFFFFF' }}>{book.publishedYear}</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Pace</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#FFFFFF' }}>{book.readingPace || 'Moderate'}</div>
              </div>
              <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>ISBN</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>{book.isbn || 'N/A'}</div>
              </div>
            </div>

            {/* Synopsis */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '0.65rem' }}>
                Synopsis
              </h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.95rem', lineHeight: 1.7 }}>
                {book.description}
              </p>
            </div>

            {/* Quotes Callout */}
            {book.quotes && book.quotes.length > 0 && (
              <div
                style={{
                  padding: '1.15rem 1.4rem',
                  background: 'rgba(139, 92, 246, 0.08)',
                  borderLeft: '4px solid #8B5CF6',
                  borderRadius: '0 16px 16px 0',
                }}
              >
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <Quote size={20} color="#A78BFA" style={{ flexShrink: 0, transform: 'rotate(180deg)' }} />
                  <div style={{ fontStyle: 'italic', color: '#DDD6FE', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    &ldquo;{book.quotes[0]}&rdquo;
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Recommended Books Section */}
        {similarBooks.length > 0 && (
          <div style={{ marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#A78BFA', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
              <Sparkles size={16} />
              <span>Recommendation Engine</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '1.5rem' }}>
              Readers Who Loved This Also Enjoyed
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.75rem',
              }}
            >
              {similarBooks.map((simBook) => (
                <BookCard key={simBook._id} book={simBook} matchPercentage={simBook.matchPercentage} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews & Discussion Section */}
        <div
          className="glass-widget-card"
          style={{
            padding: '2.5rem',
            borderRadius: '24px',
            backgroundColor: 'rgba(20, 18, 34, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38BDF8', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
            <MessageSquare size={16} />
            <span>Community Discussion</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '2rem' }}>
            Reader Reviews ({reviews.length})
          </h2>

          {/* Write a Review Box */}
          <form
            onSubmit={handleReviewSubmit}
            style={{
              padding: '1.5rem',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '2.5rem',
            }}
          >
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '1rem' }}>
              Leave Your Rating & Review
            </h4>

            {/* Star Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700, marginRight: '0.5rem' }}>
                Your Star Rating:
              </span>
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNewRating(num)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                >
                  <Star
                    size={22}
                    fill={num <= newRating ? '#F59E0B' : 'none'}
                    color={num <= newRating ? '#F59E0B' : '#64748B'}
                  />
                </button>
              ))}
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F59E0B', marginLeft: '0.5rem' }}>
                {newRating} / 5 Stars
              </span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Review headline (e.g. A gripping masterpiece that kept me awake all night)..."
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <textarea
                placeholder="Share your thoughts on the plot, character arcs, pacing, and who should read it..."
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                className="form-input"
                rows="4"
                style={{ resize: 'none' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              className="btn-purple-glow"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.88rem' }}
            >
              <span>{isSubmittingReview ? 'Posting...' : 'Post Reader Review'}</span>
            </button>
          </form>

          {/* Existing Reviews List */}
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
              No reviews yet. Be the first to share your review for this book!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: 'var(--gradient-purple)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: '#FFFFFF',
                        }}
                      >
                        {rev.userName?.[0] || 'R'}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF' }}>{rev.userName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          fill={s <= rev.rating ? '#F59E0B' : 'none'}
                          color="#F59E0B"
                        />
                      ))}
                    </div>
                  </div>

                  <h5 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                    {rev.title}
                  </h5>

                  <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.6 }}>
                    {rev.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reading Progress Modal */}
      {showProgressModal && shelfItem && (
        <ReadingProgressModal
          item={shelfItem}
          onClose={() => setShowProgressModal(false)}
        />
      )}
    </div>
  );
}
