import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Sparkles,
  Ticket,
} from 'lucide-react';
import api from '../api/client.js';
import { useAuthStore } from '../store/authStore.js';
import { useToastStore } from '../store/toastStore.js';
import EventCard from '../components/events/EventCard.jsx';
import { MAJOR_CITIES } from '../store/locationStore.js';

const CATEGORIES = [
  'Concert',
  'Festival',
  'Comedy',
  'Sports',
  'Conference',
  'Theatre',
  'Workshop',
  'Nightlife',
  'Wellness',
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Concert',
    description: '',
    date: new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16),
    city: 'Bengaluru',
    venueName: '',
    venueAddress: '',
    imageUrl: '',
    vipPrice: 4999,
    premiumPrice: 2799,
    generalPrice: 1199,
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        city: formData.city,
        imageUrl: formData.imageUrl || undefined,
        venue: {
          name: formData.venueName || 'Grand Arena',
          address: formData.venueAddress || 'Main Stadium Boulevard',
          city: formData.city,
        },
        pricing: [
          { category: 'VIP', price: Number(formData.vipPrice) },
          { category: 'Premium', price: Number(formData.premiumPrice) },
          { category: 'General', price: Number(formData.generalPrice) },
        ],
      };

      const res = await api.post('/events', payload);
      addToast('Event created successfully!', 'success');
      navigate(`/event/${res.data?.data?.event?._id || ''}`);
    } catch (err) {
      addToast(err.message || 'Failed to create event', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Build live preview object for EventCard
  const previewEvent = {
    _id: 'preview',
    title: formData.title || 'Your Event Title Here',
    category: formData.category,
    date: formData.date,
    city: formData.city,
    imageUrl: formData.imageUrl,
    venue: { name: formData.venueName || 'Grand Arena' },
    pricing: [{ price: Number(formData.generalPrice) || 999 }],
    availableSeats: 160,
  };

  return (
    <div className="mobile-safe-bottom" style={{ minHeight: '100vh', paddingTop: '1.75rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Top Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/organizer')}
            className="btn-icon"
            style={{ width: '38px', height: '38px' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--primary-gold)', fontWeight: 800, textTransform: 'uppercase' }}>
              Organizer Wizard
            </span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff' }}>
              Publish a New Event
            </h1>
          </div>
        </div>

        {/* Wizard Steps Indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            background: 'var(--bg-card)',
            padding: '1rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: step >= 1 ? 'var(--primary-gold)' : 'var(--text-muted)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= 1 ? 'var(--primary-gold)' : 'rgba(255,255,255,0.1)', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
              1
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Basic Info</span>
          </div>

          <div style={{ flex: 1, height: '2px', background: step >= 2 ? 'var(--primary-gold)' : 'var(--border-subtle)', margin: '0 1rem' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: step >= 2 ? 'var(--primary-gold)' : 'var(--text-muted)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= 2 ? 'var(--primary-gold)' : 'rgba(255,255,255,0.1)', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
              2
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Venue & Tickets</span>
          </div>

          <div style={{ flex: 1, height: '2px', background: step >= 3 ? 'var(--primary-gold)' : 'var(--border-subtle)', margin: '0 1rem' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: step >= 3 ? 'var(--primary-gold)' : 'var(--text-muted)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= 3 ? 'var(--primary-gold)' : 'rgba(255,255,255,0.1)', color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
              3
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Live Preview</span>
          </div>
        </div>

        {/* 2-Column Layout: Form & Live Preview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Step Form Box */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.75rem',
            }}
          >
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Event Fundamentals</h2>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Arijit Singh Live in Concert"
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} style={{ background: '#11151C' }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                    Date & Showtime *
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                    Cover Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                    Event Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the experience, lineup, rules, and entry guidelines..."
                    className="form-input"
                  />
                </div>

                <button
                  type="button"
                  disabled={!formData.title}
                  onClick={() => setStep(2)}
                  className="btn-primary"
                  style={{ marginTop: '0.5rem' }}
                >
                  <span>Next: Venue & Tickets</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Venue & Ticket Pricing</h2>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                    City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="form-input"
                  >
                    {MAJOR_CITIES.filter((c) => c !== 'All Cities').map((c) => (
                      <option key={c} value={c} style={{ background: '#11151C' }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    placeholder="e.g. Palace Grounds, Bengaluru"
                    className="form-input"
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'block' }}>
                    Venue Address
                  </label>
                  <input
                    type="text"
                    value={formData.venueAddress}
                    onChange={(e) => setFormData({ ...formData, venueAddress: e.target.value })}
                    placeholder="e.g. Bellary Road, Jayamahal"
                    className="form-input"
                  />
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary-gold)' }}>
                    Tier Pricing (₹ INR)
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 700 }}>
                        VIP TIER
                      </label>
                      <input
                        type="number"
                        value={formData.vipPrice}
                        onChange={(e) => setFormData({ ...formData, vipPrice: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 700 }}>
                        PREMIUM TIER
                      </label>
                      <input
                        type="number"
                        value={formData.premiumPrice}
                        onChange={(e) => setFormData({ ...formData, premiumPrice: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 700 }}>
                        GENERAL TIER
                      </label>
                      <input
                        type="number"
                        value={formData.generalPrice}
                        onChange={(e) => setFormData({ ...formData, generalPrice: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-primary"
                    style={{ flex: 1 }}
                  >
                    Review & Preview
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Ready to Publish?</h2>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Your event will be published with 160 interactive seats across VIP, Premium, and
                  General sections, protected with 5-minute atomic locking and instant digital QR passes.
                </p>

                <div
                  style={{
                    padding: '1rem',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <div>📍 <strong>City:</strong> {formData.city}</div>
                  <div>🏢 <strong>Venue:</strong> {formData.venueName || 'Grand Arena'}</div>
                  <div>📅 <strong>Date:</strong> {new Date(formData.date).toLocaleString()}</div>
                  <div>🏷️ <strong>General Price:</strong> ₹{formData.generalPrice}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handlePublish}
                    className="btn-primary"
                    style={{ flex: 1 }}
                  >
                    {loading ? 'Publishing...' : 'Publish Event Live 🚀'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Live Card Preview Column */}
          <div>
            <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-gold)', fontSize: '0.82rem', fontWeight: 700 }}>
              <Sparkles size={16} />
              <span>Live Card Preview</span>
            </div>
            <div style={{ maxWidth: '340px' }}>
              <EventCard event={previewEvent} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
