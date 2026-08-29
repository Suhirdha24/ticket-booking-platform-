import React from 'react';

export const CATEGORIES_LIST = [
  { id: '', name: 'Near By You', emoji: '📍' },
  { id: 'Sports', name: 'Sport', emoji: '🍌' },
  { id: 'Festival', name: 'Circus', emoji: '🎪' },
  { id: 'Concert', name: 'Music', emoji: '🎵' },
  { id: 'Food', name: 'Food', emoji: '🍤' },
  { id: 'Comedy', name: 'Comedy', emoji: '🎤' },
  { id: 'Workshop', name: 'Workshop', emoji: '🎨' },
  { id: 'Theatre', name: 'Theatre', emoji: '🎭' },
];

export default function CategoryPillList({ activeCategory, onSelectCategory }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        overflowX: 'auto',
        padding: '0.25rem 0.25rem 0.75rem 0.25rem',
      }}
      className="no-scrollbar"
    >
      {CATEGORIES_LIST.map((cat) => {
        const isActive =
          activeCategory === cat.id ||
          (!activeCategory && cat.id === '');

        return (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.id)}
            className={`category-chip ${isActive ? 'active' : ''}`}
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
