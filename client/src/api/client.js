import axios from 'axios';

/**
 * Pre-configured Axios instance using relative /api baseURL for production
 * and proxy compatibility in local dev.
 */
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
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
    const serverError = error.response?.data?.error;
    const message =
      serverError?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    // Attach human-readable message and error code to Error object
    const enhancedError = new Error(message);
    enhancedError.code = serverError?.code || 'UNKNOWN_ERROR';
    enhancedError.status = error.response?.status || 500;
    enhancedError.raw = error.response?.data;

    return Promise.reject(enhancedError);
  }
);

export default api;
