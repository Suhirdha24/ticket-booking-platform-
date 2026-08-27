# AI Usage Documentation — Event Ticket Booking Platform

This document outlines the AI-assisted software development workflow used to engineer, debug, and test the **Event Ticket Booking Platform** in compliance with the assessment guidelines.

---

## 1. AI Tools Used

- **Google Antigravity**: Primary AI pair programmer for full-stack MERN architecture, Vercel serverless functions design, automated testing harness generation, and React component development.
- **Claude / ChatGPT**: Used for auxiliary prompt ideation, schema review, and reviewing high-concurrency race condition scenarios in MongoDB.

---

## 2. Major Features Developed with AI Assistance

1. **Vercel Serverless Function Topology**:
   - Creating the stateless Express serverless handler in `api/index.js` wrapping `server/app.js` without relying on `app.listen()`.
   - Implementing connection caching (`server/config/db.js`) to reuse Mongoose database connections across serverless cold starts.

2. **Atomic Concurrency & Seat Locking Engine**:
   - Designing the event-specific `Seat` schema with compound unique index `{ event: 1, seatNumber: 1 }`.
   - Formulating the atomic conditional query in `server/routes/reservationRoutes.js` that checks for `status: 'AVAILABLE'` or expired `HELD` seats in a single database operation.

3. **Lazy 5-Minute Hold Expiry Strategy**:
   - Engineering server-authoritative timestamp evaluation (`heldExpiresAt <= Date.now()`) on seat queries and booking validations to eliminate fragile background `setInterval` timers.

4. **Multi-Facet Admin Analytics**:
   - Constructing MongoDB `$facet` aggregation pipelines in `server/routes/adminRoutes.js` for gross revenue, category breakdown, ticket count, and recent order stream calculations.

5. **Automated Testing Harness**:
   - Authoring the 15-scenario Vitest + Supertest test suite (`server/tests/`), including the critical concurrent race condition test (`concurrency.test.js`).

---

## 3. Examples of Useful Prompts

### Prompt 1 (Concurrency & Locking):
> *"Design a MongoDB Mongoose query for an event seat reservation system where two users simultaneously trying to reserve seat A10 results in exactly ONE winner (HTTP 201) and ONE loser (HTTP 409 Conflict). Ensure it works seamlessly on both MongoDB Atlas replica sets and standalone fallback environments."*

### Prompt 2 (Serverless Database Connection Caching):
> *"Provide a production-ready Mongoose connection pooling module for Vercel Node.js Serverless Functions that caches the connection across invocations and handles DNS SRV resolution on Windows environments."*

### Prompt 3 (Interactive Seating Map):
> *"Create a responsive, glassmorphic stadium seat map in React with stage glow effects, VIP/Premium/General color coding, dynamic tooltips, and a floating checkout dock."*

---

## 4. Examples of AI-Generated Code That Was Modified

### Example 1: Robust DNS SRV Resolution on Windows Local Dev
- **Original AI Proposal**: Relied on standard `mongoose.connect(process.env.MONGODB_URI)` without custom DNS configuration.
- **Issue**: On certain Windows ISP configurations, Node.js failed with `querySrv ECONNREFUSED _mongodb._tcp.cluster0...`.
- **Modification Made**: Added an explicit DNS fallback to Google DNS servers (`8.8.8.8`, `8.8.4.4`) before connecting:
```javascript
// server/config/db.js and server/scripts/seed.js
import dns from 'node:dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Graceful fallback in locked-down environments
}
```

### Example 2: Fallback for Non-Replica Set Test Environments
- **Original AI Proposal**: Used `session.startTransaction()` unconditionally for all reservation updates.
- **Issue**: When running unit tests with standard in-memory MongoDB without replica set configurations, multi-document transactions threw `Transaction numbers are only allowed on a replica set member or mongos`.
- **Modification Made**: Refactored the controller to use atomic `findOneAndUpdate` with conditional filters and automatic rollback of partial reservations if any seat fails, ensuring bulletproof 409 Conflict handling in both Atlas and isolated test runners.

---

## 5. Rejected AI-Generated Approach & Rationale

### ❌ Rejected Approach: Long-Running In-Memory `setInterval` Timers
- **Proposed by AI**: Setting up a `setInterval(() => releaseExpiredSeats(), 30000)` background loop inside the Express server to sweep and clear expired seat holds every 30 seconds.
- **Why It Was Rejected**:
  1. **Serverless Incompatibility**: In Vercel's serverless/Fluid Functions model, function instances freeze or terminate between invocations. A `setInterval` loop cannot reliably execute in a serverless environment.
  2. **Data Consistency**: A background sweeper introduces a time lag (up to 30 seconds) where an expired seat appears unavailable to other users.
- **Chosen Solution**: **Lazy Authoritative Evaluation**. Seat availability is dynamically computed on-the-fly during seat fetching (`GET /api/events/:id/seats`) and atomic reservation claims (`heldExpiresAt: { $lte: new Date() }`). This is 100% serverless-safe, instantaneous, and strictly consistent.

---

## 6. Significant Debugging Performed with AI Assistance

1. **Git Remote & Branch Sync**:
   - **Problem**: Local repository had its remote `origin` pointing to a previous project repo (`Mini-E-Commerce-Store`), causing push rejections.
   - **Solution**: Used AI guidance to inspect `git remote -v`, update the remote to `https://github.com/Suhirdha24/ticket-booking-platform-.git` with `git remote set-url`, and push cleanly to `main`.

2. **Windows PowerShell Statement Chaining**:
   - **Problem**: Standard bash syntax `&&` threw parser errors in PowerShell (`The token '&&' is not a valid statement separator`).
   - **Solution**: Replaced chaining operators with PowerShell-compliant `;` commands.

3. **Seat State Race Condition Testing**:
   - **Problem**: Testing simultaneous promises with `Promise.all` required careful mock setup so both requests hit the route handler concurrently.
   - **Solution**: Implemented an automated Vitest concurrency test that dispatches simultaneous requests for the exact same seat and asserts one `HTTP 201` and one `HTTP 409 Conflict`.
