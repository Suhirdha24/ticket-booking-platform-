import React from 'react';

export const CATEGORIES_WITH_EMOJIS = [
  { id: 'All', name: 'All Events', emoji: '✨' },
  { id: 'Concert', name: 'Music & Concerts', emoji: '🎵' },
  { id: 'Sports', name: 'Sports & Games', emoji: '⚽' },
  { id: 'Festival', name: 'Festivals & Food', emoji: '🎉' },
  { id: 'Comedy', name: 'Standup Comedy', emoji: '🎤' },
  { id: 'Theatre', name: 'Theatre & Drama', emoji: '🎭' },
  { id: 'Conference', name: 'Tech & Business', emoji: '💻' },
  { id: 'Workshop', name: 'Workshops', emoji: '🎨' },
  { id: 'Wellness', name: 'Yoga & Wellness', emoji: '🧘' },
  { id: 'Nightlife', name: 'Parties & Nightlife', emoji: '🌙' },
];

export default function CategoryPillList({ activeCategory, onSelectCategory }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.65rem',
        overflowX: 'auto',
        padding: '0.25rem 0.25rem 0.75rem 0.25rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      className="horizontal-pills-row"
    >
      {CATEGORIES_WITH_EMOJIS.map((cat) => {
        const isActive =
          activeCategory === cat.id ||
          (cat.id === 'All' && (!activeCategory || activeCategory === ''));

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id === 'All' ? '' : cat.id)}
            className={`category-pill-btn ${isActive ? 'active' : ''}`}
            type="button"
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
