# ARCHITECTURE.md — MERN Portfolio

Technical design for the portfolio and its CMS. Read [`CLAUDE.md`](CLAUDE.md) for working
conventions and [`backend/README.md`](../backend/README.md) for the API reference.

> History: this project started as a hardcoded Next.js template, then became a Next.js app with an
> in-process CMS. It was re-platformed to a **MERN monorepo** (separate React SPA + Express API)
> so the frontend can be rebuilt from external designs without touching data/auth code.

---

## 1. System overview

```
┌──────────────────────────┐        ┌────────────────────────────┐        ┌───────────┐
│ web/  React 19 + Vite 8  │  HTTP  │ backend/  Express 4 (TS)   │  BSON  │  MongoDB  │
│ Tailwind 4 · shadcn/ui   │ ─────► │ routes → middleware →      │ ─────► │  (Atlas)  │
│ TanStack Query           │  JSON  │ Mongoose models            │        └───────────┘
└──────────────────────────┘ ◄───── └────────────────────────────┘
        │ dev: Vite proxy                    │ prod: Vercel Blob (images)
        └─ /api, /uploads → :5000            └─ dev: ./uploads on disk
```

| Concern            | Choice                                   | Why                                                                   |
| ------------------ | ---------------------------------------- | --------------------------------------------------------------------- |
| Frontend           | React 19, Vite 8                         | Fast DX; the UI is regenerated from Stitch designs                    |
| UI kit             | shadcn/ui (`base-nova` preset, Base UI)  | Owned components, Tailwind 4 tokens                                   |
| Server state       | TanStack Query v5                        | Caching, retries, optimistic updates, status-driven skeleton/error UI |
| API                | Express 4 + TypeScript                   | Small, explicit, easy to test                                         |
| Database           | MongoDB + Mongoose 9                     | Flexible content documents; `order`/`published` fields                |
| Validation         | Zod 4 (server is the source of truth)    | One schema per resource, field-level 400 errors                       |
| Auth               | JWT in an httpOnly cookie + bcrypt       | Single admin; token never readable by page JS                         |
| Uploads            | multer → Vercel Blob (or local disk)     | Same endpoint in dev and prod                                         |
| Tests              | Vitest + Supertest + mongodb-memory-server | Real HTTP + real Mongo semantics, never touches real data             |

## 2. Repository layout

```
backend/src
  server.ts         boot, graceful shutdown
  app.ts            helmet · cors(credentials) · morgan · json · cookies · routes · errors
  config/           env.ts (zod-validated), db.ts
  models/index.ts   AdminUser, SiteSettings, Project, ExperienceItem, ApproachStep,
                    ClientLogo, Testimonial, SocialLink
  validation/       schemas.ts
  middleware/       auth (JWT), validate, upload (multer), error
  routes/           index (wiring) · resource (generic CRUD factory) · auth · settings · upload
backend/scripts/seed.ts     admin user + résumé content (idempotent)
backend/tests/              API integration tests

web/src
  main.tsx          QueryClientProvider + ThemeProvider
  lib/              api.ts (fetch wrapper, ApiError) · types.ts · query-client.ts · utils.ts
  hooks/            use-content.ts (public queries) · use-admin.ts (session, CRUD, reorder, upload)
  components/ui/    shadcn components
```

## 3. Data model

Every document gets `createdAt/updatedAt`. The API serialises `_id` → `id` and drops `__v`.

| Collection        | Fields                                                                                  | Public list filter |
| ----------------- | --------------------------------------------------------------------------------------- | ------------------ |
| `AdminUser`       | `email` (unique, lowercase), `passwordHash`                                             | —                  |
| `SiteSettings`    | `heroTagline`, `heroTitle`, `heroSubtitle`, `heroImageUrl?`, `resumeUrl?` (single doc)  | —                  |
| `Project`         | `title`, `description`, `imageUrl`, `liveUrl?`, `sourceUrl?`, `techStack[]`, `order`, `published` | `published: true` |
| `ExperienceItem`  | `title`, `description`, `iconUrl?`, `order`, `published`                                | `published: true`  |
| `ApproachStep`    | `title`, `description`, `order`                                                         | —                  |
| `ClientLogo`      | `name`, `logoUrl`, `logoTextUrl?`, `wordmarkWidth`, `order`                             | —                  |
| `Testimonial`     | `name`, `role?`, `quote`, `avatarUrl?`, `order`                                         | —                  |
| `SocialLink`      | `platform`, `url`, `iconUrl?`, `order`                                                  | —                  |

Lists are sorted by `order`, then `createdAt`. `techStack` holds icon paths served from the web
app's `public/` folder (e.g. `/re.svg`).

## 4. API design

- REST under `/api`. Public content is **read-only and unauthenticated**; everything under
  `/api/admin/*` requires a valid session.
- Six collections share one implementation (`routes/resource.ts`): the factory returns a public
  router (GET) and an admin router (GET all, POST, PUT `/:id`, DELETE `/:id`, PUT `/reorder`).
- **PUT is a full replace.** Optional fields omitted by the client are `$unset`, so clearing a form
  field really clears it (Mongoose would otherwise keep the old value).
- Errors are always JSON: `{ error, details? }`. Validation failures are `400` with
  `details: { field: message }` the UI can map onto inputs.
- `GET /api/health` reports process uptime and DB connection state.

Full table: [`backend/README.md`](../backend/README.md#api-reference).

## 5. Authentication & security

1. `POST /auth/login` validates the body, loads the admin by email, `bcrypt.compare`s the password.
   Unknown email and wrong password return the **same** 401 (no account enumeration).
2. On success a JWT (`sub`, `email`, 7-day expiry) is set as `portfolio_token`:
   `HttpOnly`, `Secure` + `SameSite=None` in production (`Lax` in dev). It is **not** in the JSON
   body, so page JavaScript can never read it.
3. `requireAuth` accepts the cookie or an `Authorization: Bearer` header (for scripts/tools).
4. Login is rate-limited (10 attempts / 15 min / IP). Helmet sets security headers; CORS allows
   only the built-in site/admin origins plus any extra `CLIENT_URL` origins, with credentials.
5. Uploads: image MIME allow-list, 5 MB cap, filenames sanitised, memory storage (no temp files).
6. Secrets live only in `backend/.env` (git-ignored); `env.ts` fails fast with a precise message.

## 6. Frontend data flow (TanStack Query)

- **Public site:** `useProjects()`, `useSettings()`, … (one `queryOptions` factory per resource, so
  keys are defined once and can be prefetched). `staleTime` 60 s, `gcTime` 10 min, no retry on 4xx.
  Components render from `status`: `isPending` → skeleton, `isError` → error state with retry,
  empty array → empty state, else data.
- **Admin:** `useSession()` resolves to the user or `null` (a 401 is *not* an error). Mutations
  (`useCreateItem`, `useUpdateItem`, `useDeleteItem`, `useReorderItems`, `useUpdateSettings`,
  `useUploadImage`) invalidate both `["admin", …]` and `["content", …]` keys so the public cache
  never serves stale data after an edit. Delete and reorder are **optimistic with rollback**.
- **Global UI state:** Zustand (toasts, UI flags). No Context API for app state, no Redux.

## 7. Rendering strategy

The site is a client-rendered SPA served as static files, with API-backed content cached by
TanStack Query. Consequences and mitigations:

| Topic            | Reality                                  | Mitigation                                                          |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| SEO / link cards | No server-rendered HTML for content      | Static `<head>` metadata + Open Graph in `index.html`; optional prerender step later |
| First paint      | Needs JS + one API round-trip            | Skeletons, `<link rel=preload>` for fonts, cache-friendly API       |
| Freshness        | Content edits appear after cache expiry  | Admin writes invalidate the cache; public staleTime is only 60 s     |

(The earlier Next.js version used ISR with on-demand revalidation. If SEO becomes critical, the
React app can be prerendered at build time or moved to a framework with SSR without changing the API.)

## 8. Testing

`npm test` (backend): spins up an in-memory MongoDB, boots the real Express app and drives it with
Supertest — auth guard, validation, CRUD for every resource, `published` filtering, field clearing,
reorder, settings fallback, upload, logout. `NODE_ENV=test` makes `env.ts` skip `backend/.env`, so
tests can never reach a real database or Blob store.

## 9. Environments & deployment

| Variable (backend)           | Dev                          | Prod                                   |
| ---------------------------- | ---------------------------- | -------------------------------------- |
| `NODE_ENV`                   | development                  | production                             |
| `CLIENT_URL`                 | `http://localhost:5173`      | deployed site origin(s)                |
| `MONGODB_URI`                | local Docker or Atlas        | Atlas                                  |
| `JWT_SECRET`                 | any ≥ 16 chars               | long random value                      |
| `IMAGEKIT_PRIVATE_KEY` / `IMAGEKIT_URL_ENDPOINT` / `IMAGEKIT_FOLDER` | empty (local `uploads/`) | ImageKit uploads into `yn-portfolio` |

`web`: `VITE_API_URL` is set only in production. Deploy `web/dist` to any static host with an SPA
fallback; deploy `backend` anywhere that runs Node (or use `backend/Dockerfile`).

## 10. Roadmap

1. ✅ Backend: API, auth, CRUD, upload, seed, tests, Docker.
2. ✅ Web scaffold + TanStack Query data layer + integration page.
3. ⏭ Implement the Stitch designs (`Design/`): public site, project case-study modal, hero
   slideshow, light/dark theme, states.
4. ⏭ Admin UI (login, dashboard, drag-to-reorder lists, forms with image upload).
5. ⏭ Extend the `Project` model for case-study content (overview, challenge, solution, features,
   metrics, gallery) and the hero slideshow (`featured`, `accent`, `accent2`).
6. ⏭ CI (typecheck, tests, build) and deployment.
