import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: ({ title, message, type = 'info', duration = 4500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    const newToast = { id, title, message, type };

    set((state) => ({ toasts: [...state.toasts, newToast] }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// Quick helpers
export const showSuccessToast = (title, message) =>
  useToastStore.getState().addToast({ title, message, type: 'success' });

export const showErrorToast = (title, message) =>
  useToastStore.getState().addToast({ title, message, type: 'error' });

export const showWarningToast = (title, message) =>
  useToastStore.getState().addToast({ title, message, type: 'warning' });

export const showInfoToast = (title, message) =>
  useToastStore.getState().addToast({ title, message, type: 'info' });
