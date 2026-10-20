import mongoose from 'mongoose';

const readingListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['WANT_TO_READ', 'CURRENTLY_READING', 'COMPLETED'],
      default: 'WANT_TO_READ',
      index: true,
    },
    progressPages: {
      type: Number,
      default: 0,
      min: 0,
    },
    userRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    personalNotes: {
      type: String,
      trim: true,
      default: '',
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
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

// Prevent duplicate entries for the same user and book
readingListSchema.index({ user: 1, book: 1 }, { unique: true });
readingListSchema.index({ user: 1, status: 1 });

const ReadingList =
  mongoose.models.ReadingList ||
  mongoose.model('ReadingList', readingListSchema);

export default ReadingList;
