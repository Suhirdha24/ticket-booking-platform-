import axios from 'axios';

/**
 * Pre-configured Axios instance using relative /api baseURL for production
 * and proxy compatibility in local dev.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Standardize error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const serverError = typeof data?.error === 'object' ? data.error : null;
    let message =
      serverError?.message ||
      (typeof data?.error === 'string' ? data.error : null) ||
      data?.message;

    if (!message) {
      if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        message = 'Unable to reach the server. Please check your internet connection.';
      } else if (error.response?.status === 500) {
        message = 'Server is currently reconnecting or busy. Please try again in a moment.';
      } else {
        message = error.message || 'An unexpected error occurred. Please try again.';
      }
    }

    const enhancedError = new Error(message);
    enhancedError.code = serverError?.code || 'UNKNOWN_ERROR';
    enhancedError.status = error.response?.status || 500;
    enhancedError.raw = data;

    return Promise.reject(enhancedError);
  }
);

export default api;
