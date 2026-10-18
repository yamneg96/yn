# Backend — Express + MongoDB API

The **E** and **M** (and Node) of the MERN portfolio. A small, typed REST API that serves the
public site's content and powers the admin CMS.

- Express 4, TypeScript, Mongoose 9, Zod 4
- JWT auth (httpOnly cookie, or `Authorization: Bearer`), bcrypt password hashing
- Helmet, CORS (credentialed), rate-limited login, centralised JSON error handling
- Image uploads: Vercel Blob in production, local `uploads/` folder in development
- Integration tests on an in-memory MongoDB (never touches your real database)

## Quick start

```bash
cd backend
cp .env.example .env        # then fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run seed                # creates the admin user + fills EMPTY collections with résumé content
npm run dev                 # http://localhost:5000
```

Check it is alive: `curl http://localhost:5000/api/health` →
`{"status":"ok","database":"connected"}`.

### Scripts

| Script                  | What it does                                                          |
| ----------------------- | --------------------------------------------------------------------- |
| `npm run dev`           | Watch mode via `tsx`                                                  |
| `npm run build`         | Compile to `dist/`                                                    |
| `npm start`             | Run the compiled server                                               |
| `npm run seed`          | Upsert admin user; seed **only empty** collections (safe to re-run)   |
| `npm run seed -- --reset` | **Destructive:** wipe all content collections and reseed from scratch |
| `npm test`              | Integration tests (downloads a `mongod` binary on first run)          |
| `npm run typecheck`     | `tsc --noEmit`                                                        |

## Environment variables

| Variable                 | Required | Notes                                                                    |
| ------------------------ | :------: | ------------------------------------------------------------------------ |
| `MONGODB_URI`            |    yes   | Atlas or local. URL-encode special characters in the password.           |
| `JWT_SECRET`             |    yes   | ≥ 16 chars. `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `PORT`                   |    no    | Default `5000`                                                           |
| `CLIENT_URL`             |    no    | Extra allowed origin(s), comma-separated. `localhost:5173/5174`, `yamlak-ecru.vercel.app` (site) and `yn-admin.vercel.app` (admin) are always allowed |
| `PUBLIC_URL`             |    no    | Public base URL of this API (used for local upload links)                |
| `JWT_EXPIRES_IN`         |    no    | Default `7d`                                                             |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | seed only | Used by `npm run seed`; rotate after first run                  |
| `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` |    no    | If both are set, uploads (images and PDF résumés) go to ImageKit; otherwise to `./uploads` |
| `IMAGEKIT_PUBLIC_KEY`    |    no    | Kept for reference; server-side uploads only need the private key        |
| `IMAGEKIT_FOLDER`        |    no    | ImageKit folder for uploads (default `yn-portfolio`)                     |

The server validates env on boot and prints exactly which variable is wrong.

> **Atlas credentials file:** if you download a connection string from Atlas as a separate file
> (e.g. `atlas-credentials.env`), copy its `MONGODB_URI` into `backend/.env` — the app only reads
> `.env`. Add a database name to the URI (`.../portfolio?retryWrites=true&w=majority`), otherwise
> Mongo uses the default `test` database. Every `*.env` file is git-ignored; never commit one.

## API reference

Base URL: `/api`. All bodies are JSON. Errors look like
`{ "error": "message", "details": { "field": "reason" } }`.

### Public (no auth) — consumed by the website

| Method | Path                 | Returns                                                   |
| ------ | -------------------- | --------------------------------------------------------- |
| GET    | `/health`            | `{ status, uptime, database }`                            |
| GET    | `/settings`          | Hero copy + résumé URL (falls back to defaults if unset)  |
| GET    | `/projects`          | Published projects, ordered                               |
| GET    | `/experience`        | Published experience entries, ordered                     |
| GET    | `/approach`          | Approach steps, ordered                                   |
| GET    | `/client-logos`      | Platform/logo badges, ordered                             |
| GET    | `/testimonials`      | Testimonials, ordered                                     |
| GET    | `/social-links`      | Social links, ordered                                     |

### Auth

| Method | Path            | Body                   | Notes                                                      |
| ------ | --------------- | ---------------------- | ---------------------------------------------------------- |
| POST   | `/auth/login`   | `{ email, password }`  | Sets httpOnly cookie; also returns `token`. 10 tries / 15 min / IP |
| POST   | `/auth/logout`  | —                      | Clears the cookie                                          |
| GET    | `/auth/me`      | —                      | `401` when not signed in                                   |

### Admin (JWT required)

| Method | Path                         | Notes                                              |
| ------ | ---------------------------- | -------------------------------------------------- |
| GET    | `/admin/overview`            | Count + last-updated per section (dashboard)       |
| GET/PUT| `/admin/settings`            | Upsert hero copy / résumé URL                      |
| POST   | `/admin/upload`              | `multipart/form-data`, field `file`, ≤ 5 MB image → `{ url }` |

Collection resources — `projects`, `experience`, `approach`, `client-logos`, `testimonials`,
`social-links` — all expose the same routes under `/admin/<resource>`:

| Method | Path                      | Notes                                                              |
| ------ | ------------------------- | ------------------------------------------------------------------ |
| GET    | `/admin/<resource>`       | Everything, including unpublished                                  |
| POST   | `/admin/<resource>`       | Create → `201`                                                     |
| PUT    | `/admin/<resource>/:id`   | Full replace; omitted optional fields are **cleared**              |
| DELETE | `/admin/<resource>/:id`   | `204`                                                              |
| PUT    | `/admin/<resource>/reorder` | `{ ids: [...] }` — writes `order` = array index                   |

Every document is returned with `id` (string) instead of `_id`/`__v`.

### Resource shapes

```ts
Project     { title, description, imageUrl, liveUrl?, sourceUrl?, techStack: string[], order, published }
Experience  { title, description, iconUrl?, order, published }
Approach    { title, description, order }
ClientLogo  { name, logoUrl, logoTextUrl?, wordmarkWidth, order }
Testimonial { name, role?, quote, avatarUrl?, order }
SocialLink  { platform, url, iconUrl?, order }
Settings    { heroTagline, heroTitle, heroSubtitle, heroImageUrl?, resumeUrl? }
```

## Project layout

```
backend/
├── src/
│   ├── server.ts            # boot: listen, connect Mongo, graceful shutdown
│   ├── app.ts               # express app: helmet, cors, cookies, routes, errors
│   ├── config/              # env (zod-validated), db connection
│   ├── models/index.ts      # all Mongoose models
│   ├── validation/          # zod schemas (single source of input rules)
│   ├── middleware/          # auth (JWT), validate, upload (multer), error
│   ├── routes/              # index (wiring), resource (generic CRUD), auth, settings, upload
│   └── utils/http.ts        # ApiError, asyncHandler, serialize
├── scripts/seed.ts          # admin user + résumé content
├── tests/api.test.ts        # supertest + mongodb-memory-server
└── uploads/                 # local dev uploads (git-ignored)
```

Adding a new content type = one model, one zod schema, one `createResource(...)` call, two
`api.use(...)` lines in `routes/index.ts`.

## Deployment notes

- Host on Render / Railway / Fly / any Node host: `npm run build && npm start`.
- Set `NODE_ENV=production`, `CLIENT_URL` to the deployed site origin, and a strong `JWT_SECRET`.
- In production the cookie is `Secure; SameSite=None` so it works across the site/API origins —
  both must be served over HTTPS.
- **Vercel:** create a project with *Root Directory* `backend`. Vercel auto-detects Express and imports
  `src/app.ts`, whose default export is the app; it connects to MongoDB lazily on the first request
  when `VERCEL` is set. No `vercel.json` is needed. Add these environment variables
  in the project settings: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (comma-separated: the site and
  admin origins, no trailing slash), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `IMAGEKIT_PRIVATE_KEY`,
  `IMAGEKIT_URL_ENDPOINT`, `IMAGEKIT_FOLDER`. Vercel's disk is read-only, so uploads must use ImageKit.
  The login/message rate limits are per warm instance on serverless.
- Use a MongoDB Atlas IP allow-list that includes your host's outbound IPs (or `0.0.0.0/0` with a
  strong DB password).
- Run `npm run seed` once against production, then rotate/remove `ADMIN_PASSWORD`.

## Troubleshooting

| Symptom                                   | Cause / fix                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| `bad auth : authentication failed`        | Wrong DB username/password in `MONGODB_URI` — reset the user in Atlas → Database Access, URL-encode special characters |
| `Invalid environment configuration`       | A required variable is missing; the message names it                        |
| `ECONNREFUSED` / `ENOTFOUND` on Mongo     | Atlas Network Access doesn't allow your IP, or the cluster host is wrong    |
| Login works but `/auth/me` is `401` in the browser | Cookie blocked cross-origin: check `CLIENT_URL`, HTTPS in production, and `credentials: "include"` on the client |
