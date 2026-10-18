# git.md — Commit Playbook

Living reference for committing this portfolio. Copy-paste ready `git add` + `git commit`
commands, grouped so every commit is one logical change that builds on its own.

> **Maintenance rule:** every time a feature, fix, or refactor lands, add its commit block to
> [§4 Change Log](#4-change-log) and move anything already committed out of
> [§3 Pending](#3-pending-remove-the-nextjs-history). Keep this file in sync with `git log`.

- Remote: `origin` → `https://github.com/yamneg96/yn.git`
- Default branch: `main`
- Layout: monorepo — `backend/` (Express + MongoDB), `web/` (React site), `admin/` (React CMS), `Design/`, `docs/`
- Last updated: **2026-10-18** (admin CMS, ImageKit uploads, removing the Next.js history)

---

## 1. Conventions

Format: **Conventional Commits** — `type(scope): imperative summary`

| Type       | Use for                                                   |
| ---------- | --------------------------------------------------------- |
| `feat`     | New user-visible capability                               |
| `fix`      | Bug fix                                                   |
| `refactor` | Code change with no behavior change                       |
| `perf`     | Performance improvement                                   |
| `style`    | Visual/CSS-only change (no logic)                         |
| `docs`     | Documentation only                                        |
| `chore`    | Tooling, deps, config, build                              |
| `test`     | Adding or fixing tests                                    |
| `ci`       | CI/CD pipeline changes                                    |

**Scopes used in this repo:** `backend`, `web`, `admin`, `repo`, `api`, `auth`, `db`, `cms`,
`upload`, `hero`, `theme`, `ui`, `state`, `query`, `seo`, `content`, `seed`, `config`, `deps`,
`design`, `a11y`, `motion`, `docker`, `ci`.

**Rules**

1. Subject ≤ 72 chars, imperative mood ("add", not "added"), no trailing period.
2. Body (second `-m`) explains **why**, not what — the diff already shows what.
3. One logical change per commit. If the subject needs "and", split it.
4. Never commit secrets. `backend/.env` is git-ignored; `*.env.example` files are safe.
5. Before committing: `npm test` (backend) and `npm run build` from the repo root must pass.

Multi-line messages work the same in PowerShell and Git Bash using repeated `-m` flags:

```bash
git commit -m "type(scope): subject" -m "Body paragraph explaining why."
```

---

## 2. Pre-commit Checklist

```bash
git status --short                 # nothing unexpected staged?
git diff --cached --stat           # review what is about to be committed
git diff --cached --name-only | grep -E "(^|/)(\.env|[^/]*\.env)$|node_modules" && echo "STOP: secret/ignored file staged"
git diff --cached | grep -iE "password|secret|private_|mongodb\+srv"   # sanity-scan for secrets
npm test && npm run build          # must pass
```

PowerShell equivalent of the secret scan:

```powershell
git diff --cached | Select-String -Pattern "password|secret|private_|mongodb\+srv" -CaseSensitive:$false
```

---

## 3. Pending: remove the Next.js history

`legacy-next/` is **already deleted** from your disk (it was git-ignored, so Git never tracked it).
What is left on GitHub is the old Next.js app inside the commit history (35 commits, 2025-12 to
2026-06), and in your working tree 107 tracked Next.js files that show as deleted.

A commit can't be removed from the middle of a history without rewriting it, so the clean fix is a
**fresh history**: one new root, then the current work committed in logical groups. This
**force-pushes `main` and destroys the old history on GitHub**. A local backup branch keeps it.

### 3.1 Check what GitHub has (read-only)

```bash
git ls-remote --heads --tags origin     # any other branch/tag that also holds the old history?
git log --oneline | wc -l               # 42 commits today (35 old + 7 recent)
```

If other branches or tags show up, delete them in step 3.4 too, or the old commits stay visible.

### 3.2 Back up the old history locally

```bash
git branch backup/with-nextjs-history   # stays on your machine only; never push it
```

### 3.3 Rebuild a clean history

The working tree already has the Next.js files removed, so an orphan branch starts clean.

```bash
git checkout --orphan clean-main
git rm -rf --cached . -q                # empty the index; files stay on disk

# 1 — repo tooling
git add package.json package-lock.json .gitignore docker-compose.yml
git commit -m "chore(repo): add monorepo scripts, docker-compose for MongoDB and ignore rules" -m "Root scripts run the API, the site and the admin app together (concurrently), seed, test and build all three. docker-compose provides a local MongoDB (and an optional API container) so development works without Atlas. .gitignore covers env files, build output and uploads."

# 2 — backend
git add backend
git status --short backend | grep -E "(^|/)(\.env|[^/]*\.env)$" && echo "STOP: env file staged"   # must print nothing
git commit -m "feat(backend): add Express + MongoDB API with JWT auth, CMS CRUD, messages inbox and ImageKit uploads" -m "Typed REST API for the portfolio: public read-only content endpoints and a JWT-protected /api/admin surface (CRUD, drag-to-reorder, settings, overview, upload). Auth uses an httpOnly cookie, bcrypt and a rate-limited login; the JWT is never returned in the response body. A generic resource factory gives every collection identical behaviour, and PUT clears omitted optional fields. The public contact form posts to a rate-limited, honeypot-filtered endpoint that feeds an admin inbox. Images and PDF resumes upload to ImageKit (folder yn-portfolio) with a local fallback. Includes a styled API overview page at /, a non-destructive seed script and 45 integration tests against an in-memory MongoDB."

# 3 — web site
git add web
git commit -m "feat(web): build the portfolio site from the approved index2 design on React, TanStack Query and Zustand" -m "Channel-feed hero with particle stage, ticker, bento about, filterable project grid, a case-file modal that expands from the card with a live mini-browser (device sizes, reload, enlarge, blocked/down fallbacks), stack orbit, timeline, testimonial marquees, approach phases and a contact form that posts to the CMS inbox. Server state is TanStack Query with skeleton, error, empty and 404 states; global UI state is Zustand. Dark and light themes, reduced-motion support and a render error boundary."

# 4 — admin CMS
git add admin
git commit -m "feat(admin): add the CMS app with messages inbox, project editor and settings" -m "React + Vite + shadcn app behind a cookie-session login with a show/hide password toggle. Dashboard counts and unread messages; Messages inbox (filter, auto-read, reply by email, archive, delete); Projects with a full case-file editor, reorder, publish toggle and delete; dialog CRUD for experience, approach, stack, testimonials and social links; site settings including a PDF resume upload. TanStack Query with optimistic reorder/delete, Zustand for theme and toasts, loading/empty/error states and light/dark themes."

# 5 — docs and design
git add README.md docs Design
git commit -m "docs: add README, architecture notes, git playbook and the design prototypes" -m "README covers setup, scripts, env, data flow, deployment and troubleshooting. ARCHITECTURE.md describes the stack, data model and auth. git.md is the commit playbook. Design/ holds the Stitch brief and the interactive HTML prototypes (index2.html is the one implemented)."

git status --short                      # must print nothing (everything committed)
git log --oneline                       # exactly 5 commits
```

### 3.4 Replace the remote history

```bash
git branch -M main                      # clean-main becomes main (the backup branch keeps the old one)
git push --force-with-lease origin main
# only if step 3.1 listed extra branches or tags holding the old history:
# git push origin --delete <branch-or-tag>
```

### 3.5 After the push

- GitHub keeps unreachable commits reachable **by their SHA URL** (and in forks or old PRs) until it
  garbage-collects. A direct link to an old commit may still open for a while. To purge sooner,
  contact GitHub Support and ask for garbage collection on `yamneg96/yn`.
- If Vercel (or another host) deploys from this repo, trigger a redeploy and set the root
  directory to `web/`.
- Anyone else with a clone must re-clone; their old `main` no longer matches.

> Want to keep the 7 recent commits as they are? That needs an interactive rebase that drops the
> 35 old ones, and it hits merge conflicts on every file the Next.js app also had. The fresh history
> above is faster and ends in the same files.

---

## 4. Change Log

Newest first. One block per landed change; copy the commit command you actually used.

### 2026-10-18

- **fix(admin,web): keep the login across reloads on Vercel.** The admin on `yn-admin.vercel.app`
  and the API on `yn-backend.vercel.app` are different *sites* (`vercel.app` is a public suffix), so
  the session cookie was third-party and browsers blocked it: login "worked", then `/auth/me` was 401
  on reload and every admin request failed. Each frontend now has a `vercel.json` that rewrites
  `/api/*` to the backend, so the browser only talks to its own domain and the cookie is first-party.
  **In both Vercel frontend projects, delete the `VITE_API_URL` variable (leave it empty) and redeploy.**
  ```bash
  git add admin web docs/git.md
  git commit -m "fix(admin): proxy /api through Vercel so the session cookie is first-party" -m "yn-admin.vercel.app and yn-backend.vercel.app are different sites, so the httpOnly session cookie was a third-party cookie that browsers blocked: login succeeded but the next request had no cookie and /auth/me returned 401. vercel.json now rewrites /api/* to the backend and adds the SPA fallback, so the browser only talks to its own origin. The web app gets the same config. VITE_API_URL must be left empty in production."
  git push origin main
  ```
- **fix(backend): allow the site and admin origins in CORS.** `localhost:5173`, `localhost:5174`,
  `https://yamlak-ecru.vercel.app` (web) and `https://yn-admin.vercel.app` (admin) are built in;
  `CLIENT_URL` only adds extras. Trailing slashes are ignored. The web and admin Vercel projects need
  `VITE_API_URL` set to the API origin.
  ```bash
  git add backend/src backend/tests backend/.env.example backend/README.md docs
  git commit -m "fix(backend): allow the web and admin origins in CORS" -m "Browsers on yamlak-ecru.vercel.app and yn-admin.vercel.app (and the local dev ports) were blocked by CORS when CLIENT_URL did not list them. The four origins are now built in, CLIENT_URL adds extras, trailing slashes are normalised, and a test covers allowed and rejected origins."
  git push origin main
  ```
- **fix(backend): Vercel build and runtime.** Two failures. (1) The build: Vercel compiles TypeScript
  from the entry file only, so the global `src/types/express.d.ts` was never loaded (`Property 'user'
  does not exist on type 'Request'`); the `Request.user` augmentation now lives in `middleware/auth.ts`.
  (2) The runtime: Vercel's Express preset imports `src/app` and needs the app as the **default
  export** (`Invalid export found in module .../src/app.js`); `app.ts` now default-exports the app and
  connects to MongoDB lazily on the first request (`ensureDb`) when `VERCEL` is set. Set the Vercel
  root directory to `backend` and add the env vars listed in `backend/README.md`.
  ```bash
  git add backend/src backend/tsconfig.json backend/README.md docs/git.md
  git commit -m "fix(backend): make the API deploy on Vercel" -m "Vercel compiles from the entry file only, so the global express.d.ts augmentation for req.user was never loaded and the build failed with TS2339; the augmentation now lives in the auth middleware. Vercel's Express runtime also requires the app as the default export of src/app, so app.ts exports it and connects to MongoDB lazily on the first request when running on Vercel. Documents the required environment variables."
  git push origin main
  ```

- **chore(repo): remove the Next.js app.** `legacy-next/` deleted from disk; the 107 tracked Next.js
  files are gone from the working tree; the GitHub history rewrite is §3.
- **feat(upload): ImageKit.** Uploads (covers, avatars, PDF resume) go to ImageKit folder
  `yn-portfolio` through its REST API, with a local `uploads/` fallback when credentials are absent.
  `@vercel/blob` removed. The test mocks `fetch`. Keys live only in `backend/.env`.
- **style(web): hero portrait.** The photo fills its rounded tile (`object-fit: cover`, face-biased)
  instead of overflowing.
- **feat(admin): CMS app.** Cookie login with show/hide password, dashboard, messages inbox,
  project editor, collection dialogs, settings. Verified end to end in a real browser, which found
  and fixed a blank-slug validation bug.
- **feat(web): site from `Design/index2.html`.** Live-browser case files and a contact form that
  posts to the inbox.
- **feat(backend): messages + overview page.** `POST /api/messages` (5 per hour, honeypot), the
  admin inbox endpoints, a styled API page at `/`, 45 tests.
- **chore(config): credentials.** `*.env` is git-ignored everywhere. Rotate the Atlas password and
  the ImageKit private key (both appeared in chat) and replace the placeholder `JWT_SECRET`.

> Template — copy for each new entry:
>
> ```
> ### YYYY-MM-DD
> - **type(scope):** subject — one line on why it mattered.
>   ```bash
>   git add <paths>
>   git commit -m "type(scope): subject" -m "Body."
>   ```
> ```

---

## 5. Recipes

### New feature (branch → commit → PR)

```bash
git switch -c feat/<short-name>
git add <paths>
git commit -m "feat(<scope>): <summary>" -m "<why>"
git push -u origin feat/<short-name>
gh pr create --title "feat(<scope>): <summary>" --body "## Summary
- <bullet>

## Test plan
- [ ] npm test passes
- [ ] npm run build passes
- [ ] Checked light and dark theme
- [ ] Checked mobile width"
```

### Fix a mistake in the last commit (not pushed yet)

```bash
git add <forgotten-file>
git commit --amend --no-edit
```

### Split one dirty file across two commits

```bash
git add -p web/src/App.tsx      # y/n per hunk
```

### Undo the last commit but keep the changes

```bash
git reset --soft HEAD~1
```

### Throw away uncommitted edits to one file (destructive — check `git status` first)

```bash
git restore <path>
```

### Release tag

```bash
git tag -a v2.0.0 -m "Portfolio v2: MERN monorepo, CMS, redesigned UI"
git push origin v2.0.0
```

---

## 6. Message Bank

Reusable subjects for recurring kinds of change:

| Situation                              | Message                                                       |
| -------------------------------------- | ------------------------------------------------------------- |
| New project added via code             | `feat(content): add <Project> to the seed data`               |
| Résumé update                          | `docs(content): update experience from latest resume`         |
| New API resource                       | `feat(api): add <resource> endpoints and validation`          |
| Model field added                      | `feat(db): add <field> to <Model>`                            |
| New React section                      | `feat(web): add <Section> section`                            |
| New admin page                         | `feat(admin): add <page> page`                                |
| New query hook                         | `feat(query): add use<Resource> hook`                         |
| Animation tweak                        | `style(motion): smooth <component> transition timing`         |
| Accessibility                          | `fix(a11y): add focus ring and aria-label to <control>`       |
| Light-mode contrast                    | `fix(theme): raise contrast for <element> in light mode`      |
| Dependency bump                        | `chore(deps): bump <pkg> to <version>`                        |
| Backend bug                            | `fix(api): <what was wrong> in <route>`                       |
| Test added                             | `test(api): cover <behaviour>`                                |
| Build break                            | `fix(config): resolve <error> during build`                   |
| Performance                            | `perf(web): lazy-load <heavy-thing> below the fold`           |
| Design brief change                    | `docs(design): update <prompt/token>`                         |
| Deployment config                      | `ci: add <workflow>` / `chore(docker): <change>`              |
