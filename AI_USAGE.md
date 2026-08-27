# AI Usage Reflection & Development Documentation

This document outlines the AI-assisted development workflow used in architecting and implementing the **EventHub Event Ticket Booking Platform**.

---

## 🤖 Scope of AI Assistance

Antigravity AI (powered by Google DeepMind Gemini models) assisted across the following development phases:

### 1. Architecture & Serverless Design
- Designed the dual-target architecture: local development Express server (`server/server.js`) and Vercel Serverless Function entrypoint (`api/index.js`).
- Formulated the serverless-safe Mongoose connection pooling pattern with global connection caching to prevent connection exhaustion in serverless runtimes.
- Configured `vercel.json` rewrites for SPA client routing and `/api/*` serverless routing.

### 2. Concurrency & Data Model Architecture
- Structured the event-specific `Seat` schema with compound unique indexing `{ event: 1, seatNumber: 1 }` and optimistic locking version counters.
- Designed the atomic conditional claiming algorithm:
  - Supports MongoDB replica set ACID multi-document transactions.
  - Implements an atomic rollback fallback for standalone MongoDB environments.
  - Returns machine-readable `HTTP 409 Conflict` (`SEAT_ALREADY_HELD`) upon race condition collisions.
- Designed lazy evaluation for 5-minute reservation locks (`heldExpiresAt <= Date.now()`), eliminating dependencies on long-running `setInterval` timers.

### 3. Full-Stack Implementation
- **Backend API**: Express route handlers for authentication, RBAC authorization, events discovery, seat map queries, reservations, transactional bookings, mock payments, cancellations, and MongoDB aggregations.
- **Frontend App**: Responsive React + Vite Single Page Application using Zustand state management, Axios relative routing, and custom CSS design system.
- **Components**: Interactive stadium/theatre seat map grid, live countdown reservation clock, digital E-ticket with QR code canvas rendering, and admin metrics dashboard.

### 4. Testing & Verification
- Authored the comprehensive 15-scenario test suite using **Vitest**, **Supertest**, and **MongoMemoryServer**.
- Implemented and verified the critical race condition test asserting exactly 1 winner (`201 Created`) and 1 loser (`409 Conflict`) during simultaneous seat reservation attempts.

---

## 🛠️ Human Oversight & Architectural Decisions

- **Strict Serverless Adherence**: Ensured no long-running daemon dependencies or in-memory persistence in production code.
- **Security & Data Integrity**: Verified that role assignments, pricing calculations, seat locking, and cancellation cutoff policies are strictly enforced server-side.
- **Authoritative Database State**: Guaranteed that the frontend visual state is always grounded in verified MongoDB responses.
