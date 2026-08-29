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
      {/* Sonora Cyber-Violet Pagination Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          flexWrap: 'wrap',
          userSelect: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '16px',
          background: 'rgba(20, 18, 34, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
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
              padding: '0.5rem 0.9rem',
              marginRight: '0.35rem',
              background: 'transparent',
              border: 'none',
              color: '#A78BFA',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              borderRadius: '10px',
              transition: 'all 0.2s ease',
            }}
            className="sonora-page-nav-btn"
          >
            <ChevronLeft size={16} />
            Previous
          </button>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.9rem',
              marginRight: '0.35rem',
              color: 'rgba(255, 255, 255, 0.2)',
              fontSize: '0.92rem',
              fontWeight: 500,
              cursor: 'default',
            }}
          >
            <ChevronLeft size={16} />
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
                minWidth: '40px',
                height: '40px',
                padding: '0 0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                fontWeight: isCurrent ? 900 : 600,
                color: isCurrent ? '#FFFFFF' : '#94A3B8',
                background: isCurrent
                  ? 'var(--gradient-purple)'
                  : 'rgba(255, 255, 255, 0.03)',
                border: isCurrent
                  ? '1px solid rgba(139, 92, 246, 0.6)'
                  : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                cursor: isCurrent ? 'default' : 'pointer',
                boxShadow: isCurrent
                  ? '0 0 20px rgba(139, 92, 246, 0.6), 0 4px 12px rgba(0, 0, 0, 0.4)'
                  : 'none',
                transition: 'all 0.2s ease',
              }}
              className={isCurrent ? '' : 'sonora-page-num-btn'}
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
              padding: '0.5rem 0.9rem',
              marginLeft: '0.35rem',
              background: 'transparent',
              border: 'none',
              color: '#A78BFA',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              borderRadius: '10px',
              transition: 'all 0.2s ease',
            }}
            className="sonora-page-nav-btn"
          >
            Next
            <ChevronRight size={16} />
          </button>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.9rem',
              marginLeft: '0.35rem',
              color: 'rgba(255, 255, 255, 0.2)',
              fontSize: '0.92rem',
              fontWeight: 500,
              cursor: 'default',
            }}
          >
            Next
            <ChevronRight size={16} />
          </span>
        )}
      </div>

      <style>{`
        .sonora-page-nav-btn:hover {
          color: #ffffff !important;
          background: rgba(139, 92, 246, 0.2) !important;
        }
        .sonora-page-num-btn:hover {
          color: #ffffff !important;
          background: rgba(139, 92, 246, 0.15) !important;
          border-color: rgba(139, 92, 246, 0.3) !important;
        }
      `}</style>
    </div>
  );
}
