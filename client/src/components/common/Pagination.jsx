import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 12,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  // Google style 10-page sliding window
  const maxVisible = 10;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = startPage + maxVisible - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3.5rem',
        marginBottom: '2rem',
        gap: '0.75rem',
      }}
    >
      {/* Google-Style Pagination Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          flexWrap: 'wrap',
          userSelect: 'none',
        }}
      >
        {/* Previous Button */}
        {currentPage > 1 ? (
          <button
            onClick={() => changePage(currentPage - 1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 1rem',
              marginRight: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: '#818cf8',
              fontSize: '0.98rem',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            className="google-nav-btn"
          >
            <ChevronLeft size={18} />
            Previous
          </button>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 1rem',
              marginRight: '0.5rem',
              color: 'rgba(255, 255, 255, 0.2)',
              fontSize: '0.98rem',
              fontWeight: 500,
              cursor: 'default',
            }}
          >
            <ChevronLeft size={18} />
            Previous
          </span>
        )}

        {/* 1 to 10 Sequential Numbers */}
        {pageNumbers.map((pageNum) => {
          const isCurrent = currentPage === pageNum;

          return (
            <button
              key={pageNum}
              onClick={() => changePage(pageNum)}
              style={{
                minWidth: '38px',
                height: '38px',
                padding: '0 0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: isCurrent ? 800 : 500,
                color: isCurrent ? '#ffffff' : '#94a3b8',
                background: isCurrent
                  ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                  : 'transparent',
                border: isCurrent
                  ? '1px solid rgba(255, 255, 255, 0.2)'
                  : '1px solid transparent',
                borderRadius: '8px',
                cursor: isCurrent ? 'default' : 'pointer',
                boxShadow: isCurrent
                  ? '0 0 16px rgba(99, 102, 241, 0.45)'
                  : 'none',
                transition: 'all 0.15s ease',
              }}
              className={isCurrent ? '' : 'google-page-num'}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        {currentPage < totalPages ? (
          <button
            onClick={() => changePage(currentPage + 1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 1rem',
              marginLeft: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: '#818cf8',
              fontSize: '0.98rem',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            className="google-nav-btn"
          >
            Next
            <ChevronRight size={18} />
          </button>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 1rem',
              marginLeft: '0.5rem',
              color: 'rgba(255, 255, 255, 0.2)',
              fontSize: '0.98rem',
              fontWeight: 500,
              cursor: 'default',
            }}
          >
            Next
            <ChevronRight size={18} />
          </span>
        )}
      </div>

      <style>{`
        .google-nav-btn:hover {
          color: #c084fc !important;
          background: rgba(99, 102, 241, 0.1) !important;
        }
        .google-page-num:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
      `}</style>
    </div>
  );
}
