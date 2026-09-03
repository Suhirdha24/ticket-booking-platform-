import React from 'react';

export const CATEGORIES_LIST = [
  { id: '', name: 'All Events', emoji: '🎟️' },
  { id: 'Concert', name: 'Concert & Live Music', emoji: '🎸' },
  { id: 'Festival', name: 'Festivals', emoji: '🎪' },
  { id: 'Nightlife', name: 'DJ & Nightlife', emoji: '🍸' },
  { id: 'Comedy', name: 'Stand-up Comedy', emoji: '🎤' },
  { id: 'Sports', name: 'Sports & Matches', emoji: '🏆' },
  { id: 'Conference', name: 'Tech & Summits', emoji: '💻' },
  { id: 'Workshop', name: 'Masterclasses', emoji: '🎨' },
  { id: 'Theatre', name: 'Theatre & Plays', emoji: '🎭' },
];

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
