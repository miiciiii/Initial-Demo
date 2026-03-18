# Implementation Notes — Protocol Discussion Platform

## Architecture Overview

The platform is built as a decoupled full-stack application: a Laravel REST API backend consumed by a React SPA frontend, with Typesense providing fast full-text search on top of a MySQL database.

---

## Backend Design Decisions

### API Structure

All routes live under `/api/v1/` with consistent `{ data, message, status }` response envelopes. HTTP semantics are followed strictly: 201 for creates, 204 for deletes, 422 for validation failures. Validation is handled exclusively through Form Request classes — no inline `$request->validate()` in controllers — keeping controllers thin and reusable.

Authentication uses **Laravel Sanctum** with token-based auth. Read endpoints are public; all write operations require a `Bearer` token. This maps cleanly to the use case where anonymous browsing is allowed but creating content requires an account.

### Polymorphic Voting

Votes use a polymorphic `votes` table (`votable_type` / `votable_id`) so a single model and controller handles voting on protocols, threads, and comments. The controller accepts `protocol`, `thread`, or `comment` as the type string and resolves the correct model class internally. The vote logic supports three states per user per item: no vote → upvote → downvote → no vote (toggle/switch), enforced with a database unique constraint on `(user_id, votable_id, votable_type)`.

### Nested Comments

Comments support one level of nesting via a `parent_id` self-referential foreign key. The API returns a full comment tree from a single query using eager-loaded recursive relationships, with depth handled on the frontend (replies are hidden at depth 3 to avoid infinite nesting in the UI).

### Typesense Integration

A `TypesenseService` class wraps the Typesense PHP client and is injected via the service container. Two collections are maintained: `protocols` and `threads`. Sync is triggered from Eloquent model observers (`ProtocolObserver`, `ThreadObserver`) on create, update, and delete events, keeping the search index consistent with the database without any queue dependency. A `search:reindex` Artisan command allows full index rebuilds from scratch.

Search supports: full-text across title/body, tag filtering (exact match on array field), and sorting by recency or vote score. Vote scores in the search index are updated whenever a vote is cast, so search rankings reflect live engagement data.

---

## Frontend Design Decisions

### State Management

No global state library is used. Each page manages its own data with `useState` and `useEffect`. Authentication state is the only global concern, handled through a `AuthContext` (React Context) that persists the token and user object in `localStorage`. An Axios request interceptor automatically attaches the `Authorization: Bearer` header to every outbound request.

### Search UX

The search page uses a 300ms debounce on the input to avoid hammering the API on every keystroke. Search results are split into Protocols and Threads sections. Available tags are extracted from unfiltered results and shown as clickable filter pills — clicking a tag re-runs the search with a `tags` parameter, narrowing results without losing the original tag list.

### Voting

`VoteButtons` applies optimistic UI updates: the score and active state update immediately on click, then roll back silently if the API call fails. This makes the interaction feel instant despite the network round-trip.

### Layout

The app uses a three-column layout on large screens: fixed sidebar navigation, main content area, and a right panel showing the top 3 most-upvoted protocols. On mobile, the sidebar collapses into a hamburger menu with a slide-over drawer. The layout breakpoints use Tailwind's `lg` and `xl` prefixes throughout.

---

## Known Limitations & Future Work

- **No real-time updates** — vote counts and new comments require a page refresh to reflect changes made by other users. WebSockets/polling could address this.
- **Flat protocol list** — protocols are not organized by category or domain. A category taxonomy would improve discoverability at scale.
- **No file attachments** — protocols are text-only. Supporting PDF/image attachments would be valuable for scientific protocol use cases.
- **Search index consistency** — vote score updates in Typesense are synchronous on every vote. At high write volume, this should move to a queued job.
