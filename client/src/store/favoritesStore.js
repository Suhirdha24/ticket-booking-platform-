import { create } from 'zustand';

const FAVORITES_STORAGE_KEY = 'eventlinqs_favorites_ids';

function getInitialFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useFavoritesStore = create((set, get) => ({
  favoriteIds: getInitialFavorites(),
  
  toggleFavorite: (eventId) => {
    if (!eventId) return;
    const current = get().favoriteIds;
    const exists = current.includes(eventId);
    const updated = exists ? current.filter((id) => id !== eventId) : [...current, eventId];

    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save favorites to localStorage:', e);
    }

    set({ favoriteIds: updated });
  },

  isFavorite: (eventId) => {
    return get().favoriteIds.includes(eventId);
  },

  clearFavorites: () => {
    try {
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch {}
    set({ favoriteIds: [] });
  },
}));
