# LYRIX DIGITAL — Premium Web Design Agency (Puerto Rico)

> **Dark Industrial Luxury** web platform built with Astro 5, React,
> Tailwind CSS v4, and Framer Motion. Deployed on Cloudflare Pages.

![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare_Pages-Deployed-F38020?logo=cloudflare&logoColor=white)

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Design System](#design-system)
5. [How To: Common Changes](#how-to-common-changes)
6. [Internationalization (i18n)](#internationalization-i18n)
7. [Blog System](#blog-system)
8. [Content Collections](#content-collections)
9. [State Management](#state-management)
10. [Contact Form & Email](#contact-form--email)
11. [SEO Engine](#seo-engine)
12. [Performance Optimizations](#performance-optimizations)
13. [Deployment](#deployment)
14. [Testing](#testing)
15. [Environment Variables](#environment-variables)

---

## Quick Start

```bash
# Install dependencies (pnpm required)
pnpm install

# Start dev server → http://localhost:4321
pnpm dev

# Production build
pnpm build

# Preview production build locally
pnpm preview

# Run tests
pnpm test
```

**Requirements:** Node.js 18+, pnpm 8+

---

## Project Structure

```
lyrixdigital/
├── astro.config.mjs          # Astro configuration (output, i18n, adapters)
├── wrangler.jsonc             # Cloudflare Workers/Pages config
├── tsconfig.json              # TypeScript strict mode
├── vitest.config.ts           # Vitest test runner config
├── package.json               # Dependencies & scripts
│
├── public/                    # Static assets (robots.txt, _headers)
│
└── src/
    ├── assets/                # Images processed by astro:assets
    ├── components/            # All UI components (React + Astro)
    │   ├── sections/          # ─ Astro wrapper components (SSR sections)
    │   │   ├── Blog.astro     #   Blog preview section (latest 3 posts)
    │   │   ├── CTA.astro      #   Call-to-action section
    │   │   ├── FAQ.astro      #   FAQ / Knowledge Base section
    │   │   ├── Portfolio.astro #   Portfolio projects grid
    │   │   ├── Process.astro  #   Process timeline section
    │   │   ├── Reviews.astro  #   Client testimonials section
    │   │   └── Services.astro #   Services / capabilities section
    │   │
    │   ├── Hero.astro         # Hero SSR shell (LCP-optimized, full visual)
    │   ├── HeroContent.tsx    # Hero React island (hover effects, particles)
    │   ├── Navigation.tsx     # Desktop sidebar + mobile header
    │   ├── ContactModal.tsx   # Lead capture modal with Turnstile
    │   ├── ProjectModal.tsx   # Portfolio project detail modal
    │   ├── Pricing.tsx        # 3-tier pricing cards ($800+/$3K+/$7K+)
    │   ├── StatusBar.tsx      # macOS-style dock bar
    │   ├── CinematicTeaser.tsx # Video teaser (Vimeo-ready)
    │   ├── ConsentBanner.tsx  # Cookie/analytics consent popup
    │   ├── TrustedBy.tsx      # Client logos marquee
    │   ├── SEO.astro          # Full SEO engine (meta, OG, JSON-LD)
    │   └── ...                # Additional components
    │
    ├── content/               # Astro Content Collections
    │   ├── config.ts          # Blog collection schema (Zod)
    │   └── blog/              # Markdown blog posts
    │       ├── why-contractors-need-websites.md   (EN)
    │       ├── por-que-contratistas-necesitan-web.md (ES)
    │       └── ...
    │
    ├── data/                  # Static data files
    │   ├── projects.ts        # Portfolio project definitions
    │   └── cities.ts          # Service area city data (for city pages)
    │
    ├── i18n/                  # Internationalization
    │   ├── ui.ts              # Translation dictionaries (EN + ES)
    │   ├── utils.ts           # t(), getLangFromUrl(), useTranslations()
    │   └── translations.ts    # Type-safe translation key picker
    │
    ├── layouts/               # Page layouts
    │   ├── main.astro         # Root HTML layout (fonts, SEO, critical CSS)
    │   └── blog-post.astro    # Blog post layout (article styling)
    │
    ├── lib/                   # Server utilities
    │   └── emailTemplate.ts   # HTML email template for form submissions
    │
    ├── pages/                 # File-based routing
    │   ├── index.astro        # Root / → English landing page
    │   ├── [lang]/            # i18n routes (/en/, /es/)
    │   │   ├── index.astro    # Landing page (per language)
    │   │   ├── [city].astro   # City-specific SEO pages
    │   │   └── blog/
    │   │       ├── index.astro  # Blog listing page
    │   │       └── [slug].astro # Individual blog post page
    │   └── api/
    │       └── send.ts        # Contact form API endpoint (Resend)
    │
    ├── schemas/               # Validation schemas
    │   └── contact.ts         # Zod schema for contact form
    │
    ├── stores/                # Global state (nanostores)
    │   ├── modalStore.ts      # Contact modal state + presets
    │   ├── windowStore.ts     # OS-style window state management
    │   └── sidebarHintStore.ts # Sidebar hint arrow persistence
    │
    └── styles/
        └── global.css         # Tailwind v4 theme + custom styles
```

---

## Architecture Overview

### Rendering Strategy

The site uses **Astro's static rendering**:

- **Static output** (`output: 'static'`) — All pages are pre-rendered at build time
- **React Islands** — Interactive components hydrate client-side with `client:idle`, `client:visible`, or `client:only="react"`
- **Cloudflare Pages adapter** — Handles deployment, the API route runs as a Cloudflare Function
- **SSR Hero Pattern** — Full hero visual (headline + CTA card) rendered as static HTML for instant LCP; React island overlays with interactivity on idle

### Component Pattern

Every section follows the **Astro Wrapper → React Island** pattern:

```
sections/Portfolio.astro      ← SSR: resolves translations, provides section ID
  └── Portfolio.tsx           ← React island: animations, interactivity
        └── FolderCard.tsx    ← Sub-component: individual project card
```

**Why?** Astro renders the HTML at build time (great for SEO + performance). React only loads for sections that need interactivity (animations, modals, hover effects). This keeps the initial JS payload minimal.

### State Flow

```
nanostores ($atom / $map)
       ↓
  ┌────────────┬──────────────┬────────────────┐
  │ modalStore │ windowStore  │ sidebarHintStore│
  │            │              │  + localStorage │
  └─────┬──────┴──────┬───────┴───────┬─────────┘
        ↓             ↓               ↓
  ContactModal   StatusBar      HeroContent
  ProjectModal   WindowFrame    Navigation
```

---

## Design System

### Colors

| Token              | Hex       | Usage                          |
|--------------------|-----------|--------------------------------|
| `lyrix-dark`       | `#050505` | Page background                |
| `lyrix-carbon`     | `#111111` | Card backgrounds               |
| `lyrix-steel`      | `#1a1a1a` | Elevated surfaces              |
| Accent (Neon Lime) | `#CCFF00` | CTAs, highlights, active states|
| Accent (Gold)      | `#FFD700` | Secondary accents (pricing)    |

### Typography

| Role     | Font              | Weights    | CSS Variable      |
|----------|-------------------|------------|--------------------|
| Headings | Oswald            | 700        | `--font-oswald`    |
| Body     | Inter             | 400–700    | `--font-inter`     |

### Component Design Language

- **macOS-inspired**: Traffic light dots (red/yellow/green), window chrome, title bars
- **Terminal aesthetic**: Monospace fonts, uppercase labels, system-style naming
- **Glassmorphism**: `backdrop-blur-xl`, semi-transparent backgrounds (`bg-white/5`)

---

## How To: Common Changes

### Change text / translations

All user-facing text lives in **`src/i18n/ui.ts`**. It has two sections: `es` (Spanish first) and `en` (English).

```typescript
// src/i18n/ui.ts
export const ui = {
  es: {
    'hero.headline': 'DISEÑO WEB PREMIUM EN PUERTO RICO.',
    // ... all Spanish strings
  },
  en: {
    'hero.headline': 'PREMIUM WEB DESIGN IN PUERTO RICO.',
    // ... all English strings
  },
};
```

**To change any text:**
1. Find the key in `ui.ts` (e.g., `'hero.headline'`)
2. Update the value in BOTH `es` and `en` sections
3. The change is reflected everywhere that key is used

### Add a new portfolio project

Edit **`src/data/projects.ts`**:

```typescript
{
  id: '004',
  title: 'New Project Name',
  category: 'web-design',
  description: 'Project description...',
  image: '/images/projects/new-project.webp',
  comingSoon: false,   // Set true if not ready
  // ...additional fields
}
```

Put the project image in `public/images/projects/`.

### Add a new blog post

1. Create a Markdown file in **`src/content/blog/`**
2. Use this frontmatter template:

```markdown
---
title: "Your Post Title"
description: "A brief summary for cards and SEO."
date: 2026-03-01
author: "Lyrix Digital"
lang: en
tags: ["seo", "web-design"]
---

## Your Content Here

Write in standard Markdown.
```

3. Create the Spanish version with `lang: es` and a different filename
4. Posts appear automatically on the blog page and the main page preview

### Add a new section to the landing page

1. Create an Astro wrapper in `src/components/sections/NewSection.astro`
2. Create a React component in `src/components/NewSection.tsx` (if interactive)
3. Import and add it in both:
   - `src/pages/index.astro`
   - `src/pages/[lang]/index.astro`
4. Add a nav item in `src/components/Navigation.tsx` → `NAV_ITEMS` array

### Change pricing

Edit **`src/components/Pricing.tsx`** — the `TIERS` array near the top contains all pricing data (name, price, features list). Also update the corresponding i18n keys in `src/i18n/ui.ts`.

### Change the contact form fields

- **Schema validation:** `src/schemas/contact.ts` (Zod)
- **Form UI:** `src/components/ContactModal.tsx`
- **Email template:** `src/lib/emailTemplate.ts`
- **API endpoint:** `src/pages/api/send.ts`

### Change SEO / structured data

Edit **`src/components/SEO.astro`**. It generates:
- Canonical URLs + hreflang alternates
- Open Graph + Twitter Card meta
- JSON-LD: Organization, WebSite, WebPage, ProfessionalService, Article, FAQ, BreadcrumbList

### Add a new city page

1. Add the city to **`src/data/cities.ts`**
2. The dynamic route at `src/pages/[lang]/[city].astro` auto-generates pages

### Change colors / fonts

- **Colors:** `src/styles/global.css` → `@theme` block
- **Fonts:** `src/layouts/main.astro` → `<AstroFont>` config

---

## Internationalization (i18n)

| File | Purpose |
|------|---------|
| `src/i18n/ui.ts` | All translation strings (ES + EN) |
| `src/i18n/utils.ts` | `t()` lookup, `getLangFromUrl()`, `useTranslations()` |
| `src/i18n/translations.ts` | Type-safe key picker for React props |

**How it works:**
- Astro pages resolve the language from the URL (`/en/` or `/es/`)
- SSR components call `t(lang, 'key')` directly
- React islands receive translations as **props** (avoids bundling the full dictionary in client JS)
- The `pickTranslations()` function extracts only the needed keys for each component

**Adding a new language:**
1. Add the locale to `astro.config.mjs` → `i18n.locales`
2. Add a new section in `ui.ts` (copy `en` block, translate all values)
3. Add the locale to `getStaticPaths()` in each page

---

## Blog System

Built on **Astro Content Collections** with Markdown.

| File | Purpose |
|------|---------|
| `src/content/config.ts` | Zod schema for blog frontmatter |
| `src/content/blog/*.md` | Blog post files (one per language) |
| `src/pages/[lang]/blog/index.astro` | Blog listing page |
| `src/pages/[lang]/blog/[slug].astro` | Individual post page |
| `src/layouts/blog-post.astro` | Post layout (typography, meta) |
| `src/components/sections/Blog.astro` | Landing page preview (latest 3) |

**Post naming convention:** Use English slug for EN posts, Spanish slug for ES posts.

**Blog typography** is handled by the `.prose-lyrix` class in `global.css`.

---

## Content Collections

Defined in `src/content/config.ts`:

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string().default('Lyrix Digital'),
    lang: z.enum(['en', 'es']),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),  // true = hidden from production
  }),
});
```

---

## State Management

Uses **nanostores** (tiny reactive atoms shared across React islands):

| Store | File | Purpose |
|-------|------|---------|
| `$contactModalOpen` | `stores/modalStore.ts` | Controls contact modal visibility |
| `$contactPreset` | `stores/modalStore.ts` | Pre-fills form based on pricing tier |
| `$lang` | `stores/modalStore.ts` | Global language state |
| `$windows` | `stores/windowStore.ts` | OS-style window open/collapsed/docked |
| `$sidebarOpened` | `stores/sidebarHintStore.ts` | Tracks if sidebar was ever opened |

**Why nanostores?** Each React island is an independent React tree. nanostores lets them share state without a common parent. The `@nanostores/react` package provides `useStore()` hook.

---

## Contact Form & Email

1. User fills out `ContactModal.tsx` → validated by `schemas/contact.ts` (Zod)
2. Form submits to `/api/send` → `pages/api/send.ts`
3. Server validates with Zod, verifies Cloudflare Turnstile token
4. Sends email via **Resend** API using HTML template from `lib/emailTemplate.ts`
5. Success/error state returned to modal

---

## SEO Engine

The **`SEO.astro`** component handles everything:

- `<meta>` tags (title, description, keywords, robots)
- Canonical URL with hreflang alternates (en ↔ es)
- Open Graph tags (title, description, image, locale)
- Twitter/X Card tags
- JSON-LD structured data using Google's `@graph` pattern:
  - `Organization` (brand, logo, areas served)
  - `WebSite` (sitelinks search)
  - `WebPage` or `Article` (per-page)
  - `ProfessionalService` + `LocalBusiness` (homepage)
  - `AggregateRating` + individual `Review` items
  - `FAQ` schema (homepage)
  - `BreadcrumbList`

---

## Performance Optimizations

| Optimization | Implementation |
|---|---|
| **Zero JS by default** | Astro static output — JS only loads for interactive islands |
| **SSR Hero Shell** | Full headline + CTA card rendered as static HTML for instant LCP — React overlays on idle |
| **Font preloading** | LCP-critical Oswald 700 preloaded in `<head>` with `fetchpriority="high"` |
| **Critical CSS** | CLS-prevention styles inlined in `<head>` |
| **CSS containment** | `contain: layout style paint` on Hero section |
| **Deferred GA4** | Analytics loaded 3s post-idle via `requestIdleCallback` — zero Lighthouse impact |
| **client:only modals** | ContactModal + ProjectModal skip SSR entirely, breaking render chain |
| **Hero CSS animations** | Framer Motion removed from hero — CSS `@keyframes` for particles + hover |
| **Inline stylesheets** | `build.inlineStylesheets: 'always'` |
| **Compositor animations** | `will-change: opacity, transform` for pulse effects |
| **Image optimization** | Art-directed `<picture>` + lazy loading |
| **Minimal hydration** | `client:idle` for above-fold, `client:visible` for below-fold |

---

## Deployment

### Cloudflare Pages

The site deploys to **Cloudflare Pages** via `@astrojs/cloudflare` adapter.

```bash
# Build for production
pnpm build

# Deploy (Cloudflare Wrangler)
npx wrangler pages deploy dist/
```

**Wrangler config:** `wrangler.jsonc` — defines bindings, KV namespaces, compatibility flags.

### Environment Variables

Set these in Cloudflare Pages dashboard (or `.env` locally):

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend email API key |
| `PUBLIC_CF_BEACON_TOKEN` | Cloudflare Web Analytics beacon token |
| `PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile (client-side) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile (server-side) |

---

## Testing

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run
```

Uses **Vitest** with `@testing-library/react` for component tests. Config in `vitest.config.ts`.

---

## License

Private — Lyrix Digital © 2026. All rights reserved.
