# Yamlak Negash — Portfolio (MERN)

A full-stack developer portfolio with a built-in CMS.

| Part         | Stack                                                                                  | Folder      |
| ------------ | -------------------------------------------------------------------------------------- | ----------- |
| **M**ongoDB  | Atlas or local, Mongoose 9 models                                                      | `backend/`  |
| **E**xpress  | Express 4 + TypeScript REST API, JWT auth (httpOnly cookie), Zod validation            | `backend/`  |
| **R**eact    | React 19 + Vite 8, Tailwind CSS 4, shadcn/ui (`base-nova` preset), TanStack Query      | `web/`      |
| **N**ode     | Node 22+                                                                               | both        |

```
yn/
├── backend/        Express + MongoDB API  (see backend/README.md — full API reference)
├── web/            Public portfolio site (React + Vite, port 5173)
├── admin/          CMS app: content, projects, messages inbox (React + Vite, port 5174)
├── Design/         Stitch AI design brief (prompt.md, design-system.md)
├── docs/           git.md (commit playbook), ARCHITECTURE.md, CLAUDE.md
├── docker-compose.yml   Local MongoDB (and optional API container)
```

> **Status:** all three apps are built. `web/` implements `Design/index2.html`; `admin/` is the CMS
> (sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `backend/.env` after `npm run seed`).
> Requests sent from the portfolio contact form land in the admin **Messages** inbox. The API
> serves an overview page at its root (`http://localhost:5000/`).

## Prerequisites

- Node.js 22+
- A MongoDB: **MongoDB Atlas** (free tier) *or* Docker for a local one (`npm run db:up`)

## First-time setup

```bash
# 1. install everything (root tooling + backend + web)
npm install
npm run install:all

# 2. configure the API
cp backend/.env.example backend/.env
#    edit backend/.env → MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD

# 3. (optional) local MongoDB instead of Atlas
npm run db:up                       # then MONGODB_URI=mongodb://localhost:27017/portfolio

# 4. create the admin user and load the résumé content
npm run seed
```

## Run

```bash
npm run dev          # API on :5000 and web on :5173, side by side
# or separately
npm run dev:api
npm run dev:web
```

Open http://localhost:5173. In development Vite proxies `/api` and `/uploads` to the API, so
cookies are same-origin and no CORS setup is needed.

## Scripts (run from the repo root)

| Script               | What it does                                              |
| -------------------- | --------------------------------------------------------- |
| `npm run dev`        | API + web together (via `concurrently`)                   |
| `npm run dev:api`    | Backend only (`tsx watch`)                                |
| `npm run dev:web`    | Web only (Vite)                                           |
| `npm run build`      | Build backend (`dist/`) and web (`web/dist/`)             |
| `npm run seed`       | Upsert admin user; fill **empty** collections (non-destructive) |
| `npm test`           | Backend integration tests (in-memory MongoDB)             |
| `npm run db:up`      | `docker compose up -d mongo`                              |

Destructive reseed (wipes CMS content): `npm --prefix backend run seed -- --reset`.

## Environment

| File                   | Purpose                                              | Commit? |
| ---------------------- | ---------------------------------------------------- | :-----: |
| `backend/.env`         | DB URI, JWT secret, admin seed credentials, Blob token | **never** |
| `backend/.env.example` | Documented template                                  |   yes   |
| `web/.env.example`     | `VITE_API_URL` (prod only), dev proxy target         |   yes   |

## How the pieces talk

```
Browser (React + TanStack Query)
   │  fetch /api/*  (credentials: include)
   ▼
Vite dev proxy ──► Express API ──► MongoDB
                     ├─ public GETs   (site content, no auth)
                     └─ /api/admin/*  (JWT cookie required: CRUD, reorder, upload)
```

- Public content is fetched with TanStack Query hooks in `web/src/hooks/use-content.ts`
  (1-minute `staleTime`, no retries on 4xx).
- The admin UI uses `web/src/hooks/use-admin.ts`: session, login/logout, CRUD, optimistic
  reorder with rollback, image upload. Every write invalidates both the admin list and the
  public cache.
- Auth is a 7-day JWT in an httpOnly cookie (never exposed to JavaScript). In production the
  cookie is `Secure; SameSite=None` so the site and API can live on different origins.

## Deployment

| Piece   | Where                       | Notes                                                                    |
| ------- | --------------------------- | ------------------------------------------------------------------------ |
| `web/`  | Vercel / Netlify / Cloudflare Pages | Build `npm run build`, output `dist/`. Set `VITE_API_URL`. SPA fallback to `index.html`. |
| `backend/` | Render / Railway / Fly / Docker | `npm run build && npm start` (or the `backend/Dockerfile`). Set `CLIENT_URL` to the site origin. |
| Database | MongoDB Atlas              | Allow your API host's IPs in Network Access.                             |

See `backend/README.md` for the full environment table and troubleshooting.

## Troubleshooting

| Problem                                       | Fix                                                                                      |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `bad auth : authentication failed`            | Wrong Mongo user/password. Atlas → Database Access → reset password, URL-encode special characters in `MONGODB_URI`. |
| Web shows "Can't reach the server"            | API isn't running (`npm run dev:api`) or `VITE_DEV_API_TARGET` points to the wrong port. |
| `Invalid environment configuration` on boot   | The message names the missing/invalid variable in `backend/.env`.                        |
| Login works but admin calls return 401        | Production cross-origin cookies need HTTPS on both sides and `CLIENT_URL` set exactly.   |
| Port 5000/5173 already in use                 | Stop the other process, or change `PORT` (API) / pass `--port` (Vite).                   |

## Documentation map

- [`backend/README.md`](backend/README.md) — API reference, env, deployment, troubleshooting
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — design decisions and data flow
- [`docs/git.md`](docs/git.md) — commit playbook (kept up to date with every change)
- [`Design/prompt.md`](Design/prompt.md), [`Design/design-system.md`](Design/design-system.md) — Stitch AI redesign brief
