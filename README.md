# 📚 BookVerse — Intelligent Book Recommendation & Reading Discovery Platform

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-forestgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> 📖 **BookVerse** is a modern, high-performance **Book Recommendation and Reading Tracking Application** crafted with React 18, Vite, Express, and MongoDB Atlas. It features a multi-algorithm recommendation engine, interactive vibe matcher, live reading progress tracking, bookshelf management, and reader community reviews.

---

## 🌟 Key Highlights & Features

### 1. 🧠 Multi-Algorithm Recommendation Engine
- **Vibe / Mood Matcher Quiz**: An interactive recommendation tool where readers select emotional vibes (*Mind-Bending, Heartbreaking, Cosy & Warm, Dark & Gritty, Thought-Provoking*), preferred reading pace (*Fast, Moderate, Slow Burn*), and length (*Short, Medium, Epic*) to generate scored match percentages (80%–99%) with distinct match rationales.
- **Personalized "For You" Feed**: Computes personalized recommendation scores factoring in user's shelf history, author affinities, genre preferences, and community ratings.
- **Content-Based Similarity**: Deep similarity scoring across books sharing overlapping genres, moods, and author bibliography.

### 2. 📖 Rich Book Catalog & Library Explorer
- **Curated Multi-Genre Catalog**: Seeded with 20+ bestselling literary masterpieces across Sci-Fi, Fantasy, Mystery/Thriller, Non-Fiction, Philosophy, Romance, and Classics.
- **Multi-Dimensional Filtering**: Search by title, author, or synopsis; filter by genres, mood vibes, minimum ratings, reading pace, and sort by rating, release year, popularity, or page count.
- **Book Showcase**: Immersive 3D book cover cards with genre tags, spine styling, rating badge, and shelf quick-actions.

### 3. 🔖 Reading Shelves & Page Progress Tracker
- **4 Dedicated Shelves**:
  - 📖 **Currently Reading** — Live reading progress tracker with interactive percentage slider, pages read out of total, and live progress updating.
  - 🔖 **Want to Read** — Wishlist and reading queue.
  - ✅ **Completed** — Log completed books, review your finished milestones, and calculate total pages read.
  - ⭐ **Favorites** — Curated showcase of all-time favorite reads.
- **Live Page Tracking Modal**: Update current page with a smooth drag slider or direct number input, with real-time recalculation of total pages read.

### 4. 🎯 Annual Reading Challenge & Reader Stats
- Set and track your yearly book completion goal (e.g., 20 books/year).
- Dynamic progress bar with percentage complete, remaining books, and live reading statistics (Total Shelved, Currently Reading, Pages Read).

### 5. ⭐ Community Reviews & Star Ratings
- Readers can submit star ratings (1 to 5) with headlines and written reviews.
- Automatic recalculation of `averageRating` and `ratingsCount` on the book schema upon every review submission.

### 6. 🎨 Luxury Glassmorphic Aesthetic
- Tailored modern dark mode with violet/indigo accents (`#8B5CF6`, `#6366F1`), gradient text, smooth hover transitions, and responsive mobile dock navigation.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas cluster or local MongoDB instance

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Suhirdha24/ticket-booking-platform-.git
cd ticket-booking-platform-

# Install root dependencies
npm install

# Install client dependencies
npm --prefix client install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### 3. Seed Database with Curated Books & Demo User
```bash
npm run seed:books
```
*Seeds 20 bestselling books, demo user `reader@example.com` (`Password@123`), sample reading shelves, and community reviews.*

### 4. Launch Locally
```bash
npm run dev
```
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🧪 Testing

Run backend tests powered by Vitest:
```bash
npm test
```
*Validates book catalog queries, vibe matcher quiz, similar book recommendations, shelf CRUD, and review rating recalculations.*

---

## 📡 Key API Routes

### 📚 Books
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/books` | Catalog listing with search, genre, mood, pace, rating & sorting |
| `GET` | `/api/books/featured` | Spotlighted featured reads |
| `GET` | `/api/books/trending` | Most popular and trending books |
| `GET` | `/api/books/:id` | Full details, quotes, synopsis & reading pace |

### 🧠 Recommendations
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recommendations/for-you` | Personalized reading feed (auth/guest) |
| `POST` | `/api/recommendations/vibe-matcher` | Interactive mood & pacing matcher quiz |
| `GET` | `/api/recommendations/similar/:bookId` | Content-based similar books |

### 📖 Reading Shelves
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reading-list` | Get user's shelves with reading statistics |
| `POST` | `/api/reading-list` | Add book to shelf or update reading page progress |
| `DELETE` | `/api/reading-list/:bookId` | Remove book from reading list |

### ⭐ Reviews
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reviews/book/:bookId` | Get all reviews for a book |
| `POST` | `/api/reviews/book/:bookId` | Post star rating and written review |
| `DELETE` | `/api/reviews/:id` | Delete own review |

---

## 👥 Demo User Credentials

| Role | Email | Password |
|---|---|---|
| **Reader** | `reader@example.com` | `Password@123` |

*(Or click "Quick Demo Reader" on the `/login` page for 1-click login).*

---

## 📜 License
MIT License. Built with passion for readers worldwide.
