# CLAUDE.md — Working Conventions

Context for Claude Code (and humans) working in this repository. Technical design lives in
[`ARCHITECTURE.md`](ARCHITECTURE.md); the API reference in [`backend/README.md`](../backend/README.md).

## What this is

A MERN portfolio for Yamlak Negash with a built-in CMS:

- `backend/` — Express + TypeScript + Mongoose API (complete, tested).
- `web/` — React 19 + Vite 8 + TanStack Query + Zustand. Implements `Design/index2.html`; its
  CSS is ported to `src/styles/site.css` (do not add shadcn `index.css` back; token names clash).
- `admin/` — React + Vite + Tailwind 4 + shadcn (base-nova) CMS on port 5174: dashboard, messages
  inbox, projects editor, collections, settings. Generic list pages are config-driven
  (`components/admin/CollectionPage.tsx`).

## Conventions

- **TypeScript everywhere.** `web/` uses `verbatimModuleSyntax` + `erasableSyntaxOnly`: use
  `import type`, and no parameter properties / enums (write explicit class fields).
- **Server state = TanStack Query.** Anything fetched from the API goes through a hook in
  `web/src/hooks`. Add a `queryOptions` factory + hook per resource; never `fetch` inside components.
  Components render from query `status`: pending → skeleton, error → error state with retry,
  empty → empty state.
- **Global client state = Zustand.** Not Context API, not Redux.
- **Styling:** Tailwind 4 utility classes and the shadcn tokens in `web/src/index.css`. Add shadcn
  components with `npx shadcn@latest add <name>` from `web/`.
- **Validation lives on the server** (`backend/src/validation/schemas.ts`). Mirror shapes in
  `web/src/lib/types.ts` when a schema changes.
- **New content type:** model + zod schema + one `createResource(...)` call + two `api.use(...)`
  lines in `backend/src/routes/index.ts`, then a type in `web/src/lib/types.ts` and a hook.
- **Errors:** API returns `{ error, details? }`. Throw `ApiError` in the backend; the web `api()`
  wrapper turns it into a typed `ApiError` with `fieldErrors`.
- **No secrets in code.** Only `backend/.env` (git-ignored); document every variable in
  `backend/.env.example` the moment it is introduced.
- **Animation:** Framer Motion (`motion`) for UI animation; respect `prefers-reduced-motion`.

## Workflow

1. Make the change.
2. Backend: `npm run typecheck` and `npm test` (from `backend/`). Web: `npm run build` (from `web/`).
3. Update docs that the change affects — in particular **`docs/git.md`** (add the commit block to
   the Change Log / Pending Commits) and `backend/README.md` if the API changed.
4. Commit with Conventional Commits (see `docs/git.md`).

## Commands (repo root)

| Command                | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | API (:5000) + web (:5173)                      |
| `npm run seed`         | Admin user + fill empty collections            |
| `npm test`             | Backend integration tests                      |
| `npm run build`        | Build both                                     |

## Where things are

| Need                         | Look in                                   |
| ---------------------------- | ----------------------------------------- |
| An endpoint                  | `backend/src/routes/`                     |
| Input rules                  | `backend/src/validation/schemas.ts`       |
| DB shapes                    | `backend/src/models/index.ts`             |
| Seed content (résumé data)   | `backend/scripts/seed.ts`                 |
| API client / error handling  | `web/src/lib/api.ts`                      |
| Query hooks                  | `web/src/hooks/`                          |
| Design brief for Stitch      | `Design/prompt.md`, `Design/design-system.md` |
| Commit commands              | `docs/git.md`                             |

## Constraints

- Don't commit `.env` files.
- Don't run `npm run seed -- --reset` against production — it wipes CMS content.
- Keep the API contract stable; the site and admin apps depend on it.
- When in doubt, prefer the smallest change that unblocks the current task.
