import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
      index: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue',
      required: [true, 'Venue reference is required'],
    },
    seatNumber: {
      type: String,
      required: [true, 'Seat number is required'],
      trim: true,
    },
    row: {
      type: String,
      required: [true, 'Row identifier is required'],
      trim: true,
    },
    section: {
      type: String,
      required: [true, 'Section identifier is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Seat category is required'],
      enum: ['VIP', 'Premium', 'General'],
      default: 'General',
    },
    price: {
      type: Number,
      required: [true, 'Seat price is required'],
      min: 0,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'HELD', 'BOOKED'],
      default: 'AVAILABLE',
      index: true,
    },
    heldBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      default: null,
      index: true,
    },
    heldExpiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    version: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound unique index: A seatNumber must be unique per event
seatSchema.index({ event: 1, seatNumber: 1 }, { unique: true });

// Compound index for fast seat state lookups
seatSchema.index({ event: 1, status: 1, heldExpiresAt: 1 });

/**
 * Calculates effective status based on lazy expiration evaluation.
 * If heldExpiresAt has passed, seat is effectively AVAILABLE.
 */
seatSchema.methods.getEffectiveStatus = function (now = new Date()) {
  if (this.status === 'HELD' && this.heldExpiresAt && this.heldExpiresAt <= now) {
    return 'AVAILABLE';
  }
  return this.status;
};

// Virtual field for effective status in JSON outputs
seatSchema.virtual('effectiveStatus').get(function () {
  const now = new Date();
  if (this.status === 'HELD' && this.heldExpiresAt && this.heldExpiresAt <= now) {
    return 'AVAILABLE';
  }
  return this.status;
});

const Seat = mongoose.models.Seat || mongoose.model('Seat', seatSchema);

export default Seat;
