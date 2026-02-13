# LYRIX DIGITAL — Architecture & Developer Guide

> Detailed technical documentation for the Lyrix Digital web platform.
> For quick-start instructions and common tasks, see [README.md](../README.md).

---

## Table of Contents

1. [Tech Stack Deep Dive](#tech-stack-deep-dive)
2. [Page Routing & i18n Flow](#page-routing--i18n-flow)
3. [Component Architecture](#component-architecture)
4. [State Management In Depth](#state-management-in-depth)
5. [Hydration Strategy](#hydration-strategy)
6. [SEO & Structured Data](#seo--structured-data)
7. [Contact Form Pipeline](#contact-form-pipeline)
8. [Blog System Details](#blog-system-details)
9. [Styling Architecture](#styling-architecture)
10. [Performance Budget](#performance-budget)
11. [File-by-File Reference](#file-by-file-reference)

---

## Tech Stack Deep Dive

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Astro | 5.x | Static site generation, Islands architecture |
| **UI Library** | React | 19 | Interactive islands (forms, animations) |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS (CSS-first config, no JS config file) |
| **Animation** | Framer Motion | 12.x | Physics-based animations, AnimatePresence (below-fold sections) |
| **Animation** | CSS @keyframes | — | LCP-critical hero animations (particle-fade, pulse) |
| **Icons** | lucide-react | 0.56x | Consistent icon set across components |
| **State** | nanostores | 1.x | Cross-island reactive state management |
| **Email** | Resend | 6.x | Transactional email sending |
| **Validation** | Zod | 4.x | Runtime schema validation (forms, content) |
| **Fonts** | astro-font | 1.x | Optimized font loading with fallback metrics |
| **Analytics** | Google Analytics 4 | — | Deferred 3s post-idle via requestIdleCallback (no GTM) |
| **Analytics** | Cloudflare Web Analytics | — | Privacy-first beacon analytics |
| **Hosting** | Cloudflare Pages | — | Edge deployment with Functions support |
| **Security** | Cloudflare Turnstile | — | Bot protection for contact form |

---

## Page Routing & i18n Flow

### URL Structure

```
/                    → English landing page (root, no redirect)
/en/                 → English landing page (explicit)
/es/                 → Spanish landing page
/en/blog/            → English blog index
/es/blog/            → Spanish blog index
/en/blog/[slug]/     → English blog post
/es/blog/[slug]/     → Spanish blog post
/en/[city]/          → English city page (san-juan, dorado, etc.)
/es/[city]/          → Spanish city page
/api/send            → Contact form API (POST)
```

### Language Resolution Flow

```
1. URL: /es/blog/my-post/
2. Astro extracts [lang] param → 'es'
3. getLangFromUrl(Astro.url) → 'es'
4. t('es', 'key') → returns Spanish string from ui.ts
5. For React islands: pickTranslations('es', keys) → serialized as props
```

### Why Translations as Props?

If React islands imported `ui.ts` directly, the entire 600+ line translation file
would be bundled in client JavaScript. Instead:

1. Astro resolves translations at build time (free — it's just a JS object lookup)
2. Only the 5-15 strings each component needs are serialized into the HTML as props
3. React hydrates with the pre-resolved strings — zero dictionary in the client bundle

This is implemented via `pickTranslations()` in `src/i18n/translations.ts`.

---

## Component Architecture

### The Astro Wrapper Pattern

Every major section uses a two-layer approach:

```
┌─────────────────────────────────────────────────┐
│  sections/Services.astro  (SERVER)              │
│  ─ Resolves i18n translations at build time     │
│  ─ Provides section HTML wrapper + id           │
│  ─ Handles SSR-only concerns (SEO, a11y)        │
│  ─ Passes data as props to React                │
│                                                 │
│   ┌───────────────────────────────────────────┐ │
│   │  ServicesComponent.tsx  (CLIENT)          │ │
│   │  ─ Framer Motion animations              │ │
│   │  ─ Hover effects, scroll triggers         │ │
│   │  ─ Interactive UX (modals, toggles)       │ │
│   │  ─ Hydrates via client:visible            │ │
│   └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Component Hierarchy

```
main.astro (HTML shell)
  └── [lang]/index.astro (page)
        ├── Navigation.tsx          client:idle
        ├── Hero.astro (SSR visual shell — LCP renders without JS)
        │     ├── #hero-ssr (title bar, headline, CTA card — static HTML)
        │     ├── HeroContent.tsx   client:idle (overlays SSR on mount)
        │     ├── StatusBar.tsx     client:idle
        │     ├── ContactModal.tsx  client:only="react"
        │     └── ProjectModal.tsx  client:only="react"
        ├── TrustedBy.tsx           client:visible
        ├── sections/Portfolio.astro
        │     └── Portfolio.tsx     client:visible
        ├── sections/Services.astro
        │     └── ServicesComponent.tsx  client:visible
        │           └── ServiceCard.tsx
        ├── sections/Reviews.astro
        │     └── Reviews.tsx       client:visible
        ├── CinematicTeaser.tsx     client:visible
        ├── sections/Process.astro
        │     └── Process.tsx       client:visible
        ├── Pricing.tsx             client:visible
        ├── sections/Blog.astro     (server only — no React)
        ├── sections/FAQ.astro
        │     └── FAQ.tsx           client:visible
        └── sections/CTA.astro
        │     └── CTA.tsx           client:visible
        ├── ConsentBanner.tsx       client:only="react"
        └── OnboardingHints.tsx     client:only="react"
```

### Navigation Architecture

**Desktop (≥1024px):**
- Fixed left edge → collapsed arrow tab (`w-8 h-20`)
- Click opens Finder-style sidebar with traffic light dots
- Mouse leave collapses with 300ms debounce delay
- Opening the sidebar permanently dismisses the Hero hint arrow (via `sidebarHintStore`)

**Mobile (<1024px):**
- Fixed top header bar (LYRIX OS branding + hamburger)
- Hamburger toggles a slide-down menu overlay
- Menu items use full page navigation for external links (Blog)

---

## State Management In Depth

### nanostores Pattern

```typescript
// 1. Define an atom (single value) or map (object)
import { atom } from 'nanostores';
export const $myState = atom<boolean>(false);

// 2. Read in React with useStore hook
import { useStore } from '@nanostores/react';
const value = useStore($myState);

// 3. Write from anywhere (React, Astro, vanilla JS)
$myState.set(true);
```

### Store Inventory

**modalStore.ts** — Controls the contact form modal:
- `$contactModalOpen` — visibility toggle
- `$contactSubject` — pre-filled subject line
- `$contactPreset` — which pricing tier triggered the modal
- `$lang` — global language (set by page, read by all islands)
- `openContactModal(preset?)` — opens with optional context
- `closeContactModal()` — closes and resets state

**windowStore.ts** — OS-style window management:
- `$windows` — map of WindowId → WindowState (OPEN/COLLAPSED/DOCKED)
- `WINDOW_REGISTRY` — maps window IDs to section DOM IDs for scroll targeting
- `closeWindow()`, `minimizeWindow()`, `openWindow()` — state transitions

**sidebarHintStore.ts** — Sidebar discovery hint:
- `$sidebarOpened` — has the user ever opened the sidebar?
- `hydrateSidebarHint()` — reads localStorage after mount (hydration-safe)
- `markSidebarOpened()` — persists to localStorage, dismisses hint forever

### Hydration Safety Rule

**NEVER** read `localStorage` or `window` at module scope in stores. This breaks
React SSR hydration because the server renders with default values while the
client would get different values from storage.

**Correct pattern:**
```typescript
// Store: always initialize with server-safe default
export const $myState = atom(false);

// Component: hydrate in useEffect (client-only)
useEffect(() => {
  const saved = localStorage.getItem('key');
  if (saved) $myState.set(true);
}, []);
```

---

## Hydration Strategy

| Directive | When JS Loads | Used For |
|-----------|---------------|----------|
| `client:idle` | After page idle (requestIdleCallback) | Navigation, HeroContent, StatusBar |
| `client:visible` | When entering viewport (IntersectionObserver) | Below-fold sections, Pricing, CinematicTeaser |
| `client:only="react"` | Client-side only (no SSR) | ContactModal, ProjectModal, ConsentBanner, OnboardingHints |
| (none) | Never — server HTML only | Blog.astro, pure Astro components |

**Rule of thumb:**
- Above the fold → `client:idle` (load soon, but don't block LCP)
- Below the fold → `client:visible` (lazy load, saves bandwidth)
- Static content → no directive (zero JS shipped)

---

## SEO & Structured Data

### SEO.astro Component

Accepts props and generates all SEO markup. Used in `main.astro` layout, inherited by every page.

**What it generates:**
1. `<meta>` tags (charset, viewport, description, keywords, robots)
2. `<link rel="canonical">` + hreflang alternates (en ↔ es + x-default)
3. Open Graph tags (og:title, og:description, og:image, og:locale)
4. Twitter/X Card tags
5. JSON-LD `@graph` with:
   - Organization (always)
   - WebSite (always)
   - WebPage or Article (per page type)
   - ProfessionalService + LocalBusiness (homepage)
   - FAQ (homepage)
   - BreadcrumbList (all pages)
   - AggregateRating + Reviews (homepage)

### City Pages SEO

Each city page (`/en/san-juan/`, `/es/dorado/`) targets local search queries.
City data in `src/data/cities.ts` provides:
- City name, address info
- Service-specific keywords
- Geo coordinates for LocalBusiness schema

---

## Contact Form Pipeline

```
┌──────────┐    ┌───────────┐    ┌──────────┐    ┌────────┐
│  User    │───→│  Zod      │───→│ Turnstile│───→│ Resend │
│  fills   │    │  validates │    │ verifies │    │ sends  │
│  form    │    │  fields    │    │ bot check│    │ email  │
└──────────┘    └───────────┘    └──────────┘    └────────┘
     ↑                                                │
     └────────────── success/error response ──────────┘
```

**Flow:**
1. `ContactModal.tsx` — React form with sector, budget, maintenance mode, cinematic addon
2. Client-side Zod validation → shows inline field errors
3. POST to `/api/send` with form data + Turnstile token
4. `send.ts` → server-side Zod re-validation + Turnstile secret verification
5. `emailTemplate.ts` → generates branded HTML email
6. Resend API sends to `lyrixdigitals@gmail.com`
7. Response returned to modal → success animation or error message

---

## Blog System Details

### Content Collection Schema

```typescript
// src/content/config.ts
z.object({
  title: z.string(),        // Post headline
  description: z.string(),  // SEO description + card excerpt
  date: z.date(),           // Publication date (YYYY-MM-DD in frontmatter)
  author: z.string(),       // Author name (defaults to 'Lyrix Digital')
  lang: z.enum(['en','es']),// Language — MUST match for correct filtering
  tags: z.array(z.string()),// Tags for filtering + card badges
  image: z.string().optional(), // Hero image (not yet used)
  draft: z.boolean(),       // true = excluded from build
})
```

### Post Lifecycle

1. Create `.md` file in `src/content/blog/` with valid frontmatter
2. Astro validates against schema at build time (errors = build failure)
3. Blog index queries `getCollection('blog')`, filters by `lang` + `!draft`
4. Landing page `Blog.astro` shows latest 3 posts
5. Individual post rendered by `[slug].astro` → `blog-post.astro` layout
6. Typography styled by `.prose-lyrix` class in `global.css`

### How Posts Are Routed

```
src/content/blog/my-post-title.md  (lang: en)
  → /en/blog/my-post-title/

src/content/blog/mi-titulo.md  (lang: es)
  → /es/blog/mi-titulo/
```

The slug is derived from the **filename** (not the title).

---

## Styling Architecture

### Tailwind v4 CSS-First Config

Tailwind v4 uses **CSS-first configuration** instead of `tailwind.config.js`:

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-lyrix-dark: #050505;
  --color-lyrix-carbon: #111111;
  --color-lyrix-steel: #1a1a1a;
  /* ... */
}
```

These become usable as `bg-lyrix-dark`, `text-lyrix-steel`, etc.

### Custom CSS Classes

| Class | Purpose |
|-------|---------|
| `.prose-lyrix` | Blog typography (headings, links, code, lists) |
| `.animate-marquee` | Infinite horizontal scroll (TrustedBy logos) |
| `.animate-pulse-perf` | Compositor-optimized pulse (opacity + transform only) |
| `.sr-only` | Screen-reader only text |

### Font Loading Strategy

1. `astro-font` generates `@font-face` declarations with `font-display: swap`
2. Size-adjust fallback metrics prevent CLS
3. LCP-critical font (Oswald 700) is `<link rel="preload">` in `<head>` with `fetchpriority="high"`
4. Inter loaded via `astro-font` with `font-display: swap`

---

## Performance Budget

Target: **Lighthouse 90+ mobile / 100 desktop**

| Metric | Target | How |
|--------|--------|-----|
| LCP | < 2.0s | SSR hero shell paints headline at FCP — no JS required |
| FID/INP | < 100ms | Deferred hydration, compositor-only animations |
| CLS | 0 | Explicit `min-height` reservations, `font-display: swap` |
| TBT | < 150ms | GA4 deferred 3s, modals client:only, Framer Motion removed from hero |

---

## File-by-File Reference

### Pages

| File | Route | Purpose |
|------|-------|---------|
| `pages/index.astro` | `/` | Root English page (no redirect) |
| `pages/[lang]/index.astro` | `/en/`, `/es/` | i18n landing pages |
| `pages/[lang]/[city].astro` | `/en/san-juan/` etc. | City-specific SEO pages |
| `pages/[lang]/blog/index.astro` | `/en/blog/` | Blog listing |
| `pages/[lang]/blog/[slug].astro` | `/en/blog/my-post/` | Blog post |
| `pages/api/send.ts` | `/api/send` | Contact form endpoint |

### Components (React Islands)

| File | Hydration | Section |
|------|-----------|---------|
| `HeroContent.tsx` | `client:idle` | Hero with per-char hover, CSS particle trail |
| `Navigation.tsx` | `client:idle` | Desktop sidebar + mobile header |
| `StatusBar.tsx` | `client:idle` | macOS dock with window state |
| `ContactModal.tsx` | `client:only="react"` | Form modal + Turnstile |
| `ProjectModal.tsx` | `client:only="react"` | Portfolio detail modal |
| `ConsentBanner.tsx` | `client:only="react"` | Cookie/analytics consent popup |
| `OnboardingHints.tsx` | `client:only="react"` | First-visit sidebar hints |
| `Portfolio.tsx` | `client:visible` | Project cards grid |
| `ServicesComponent.tsx` | `client:visible` | Service cards with animations |
| `Reviews.tsx` | `client:visible` | Testimonial carousel |
| `Process.tsx` | `client:visible` | Process timeline |
| `FAQ.tsx` | `client:visible` | Accordion FAQ |
| `CTA.tsx` | `client:visible` | Call-to-action form |
| `Pricing.tsx` | `client:visible` | 3-tier pricing cards |
| `TrustedBy.tsx` | `client:visible` | Client logos marquee |
| `CinematicTeaser.tsx` | `client:visible` | Video/media teaser |

### Components (Server-Only Astro)

| File | Purpose |
|------|---------|
| `Hero.astro` | Hero SSR shell (full visual + React overlay pattern) |
| `SEO.astro` | Full SEO engine |
| `sections/Blog.astro` | Blog preview (latest 3 posts) |
| `sections/Services.astro` | Services wrapper |
| `sections/Portfolio.astro` | Portfolio wrapper |
| `sections/Reviews.astro` | Reviews wrapper |
| `sections/Process.astro` | Process wrapper |
| `sections/FAQ.astro` | FAQ wrapper |
| `sections/CTA.astro` | CTA wrapper |

### Stores

| File | Atoms | Purpose |
|------|-------|---------|
| `modalStore.ts` | `$contactModalOpen`, `$contactPreset`, `$contactSubject`, `$lang` | Modal & form state |
| `windowStore.ts` | `$windows` | OS window state (OPEN/COLLAPSED/DOCKED) |
| `sidebarHintStore.ts` | `$sidebarOpened` | Sidebar discovery + localStorage |

### Data

| File | Exports | Purpose |
|------|---------|---------|
| `data/projects.ts` | `PROJECTS` array | Portfolio definitions |
| `data/cities.ts` | `CITIES` array | City page data |

### Config

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro setup (output, i18n, adapters, Vite plugins) |
| `wrangler.jsonc` | Cloudflare deployment config |
| `tsconfig.json` | TypeScript configuration |
| `vitest.config.ts` | Test runner configuration |
