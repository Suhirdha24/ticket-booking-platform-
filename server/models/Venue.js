import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rows: {
      type: Number,
      required: true,
      min: 1,
    },
    seatsPerRow: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      required: true,
      enum: ['VIP', 'Premium', 'General'],
      default: 'General',
    },
  },
  { _id: false }
);

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide venue name'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide venue address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    zipCode: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: 'USA',
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify venue capacity'],
      min: 1,
    },
    sections: [sectionSchema],
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
    },
  },
  {
    timestamps: true,
  }
);

const Venue = mongoose.models.Venue || mongoose.model('Venue', venueSchema);

export default Venue;
