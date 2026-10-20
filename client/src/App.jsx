import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import { useBookshelfStore } from './store/bookshelfStore.js';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import MobileBottomNav from './components/layout/MobileBottomNav.jsx';
import Toast from './components/common/Toast.jsx';

// BookVerse Pages
import Home from './pages/Home.jsx';
import Books from './pages/Books.jsx';
import BookDetails from './pages/BookDetails.jsx';
import Recommendations from './pages/Recommendations.jsx';
import MyBookshelf from './pages/MyBookshelf.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  const { fetchMe, isAuthenticated } = useAuthStore();
  const { fetchShelf } = useBookshelfStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchShelf();
    }
  }, [isAuthenticated, fetchShelf]);

  return (
    <Router>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-main)',
        }}
      >
        <Navbar />

        <main style={{ flex: 1 }}>
          <Routes>
            {/* Core BookVerse Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/recommendations" element={<Recommendations />} />

            {/* Reading Shelf & Reader Profile */}
            <Route
              path="/my-bookshelf"
              element={
                <ProtectedRoute>
                  <MyBookshelf />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/user/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Backward Compatibility Redirects */}
            <Route path="/events" element={<Navigate to="/books" replace />} />
            <Route path="/events/:id" element={<Navigate to="/books" replace />} />
            <Route path="/favorites" element={<Navigate to="/my-bookshelf" replace />} />
            <Route path="/my-bookings" element={<Navigate to="/my-bookshelf" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <MobileBottomNav />
        <Toast />
      </div>
    </Router>
  );
}
