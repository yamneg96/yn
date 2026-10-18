# prompt.md — Copy-Paste Stitch Prompts (one per page / section)

**Project:** Yamlak Negash — Full-Stack Software Engineer portfolio (redesign)
**Direction:** "Aurora Cyber" — premium, futuristic, cinematic tech portfolio
**Last updated:** 2026-10-18

Every prompt below is inside a code block: click the copy button, paste into Stitch, done. Each one is **self-contained** (Stitch cannot see the repo and forgets nothing it isn't told), so it repeats the few tokens it needs. Full token tables live in [design-system.md](design-system.md).

## How to run it

1. Paste **P0 — Design System Primer** first, in a new Stitch project. It sets palette, type, spacing and motion for everything after.
2. Generate **one prompt per message**, in order: P1 → P9 (sections), then P10 (modal), P11–P13 (variants/states).
3. Not happy with a result? Paste a line from **R — Refinement Prompts**. One change per message.
4. For a single full-page frame, use **P14 — Full Home Assembly** after the sections look right.
5. Export HTML/Tailwind or Figma and port with [design-system.md](design-system.md) §6.

| #   | Prompt                          | Produces                                   |
| --- | ------------------------------- | ------------------------------------------ |
| P0  | Design System Primer            | Style guide / tokens                       |
| P1  | Navigation                      | Floating glass nav + mobile menu sheet     |
| P2  | Hero                            | Slideshow hero (slide 1)                   |
| P2b | Hero — five slide states        | Re-themed hero ×5                          |
| P3  | About                           | Bento grid                                 |
| P4  | Featured Projects               | Filter chips + project cards               |
| P5  | Tech Stack                      | Orbit icon field                           |
| P6  | Experience                      | Scroll-drawn timeline                      |
| P7  | Testimonials                    | Dual marquee                               |
| P8  | My Approach                     | 4 phase cards                              |
| P9  | Contact / Footer                | CTA + socials + footer                     |
| P10 | Project Case-Study Modal        | Shared-element full-screen modal           |
| P11 | Light Theme                     | Home + modal in light                      |
| P12 | Mobile (390px)                  | Stacked layouts                            |
| P13 | States                          | Skeleton, empty, error, toasts, 404        |
| P14 | Full Home Assembly              | Whole page, one frame                      |
| P15 | Admin CMS (optional)            | Dashboard                                  |

---

## P0 — Design System Primer (paste first, once)

```text
Create a design system and style guide for a premium, futuristic developer portfolio called "Aurora Cyber" for Yamlak Negash, a Full-Stack Software Engineer from Addis Ababa, Ethiopia. The site must feel like a high-end developer-tool product launch page, not a template. No stock-photo clichés, no clip-art, no emoji.

COLOUR — DARK (primary)
- Page background #04060F; surface #0A0F1F; elevated (modals, hovered cards) #101830
- Glass panels: fill rgba(16,24,48,0.55) with 20px backdrop blur, 1px border rgba(120,160,255,0.14)
- Text: primary #EAF2FF, secondary #9FB0D0, muted #6B7A9C
- Accents: cyan #22D3EE (primary, links, focus ring), blue #3B82F6, violet #8B5CF6, magenta #D946EF
- Signals: mint #34D399 (available/success), amber #FBBF24 (warning), rose #FB7185 (error)
- Signature gradient "aurora": linear-gradient(120deg, #22D3EE 0%, #6366F1 45%, #D946EF 100%) for headline highlights, primary CTA border, progress bars
- Background layers, back to front: void colour → slowly drifting blurred mesh blobs (cyan/violet/magenta/blue) → faint engineering grid (1px lines, 3–4% opacity, radial mask fading at edges) → particle field → content

COLOUR — LIGHT (matching)
- Page #F6F8FF (never pure white), surface #FFFFFF, elevated #EEF2FF, border rgba(15,23,60,0.10)
- Text: #0B1020 / #44506E / #7280A0
- Accents darkened for 4.5:1 contrast: cyan #0891B2, blue #2563EB, violet #7C3AED, magenta #C026D3
- Glows become soft tinted shadows; glass becomes frosted white rgba(255,255,255,0.7) + blur

TYPOGRAPHY
- Space Grotesk for display and headings (tight tracking: -0.03em hero, -0.02em H2). Hero H1 clamp(2.5rem, 6vw, 5.5rem), weight 700, leading 1.02. Section H2 clamp(2rem, 4vw, 3.5rem), weight 600. Card title 1.5rem, weight 600.
- Inter for body (1.0625rem, leading 1.7, colour secondary) and buttons (600, 0.9375rem)
- JetBrains Mono for labels, stats, tags: 0.75rem uppercase, tracking 0.18em, e.g. "// 01 — PROJECTS"; stat numbers 2.5rem weight 600 with tabular numerals

LAYOUT & SHAPE
- 12-column grid, 24px gutters (16px mobile), max content width 1240px, 8px spacing base (4/8/12/16/24/32/48/64/96/128)
- Section vertical padding clamp(80px, 12vh, 160px)
- Radii: buttons 12px, cards 20px, modal 28px, pills 999px
- No heavy drop shadows in dark mode: use a 1px glass border plus a coloured glow (0 20px 80px -20px accent at 35%)
- Section dividers: hairline gradient line (transparent → cyan at 40% → transparent) with a small mono index label

COMPONENTS TO INCLUDE IN THE STYLE GUIDE
- Primary button: animated conic-gradient aurora border, inner fill = surface, arrow icon. Secondary button: glass fill. Icon button: 44px glass circle.
- Glass card, glass pill/tag, stat chip, status badge ("Live" with mint dot), filter chip (active = filled aurora), tooltip, toast, input field
- Focus ring: 2px cyan outline, 3px offset, always visible

MOTION PRINCIPLES (describe in the guide)
- Easing: out-expo cubic-bezier(0.16,1,0.3,1) for entrances; in-out cubic-bezier(0.65,0,0.35,1) for cross-fades; spring (stiffness 260, damping 30) for modals
- Durations: micro 150ms, base 350ms, reveal 700ms, scene change 1200ms; stagger 60–90ms
- Animate only transform and opacity; respect prefers-reduced-motion

OUTPUT: show the palette (dark and light), type scale, spacing, radii, button/card/chip states, and motion tokens. Use Tailwind CSS with CSS variables for tokens. WCAG AA contrast in both themes.
```

---

## P1 — Navigation

```text
Design the navigation for the "Aurora Cyber" portfolio of Yamlak Negash (dark theme: page #04060F, glass rgba(16,24,48,0.55) + 20px blur, border rgba(120,160,255,0.14), text #EAF2FF, accent cyan #22D3EE, aurora gradient #22D3EE → #6366F1 → #D946EF; fonts Space Grotesk / Inter / JetBrains Mono).

DESKTOP: a floating, pill-shaped glass bar, horizontally centred, 16px from the top, backdrop-filter blur(20px) saturate(190%), 1px glass border, radius 999px.
- Left: monogram "YN" inside a rotating gradient ring.
- Centre links: About · Projects · Stack · Experience · Testimonials · Contact. The active link has a cyan underline/pill that slides between items (scroll-spy). Inactive links use secondary text #9FB0D0 and brighten on hover.
- Right: theme toggle (sun/moon morph icon, 44px glass circle) and a compact "Résumé" button with a download icon.
- Bottom edge of the bar: a 2px scroll-progress line in the aurora gradient.
- Behaviour to annotate: hides on scroll down (translateY -120%), reappears on scroll up (300ms out-expo).

MOBILE (390px): bar shrinks to monogram + theme toggle + menu button. Show the opened menu as a full-screen glass sheet with large staggered links (Space Grotesk 2rem), the Résumé button at the bottom, social icons (GitHub, LinkedIn), and a close button.

Show: default, active-link, hover, scrolled/hidden states, and the mobile open menu. Touch targets ≥ 44px, visible focus rings, semantic <nav> landmark. Tailwind CSS.
```

---

## P2 — Hero (slideshow that re-themes the page)

```text
Design the HERO section (full viewport, 1440px desktop, dark theme) of the portfolio of Yamlak Negash, Full-Stack Software Engineer. Style "Aurora Cyber": page #04060F, glass rgba(16,24,48,0.55) + blur, text #EAF2FF / #9FB0D0, aurora gradient #22D3EE → #6366F1 → #D946EF, mint #34D399. Fonts: Space Grotesk (headline), Inter (body), JetBrains Mono (labels, stats).

SIGNATURE IDEA: the background is a slideshow of FIVE featured projects, and each slide re-themes the entire hero (glow, mesh blobs, particles, grid highlight, buttons, progress bar) to that project's accent colour. The foreground never changes. Show slide 1: DonorLink in crimson (#F43F5E, secondary #FB7185).

BACKGROUND (back to front): deep-navy void → blurred, darkened abstract render of the project (gradient mesh + faint UI fragments / data-viz shapes in the accent colour) → drifting mesh blobs tinted to the accent → engineering grid (1px, 4% opacity, radial mask) whose brightest cells tint to the accent → particle field (rising droplets/pulses for DonorLink; ≤120 particles).

FOREGROUND, top to bottom, left-aligned (left ~60% of the width):
1. Glass pill with pulsing mint dot: "Available for new opportunities · Addis Ababa, ET"
2. Mono label: "// FULL-STACK SOFTWARE ENGINEER"
3. H1 (Space Grotesk 700, clamp(2.5rem, 6vw, 5.5rem), tracking -0.03em, leading 1.02): "I build production software that ships, scales, and gets used." — the words "ships, scales, and gets used" in the aurora gradient (background-clip: text).
4. Typewriter role line with blinking cursor: "> Mobile Engineer_" (rotates every 3s: Full-Stack Engineer · Mobile Engineer · Fintech Integrations · Real-time Systems · Applied AI)
5. Value proposition, max 2 lines, secondary text: "Independently shipped 20+ production-track systems across fintech, healthcare, logistics, hospitality and education — live with real users, real payments and real-time traffic."
6. Buttons: primary "View my work →" (animated conic aurora border), secondary glass "↓ Download résumé", then two 44px glass icon buttons (GitHub, LinkedIn).
7. Four glass stat chips in a row (mono numbers, tabular): "20+ Production systems shipped" · "9 Bank & payment integrations" · "400+ Source files in one monorepo" · "260+ Commits on a single project".

RIGHT SIDE: circular placeholder portrait with a rotating aurora conic-gradient ring and a small mint status dot.

BOTTOM-LEFT: "NOW SHOWING" glass card — mono label "01 / 05 — NATIONAL BLOOD LOGISTICS", a crimson dot + "DonorLink", one line: "Six-app monorepo coordinating Ethiopia's blood bank, hospitals and donors in real time.", and a button "Open case study ↗" in the accent colour.
BOTTOM-RIGHT: slide counter "01 / 05", five thin progress bars (active one fills over 7s in the accent colour), glass circular prev/next arrows, a pause/play button. Bottom centre: bobbing "↓ scroll" cue.

Above everything: the floating glass nav pill (YN monogram, About · Projects · Stack · Experience · Testimonials · Contact, theme toggle, Résumé).

BEHAVIOUR to annotate: autoplay every 7s; pause on hover/focus/hidden tab; keyboard ← →; touch swipe; page scroll never hijacked; cross-fade 1.2s; slow Ken-Burns drift (scale 1.00→1.08 over 8s); "Now showing" text swaps with a vertical mask reveal (450ms, 60ms stagger); page-load choreography: grid draws in → nav slides down → pill scales in → H1 reveals word by word → role line types → CTAs rise → stats count up → card and controls slide in. Reduced-motion: no autoplay, particles or Ken-Burns.
Output: responsive Tailwind CSS, WCAG AA, carousel ARIA (role="region" aria-roledescription="carousel").
```

---

## P2b — Hero: all five slide states

```text
Show the hero section of Yamlak Negash's "Aurora Cyber" portfolio five times, one frame per slide, with IDENTICAL foreground (floating nav, availability pill, headline "I build production software that ships, scales, and gets used.", role line, value proposition, CTAs, four stat chips, circular portrait) and only the world behind it changing. For each slide re-theme: background scene, mesh blobs (different layout per slide), particle behaviour, grid highlight cells, glow, primary button border, active progress bar, slide counter, and the "Now showing" card.

1. 01 / 05 — DonorLink — NATIONAL BLOOD LOGISTICS — crimson #F43F5E / #FB7185 — rising droplets and pulses. "Six-app monorepo coordinating Ethiopia's blood bank, hospitals and donors in real time."
2. 02 / 05 — TrustPay — PAYMENT VERIFICATION — violet #8B5CF6 / #A78BFA — hex-lock grid nodes. "Direct-to-bank verification across 9 Ethiopian banks, with OCR + QR and fraud forensics."
3. 03 / 05 — NYDL — ENTERPRISE LMS — sky cyan #0EA5E9 / #22D3EE — linked nodes / graph. "Multi-portal learning SaaS with cohorts, certificates, payments and analytics."
4. 04 / 05 — Lumora — AI TUTOR — emerald #10B981 / #2DD4BF — floating glyphs / constellation. "Multi-tenant EdTech with on-device + cloud AI tutoring in English and Amharic."
5. 05 / 05 — Chereta — TRUST-FIRST MARKETPLACE — amber #F59E0B / #FBBF24 — drifting tags and coins. "Escrow 'Safe Deal' payments, Telegram bot and RAG support for second-hand commerce."

Dark theme, 1440px. Annotate on each frame which elements changed. Page base stays #04060F with text #EAF2FF.
```

---

## P3 — About (bento grid)

```text
Design the ABOUT section for the "Aurora Cyber" portfolio of Yamlak Negash (dark: page #04060F, glass rgba(16,24,48,0.55) + 20px blur, 1px border rgba(120,160,255,0.14), text #EAF2FF / #9FB0D0, accents cyan #22D3EE, violet #8B5CF6, magenta #D946EF; Space Grotesk / Inter / JetBrains Mono).

Section header: mono label "// 01 — ABOUT" above an H2 "Engineer first. Product-minded always." (Space Grotesk 600, clamp(2rem, 4vw, 3.5rem)), with a hairline aurora divider above.

Layout: an asymmetric BENTO GRID of six glass tiles on a 12-column grid (max width 1240px, 24px gap, 20px radius):
1. COLLABORATION (large, 7 cols): "I prioritise client collaboration, fostering open communication." Subtle illustration of overlapping chat bubbles / avatars in the accent colours.
2. TIME ZONES (small, 5 cols): "Flexible with time-zone communication." A slowly rotating wireframe globe with pulsing city markers; Addis Ababa highlighted in cyan.
3. TECH STACK (medium, 5 cols): two columns of gently bobbing tech chips: React, Next.js, TypeScript, Node.js, Express, Python/AI.
4. PASSION (small, 3 cols): "Tech enthusiast with a passion for development." with a glowing code-bracket glyph.
5. INSIDE SCOOP (large, 7 cols): "Currently leading NYDev, shipping production systems across fintech, health-tech and edtech — from national blood-bank logistics to AI-powered tutoring."
6. CTA (medium, 4 cols, aurora-gradient border): "Want to start a project together?" and a "Copy my email" button (shows copy icon; on click morphs to "Copied ✓" with a burst of 24 small accent squares).

Tile interactions to annotate: cursor-following spotlight border, 3D tilt (max 6°) with moving specular highlight, content parallax, scroll reveal (rise 32px + fade, 80ms stagger, once). Behind the section: faint engineering grid and a soft violet/cyan mesh blob.
Show hover state for one tile. Responsive: 2 columns on tablet, 1 on mobile. Tailwind CSS, WCAG AA.
```

---

## P4 — Featured Projects (grid + filters)

```text
Design the FEATURED PROJECTS section for the "Aurora Cyber" portfolio of Yamlak Negash (dark: page #04060F, surface #0A0F1F, glass border rgba(120,160,255,0.14), text #EAF2FF / #9FB0D0 / #6B7A9C, aurora gradient #22D3EE → #6366F1 → #D946EF; Space Grotesk / Inter / JetBrains Mono).

Header: mono label "// 02 — PROJECTS", H2 "A selection of systems that shipped." Below it, filter chips: All · Fintech · Health · EdTech · Marketplace · AI · Mobile (active chip filled with the aurora gradient; others glass). Show the grid re-flowing with a FLIP layout animation when a filter is chosen.

CARD anatomy (20px radius, dark inner surface in BOTH themes, 4:3 media): generated abstract cover art in the project's accent colour with a soft glow; project name (Space Grotesk 600, 1.5rem); one-line description (secondary text); overlapping circular tech icons; status badge ("● Live" mint dot, or "Repo" for GitHub-only); on hover: glow intensifies, cover scales 1.04, 3D tilt ±6°, border turns to the accent, "View case study ↗" slides up. Clicking anywhere on a card opens the case-study modal (shared-element expansion).
GRID: 3 columns desktop (the first two cards span wider for hierarchy), 2 tablet, 1 mobile. Reveal: cards rise 24px + fade, 80ms stagger. Show one card in its hover state.

USE THIS PROJECT DATA VERBATIM (accent / accent-2):
1. DonorLink — National Blood Logistics Platform · Health, Mobile, Real-time · #F43F5E/#FB7185 · "6-app Turborepo/pnpm monorepo coordinating Ethiopia's National Blood Bank, regional banks, hospitals and donors." · React, TS, React Native, Node, MongoDB, Socket.IO, Python (FastAPI) · Live
2. TrustPay — Digital Payment Verification · Fintech, Mobile · #8B5CF6/#A78BFA · "Direct-to-bank verification against 9 Ethiopian banks and mobile-money providers, no third-party aggregator." · React, Vite, React Native, Node, MongoDB · Live
3. NYDL — Enterprise Learning Management SaaS · EdTech · #0EA5E9/#22D3EE · "Multi-portal LMS: courses, cohorts, assignments, certificates, badges, payments, analytics." · React, Vite, TanStack, Node, MongoDB, BullMQ · Live
4. Lumora — Multi-Tenant EdTech SaaS + AI Tutor · EdTech, AI, Mobile · #10B981/#2DD4BF · "School operations plus an AI mobile tutor with OCR homework capture and English/Amharic voice tutoring." · React, TanStack, Expo, Node, MongoDB, ExecuTorch, RAG · Live
5. Chereta — Trust-First Second-Hand Marketplace · Marketplace, AI, Mobile · #F59E0B/#FBBF24 · "Escrow 'Safe Deal' flow with real Chapa payments, 14-command Telegram bot and RAG support widget." · React, TS, Node, PostgreSQL, Socket.IO, Chapa · Live
6. SJCS-Web — School Administration Platform · EdTech · #3B82F6/#60A5FA · "MERN MVP: attendance, academics, payments, results and real-time exam rooms with webcam ID capture." · React, TS, Tailwind, Node, MongoDB, Socket.IO · Live
7. Procedure Notifier & Bed Notification System (BNS) · Health, Real-time · #14B8A6/#5EEAD4 · "Hospital bed-availability and procedure-notification system; 260+ commits, grew into a MERN + mobile system." · React, TS, Tailwind, Node, MongoDB · Live
8. Kana — Wedding Invitation, RSVP & Photo Sharing · Marketplace, Web · #EC4899/#F9A8D4 · "Multi-tenant platform where any couple spins up a wedding microsite from one shared codebase." · React, TS, Tailwind, Node, MongoDB · Live
9. Nuru — AI-Assisted Youth Life-Navigation · AI, Social impact · #6366F1/#A5B4FC · "Privacy-first decision support with anonymous AI chat, wizards and a clinic finder; Amharic and Afaan Oromo." · React, TanStack, Tailwind, Node, MongoDB · Repo
10. Email-Helper — Bilingual Gmail Client · Mobile, Web · #38BDF8/#7DD3FC · "Beginner-friendly English/Amharic email client with real Gmail OAuth2 across web, Expo mobile and Express backend." · React, Expo, Node, MongoDB · Repo

Show 6 cards on the first view plus a "Show all 10 projects" button. Tailwind CSS, WCAG AA, status never conveyed by colour alone.
```

---

## P5 — Tech Stack (orbit field)

```text
Design the TECH STACK section for the "Aurora Cyber" portfolio of Yamlak Negash (dark: page #04060F, glass rgba(16,24,48,0.55), text #EAF2FF / #9FB0D0, accents cyan #22D3EE, violet #8B5CF6, magenta #D946EF, blue #3B82F6, mint #34D399; Space Grotesk / Inter / JetBrains Mono).

Header: mono label "// 03 — STACK", H2 "Tools I ship with."

DESKTOP: an interactive icon field. A glowing core labelled "Full-Stack" sits at the centre; technology icons sit on concentric orbit rings around it, slowly rotating (60s per revolution). Icons live in 48px glass tiles, colour-coded by category with a matching glow. Hovering an icon enlarges it, pauses the orbit and shows a tooltip with name + context (e.g. "Socket.IO — real-time inventory tracking"). A category legend (colour dots + names) sits to the side; hovering a category highlights its icons and dims the rest. The section pins for ~1.5 viewport heights while categories highlight one by one.

CATEGORIES AND CONTENT:
- Frontend: React, Next.js, TypeScript, Vite, TanStack (Router/Query/Table), Tailwind CSS, shadcn/ui, Zustand, React Hook Form + Zod
- Mobile: React Native, Expo, Expo Router, NativeWind, ExecuTorch (on-device AI), ML Kit OCR, Biometrics, EAS
- Backend: Node.js, Express, NestJS, REST, JWT/RBAC multi-tenant auth, Socket.IO, BullMQ/Redis, Zod
- Data: MongoDB/Mongoose, PostgreSQL (Neon, Drizzle, Prisma), Redis
- AI / ML: Python, scikit-learn, DistilBERT, XGBoost, SHAP, DVC, OpenAI/Gemini/Groq, RAG, OCR
- Payments & identity: Chapa, Stripe, direct-to-bank verification (CBE), OAuth (Google/Instagram/Telegram), Fayda eSignet
- DevOps & architecture: Docker, Nginx, Vercel/Render/Cloudflare Workers, Turborepo/pnpm, Clean/Microservice architecture, CI/CD
- Testing & security: Vitest, Jest, Playwright, Storybook, 2FA/TOTP, rate limiting, ClamAV, audit logging

MOBILE (390px): replace the orbit with a two-row infinite marquee scrolling in opposite directions, with a category chip filter above. Show the desktop orbit with one hovered tooltip, and the mobile marquee. Reduced-motion: static grid of grouped icons. Tailwind CSS, WCAG AA.
```

---

## P6 — Experience (timeline)

```text
Design the EXPERIENCE section for the "Aurora Cyber" portfolio of Yamlak Negash (dark: page #04060F, glass rgba(16,24,48,0.55) + blur, border rgba(120,160,255,0.14), text #EAF2FF / #9FB0D0 / #6B7A9C, aurora gradient #22D3EE → #6366F1 → #D946EF; Space Grotesk / Inter / JetBrains Mono).

Header: mono label "// 04 — EXPERIENCE", H2 "Where I've built things."

LAYOUT: a vertical timeline with a glowing aurora-gradient spine in the centre that DRAWS ITSELF as the user scrolls (stroke-dashoffset linked to scroll). Each entry is a glass card that slides in from alternating sides (left/right); the node on the spine pulses when its card enters the viewport. On mobile the spine moves to the left edge and all cards stack on the right. Each card: mono date range, role (Space Grotesk 600), company, 2–3 bullet highlights, and small tech chips.

ENTRIES (use verbatim):
1. Oct 2025 – Present — Lead Full-Stack Developer — NYDev (independent software studio). "Architected DonorLink, TrustPay, NYDL, Lumora and more across fintech, health, logistics, hospitality and edtech; several live with real users, payments and real-time traffic."
2. Mar – Jul 2026 — Software Engineering Intern — PISpace Technology. "Full-stack/frontend on a production ERP (accounting module): React/Vite/TS/Tailwind/shadcn, TanStack Query/Router, Zustand; companion React Native receipt-capture app (ML Kit)."
3. University — Lead Frontend Developer & Project Manager — University Medical Collaboration. "Led a multidisciplinary team on a hospital bed/procedure notification system; Figma → production React; 260+ commits; MERN + mobile with cron expiry and Gemini/Groq features."
4. Ethronics — Lead Frontend Developer. "Built the JobsPark recruitment platform end-to-end: React, Express/MongoDB, JWT/RBAC, Chapa payments."

Below the timeline: an "Education" mini-card — "B.Sc. Software Engineering, Addis Ababa University — Expected 2027", plus a language line "English (professional) · Amharic (native)".
Annotate scroll behaviour and the reduced-motion fallback (spine fully drawn, no slide-in). Tailwind CSS, WCAG AA.
```

---

## P7 — Testimonials (marquee)

```text
Design the TESTIMONIALS section for the "Aurora Cyber" portfolio of Yamlak Negash (dark: page #04060F, glass rgba(16,24,48,0.55) + blur, border rgba(120,160,255,0.14), text #EAF2FF / #9FB0D0, aurora gradient #22D3EE → #6366F1 → #D946EF; Space Grotesk / Inter / JetBrains Mono).

Header: mono label "// 05 — KIND WORDS", H2 "What people say."

LAYOUT: two rows of glass quote cards in an infinite horizontal marquee, moving in opposite directions (slow, ~60s loop), pausing on hover, with left/right edge fade masks. Card (360px wide, 20px radius): large faint quote mark, italic quote text designed for 2–3 lines, avatar circle with an aurora gradient ring, name (Space Grotesk 600), role (mono, muted). Cards slightly lift and brighten their border on hover.

PEOPLE (write believable placeholder quotes about reliability, communication and shipping on time; the real quotes come from a CMS):
- Abenezer Negash — Radiology Technologist
- Sana Matusala — Developer and Civil Engineer
- Besukal Getamesay — Electrical Engineer & IT Technologist
- Samuel Tesfaye — Economist & Architectural Engineer

Show the desktop view and a mobile view (single row). Reduced-motion: static two-row scrollable grid. Tailwind CSS, WCAG AA.
```

---

## P8 — My Approach (phase cards)

```text
Design the MY APPROACH section for the "Aurora Cyber" portfolio of Yamlak Negash (dark: page #04060F, surface #0A0F1F, border rgba(120,160,255,0.14), text #EAF2FF / #9FB0D0, accents cyan #22D3EE, violet #8B5CF6, magenta #D946EF; Space Grotesk / Inter / JetBrains Mono).

Header: mono label "// 06 — APPROACH", H2 "How I turn ideas into software that holds up."

LAYOUT: four large numbered phase cards in a row (stack vertically on mobile), 20px radius, glass fill. Giant outlined numeral (01–04) in Space Grotesk, mono phase label, title, description, and a small icon. HOVER: a dot-matrix canvas reveal sweeps across the card in the accent colour (a different accent per card: cyan, blue, violet, magenta) and the title/description brighten over it. Show one card in hover state.

PHASES (verbatim):
1. Architecture & Planning — map data model, auth boundaries, integrations and scale before writing code.
2. Build in Vertical Slices — ship end-to-end slices (UI, API, data) for one real workflow at a time.
3. Harden for Production — auth/RBAC, validation, rate limiting, error boundaries and monitoring before launch.
4. Ship, Measure, Iterate — watch what breaks under real usage and iterate on evidence.

Connect the cards with a thin dashed aurora line that fills as the section scrolls into view. Scroll reveal: rise 32px + fade, 80ms stagger. Tailwind CSS, WCAG AA; hover effects have a static fallback for touch and reduced motion.
```

---

## P9 — Contact / Footer

```text
Design the CONTACT and FOOTER section for the "Aurora Cyber" portfolio of Yamlak Negash (dark: page #04060F, glass rgba(16,24,48,0.55) + blur, border rgba(120,160,255,0.14), text #EAF2FF / #9FB0D0 / #6B7A9C, accents cyan #22D3EE, violet #8B5CF6, magenta #D946EF; aurora gradient #22D3EE → #6366F1 → #D946EF; Space Grotesk / Inter / JetBrains Mono).

Background: the engineering grid fades up from the bottom with a soft cyan horizon glow and a few drifting particles.

CONTENT:
- Mono label "// 07 — CONTACT"
- Giant statement (Space Grotesk 700, clamp(2.5rem, 7vw, 6rem)): "Ready to build something that ships?" — the word "ships" in the aurora gradient.
- Supporting line: "Open to full-time roles, contracts and ambitious product ideas. Based in Addis Ababa, Ethiopia — flexible with time zones."
- Primary magnetic button "Let's get in touch →" (mailto:yamlaknegash96@gmail.com, animated conic aurora border) and secondary glass button "Copy email" (morphs to "Copied ✓" with a confetti burst).
- Social row of 44px glass icon buttons: GitHub (github.com/yamneg96), LinkedIn (linkedin.com/in/yamlak-negash-43827a399), Portfolio (yamlak.vercel.app), Upwork. A caption beneath rotates every 3s and follows the highlighted icon (e.g. "Check out my repositories on GitHub").
- Footer bar: "© 2026 Yamlak Negash" left, "Built with Next.js" centre, back-to-top button on the right with a circular scroll-progress ring.

Show desktop and mobile. Hover states: icon lift -2px + glow; link underline draws left→right. Tailwind CSS, WCAG AA, semantic <footer>.
```

---

## P10 — Project Case-Study Modal (shared element)

```text
Design the full-screen PROJECT CASE-STUDY MODAL for the "Aurora Cyber" portfolio of Yamlak Negash, using DonorLink as the example. Base (dark): page #04060F, elevated #101830, glass border rgba(120,160,255,0.14), text #EAF2FF / #9FB0D0, Space Grotesk / Inter / JetBrains Mono. While the modal is open the whole UI takes the project accent: crimson #F43F5E (secondary #FB7185, glow rgba(244,63,94,0.35)) for border glow, buttons, chips and progress.

SHOW THREE FRAMES: (a) the project card in its collapsed state in the grid, (b) an in-between transition frame (card expanding from its exact position/size to full screen, backdrop blurred 18px and dimmed 70%, page behind scaled to 0.97), (c) the fully open modal.

OPEN MODAL LAYOUT (desktop, inset 24px, radius 28px):
- Sticky header: "‹ Prev project" · title "DonorLink" · "Next project ›" · close ✕ button.
- Media carousel (16:9) with arrows, thumbnails and dots; supports image, looping muted video and a phone device frame; crossfade 350ms. Use generated cover art as placeholders.
- Left column (≈ 8 cols): mono label "// CASE STUDY"; H1 "DonorLink — National Blood Logistics Platform"; one-line summary; sections Overview · Challenge · Solution (2–3 short paragraphs each); Key features (5 icon bullet rows with accent icons); Architecture diagram (animated node-and-line: Donor App (React Native) ↔ API (Express/MongoDB) ↔ Hospital Portal / National Ops Portal, plus Intelligence service (FastAPI) and a Socket.IO event bus); Impact metrics as count-up tiles ("6 apps", "400+ source files", "Real-time" ...); "Next project" strip with thumbnail + title.
- Right column (≈ 4 cols): sticky "AT A GLANCE" glass card — Role: Lead Full-Stack Developer · Type: Web + Mobile · Status: ● Live · Stack chips (React, TypeScript, React Native, Node, MongoDB, Socket.IO, FastAPI) · buttons "Live demo ↗" (primary, accent) and "Source code ↗" (glass). Variants: NYDL adds "Admin panel ↗"; Chereta adds "Install mobile app ↗".
- Content per project follows this template: title, tagline, role, platform, status, accent, media[], overview, challenge, solution, features[], stack[], metrics[{value,label}], links{live,repo,admin,mobile}.

MOTION to annotate: spring expansion (stiffness 260, damping 30, ~600ms) using shared elements (cover + title); content staggers in after the expand (title → meta → media → sections, 70ms apart, rise 16px); close reverses into the card (~450ms) and the card pulses once; Prev/Next swap content with a horizontal slide. Reduced-motion: 200ms fade/scale.
BEHAVIOUR: role="dialog" aria-modal, focus trap, focus returns to the card, Esc / backdrop click / swipe-down to close, body scroll locked, deep link #project=donorlink. Mobile: full-screen sheet with a drag handle, single column, "At a glance" card moves under the title. Tailwind CSS, WCAG AA.
```

---

## P11 — Light Theme

```text
Recreate the Home page hero, the featured-projects grid and the project case-study modal of Yamlak Negash's "Aurora Cyber" portfolio in the LIGHT THEME. Same layout, type and motion as the dark version.

LIGHT TOKENS: page #F6F8FF (cool off-white, never pure #FFF); surface/cards #FFFFFF; elevated/modal #EEF2FF; border rgba(15,23,60,0.10); text primary #0B1020, secondary #44506E, muted #7280A0; accents darkened for contrast — cyan #0891B2, blue #2563EB, violet #7C3AED, magenta #C026D3; aurora gradient #0891B2 → #6366F1 → #C026D3. Glass panels become frosted white rgba(255,255,255,0.7) with 20px blur; dark-mode glows become soft tinted shadows (0 20px 60px -24px accent at 30%); particle field drops to ~40% opacity; the engineering grid becomes navy lines at 5% opacity.

RULES: project cards KEEP a dark inner surface (#0A0F1F) in both themes so their glow stays dramatic; the hero slideshow backgrounds remain darkened scenes with a light-tinted overlay and dark-on-light foreground text; every text/background pair meets WCAG AA (4.5:1 body, 3:1 large text/UI). Also show the theme toggle (sun/moon morph) and annotate the circular view-transition reveal expanding from the toggle (~700ms). Fonts: Space Grotesk / Inter / JetBrains Mono. Tailwind CSS.
```

---

## P12 — Mobile (390px)

```text
Design the MOBILE (390px wide, dark theme) version of Yamlak Negash's "Aurora Cyber" portfolio. Tokens: page #04060F, glass rgba(16,24,48,0.55) + blur, border rgba(120,160,255,0.14), text #EAF2FF / #9FB0D0, aurora gradient #22D3EE → #6366F1 → #D946EF, mint #34D399; Space Grotesk / Inter / JetBrains Mono. Gutters 16px, touch targets ≥ 44px.

SCREENS TO SHOW:
1. Hero: compact nav (YN monogram, theme toggle, menu button) → circular portrait with rotating aurora ring → availability pill → H1 "I build production software that ships, scales, and gets used." (clamp 2.5rem) → typewriter role line → value proposition → full-width primary and secondary buttons → stats in a 2×2 grid → the "Now showing" card with slideshow controls (counter, progress bars, arrows) sitting UNDER the card, swipe to change slide.
2. Open menu: full-screen glass sheet with large staggered links, Résumé button, social icons.
3. Projects: filter chips as a horizontally scrolling row; single-column cards.
4. Project modal: full-screen bottom sheet with a drag handle, swipe-down to close, media carousel, "At a glance" under the title, sticky bottom bar with "Live demo ↗".
5. Tech stack: two-row opposing marquee.
6. Experience: timeline with the spine on the left edge.
7. Testimonials single-row marquee, approach cards stacked, contact footer with stacked buttons.

Show all seven as a row of phone frames. Tailwind CSS, WCAG AA, reduced-motion fallbacks.
```

---

## P13 — States (loading, empty, error, toasts, 404)

```text
Design the system STATES for the "Aurora Cyber" portfolio of Yamlak Negash, in DARK (page #04060F, glass rgba(16,24,48,0.55), border rgba(120,160,255,0.14), text #EAF2FF / #9FB0D0) and LIGHT (page #F6F8FF, cards #FFFFFF, text #0B1020 / #44506E). Signals: mint #34D399 success, amber #FBBF24 warning, rose #FB7185 error, cyan #22D3EE info. Fonts: Space Grotesk / Inter / JetBrains Mono.

1. LOADING SKELETONS: glass blocks with a diagonal shimmer sweep (1.6s linear infinite) matching the final layouts — hero stat chips, project card grid, text lines, avatar circle.
2. EMPTY STATE: centred icon in an accent circle, title "Nothing here yet", helpful message, optional action button.
3. ERROR STATE: rose-tinted glass panel, alert icon, title "Something went wrong", message, "Try again" button with a rotating refresh icon while retrying.
4. TOASTS: top-right glass cards sliding in from -12px with icon, message and dismiss: success, error, info, warning variants; auto-dismiss 4s with a thin countdown bar.
5. 404 PAGE: huge aurora-gradient "404" with a glitch-scanline reveal, the line "This page hasn't shipped yet.", a "Back to home" primary button (animated aurora border), floating particles and the faint engineering grid in the background.

Show each state in both themes. Never rely on colour alone (icons + text). Tailwind CSS, WCAG AA.
```

---

## P14 — Full Home Assembly (one frame)

```text
Using the "Aurora Cyber" system already defined in this project, assemble the complete HOME PAGE of Yamlak Negash's portfolio as one long 1440px desktop frame in the DARK theme, in this order, each section separated by an aurora hairline divider and a mono index label:

floating glass nav → Hero (5-project re-theming slideshow; show slide 2, TrustPay, in violet #8B5CF6) → "// 01 — ABOUT" bento grid → "// 02 — PROJECTS" filter chips + card grid → "// 03 — STACK" orbit field → "// 04 — EXPERIENCE" scroll-drawn timeline → "// 05 — KIND WORDS" testimonial marquees → "// 06 — APPROACH" four phase cards → "// 07 — CONTACT" statement, CTAs, socials and footer.

Keep the foreground content, copy and component styling consistent with the earlier section screens. Page rhythm: section padding clamp(80px, 12vh, 160px), max content width 1240px. Also show a right-edge section index counter (01 / 07) and the 2px aurora scroll-progress bar. Tailwind CSS, WCAG AA.
```

---

## P15 — Admin CMS (optional)

```text
Design a matching ADMIN DASHBOARD for the "Aurora Cyber" portfolio of Yamlak Negash. Same tokens (dark: page #04060F, surface #0A0F1F, glass border rgba(120,160,255,0.14), text #EAF2FF / #9FB0D0, accent cyan #22D3EE, aurora gradient) but quieter motion and denser layout.

- Left sidebar: Dashboard, Settings, Projects, Experience, Approach, Client logos, Testimonials, Social links; active item has a cyan indicator; collapsible on mobile.
- Top bar: page title, search, theme toggle, avatar menu.
- Dashboard: stat tiles (projects, testimonials, views) and a recent-edits list.
- List views: table with drag-to-reorder rows, status badges, row actions (edit, delete with confirm).
- Project edit form: title, tagline, accent colour pickers (accent, accent-2), featured toggle, platform and status selects, overview / challenge / solution textareas, features list, metrics rows, gallery drag-and-drop image upload with previews, tech-stack chip input, links (live, repo, admin, mobile). Sticky save bar with "Save changes" and "Discard".
- Save success/error toasts; light and dark themes.

Tailwind CSS, WCAG AA, form labels and error messages for every field.
```

---

## R — Refinement Prompts (one change per message)

```text
Make the hero headline larger and tighten the tracking; keep the gradient on "ships, scales, and gets used".
```

```text
Increase the contrast of the secondary text on the dark theme so it meets WCAG AA.
```

```text
Make glass panels slightly more opaque so text over the particle field stays readable.
```

```text
Replace the orbiting tech icons with a bento of category cards if the orbit feels busy.
```

```text
Give me three variants of the project card: minimal, glow-heavy, and editorial large-image.
```

```text
Reduce the number of simultaneously animated elements in the hero by 30%.
```

```text
Add a subtle noise/grain overlay (3% opacity) to the dark backgrounds for depth.
```

```text
Swap the aurora gradient for cyan → blue only, for a calmer, more corporate look.
```

```text
Show the modal's architecture diagram at larger scale with labelled connections.
```

```text
Regenerate this screen using Tailwind spacing utilities (p-4, m-8, gap-6) and CSS variables for the colour tokens.
```

```text
Give me 3 variants of this section: conservative, bold, experimental.
```

---

## Assets Still Needed

1. **Real portrait photo** (square, ≥ 800px) for the hero avatar; a placeholder is used until then.
2. **Real project screenshots / short screen recordings** (16:9) for DonorLink, TrustPay, NYDL, Lumora and Chereta, so the modal carousel and slide backgrounds use real UI instead of generated art.
3. **Case-study copy** (challenge / solution / outcome) for each featured project; the prompts only contain résumé-level facts.
4. **Testimonials:** confirm the four quotes and the people's names/roles are approved for public display.
5. **Sound:** none planned; keep the site silent.
6. **Fonts:** Space Grotesk, Inter and JetBrains Mono are open-source (SIL OFL) via Google Fonts.

## Brand Facts (reference)

| Field        | Value                                                                  |
| ------------ | ---------------------------------------------------------------------- |
| Name / title | Yamlak Negash — Full-Stack Software Engineer (React, Next.js, React Native, Node.js, TypeScript) |
| Location     | Addis Ababa, Ethiopia                                                  |
| Email        | yamlaknegash96@gmail.com                                               |
| GitHub       | https://github.com/yamneg96                                            |
| LinkedIn     | https://www.linkedin.com/in/yamlak-negash-43827a399                    |
| Portfolio    | https://yamlak.vercel.app                                              |
| Résumé       | `/Yamlak_Resume.pdf`                                                   |
| Languages    | English (professional), Amharic (native)                               |
| Education    | B.Sc. Software Engineering, Addis Ababa University (expected 2027)     |
| Voice        | Confident, specific, engineering-first. Short sentences. Numbers over adjectives. |

## Research Notes

Prompt structure (context → structure → aesthetic → output stack, name the palette, assign type per role, ask for variants) follows community Stitch guides; Google's own Stitch documentation was not verified:
- [Stop generating AI slop — the developer's guide to Google Stitch](https://dev.to/seifalmotaz/stop-generating-ai-slop-the-developers-guide-to-google-stitch-jen)
- [Google Stitch for UI design (UX Planet)](https://uxplanet.org/google-stitch-for-ui-design-544cf8b42d52)
- [Google Stitch AI review (index.dev)](https://index.dev/blog/google-stitch-ai-review-for-ui-designers)

Colour direction (treat hex values as starting points): [Contra — web design trends 2026](https://contra.com/community/NvTilwHA-top-web-design-trends-for-2026), [ControlF5 — 2026 colour combinations](https://www.controlf5.in/?p=69113), [Vistaprint — colour trends 2026](https://www.vistaprint.com/hub/color-trends).

Design decisions confirmed with the owner on 2026-10-18: **Aurora Cyber palette · hero slideshow of featured projects · shared-element project modal · full page with states in dark and light themes.**
