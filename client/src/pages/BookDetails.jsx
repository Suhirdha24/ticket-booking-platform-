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
  BookOpen,
  Calendar,
  Layers,
  ArrowLeft,
  Clock,
  Heart,
  MessageSquare,
  CheckCircle2,
  Share2,
  ExternalLink,
  Globe,
  ShoppingBag,
} from 'lucide-react';

export default function BookDetails() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const { getBookShelfItem, updateShelfItem } = useBookshelfStore();

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
      showSuccessToast('Review Published!', 'Thank you for sharing your review.');

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
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <BookOpen size={44} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
          Book Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          This book could not be found in our catalog.
        </p>
        <Link to="/books" className="btn btn-primary">
          Browse All Books
        </Link>
      </div>
    );
  }

  const progressPercent = shelfItem
    ? Math.min(100, Math.round(((shelfItem.progressPages || 0) / book.pageCount) * 100))
    : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', paddingBottom: '5rem' }}>
      {/* Back Button */}
      <div className="container" style={{ paddingTop: '1.5rem', marginBottom: '1.25rem' }}>
        <Link
          to="/books"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={15} />
          <span>Back to Library Catalog</span>
        </Link>
      </div>

      {/* Main Book Showcase Card */}
      <div className="container">
        <div
          className="card-clean"
          style={{
            padding: '2.5rem',
            borderRadius: '16px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-medium)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
            marginBottom: '3rem',
          }}
        >
          {/* Left Column: Book Cover & Shelf Action */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              className="book-3d-item"
              style={{
                position: 'relative',
                width: '220px',
                height: '320px',
                borderRadius: '6px 12px 12px 6px',
                boxShadow: 'var(--book-shadow)',
                overflow: 'hidden',
                marginBottom: '1.75rem',
                backgroundColor: 'var(--bg-subtle)',
              }}
            >
              <img
                src={book.coverImage}
                alt={book.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <div className="book-3d-spine-crease" />
            </div>

            {/* Reading Status Buttons */}
            <div style={{ width: '100%', maxWidth: '260px', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => handleShelfChange('WANT_TO_READ')}
                className={currentShelf === 'WANT_TO_READ' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
              >
                <Bookmark size={15} fill={currentShelf === 'WANT_TO_READ' ? 'currentColor' : 'none'} />
                <span>{currentShelf === 'WANT_TO_READ' ? 'On Want to Read' : 'Want to Read'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleShelfChange('CURRENTLY_READING')}
                className={currentShelf === 'CURRENTLY_READING' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
              >
                <BookOpen size={15} />
                <span>{currentShelf === 'CURRENTLY_READING' ? 'Currently Reading' : 'Mark Currently Reading'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleShelfChange('COMPLETED')}
                className={currentShelf === 'COMPLETED' ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ width: '100%', padding: '0.75rem', justifyContent: 'center' }}
              >
                <CheckCircle2 size={15} />
                <span>{currentShelf === 'COMPLETED' ? 'Completed' : 'Mark as Read'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleFavorite}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem',
                  background: 'none',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  color: shelfItem?.isFavorite ? 'var(--accent-rose)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '0.25rem',
                }}
              >
                <Heart size={14} fill={shelfItem?.isFavorite ? 'currentColor' : 'none'} />
                <span>{shelfItem?.isFavorite ? 'In Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>

            {/* Amazon Mega Bookstore Purchasing Options */}
            <div
              style={{
                width: '100%',
                maxWidth: '260px',
                marginTop: '1.25rem',
                padding: '1.15rem',
                backgroundColor: '#FFFBEB',
                border: '1.5px solid #FCD34D',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.08)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 900, color: '#92400E', letterSpacing: '-0.02em' }}>
                  amazon
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                  Verified Editions
                </span>
              </div>

              <a
                href={book.amazonLink || `https://www.amazon.com/s?k=${encodeURIComponent((book.isbn || `${book.title} ${book.author}`).trim())}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#F59E0B',
                  color: '#FFFFFF',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  borderRadius: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(245, 158, 11, 0.35)',
                  marginBottom: '0.5rem',
                }}
              >
                <ShoppingBag size={15} />
                <span>Buy on Amazon</span>
                <ExternalLink size={13} />
              </a>

              {book.previewLink && (
                <a
                  href={book.previewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    width: '100%',
                    padding: '0.55rem',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    color: 'var(--text-heading)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  <BookOpen size={13} />
                  <span>Read Free Sample</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Title, Author, Specs, Synopsis */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Genre & Mood Chips */}
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
              {(book.genres || []).map((genre) => (
                <span
                  key={genre}
                  style={{
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                  }}
                >
                  {genre}
                </span>
              ))}
              {(book.moodTags || []).map((mood) => (
                <span
                  key={mood}
                  style={{
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-body)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                  }}
                >
                  ✦ {mood}
                </span>
              ))}
            </div>

            {/* Title & Author */}
            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, color: 'var(--text-heading)', lineHeight: 1.25, marginBottom: '0.35rem' }}>
              {book.title}
            </h1>
            <div style={{ fontSize: '1.05rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              by <strong style={{ color: 'var(--text-heading)' }}>{book.author}</strong>
            </div>

            {/* Rating Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 1rem',
                background: 'var(--bg-subtle)',
                borderRadius: '8px',
                width: 'fit-content',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(book.averageRating || 4.5) ? '#F59E0B' : 'none'}
                    color="#F59E0B"
                  />
                ))}
              </div>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                {Number(book.averageRating || 4.5).toFixed(1)}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                ({book.ratingsCount || 0} reviews)
              </span>
            </div>

            {/* Reading Progress tracker bar (if reading) */}
            {currentShelf === 'CURRENTLY_READING' && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-light)',
                  border: '1px solid var(--primary-border)',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Your Reading Progress
                  </span>
                  <button
                    onClick={() => setShowProgressModal(true)}
                    className="btn btn-primary"
                    style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
                  >
                    Update Page
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <span>Page {shelfItem?.progressPages || 0} of {book.pageCount}</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{progressPercent}%</span>
                </div>

                <div style={{ width: '100%', height: '7px', background: '#FFFFFF', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
                </div>
              </div>
            )}

            {/* Quote Snippet */}
            {book.quotes?.[0] && (
              <div
                style={{
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-subtle)',
                  borderLeft: '3px solid var(--primary)',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '0.88rem',
                  fontStyle: 'italic',
                  color: 'var(--text-body)',
                  marginBottom: '1.5rem',
                }}
              >
                &ldquo;{book.quotes[0]}&rdquo;
              </div>
            )}

            {/* Amazon-Style Format Tabs */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.5rem' }}>
                Available Editions & Formats:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '0.5rem' }}>
                {[
                  { name: 'Paperback', price: '$14.99', badge: 'Standard' },
                  { name: 'Hardcover', price: '$24.99', badge: 'Collector' },
                  { name: 'Kindle eBook', price: '$9.99', badge: 'Instant' },
                  { name: 'Audiobook', price: '$0.00', badge: 'Audible Free' },
                ].map((fmt) => (
                  <button
                    key={fmt.name}
                    type="button"
                    onClick={() => setSelectedFormat(fmt.name)}
                    style={{
                      padding: '0.65rem 0.5rem',
                      borderRadius: '8px',
                      border: selectedFormat === fmt.name ? '2px solid #F59E0B' : '1px solid var(--border-medium)',
                      backgroundColor: selectedFormat === fmt.name ? '#FFFBEB' : '#FFFFFF',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 700 }}>{fmt.badge}</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)' }}>{fmt.name}</div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#B45309', marginTop: '0.15rem' }}>{fmt.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Synopsis */}
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.45rem' }}>
              About this Book
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              {book.description}
            </p>

            {/* Metadata Specs Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))',
                gap: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.25rem',
              }}
            >
              <div style={{ padding: '0.65rem', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Language</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#B45309' }}>
                  {book.language || 'English'}
                </div>
              </div>
              <div style={{ padding: '0.65rem', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Page Count</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>{book.pageCount} pages</div>
              </div>
              <div style={{ padding: '0.65rem', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Publisher</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {book.publisher || 'World Editions'}
                </div>
              </div>
              <div style={{ padding: '0.65rem', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Published Year</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-heading)' }}>{book.publishedYear}</div>
              </div>
              <div style={{ padding: '0.65rem', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ISBN / ID</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {book.isbn || book.openLibraryId || 'Global Catalog'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Books Section */}
        {similarBooks.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '1.25rem' }}>
              Readers Also Loved
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {similarBooks.map((simBook) => (
                <BookCard key={simBook._id} book={simBook} />
              ))}
            </div>
          </div>
        )}

        {/* Community Reviews Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Write a Review */}
          <div
            className="card-clean"
            style={{
              padding: '1.75rem',
              borderRadius: '14px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-medium)',
              height: 'fit-content',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.35rem' }}>
              Share Your Thoughts
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Rate and review this book for fellow BookVerse readers.
            </p>

            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Star Rating Picker */}
              <div>
                <label className="form-label">Your Rating</label>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.2rem',
                      }}
                    >
                      <Star
                        size={22}
                        fill={star <= newRating ? '#F59E0B' : 'none'}
                        color="#F59E0B"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="review-title">
                  Review Headline
                </label>
                <input
                  id="review-title"
                  type="text"
                  required
                  placeholder="e.g. Masterpiece of modern storytelling"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="review-content">
                  Detailed Review
                </label>
                <textarea
                  id="review-content"
                  rows={4}
                  required
                  placeholder="What did you love? How was the pacing and character depth?"
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                {isSubmittingReview ? 'Submitting...' : 'Post Reader Review'}
              </button>
            </form>
          </div>

          {/* Reader Reviews List */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)' }}>
                Community Reviews ({reviews.length})
              </h3>
            </div>

            {reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="card-clean"
                    style={{
                      padding: '1.25rem',
                      borderRadius: '12px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                          }}
                        >
                          {rev.userName?.[0] || 'R'}
                        </div>
                        <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                          {rev.userName}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={13}
                            fill={s <= rev.rating ? '#F59E0B' : 'none'}
                            color="#F59E0B"
                          />
                        ))}
                      </div>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-heading)', marginBottom: '0.25rem' }}>
                      {rev.title}
                    </h4>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                      {rev.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '2.5rem 1rem',
                  textAlign: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <MessageSquare size={32} color="var(--text-subtle)" style={{ marginBottom: '0.65rem' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Be the first reader to write a review for this book!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reading Progress Modal */}
      {showProgressModal && (
        <ReadingProgressModal
          book={book}
          currentPages={shelfItem?.progressPages || 0}
          onClose={() => setShowProgressModal(false)}
        />
      )}
    </div>
  );
}
