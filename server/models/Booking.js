import mongoose from 'mongoose';

const priceSnapshotItemSchema = new mongoose.Schema(
  {
    seatNumber: { type: String, required: true },
    row: { type: String, required: true },
    section: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const eventSnapshotSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    venueName: { type: String, required: true },
    venueCity: { type: String, required: true },
    venueAddress: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
  },
  { _id: false }
);

const venueSnapshotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, default: '' },
  },
  { _id: false }
);

const paymentDetailsSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ['CARD', 'UPI', 'NET_BANKING'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      required: true,
    },
    paidAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
      index: true,
    },
    reservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      required: [true, 'Reservation reference is required'],
      unique: true,
      index: true,
    },
    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat',
        required: true,
      },
    ],
    eventSnapshot: {
      type: eventSnapshotSchema,
      required: true,
    },
    venueSnapshot: {
      type: venueSnapshotSchema,
      required: true,
    },
    priceSnapshot: [priceSnapshotItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    convenienceFee: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDetails: paymentDetailsSchema,
    paymentStatus: {
      type: String,
      enum: ['PAID', 'FAILED', 'REFUNDED'],
      default: 'PAID',
      index: true,
    },
    bookingStatus: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
      index: true,
    },
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    qrToken: {
      type: String,
      required: true,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ user: 1, bookingStatus: 1, createdAt: -1 });
bookingSchema.index({ event: 1, bookingStatus: 1 });

const Booking =
  mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
