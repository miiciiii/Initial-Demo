# Protocol Discussion Platform

A full-stack web application for publishing structured protocols and engaging in discussions through threads, comments, reviews, and voting.

**Stack:** Laravel 11 · React 19 + Vite · Tailwind CSS 4 · MySQL · Typesense

---

## Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8+
- [Typesense](https://typesense.org/docs/guide/install-typesense.html) server running locally

---

## Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

Edit `.env` with your database and Typesense credentials:

```env
DB_DATABASE=protocol_platform
DB_USERNAME=root
DB_PASSWORD=your_password

TYPESENSE_API_KEY=your-typesense-api-key
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
```

```bash
# Create database, run migrations, and seed sample data
php artisan migrate --seed

# Start the API server
php artisan serve
```

The API will be available at `http://localhost:8000`.

---

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

The default `.env` points to the local API:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Typesense Setup

### 1. Install Typesense

**macOS (Homebrew):**
```bash
brew install typesense/tap/typesense-server
brew services start typesense-server
```

**Docker:**
```bash
docker run -p 8108:8108 \
  -v /tmp/typesense-data:/data \
  typesense/typesense:27.1 \
  --data-dir /data \
  --api-key=your-api-key \
  --enable-cors
```

**Linux:**
See [Typesense installation docs](https://typesense.org/docs/guide/install-typesense.html).

### 2. Reindex data

After seeding the database, populate the search index:

```bash
cd backend
php artisan search:reindex
```

This rebuilds the `protocols` and `threads` collections in Typesense from the current database records.

---

## API Overview

All endpoints are prefixed with `/api/v1/`. Read endpoints are public; write endpoints require a Bearer token.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user, returns token |
| POST | `/auth/login` | Login, returns token |
| POST | `/auth/logout` | Revoke token (protected) |
| GET | `/auth/me` | Get authenticated user (protected) |

### Protocols

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/protocols` | List protocols (paginated, sortable, searchable) |
| GET | `/protocols/{id}` | Single protocol with relations |
| POST | `/protocols` | Create protocol (protected) |
| PUT | `/protocols/{id}` | Update protocol (protected) |
| DELETE | `/protocols/{id}` | Delete protocol (protected) |

Query parameters for `GET /protocols`:
- `search` — filter by title
- `sort` — `recent` \| `reviewed` \| `upvoted`
- `page`, `per_page`

### Threads

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/threads/{id}` | Single thread with comments and votes |
| POST | `/threads` | Create thread (protected) |
| PUT | `/threads/{id}` | Update thread (protected) |
| DELETE | `/threads/{id}` | Delete thread (protected) |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments/thread/{thread_id}` | Nested comment tree for a thread |
| POST | `/comments` | Create comment or reply (protected) |
| DELETE | `/comments/{id}` | Delete comment (protected) |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews/protocol/{protocol_id}` | List reviews for a protocol |
| POST | `/reviews` | Submit text feedback (protected) |

### Votes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/votes` | Cast, toggle, or switch a vote (protected) |

Request body:
```json
{
  "votable_id": 15,
  "votable_type": "protocol",
  "value": 1
}
```

`votable_type` accepts: `protocol`, `thread`, `comment`
`value` accepts: `1` (upvote) or `-1` (downvote)

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search` | Full-text search across protocols and threads |

Query parameters:
- `q` — search query (required)
- `sort` — `recent` \| `rated` \| `upvoted`
- `tags` — comma-separated tag filter (e.g. `biology,lab`)
- `type` — `protocols` \| `threads` (omit for both)

### Response Format

All responses follow:
```json
{
  "status": "success",
  "message": "...",
  "data": { ... }
}
```

---

## Sample Data

The seeder creates:
- 12 protocols with realistic content and tags
- 10 threads linked to protocols
- Multiple nested comments per thread
- Multiple reviews per protocol
- Votes distributed across protocols, threads, and comments

```bash
# Re-seed at any time (drops and recreates all data)
php artisan migrate:fresh --seed
php artisan search:reindex
```
