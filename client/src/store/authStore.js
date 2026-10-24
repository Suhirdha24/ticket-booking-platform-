import { create } from 'zustand';
import api from '../api/client.js';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: Boolean(localStorage.getItem('token')),
  isLoading: false,
  error: null,

  login: async (email, password, options = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
        portal: options.portal,
        requiredRole: options.requiredRole,
      });
      const data = res.data?.data || res.data || {};
      const user = data.user;
      const token = data.token;

      if (!user || !token) {
        throw new Error('Invalid response from authentication server.');
      }

      if (options.requiredRole === 'admin' && user.role !== 'admin') {
        throw new Error('Access denied: This portal is exclusively for administrators.');
      }

      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', payload);
      const data = res.data?.data || res.data || {};
      const user = data.user;
      const token = data.token;

      if (!user || !token) {
        throw new Error('Invalid response from registration server.');
      }

      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  fetchMe: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const res = await api.get('/auth/me');
      const user = res.data?.data?.user || res.data?.user;
      if (user) {
        set({ user, isAuthenticated: true });
        return user;
      }
      return null;
    } catch (err) {
      // Do not clear token if the request was simply canceled/aborted during navigation
      if (err.isCanceled || err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || err.message === 'canceled') {
        return null;
      }
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false });
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.put('/auth/profile', data);
      const updatedUser = res.data.data.user;
      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },
}));
