import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, Sparkles, Bookmark, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { useBookshelfStore } from '../../store/bookshelfStore.js';

export default function MobileBottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { stats } = useBookshelfStore();

  const navLinks = [
    {
      to: '/',
      label: 'Home',
      icon: Home,
      exact: true,
    },
    {
      to: '/books',
      label: 'Catalog',
      icon: BookOpen,
    },
    {
      to: '/recommendations',
      label: 'Vibe Match',
      icon: Sparkles,
    },
    {
      to: isAuthenticated ? '/my-bookshelf' : '/login',
      label: 'My Shelf',
      icon: Bookmark,
      badge: stats.totalShelved > 0 ? stats.totalShelved : null,
    },
    {
      to: isAuthenticated ? '/profile' : '/login',
      label: 'Profile',
      icon: User,
    },
  ];

  // Don't render floating bottom nav on authentication pages to keep auth clean & unobscured
  if (['/login', '/register', '/user/login'].includes(location.pathname)) {
    return null;
  }

  return (
    <div className="floating-dock-wrapper" aria-label="Bottom Navigation Dock">
      <nav className="floating-dock">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={`dock-item ${isActive ? 'active' : ''}`}
              aria-label={item.label}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              {item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                  }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
