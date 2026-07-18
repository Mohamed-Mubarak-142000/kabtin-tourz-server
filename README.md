# Kabtin Brez — Backend API

Production-quality Node.js + Express + MongoDB (Mongoose) REST API for a Hajj/Umrah/travel
agency (حج, عمرة, حجز تذاكر طيران, سياحة داخلية, سياحة خارجية, تأشيرات).

This is one of three independently deployable folders in the monorepo:
- `backend` (this folder) — the API
- `landing` — public Next.js marketing site (consumes the public, unauthenticated endpoints)
- `dashboard` — React/Vite admin panel (consumes the authenticated endpoints)

## Tech stack

Express, Mongoose (MongoDB), JWT auth (jsonwebtoken), bcryptjs, zod validation, multer +
Cloudinary for image uploads, helmet, cors, express-rate-limit.

## Project layout

```
backend/
  src/
    config/        # env.js, db.js, cloudinary.js
    middlewares/    # auth.js, errorHandler.js, asyncHandler.js, validate.js, rateLimiters.js
    models/         # Admin, Trip, Branch, Testimonial, Faq, Lead, Settings
    controllers/    # thin, per-entity
    services/       # business logic / DB access, per-entity
    routes/         # per-entity, mounted under /api/*
    utils/          # apiResponse.js, slugify.js, jwt.js
    app.js
    server.js
  scripts/
    seed.js
  .env.example
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy the env file and fill in real values:
   ```
   cp .env.example .env
   ```
3. Set `MONGODB_URI` to a real MongoDB connection string (MongoDB Atlas, or a local `mongod`).
   The server will still boot and log a clear error if the DB is unreachable — it will not
   crash the process — but any endpoint touching the database will fail until this is fixed.
4. (Optional but recommended for image uploads) Set `CLOUDINARY_CLOUD_NAME`,
   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` from your Cloudinary dashboard.
5. Set `CORS_ORIGINS` to a comma-separated list of the origins allowed to call this API
   (e.g. the landing site and dashboard URLs, local and production).

## Running

```
npm run dev     # nodemon, auto-restarts on change
npm start       # plain node, for production
```

The server listens on `PORT` (default `5000`). Health check: `GET /health`.

## Seeding the database

```
npm run seed
```

This is safe to re-run (idempotent-ish — it skips/upserts instead of duplicating):
- Creates the single Admin account from `ADMIN_USERNAME` / `ADMIN_PASSWORD` if none exists yet.
- Upserts the `Settings` singleton with realistic Arabic content (hero, phones, WhatsApp
  numbers, social links, stats, about).
- Seeds 3 sample branches (Cairo, جنزور, المنوفية).
- Seeds 8 sample trips spanning all 6 categories (hajj, umrah, flights, domestic,
  international, visa).
- Seeds 4 sample testimonials and 5 sample FAQs.

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/kabtin-brez` |
| `JWT_SECRET` | Secret used to sign admin JWTs | — (set a long random string) |
| `JWT_EXPIRES_IN` | JWT expiry | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | — |
| `CLOUDINARY_API_KEY` | Cloudinary API key | — |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | — |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000,http://localhost:5173` |
| `ADMIN_USERNAME` | Seeded admin username | `admin` |
| `ADMIN_PASSWORD` | Seeded admin password | `ChangeMe123!` |

## Auth

Single admin, no public registration. Log in to get a JWT, then send it as
`Authorization: Bearer <token>` on protected routes.

- `requireAuth` — 401s if the token is missing/invalid.
- `optionalAuth` — never rejects; sets `req.admin` if a valid token is present, otherwise
  `req.admin = null` and the request continues. Used on the public trip-listing endpoints so
  the dashboard (authenticated) can see unpublished trips while the landing site (anonymous)
  only ever sees published ones.

## Response envelope

Every response follows the same shape:
```json
{ "success": true, "data": { } }
{ "success": false, "error": "message" }
```

## API endpoints

### Auth
- `POST /api/auth/login` — public, rate-limited. Body: `{ username, password }` →
  `{ success:true, data:{ token } }`.

### Trips
- `GET /api/trips` — optionalAuth. Query: `?category=hajj|umrah|flights|domestic|international|visa`.
  Unauthenticated requests are always forced to `published:true`. Authenticated requests see
  everything unless `?published=true|false` is explicitly passed.
- `GET /api/trips/:slug` — optionalAuth. 404 if not found, or (when unauthenticated) not published.
- `POST /api/trips` — requireAuth.
- `PUT /api/trips/:id` — requireAuth.
- `DELETE /api/trips/:id` — requireAuth.

### Branches
- `GET /api/branches` — public.
- `POST /api/branches` — requireAuth.
- `PUT /api/branches/:id` — requireAuth.
- `DELETE /api/branches/:id` — requireAuth.

### Testimonials
- `GET /api/testimonials` — public.
- `POST /api/testimonials` — requireAuth.
- `PUT /api/testimonials/:id` — requireAuth.
- `DELETE /api/testimonials/:id` — requireAuth.

### FAQs
- `GET /api/faqs` — public, sorted by `order` ascending.
- `POST /api/faqs` — requireAuth.
- `PUT /api/faqs/:id` — requireAuth.
- `DELETE /api/faqs/:id` — requireAuth.
- `PATCH /api/faqs/reorder` — requireAuth. Body: `[{ id, order }, ...]`, bulk-updates order fields.

### Leads
- `POST /api/leads` — public, rate-limited.
- `GET /api/leads` — requireAuth.
- `PATCH /api/leads/:id` — requireAuth. Body: `{ status: "new"|"contacted"|"closed" }`.
- `DELETE /api/leads/:id` — requireAuth.

### Settings (singleton)
- `GET /api/settings` — public.
- `PUT /api/settings` — requireAuth. Full upsert of the singleton document.

### Upload
- `POST /api/upload` — requireAuth, `multipart/form-data`, field name `images`, up to 10 files,
  in-memory (no disk writes), each uploaded to Cloudinary. Images only, max 8MB per file. →
  `{ success:true, data:{ urls: string[] } }`.

### Misc
- `GET /health` — plain liveness check, no envelope: `{ success:true, data:{ status:"ok", uptime } }`.

## Security notes

- `helmet()` for standard security headers.
- `cors()` restricted to `CORS_ORIGINS`.
- `express-rate-limit` on `POST /api/auth/login` and `POST /api/leads` (20 requests / 15 min / IP).
- All request bodies validated with `zod` via the `validate(schema)` middleware factory — 400
  with field-level messages on failure.
- Centralized error handler normalizes Mongoose validation/cast/duplicate-key errors, malformed
  JSON, and multer errors into the standard `{ success:false, error }` envelope.
