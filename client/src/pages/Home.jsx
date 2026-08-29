import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, MapPin } from 'lucide-react';
import api from '../api/client.js';
import { useLocationStore } from '../store/locationStore.js';
import StoryAvatarRow from '../components/events/StoryAvatarRow.jsx';
import CategoryPillList from '../components/events/CategoryPillList.jsx';
import EventCard from '../components/events/EventCard.jsx';
import LocationModal from '../components/common/LocationModal.jsx';

export default function Home() {
  const navigate = useNavigate();
  const { selectedCity, openLocationModal } = useLocationStore();

  const [activeCategory, setActiveCategory] = useState('');
  const [selectedHost, setSelectedHost] = useState(null);
  const [searchTags, setSearchTags] = useState(['🍤 Food', '🍌 Sport', '🎻 Orchestra']);
  const [searchInput, setSearchInput] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events
  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        if (selectedCity && selectedCity !== 'All Cities') params.set('city', selectedCity);
        params.set('limit', '12');

        const res = await api.get(`/events?${params.toString()}`);
        setEvents(res.data?.data?.events || []);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [activeCategory, selectedCity]);

  const handleRemoveTag = (tagToRemove) => {
    setSearchTags(searchTags.filter((t) => t !== tagToRemove));
  };

  const handleAddSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/events?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="mobile-safe-bottom" style={{ minHeight: '100vh', paddingTop: '1rem' }}>
      <LocationModal />

      <div className="container" style={{ maxWidth: '480px' }}>
        {/* 1. TOP STORY / ORGANIZER AVATARS ROW */}
        <StoryAvatarRow
          selectedHost={selectedHost}
          onSelectHost={(hostId) => {
            setSelectedHost(hostId);
            if (hostId === 'theeagle' || hostId === 'sritex') {
              setActiveCategory('Sports');
            } else if (hostId === 'cooking' || hostId === 'tomyu') {
              setActiveCategory('Food');
            } else if (hostId === 'wedding') {
              setActiveCategory('Festival');
            } else {
              setActiveCategory('');
            }
          }}
        />

        {/* 2. CATEGORY FILTER CHIPS ROW */}
        <div style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
          <CategoryPillList
            activeCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
          />
        </div>

        {/* 3. SEARCH BAR WITH REMOVABLE TAG CHIPS */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="template-search-bar">
            <button
              type="button"
              className="search-icon-btn"
              onClick={() => setShowSearchInput(!showSearchInput)}
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {showSearchInput ? (
              <form onSubmit={handleAddSearch} style={{ flex: 1, display: 'flex' }}>
                <input
                  type="text"
                  autoFocus
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search events, comedy, concerts..."
                  style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.88rem',
                    color: '#0F172A',
                    fontFamily: 'var(--font-body)',
                  }}
                />
              </form>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  overflowX: 'auto',
                  flex: 1,
                }}
                className="no-scrollbar"
              >
                {searchTags.map((tag) => (
                  <div key={tag} className="search-tag-chip">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Remove ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. EVENT FEED (MATCHING THE TEMPLATE PHOTO CARDS) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: '290px',
                  borderRadius: 'var(--radius-xl)',
                  background: '#FFFFFF',
                  boxShadow: 'var(--shadow-card)',
                  animation: 'pulse 1.5s infinite',
                }}
              />
            ))
          ) : events.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1.5rem',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <p style={{ color: '#64748B', fontWeight: 600 }}>
                No events found in this category.
              </p>
              <button
                onClick={() => setActiveCategory('')}
                className="btn-primary"
                style={{ marginTop: '1rem' }}
              >
                View All Events
              </button>
            </div>
          ) : (
            events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
