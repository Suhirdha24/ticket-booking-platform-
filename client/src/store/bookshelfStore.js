import { create } from 'zustand';
import api from '../api/client.js';
import { showSuccessToast, showErrorToast } from './toastStore.js';

export const useBookshelfStore = create((set, get) => ({
  shelfItems: [],
  stats: {
    totalShelved: 0,
    wantToRead: 0,
    currentlyReading: 0,
    completed: 0,
    favorites: 0,
    totalPagesRead: 0,
  },
  isLoading: false,

  fetchShelf: async (status = null) => {
    set({ isLoading: true });
    try {
      const url = status ? `/reading-list?status=${status}` : '/reading-list';
      const res = await api.get(url);
      set({
        shelfItems: res.data.data?.items || [],
        stats: res.data.data?.stats || get().stats,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  updateShelfItem: async (bookId, { status, progressPages, userRating, personalNotes, isFavorite }) => {
    try {
      const res = await api.post('/reading-list', {
        bookId,
        status,
        progressPages,
        userRating,
        personalNotes,
        isFavorite,
      });

      const updatedItem = res.data.data;
      const currentItems = get().shelfItems;
      const existingIdx = currentItems.findIndex(
        (i) => (i.book?._id || i.book) === bookId
      );

      let newItems;
      if (existingIdx >= 0) {
        newItems = [...currentItems];
        newItems[existingIdx] = updatedItem;
      } else {
        newItems = [updatedItem, ...currentItems];
      }

      set({ shelfItems: newItems });
      get().fetchShelf(); // refresh stats

      showSuccessToast(
        'Bookshelf Updated',
        status === 'WANT_TO_READ'
          ? 'Added to your Want to Read shelf!'
          : status === 'CURRENTLY_READING'
          ? 'Marked as Currently Reading!'
          : status === 'COMPLETED'
          ? 'Congratulations on completing this book! 🎉'
          : 'Saved to your reading shelf.'
      );

      return updatedItem;
    } catch (err) {
      showErrorToast('Failed to update shelf', err.message || 'Please log in to manage your shelf.');
      throw err;
    }
  },

  removeFromShelf: async (bookId) => {
    try {
      await api.delete(`/reading-list/${bookId}`);
      const newItems = get().shelfItems.filter(
        (i) => (i.book?._id || i.book) !== bookId
      );
      set({ shelfItems: newItems });
      get().fetchShelf();
      showSuccessToast('Removed from Shelf', 'Book removed from your reading list.');
    } catch (err) {
      showErrorToast('Failed to remove book', err.message);
    }
  },

  getBookShelfStatus: (bookId) => {
    const item = get().shelfItems.find(
      (i) => (i.book?._id || i.book) === bookId
    );
    return item ? item.status : null;
  },

  getBookShelfItem: (bookId) => {
    return get().shelfItems.find(
      (i) => (i.book?._id || i.book) === bookId
    );
  },
}));
