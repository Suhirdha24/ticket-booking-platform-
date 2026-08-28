import React from 'react';
import { Search, Filter, RotateCcw, MapPin } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Concert',
  'Sports',
  'Comedy',
  'Festival',
  'Theatre',
  'Conference',
  'Exhibition',
  'Workshop',
  'Gaming',
  'Meetup',
  'Wellness',
  'Nightlife',
  'Kids & Family',
];
const CITIES = [
  'All',
  'Agra',
  'Ahmedabad',
  'Amritsar',
  'Bengaluru',
  'Bhopal',
  'Bhubaneswar',
  'Chandigarh',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dehradun',
  'Dindigul',
  'Erode',
  'Goa',
  'Gurugram',
  'Guwahati',
  'Gwalior',
  'Hosur',
  'Hyderabad',
  'Indore',
  'Jaipur',
  'Jalandhar',
  'Jamshedpur',
  'Jodhpur',
  'Kanchipuram',
  'Kanyakumari',
  'Kanpur',
  'Karur',
  'Kochi',
  'Kolkata',
  'Kozhikode',
  'Lucknow',
  'Ludhiana',
  'Madurai',
  'Mangaluru',
  'Mumbai',
  'Mysuru',
  'Nagercoil',
  'Nagpur',
  'Namakkal',
  'Nashik',
  'Navi Mumbai',
  'New Delhi',
  'Noida',
  'Patna',
  'Puducherry',
  'Pune',
  'Raipur',
  'Ramanathapuram',
  'Ranchi',
  'Salem',
  'Sivakasi',
  'Surat',
  'Thanjavur',
  'Theni',
  'Thiruvananthapuram',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tiruppur',
  'Tiruvannamalai',
  'Udaipur',
  'Vadodara',
  'Varanasi',
  'Vellore',
  'Vijayawada',
  'Villupuram',
  'Virudhunagar',
  'Visakhapatnam',
];

export default function EventFilter({
  search,
  setSearch,
  category,
  setCategory,
  city,
  setCity,
  sort,
  setSort,
  onReset,
}) {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      {/* Top row: Search & Sorting */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)',
            }}
          />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Search events, artists, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* City Filter */}
        <div style={{ position: 'relative', width: '100%' }}>
          <MapPin
            size={18}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-subtle)',
              pointerEvents: 'none',
            }}
          />
          <select
            className="input-field"
            style={{ paddingLeft: '2.75rem', appearance: 'none', cursor: 'pointer' }}
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="All">All Cities</option>
            {CITIES.filter((c) => c !== 'All').map((c) => (
              <option key={c} value={c} style={{ backgroundColor: '#181a28' }}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div>
          <select
            className="input-field"
            style={{ appearance: 'none', cursor: 'pointer' }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="date-asc" style={{ backgroundColor: '#181a28' }}>Date: Earliest First</option>
            <option value="date-desc" style={{ backgroundColor: '#181a28' }}>Date: Latest First</option>
            <option value="price-asc" style={{ backgroundColor: '#181a28' }}>Price: Low to High</option>
            <option value="price-desc" style={{ backgroundColor: '#181a28' }}>Price: High to Low</option>
            <option value="title-asc" style={{ backgroundColor: '#181a28' }}>Title: A to Z</option>
          </select>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={onReset}
            className="btn btn-secondary"
            style={{ width: '100%', padding: '0.75rem 1rem' }}
          >
            <RotateCcw size={16} />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Category Pills Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
        }}
      >
        <span
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-subtle)',
            marginRight: '0.5rem',
            fontWeight: 600,
          }}
        >
          Categories:
        </span>
        {CATEGORIES.map((cat) => {
          const isSelected = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                  : 'var(--bg-surface)',
                color: isSelected ? '#ffffff' : 'var(--text-muted)',
                border: isSelected
                  ? '1px solid #818cf8'
                  : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '0.4rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
