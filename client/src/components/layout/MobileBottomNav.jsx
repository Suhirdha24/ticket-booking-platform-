import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Ticket, Heart, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { useFavoritesStore } from '../../store/favoritesStore.js';

export default function MobileBottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { favoriteIds } = useFavoritesStore();

  // Hide bottom navigation during seat selection or checkout on mobile to maximize viewport
  const isExcludedRoute =
    location.pathname.includes('/seats') ||
    location.pathname.includes('/checkout');

  if (isExcludedRoute) {
    return null;
  }

  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: Home,
      exact: true,
    },
    {
      to: '/events',
      label: 'Explore',
      icon: Compass,
    },
    {
      to: isAuthenticated ? '/my-bookings' : '/login',
      label: 'Bookings',
      icon: Ticket,
    },
    {
      to: '/favorites',
      label: 'Favorites',
      icon: Heart,
      badge: favoriteIds.length > 0 ? favoriteIds.length : null,
    },
    {
      to: isAuthenticated ? '/profile' : '/login',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            {isActive && <div className="bottom-nav-indicator" />}
            <div className="nav-icon-container" style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              {item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-6px',
                    background: 'var(--primary-gold)',
                    color: '#000000',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
