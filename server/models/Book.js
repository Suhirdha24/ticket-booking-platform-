import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      index: true,
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image URL is required'],
    },
    isbn: {
      type: String,
      sparse: true,
      trim: true,
    },
    openLibraryId: {
      type: String,
      sparse: true,
      index: true,
    },
    amazonLink: {
      type: String,
    },
    previewLink: {
      type: String,
    },
    genres: [
      {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
    ],
    publishedYear: {
      type: Number,
      default: 2023,
    },
    publisher: {
      type: String,
      default: 'Penguin Random House',
    },
    pageCount: {
      type: Number,
      required: true,
      default: 320,
    },
    language: {
      type: String,
      default: 'English',
    },
    averageRating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
      index: true,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    moodTags: [
      {
        type: String,
        trim: true,
      },
    ],
    readingPace: {
      type: String,
      enum: ['Fast', 'Moderate', 'Slow Burn'],
      default: 'Moderate',
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    trending: {
      type: Boolean,
      default: false,
      index: true,
    },
    quotes: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound text index for title, author, and description search
bookSchema.index({ title: 'text', author: 'text', description: 'text' });
bookSchema.index({ genres: 1, averageRating: -1 });

const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

export default Book;
