import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required for reservation'],
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required for reservation'],
      index: true,
    },
    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat',
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Method to verify if reservation is valid & active
reservationSchema.methods.isValidActive = function (now = new Date()) {
  return this.status === 'ACTIVE' && this.expiresAt > now;
};

// Compound indexes
reservationSchema.index({ user: 1, status: 1, expiresAt: 1 });
reservationSchema.index({ event: 1, status: 1 });

const Reservation =
  mongoose.models.Reservation ||
  mongoose.model('Reservation', reservationSchema);

export default Reservation;
