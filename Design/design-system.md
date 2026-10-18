# design-system.md — Aurora Cyber Design System

**Project:** Yamlak Negash — Full-Stack Software Engineer portfolio (redesign)
**Direction:** "Aurora Cyber" — premium, futuristic, cinematic tech portfolio
**Last updated:** 2026-10-18

Tokens and rules: colour, type, layout, motion, states, responsiveness, accessibility and the developer handoff. Page content, section specs and Stitch prompts live in [prompt.md](prompt.md).

---

## 1. Colour System — "Aurora Cyber"

All colours are design tokens. Ask Stitch to expose them as CSS variables / Tailwind theme extensions.

### 1.1 Dark theme (primary)

| Token                 | Hex / value                          | Use                                         |
| --------------------- | ------------------------------------ | ------------------------------------------- |
| `--bg-void`           | `#04060F`                            | Page background                             |
| `--bg-surface`        | `#0A0F1F`                            | Sections, cards                             |
| `--bg-elevated`       | `#101830`                            | Modals, hovered cards                       |
| `--border-glass`      | `rgba(120,160,255,0.14)`             | 1px panel borders                           |
| `--glass-fill`        | `rgba(16,24,48,0.55)` + blur 20px    | Glass panels, nav                           |
| `--text-primary`      | `#EAF2FF`                            | Headings, key text                          |
| `--text-secondary`    | `#9FB0D0`                            | Body copy                                   |
| `--text-muted`        | `#6B7A9C`                            | Captions, mono labels                       |
| `--accent-cyan`       | `#22D3EE`                            | Primary accent, links, focus ring           |
| `--accent-blue`       | `#3B82F6`                            | Secondary accent                            |
| `--accent-violet`     | `#8B5CF6`                            | Gradient mid-stop, highlights               |
| `--accent-magenta`    | `#D946EF`                            | Gradient end-stop, rare emphasis            |
| `--signal-mint`       | `#34D399`                            | Availability dot, success                   |
| `--signal-amber`      | `#FBBF24`                            | Warning                                     |
| `--signal-rose`       | `#FB7185`                            | Error                                       |

**Signature gradients**

- `--grad-aurora`: `linear-gradient(120deg, #22D3EE 0%, #6366F1 45%, #D946EF 100%)` — headline highlight, primary CTA border, progress bars.
- `--grad-halo`: radial `rgba(34,211,238,0.28)` → transparent — hero glow behind avatar/slide.
- `--grad-mesh`: 3–4 blurred radial blobs (cyan / violet / magenta / blue) drifting slowly behind sections.

### 1.2 Light theme (matching)

| Token              | Hex / value                | Notes                                           |
| ------------------ | -------------------------- | ----------------------------------------------- |
| `--bg-void`        | `#F6F8FF`                  | Cool off-white, never pure #FFF for the page    |
| `--bg-surface`     | `#FFFFFF`                  | Cards                                           |
| `--bg-elevated`    | `#EEF2FF`                  | Modals                                          |
| `--border-glass`   | `rgba(15,23,60,0.10)`      |                                                 |
| `--text-primary`   | `#0B1020`                  |                                                 |
| `--text-secondary` | `#44506E`                  |                                                 |
| `--text-muted`     | `#7280A0`                  |                                                 |
| `--accent-cyan`    | `#0891B2`                  | Darker to hold 4.5:1 on white                   |
| `--accent-blue`    | `#2563EB`                  |                                                 |
| `--accent-violet`  | `#7C3AED`                  |                                                 |
| `--accent-magenta` | `#C026D3`                  |                                                 |

Light theme keeps the same layout and motion; glows become soft tinted shadows, glass panels become frosted white (`rgba(255,255,255,0.7)` + blur), and the particle field drops to ~40% opacity. **Project showcase cards keep a dark inner surface in both themes** so their glow effects stay dramatic.

### 1.3 Per-project theme accents (drive the hero slideshow + modal)

Each featured project carries `--accent` (primary), `--accent-2` (secondary) and `--glow` (rgba, 35% alpha).

| Project                          | `--accent` | `--accent-2` | Mood                      |
| -------------------------------- | ---------- | ------------ | ------------------------- |
| DonorLink (blood logistics)      | `#F43F5E`  | `#FB7185`    | Urgent, life-critical     |
| TrustPay (payment verification)  | `#8B5CF6`  | `#A78BFA`    | Secure, fintech           |
| NYDL (enterprise LMS)            | `#0EA5E9`  | `#22D3EE`    | Clear, educational        |
| Lumora (AI tutor, multi-tenant)  | `#10B981`  | `#2DD4BF`    | Growth, intelligent       |
| Chereta (trust-first marketplace)| `#F59E0B`  | `#FBBF24`    | Warm, commerce            |
| Kana (wedding platform)          | `#EC4899`  | `#F9A8D4`    | Romantic                  |
| Nuru (youth life navigation)     | `#6366F1`  | `#A5B4FC`    | Calm, supportive          |
| Email-Helper (bilingual Gmail)   | `#38BDF8`  | `#7DD3FC`    | Light, friendly           |
| SJCS-Web (school administration) | `#3B82F6`  | `#60A5FA`    | Institutional             |
| BNS (hospital bed system)        | `#14B8A6`  | `#5EEAD4`    | Clinical, calm            |

---

## 2. Typography

| Role            | Font             | Weight   | Size (desktop → mobile)                | Notes                                  |
| --------------- | ---------------- | -------- | -------------------------------------- | -------------------------------------- |
| Hero H1         | Space Grotesk    | 700      | `clamp(2.5rem, 6vw, 5.5rem)`           | tracking −0.03em, leading 1.02         |
| Section H2      | Space Grotesk    | 600      | `clamp(2rem, 4vw, 3.5rem)`             | tracking −0.02em                       |
| Card title (H3) | Space Grotesk    | 600      | 1.5rem → 1.25rem                       |                                        |
| Body            | Inter            | 400/500  | 1.0625rem → 1rem, leading 1.7          | colour `--text-secondary`              |
| Mono label      | JetBrains Mono   | 500      | 0.75rem, uppercase, tracking 0.18em    | e.g. `// 02 — PROJECTS`                |
| Stat number     | JetBrains Mono   | 600      | 2.5rem → 1.75rem                       | tabular numerals                       |
| Button          | Inter            | 600      | 0.9375rem                              | tracking 0.01em                        |

Alternatives to request if Stitch's rendering looks off: **Sora** or **Geist** for display, **Geist Mono** for code labels.

**Headline highlight:** wrap 2–3 key words ("ships, scales, and gets used") in `--grad-aurora` via `background-clip: text`.

---

## 3. Layout, Spacing & Shape

- 12-column grid, 24px gutters (16px mobile), max width **1240px**, section padding `clamp(80px, 12vh, 160px)` vertical.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 (8px base).
- Radii: buttons 12px, cards 20px, modal 28px, pills 999px.
- Elevation (dark): no heavy drop shadows; use `0 0 0 1px --border-glass` + coloured glow `0 20px 80px -20px var(--glow)`.
- Background layers (back → front): void colour → drifting mesh blobs → engineering grid (1px lines, 3–4% opacity, radial mask fading at edges) → particle field → content.
- Section dividers: a hairline gradient line (`transparent → --accent-cyan 40% → transparent`) with a small mono index label.

---

## 4. Motion & Animation

### 4.1 Motion tokens

| Token              | Value                                  | Use                                      |
| ------------------ | -------------------------------------- | ---------------------------------------- |
| `--ease-out-expo`  | `cubic-bezier(0.16, 1, 0.3, 1)`        | Reveals, entrances                       |
| `--ease-in-out`    | `cubic-bezier(0.65, 0, 0.35, 1)`       | Cross-fades, theme switch                |
| `--ease-spring`    | spring {stiffness 260, damping 30}     | Modal, shared elements                   |
| `--dur-micro`      | 150ms                                  | Hover colour, press                      |
| `--dur-base`       | 350ms                                  | Hover lifts, chips                       |
| `--dur-reveal`     | 700ms                                  | Scroll reveals                           |
| `--dur-scene`      | 1200ms                                 | Hero slide re-theme                      |
| `--stagger`        | 60–90ms                                | Lists, words, cards                      |

### 4.2 Pointer & micro-interactions

- **Cursor spotlight:** a 600px radial gradient (`--glow`) follows the cursor across the page background at 12% opacity (desktop only), lerped for smoothness.
- **Magnetic buttons:** primary CTAs shift up to 8px toward the cursor within a 80px radius and spring back on leave.
- **Primary button:** animated conic-gradient border (aurora, 3s linear infinite spin), inner fill `--bg-surface`; hover brightens the border and shifts the arrow 4px right; press scales 0.97.
- **Cards:** 3D tilt (±6°) tracking the pointer with a moving specular highlight; border brightens to `--accent`.
- **Links:** underline draws left → right (300ms); external links show a small ↗ that nudges on hover.
- **Icon buttons:** subtle lift (−2px) + glow.
- **Focus rings:** 2px `--accent-cyan` outline with 3px offset, never removed.
- **Copy-email:** button morphs to a check, confetti of 24 small accent-coloured squares, label returns after 3s.
- **Custom cursor (optional, desktop):** 8px dot + 32px ring that grows over interactive elements.

### 4.3 Theme switch (dark ↔ light)

Circular **view-transition reveal** expanding from the toggle button (≈700ms, ease-in-out); the sun/moon icon rotates and morphs. Colour tokens swap atomically; no flash. Persist choice, default to system preference.

### 4.4 Loading, empty, error, 404 states

- **Skeletons:** glass blocks with a diagonal shimmer sweep (1.6s linear infinite); match the final layout (cards, stat tiles, text lines).
- **Empty state:** centred icon in an accent circle, title, helpful message, optional action.
- **Error state:** rose-tinted panel, alert icon, message, **Try again** button with a rotating refresh icon while retrying.
- **404:** huge gradient "404" with glitch-scanline reveal, the line *"This page hasn't shipped yet."*, a **Back to home** primary button, floating particles in the background.
- **Toasts:** top-right glass cards sliding in from −12px, icon + message + dismiss, auto-dismiss 4s.

### 4.5 Performance & accessibility rules for all motion

- Animate **only `transform` and `opacity`** (plus filter on the modal backdrop). No layout-thrashing properties.
- Target 60fps; particle/canvas work pauses when off-screen or tab hidden.
- Honour `prefers-reduced-motion`: no autoplay, no parallax, no scramble, no tilt; keep opacity fades ≤ 200ms.
- Never trap scroll; never auto-play audio; every animated element has a static fallback.

---

## 5. Responsive & Accessibility Requirements

- **Breakpoints:** 640 (sm), 1024 (lg), 1280 (xl). Design 390px mobile and 1440px desktop frames.
- **Mobile adaptations:** nav → monogram + menu sheet; hero stacks (avatar → headline → CTAs → stats in a 2×2 grid); slideshow controls move under the "Now showing" card; project grid single column; modal becomes a full-screen sheet with a drag handle; orbit stack becomes a marquee; timeline spine moves to the left edge.
- **Touch targets** ≥ 44×44px. **Contrast** ≥ 4.5:1 body, 3:1 large text/UI, verified in **both** themes.
- Semantic landmarks (`header`, `nav`, `main`, `section[aria-labelledby]`, `footer`), skip-to-content link, descriptive alt text, ARIA for the slideshow (`role="region" aria-roledescription="carousel"`, live region announcing slide changes only when paused/manual).
- Don't convey meaning by colour alone (status badges include text).

---

## 6. Developer Handoff (for after Stitch)

Current stack the design must port into: **Next.js 14 (App Router) · Tailwind CSS · Framer Motion · Lenis · next-themes · TanStack Query · Zustand · MongoDB-backed CMS with ISR**.

| Design element                  | Implementation plan                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Tokens                          | CSS variables in `globals.css` (`:root` / `.dark`) mapped in `tailwind.config.ts`; per-slide `--accent` set on the hero wrapper via inline style |
| Hero slideshow                  | Client component; slide state in a **Zustand** store (`activeSlide`, `paused`) so the nav glow and page accent can read it; Framer Motion `AnimatePresence` for scene cross-fade; featured projects come from the CMS (`featured` flag + `accent`/`accent2` fields to add to the Project model) |
| Project modal                   | Framer Motion `layoutId` shared-element expansion, `Dialog` semantics with focus trap, URL hash deep link; modal content fields (overview, challenge, solution, features, metrics, gallery) added to the Project model and admin form |
| Particle field                  | Lightweight `<canvas>` (≤ 120 particles) or CSS; `IntersectionObserver` + `visibilitychange` to pause                       |
| Scroll reveals                  | Existing `components/motion/Reveal.tsx` + shared variants                                                     |
| Theme switch reveal             | `document.startViewTransition` with CSS `clip-path` circle, fallback to instant swap                          |
| Loading / error / empty / 404   | Existing `components/states/*` restyled with the new tokens                                                   |
| Fonts                           | `next/font` — Space Grotesk, Inter, JetBrains Mono                                                            |

**CMS fields to add when implementing** (so the redesign stays editable from `/admin`): `featured` (bool), `accent`, `accent2`, `tagline`, `role`, `platform`, `status`, `overview`, `challenge`, `solution`, `features[]`, `metrics[]`, `gallery[]`, `links{live,repo,admin,mobile}`.
