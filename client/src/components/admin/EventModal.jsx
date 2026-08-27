import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import api from '../../api/client.js';
import { showErrorToast, showSuccessToast } from '../../store/toastStore.js';

export default function EventModal({ isOpen, onClose, onEventSaved, eventToEdit, venues = [] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Concert');
  const [venueId, setVenueId] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [vipPrice, setVipPrice] = useState(150);
  const [premiumPrice, setPremiumPrice] = useState(90);
  const [generalPrice, setGeneralPrice] = useState(50);
  const [cutoffHours, setCutoffHours] = useState(24);
  const [bannerUrl, setBannerUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || '');
      setDescription(eventToEdit.description || '');
      setCategory(eventToEdit.category || 'Concert');
      setVenueId(eventToEdit.venue?._id || eventToEdit.venue || '');
      setCity(eventToEdit.city || '');
      setDate(eventToEdit.date ? new Date(eventToEdit.date).toISOString().slice(0, 16) : '');
      setBannerUrl(eventToEdit.bannerUrl || '');
      setCutoffHours(eventToEdit.cancellationPolicy?.cutoffHours || 24);

      if (eventToEdit.pricing) {
        const vip = eventToEdit.pricing.find((p) => p.category === 'VIP');
        const prem = eventToEdit.pricing.find((p) => p.category === 'Premium');
        const gen = eventToEdit.pricing.find((p) => p.category === 'General');
        if (vip) setVipPrice(vip.price);
        if (prem) setPremiumPrice(prem.price);
        if (gen) setGeneralPrice(gen.price);
      }
    } else {
      // Default new event values
      setTitle('');
      setDescription('');
      setCategory('Concert');
      setVenueId(venues[0]?._id || '');
      setCity(venues[0]?.city || 'San Francisco');
      setDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
      setBannerUrl('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80');
      setVipPrice(150);
      setPremiumPrice(90);
      setGeneralPrice(50);
      setCutoffHours(24);
    }
  }, [eventToEdit, isOpen, venues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        category,
        venueId,
        city: city || venues.find((v) => v._id === venueId)?.city || 'San Francisco',
        date: new Date(date),
        bannerUrl,
        pricing: [
          { category: 'VIP', price: Number(vipPrice) },
          { category: 'Premium', price: Number(premiumPrice) },
          { category: 'General', price: Number(generalPrice) },
        ],
        cancellationPolicy: {
          allowCancellation: true,
          cutoffHours: Number(cutoffHours),
        },
      };

      if (eventToEdit) {
        await api.put(`/events/${eventToEdit._id}`, payload);
        showSuccessToast('Event Updated', 'Event details were updated successfully.');
      } else {
        await api.post('/events', payload);
        showSuccessToast('Event Created', 'New event and its seat map were successfully generated.');
      }

      setIsSubmitting(false);
      onEventSaved();
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      showErrorToast('Failed to Save Event', err.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Event' : 'Create New Event'}
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="input-group">
          <label className="input-label">Event Title</label>
          <input
            type="text"
            className="input-field"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Neon Horizon Festival 2026"
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Event Description</label>
          <textarea
            className="input-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Event details, artist highlights, schedule..."
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Category</label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="Concert" style={{ backgroundColor: '#181a28' }}>Concert</option>
              <option value="Conference" style={{ backgroundColor: '#181a28' }}>Conference</option>
              <option value="Theatre" style={{ backgroundColor: '#181a28' }}>Theatre</option>
              <option value="Sports" style={{ backgroundColor: '#181a28' }}>Sports</option>
              <option value="Comedy" style={{ backgroundColor: '#181a28' }}>Comedy</option>
              <option value="Festival" style={{ backgroundColor: '#181a28' }}>Festival</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Venue</label>
            <select
              className="input-field"
              value={venueId}
              onChange={(e) => {
                setVenueId(e.target.value);
                const selectedVenue = venues.find((v) => v._id === e.target.value);
                if (selectedVenue) setCity(selectedVenue.city);
              }}
              style={{ cursor: 'pointer' }}
              required
            >
              {venues.map((v) => (
                <option key={v._id} value={v._id} style={{ backgroundColor: '#181a28' }}>
                  {v.name} ({v.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Date & Time</label>
            <input
              type="datetime-local"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Cancellation Cutoff (Hours)</label>
            <input
              type="number"
              className="input-field"
              value={cutoffHours}
              onChange={(e) => setCutoffHours(e.target.value)}
              min={0}
              placeholder="24"
              required
            />
          </div>
        </div>

        {/* Pricing Tiers */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.65rem' }}>
            Seat Tier Pricing ($ USD)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div className="input-group">
              <label className="input-label" style={{ color: '#fbbf24' }}>VIP Tier ($)</label>
              <input
                type="number"
                className="input-field"
                value={vipPrice}
                onChange={(e) => setVipPrice(e.target.value)}
                min={1}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: '#c084fc' }}>Premium Tier ($)</label>
              <input
                type="number"
                className="input-field"
                value={premiumPrice}
                onChange={(e) => setPremiumPrice(e.target.value)}
                min={1}
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ color: '#22d3ee' }}>General Tier ($)</label>
              <input
                type="number"
                className="input-field"
                value={generalPrice}
                onChange={(e) => setGeneralPrice(e.target.value)}
                min={1}
                required
              />
            </div>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Banner Image URL</label>
          <input
            type="url"
            className="input-field"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            {eventToEdit ? 'Save Changes' : 'Create & Generate Seats'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
