import mongoose from 'mongoose';

const pricingTierSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ['VIP', 'Premium', 'General'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const cancellationPolicySchema = new mongoose.Schema(
  {
    allowCancellation: {
      type: Boolean,
      default: true,
    },
    cutoffHours: {
      type: Number,
      default: 24,
      min: 0,
    },
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
    },
    category: {
      type: String,
      required: [true, 'Please provide event category'],
      enum: [
        'Concert',
        'Conference',
        'Theatre',
        'Sports',
        'Comedy',
        'Festival',
        'Other',
      ],
      index: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: [true, 'Please specify event venue'],
      index: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide event city'],
      trim: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date & time'],
      index: true,
    },
    doorsOpen: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
    },
    thumbnailUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop&q=80',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'],
      default: 'PUBLISHED',
      index: true,
    },
    pricing: [pricingTierSchema],
    cancellationPolicy: {
      type: cancellationPolicySchema,
      default: () => ({ allowCancellation: true, cutoffHours: 24 }),
    },
    totalSeats: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableSeats: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for searching and filtering
eventSchema.index({ status: 1, date: 1 });
eventSchema.index({ status: 1, category: 1, city: 1, date: 1 });
eventSchema.index({ title: 'text', description: 'text' });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;
