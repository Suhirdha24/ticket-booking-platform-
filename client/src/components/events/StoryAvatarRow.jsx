import React from 'react';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';

export const STORY_HOSTS = [
  {
    id: 'theeagle',
    name: '@TheEagle',
    badge: '2',
    badgeType: 'red',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    category: 'Sports',
  },
  {
    id: 'tomyu',
    name: '@Tomyu..',
    badge: '9+',
    badgeType: 'green',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    category: 'Food',
  },
  {
    id: 'wedding',
    name: '@Weddin..',
    badge: null,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
    category: 'Festival',
  },
  {
    id: 'cooking',
    name: '@Cookin..',
    badge: null,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    category: 'Workshop',
  },
  {
    id: 'sritex',
    name: '@Sritex',
    badge: '4',
    badgeType: 'green',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    category: 'Sports',
  },
];

export default function StoryAvatarRow({ onSelectHost, selectedHost }) {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        overflowX: 'auto',
        padding: '0.5rem 0.25rem 1rem 0.25rem',
      }}
      className="no-scrollbar"
    >
      {/* 1. You / Add Story Avatar */}
      <div
        className="story-avatar-container"
        onClick={() => onSelectHost?.(null)}
      >
        <div
          className="story-avatar-ring dotted"
          style={{
            position: 'relative',
          }}
        >
          {isAuthenticated ? (
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #E2E8F0, #CBD5E1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
                color: '#0F172A',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
          ) : (
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <Plus size={16} strokeWidth={3} />
            </div>
          )}
        </div>
        <span className="story-avatar-name">You</span>
      </div>

      {/* 2. Host Stories */}
      {STORY_HOSTS.map((host) => {
        const isSelected = selectedHost === host.id;
        return (
          <div
            key={host.id}
            className="story-avatar-container"
            onClick={() => onSelectHost?.(isSelected ? null : host.id)}
          >
            <div
              className={`story-avatar-ring ${host.badge ? 'has-badge' : ''} ${
                host.badgeType === 'green'
                  ? 'green-badge'
                  : host.badgeType === 'red'
                  ? 'red-badge'
                  : ''
              }`}
              data-badge={host.badge}
              style={{
                border: isSelected ? '2.5px solid #0F172A' : 'none',
              }}
            >
              <img src={host.avatar} alt={host.name} />
            </div>
            <span
              className="story-avatar-name"
              style={{ fontWeight: isSelected ? 800 : 600 }}
            >
              {host.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
