import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Ticket, Compass, Heart, User } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { useFavoritesStore } from '../../store/favoritesStore.js';

export default function MobileBottomNav() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { favoriteIds } = useFavoritesStore();

  // Hide during seat selection and checkout to maximize viewport
  const isExcluded =
    location.pathname.includes('/seats') || location.pathname.includes('/checkout');

  if (isExcluded) return null;

  const navLinks = [
    {
      to: '/',
      label: 'Home',
      icon: Home,
      exact: true,
    },
    {
      to: isAuthenticated ? '/my-bookings' : '/login',
      label: 'Tickets',
      icon: Ticket,
    },
    {
      to: '/events',
      label: 'Discover',
      icon: Compass,
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
                    background: '#F43F5E',
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
