import React from 'react';
import { ALL_GENRES } from '../../utils/eventDetailsHelper.js';

export const CATEGORIES_LIST = ALL_GENRES;

export default function CategoryPillList({ activeCategory, onSelectCategory }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        overflowX: 'auto',
        padding: '0.25rem 0 0.75rem 0',
      }}
      className="no-scrollbar"
    >
      {CATEGORIES_LIST.map((cat) => {
        const isActive =
          activeCategory === cat.id ||
          (!activeCategory && cat.id === '');

        return (
          <button
            key={cat.id || 'all'}
            onClick={() => onSelectCategory(cat.id)}
            className={`sonora-filter-chip ${isActive ? 'active' : ''}`}
            type="button"
          >
            {cat.emoji && <span>{cat.emoji}</span>}
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
