# LYRIX DIGITAL — Business & Operations Roadmap

> Everything you need to know to launch, operate, and grow Lyrix Digital as a real business in Puerto Rico.
> From building the website to closing deals to legal compliance — this is the full blueprint.

---

## Table of Contents

1. [What This Website Has (Full Inventory)](#1-what-this-website-has-full-inventory)
2. [How to Build This Website From Scratch](#2-how-to-build-this-website-from-scratch)
3. [The Sales Process (Lead → Close)](#3-the-sales-process-lead--close)
4. [How to Price Your Services](#4-how-to-price-your-services)
5. [Post-Sale: Project Delivery Workflow](#5-post-sale-project-delivery-workflow)
6. [Legal Requirements for Puerto Rico](#6-legal-requirements-for-puerto-rico)
7. [Financial & Tax Strategy](#7-financial--tax-strategy)
8. [Tools & Subscriptions You Need](#8-tools--subscriptions-you-need)
9. [Growth Playbook](#9-growth-playbook)
10. [Things I Want You to Know](#10-things-i-want-you-to-know)

---

## 1. What This Website Has (Full Inventory)

### 1.1 — Tech Stack

| Layer | Technology | What It Does |
|-------|-----------|--------------|
| Framework | **Astro 5** | Static site generation — pre-renders every page to pure HTML at build time. Zero JavaScript shipped by default. |
| UI Islands | **React 19** | Only used for interactive components (forms, animations, modals). Hydrates on-demand, not upfront. |
| Styling | **Tailwind CSS v4** | CSS-first configuration, utility classes, mobile-first responsive design. |
| Animations | **Framer Motion 12** | Physics-based scroll animations, entrance effects, hover states. |
| Icons | **lucide-react** | Consistent SVG icon set across all components. |
| State Management | **nanostores** | Lightweight reactive stores shared across React islands (modal state, window state, sidebar hint). |
| Email Service | **Resend** | Transactional email API — sends branded lead notification to your inbox when someone fills the form. |
| Form Validation | **Zod 4** | Schema validation that runs on BOTH client (instant feedback) and server (security enforcement). |
| Bot Protection | **Cloudflare Turnstile** | Invisible CAPTCHA — blocks bots without making humans solve puzzles. |
| Hosting | **Cloudflare Pages** | Edge deployment — your site is served from the CDN node closest to the visitor. Free tier covers most needs. |
| Analytics | **Google Tag Manager** via **Partytown** | GTM runs in a web worker (off-main-thread) so it doesn't slow down the site. |
| Fonts | **astro-font** | Optimized loading with `font-display: swap`, size-adjust fallback metrics (prevents layout shift). |

### 1.2 — Website Sections (Top to Bottom)

| # | Section | Component | What It Does |
|---|---------|-----------|--------------|
| 1 | **Skip to Content** | `main.astro` | Accessibility link — hidden until focused. Required for WCAG compliance. |
| 2 | **Navigation** | `Navigation.tsx` | Desktop: Finder-style sidebar (collapsed arrow → expands on click). Mobile: hamburger overlay. |
| 3 | **Hero** | `Hero.astro` + `HeroContent.tsx` + `SpotlightHero.tsx` | Massive headline with mouse-tracking spotlight gradient. No images — text IS the visual. Per-character hover animation on headline. |
| 4 | **Status Bar** | `StatusBar.tsx` | macOS-style dock at bottom of hero. Shows contact info, call button, language toggle. |
| 5 | **Trusted By** | `TrustedBy.tsx` | Infinite-scroll marquee of client monogram logos. Social proof. |
| 6 | **Portfolio** | `Portfolio.tsx` + `FolderCard.tsx` + `ProjectModal.tsx` | OS-style folder cards that expand into project detail modals with screenshots. |
| 7 | **Services** | `ServicesComponent.tsx` + `ServiceCard.tsx` | Three service modules (Web, Video, SEO) displayed as "system specs." Terminal-style UI. |
| 8 | **Reviews** | `Reviews.tsx` | Client testimonials as "telemetry signals" — auto-scrolling carousel with pause-on-touch. |
| 9 | **Cinematic Teaser** | `CinematicTeaser.tsx` | Placeholder for the upcoming commercial video. Shows "IN PRODUCTION" status. |
| 10 | **Process** | `Process.tsx` | 3-phase timeline (Discovery → Development → Launch). Shows 2-4 week timeline. |
| 11 | **Pricing** | `Pricing.tsx` | 3-tier pricing cards ($1K+ / $3K+ / $7K+). Middle tier highlighted as "Most Popular." |
| 12 | **Blog** | `Blog.astro` | Latest 3 articles from the content collection. Server-rendered (zero JS). |
| 13 | **FAQ** | `FAQ.tsx` | 8-question accordion. Handles objections: ownership, pricing, WordPress vs Astro, maintenance, etc. |
| 14 | **CTA** | `CTA.tsx` + `SystemExecution.tsx` | Terminal-style final call-to-action with trust signals (no contracts, source code included, 90-day support). |
| 15 | **Footer** | `Footer.astro` | 4-column footer: brand info, navigation, legal links, social links. Copyright + "Built with Astro" credit. |
| 16 | **Contact Modal** | `ContactModal.tsx` | Glassmorphic overlay form. Fields: name, email, phone, sector, maintenance mode, budget range, cinematic addon, message. Honeypot + Turnstile anti-spam. |

### 1.3 — SEO Infrastructure

| Feature | Implementation |
|---------|---------------|
| **Bilingual (EN/ES)** | `/` serves English, `/es/` serves Spanish. Full i18n translation system (600+ strings). |
| **Hreflang Tags** | Every page links to its counterpart in the other language + `x-default`. Generated by `SEO.astro`. |
| **JSON-LD Schema** | Organization, WebSite, WebPage, ProfessionalService, LocalBusiness, FAQ, AggregateRating, BreadcrumbList, VideoObject — all structured data Google expects. |
| **City Pages** | Dynamic pages for each PR city (San Juan, Dorado, Bayamón, Caguas, etc.) targeting local "near me" searches. |
| **Sitemap** | Auto-generated with priorities and change frequencies. Excludes 404. |
| **robots.txt** | Allows all crawlers, points to sitemap. |
| **Canonical URLs** | Every page has a canonical tag to prevent duplicate content. |
| **Open Graph / Twitter Cards** | Full social preview metadata for every page. |
| **Google PageSpeed** | Target 95-100 across all four categories (Performance, Accessibility, Best Practices, SEO). |

### 1.4 — Security

| Layer | What It Does |
|-------|--------------|
| **Zod Validation** | Validates every form field on client AND server. Rejects malformed data before it reaches the email system. |
| **Honeypot Field** | Hidden input that bots auto-fill. If it has content → silently accept (fake success) so the bot thinks it worked. |
| **Cloudflare Turnstile** | Server-side token verification. Blocks automated submissions. |
| **HTML Escaping** | All user input is HTML-escaped in the email template to prevent XSS injection. |
| **No Database** | Static site = no database. No SQL injection possible. No admin panel to hack. |
| **HTTPS/SSL** | Cloudflare provides automatic SSL certificates. |
| **Security Headers** | `_headers` file sets `X-Content-Type-Options: nosniff`, HSTS, frame options. |

### 1.5 — Analytics & Tracking

| Event | Trigger | Data Captured |
|-------|---------|---------------|
| `cta_click` | Any CTA button click | Source (hero, pricing, statusbar, cta_section, spotlight_hero) |
| `modal_open` | Contact modal opens | Source |
| `modal_close` | Contact modal closes | — |
| `generate_lead` | Form submitted successfully | Sector, budget, cinematic addon, language |
| `contact_call` | Phone number clicked | — |
| `contact_email` | Email link clicked | — |
| `social_click` | Social media link clicked | Platform |

---

## 2. How to Build This Website From Scratch

### 2.1 — Prerequisites (What You Need to Know)

| Skill | Level Needed | Why |
|-------|-------------|-----|
| **HTML/CSS** | Intermediate | Tailwind is utility CSS — you write classes, not stylesheets. |
| **JavaScript/TypeScript** | Intermediate | React components, Astro data flow, API routes. |
| **React** | Intermediate | Only for interactive islands (forms, animations). Not a full React app. |
| **Git** | Basic | Version control, deployment pipeline. |
| **Terminal/CLI** | Basic | `pnpm install`, `pnpm dev`, `pnpm build`, deployment commands. |
| **Figma (optional)** | Basic | For wireframing before you code. Not strictly required. |

### 2.2 — Development Environment Setup

```bash
# 1. Install Node.js (v18+ required)
# Download from https://nodejs.org or use nvm

# 2. Install pnpm (fast package manager)
npm install -g pnpm

# 3. Clone the repository
git clone https://github.com/YOUR_USERNAME/lyrixdigital.git
cd lyrixdigital

# 4. Install dependencies
pnpm install

# 5. Copy environment variables
cp .env.example .env
# Fill in: RESEND_API_KEY, TURNSTILE_SECRET_KEY, PUBLIC_TURNSTILE_SITE_KEY

# 6. Start development server
pnpm dev
# Open http://localhost:4321

# 7. Build for production (to test before deploying)
pnpm build

# 8. Preview production build locally
pnpm preview
```

### 2.3 — Environment Variables You Need

| Variable | Where to Get It | What It Does |
|----------|----------------|--------------|
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) | Sends lead notification emails from the contact form. |
| `TURNSTILE_SECRET_KEY` | [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com) | Server-side bot verification. |
| `PUBLIC_TURNSTILE_SITE_KEY` | Same Cloudflare Turnstile page | Client-side widget key (safe to expose publicly). |

### 2.4 — Deployment to Cloudflare Pages

```bash
# Option 1: Git Integration (recommended — auto-deploys on push)
# 1. Push your repo to GitHub
# 2. Go to Cloudflare Pages → Create a project → Connect to Git
# 3. Build settings:
#    - Framework preset: Astro
#    - Build command: pnpm build
#    - Build output directory: dist
# 4. Add environment variables in Cloudflare Pages settings
# 5. Every push to main → auto-deploy

# Option 2: Manual deploy with Wrangler
npx wrangler pages deploy dist --project-name=lyrixdigital
```

### 2.5 — Domain & DNS Setup

1. Buy your domain (Cloudflare Registrar, Namecheap, Google Domains)
2. Point nameservers to Cloudflare (if not using Cloudflare Registrar)
3. In Cloudflare Pages → Custom Domains → add `lyrixdigital.com` and `www.lyrixdigital.com`
4. SSL certificate is automatic
5. Update `site` in `astro.config.mjs` to match your domain

### 2.6 — Email Setup for Resend

1. Create account at [resend.com](https://resend.com)
2. Verify your domain (`lyrixdigital.com`) — Resend gives you DNS records to add
3. Create an API key with "Sending" permission
4. Update the `from` address in `src/pages/api/send.ts` to match your verified domain
5. Update the `to` address to your business email

### 2.7 — Google Integrations

| Service | Setup Steps |
|---------|-------------|
| **Google Tag Manager** | Create GTM container → get `GTM-XXXXXXX` ID → add to Partytown config in `astro.config.mjs` |
| **Google Search Console** | Verify domain ownership → submit sitemap URL (`https://lyrixdigital.com/sitemap-index.xml`) |
| **Google Business Profile** | Create/claim your business → add website URL → upload photos → collect reviews |
| **Google Analytics 4** | Create property → connect via GTM → configure conversions for `generate_lead` event |
| **Bing Webmaster Tools** | Import from Google Search Console (one-click) or verify separately |

---

## 3. The Sales Process (Lead → Close)

### 3.1 — How Leads Arrive

```
┌─────────────────────────┐
│   LEAD SOURCES          │
├─────────────────────────┤
│ 1. Website form         │──→ Email notification → your inbox
│ 2. Phone call           │──→ Direct conversation
│ 3. Instagram DM         │──→ Redirect to website or call
│ 4. Google organic       │──→ They land on site → form or call
│ 5. Google Maps/GBP      │──→ Click-to-call or visit site
│ 6. WhatsApp referral    │──→ Someone shares your link
│ 7. Word of mouth        │──→ Direct call or site visit
└─────────────────────────┘
```

### 3.2 — When a Lead Fills the Form

**You receive an email with:**
- Full name
- Email
- Phone number
- Sector (Contractors, Creative, Personal, Business)
- Maintenance preference (Managed / Handover / Undecided)
- Budget range ($1K–$3K / $3K–$5K / $5K–$10K / $10K+)
- Whether they want cinematic video production
- Their project description message
- Language they were browsing in (EN or ES)

### 3.3 — Your Response Protocol (The First 24 Hours)

**Speed is EVERYTHING. The first agency to respond wins 78% of the time.**

```
WITHIN 1 HOUR (ideally):
  1. Read the lead email carefully
  2. Google their business name — understand what they do
  3. Check their current website (if they have one) on PageSpeed Insights
  4. Respond via email:

     Subject: "[Name], I reviewed [Business Name] — here's what I found"
     Body:
       - Reference something specific about THEIR business
       - 1-2 quick wins you noticed (slow site, no mobile optimization, no GBP)
       - Propose a 20-minute call
       - Give 2-3 time slots (within the next 48 hours)
       - Sign off professionally

WITHIN 24 HOURS:
  5. If no reply → follow up by phone (if they provided one)
  6. If no answer → send a WhatsApp message (common in PR)
  7. If still no response after 48 hours → one final email with a deadline
     ("I'll keep this slot open until Friday")
```

### 3.4 — The Discovery Call (20-30 minutes)

**Structure the call so YOU lead. Don't let them drive.**

```
MINUTE 0-5: RAPPORT
  - "Tell me about your business"
  - "How long have you been operating?"
  - "What areas in PR do you serve?"
  - Listen more than you talk

MINUTE 5-10: PAIN DIAGNOSIS
  - "Where do most of your clients come from right now?"
  - "What's your current website situation?"
  - "Are you spending money on Facebook/Google ads?"
  - "What's the #1 thing you'd change about your online presence?"

MINUTE 10-15: EDUCATION (Position yourself as the expert)
  - Share their PageSpeed score (if they have a site)
  - Show YOUR site's score (100/100/100/100)
  - Explain BRIEFLY why Astro beats WordPress for their case
  - DON'T get too technical — focus on OUTCOMES (leads, speed, ranking)

MINUTE 15-20: SCOPE & EXPECTATIONS
  - "Based on what you told me, here's what I'd recommend..."
  - Present 1-2 tier options (don't overwhelm with all 3)
  - Explain what's included in each
  - Give a rough price range (not exact — that comes in the proposal)
  - Set timeline expectations (2-4 weeks)

MINUTE 20-25: CLOSE OR NEXT STEP
  - "I'd like to put together a custom proposal for you. I'll send it
     within 48 hours. Sound good?"
  - Confirm their email for the proposal
  - Ask if there's a decision-maker who also needs to see it
  - Thank them for their time
```

### 3.5 — The Proposal (Send Within 48 Hours)

**What to include in your proposal document:**

```
1. EXECUTIVE SUMMARY
   - 2-3 sentences about their business and pain points (show you listened)
   - What you're proposing to build

2. SCOPE OF WORK
   - List every deliverable: pages, sections, features
   - What's included: design, development, content, SEO setup
   - What's NOT included (explicitly): copywriting if they want to provide it,
     ongoing ads management, etc.

3. TIMELINE
   - Phase 1: Discovery & wireframes (3-5 days)
   - Phase 2: Development (1-2 weeks)
   - Phase 3: Review & revisions (3-5 days)
   - Phase 4: Launch & handover (1-2 days)

4. INVESTMENT
   - Your total price
   - Payment structure: 50% upfront, 50% on launch
   - What the price covers

5. MAINTENANCE OPTIONS
   - Managed Mode: $X/month (updates, monitoring, content changes)
   - Handover Mode: One-time delivery, they manage it

6. TERMS
   - 2 revision rounds included
   - Additional revisions: $X/hour
   - Client owns 100% of source code
   - 90-day post-launch support included

7. NEXT STEPS
   - "Sign this proposal and send the 50% deposit to begin"
   - Include your payment method (Zelle, ATH Móvil, bank transfer, PayPal)
```

---

## 4. How to Price Your Services

### 4.1 — Pricing Philosophy

**DO NOT price by the hour.** Price by **value delivered**.

A contractor who gets 2 extra jobs per month worth $5K each from your website is making an extra $120K/year. Charging $3K–$7K for that is a no-brainer for them.

### 4.2 — Your Current Pricing Tiers

| Tier | Starting Price | Who It's For | Your Actual Cost (Time) |
|------|---------------|-------------|------------------------|
| **Landing Page** | $1,000+ | Small businesses that need one page fast | ~15-20 hours of work |
| **Authority System** | $3,000+ | Businesses that want full SEO + lead capture | ~40-60 hours of work |
| **Full Growth System** | $7,000+ | Businesses that want web + video + marketing | ~80-120 hours (inc. production) |

### 4.3 — How to Determine the Exact Price for a Project

**Step 1: Assess the scope**

| Factor | Low ($) | Medium ($$) | High ($$$) |
|--------|---------|-------------|------------|
| Number of pages | 1 | 3-5 | 6+ |
| Custom sections | Standard layout | Custom designs | Unique interactions |
| Content creation | Client provides | You write (basic) | Professional copywriting |
| Photography/Video | Client provides or stock | Basic shoot (half-day) | Full cinematic (1-2 days) |
| Blog system | No | Basic setup | Full content strategy |
| E-commerce | No | Simple (5-20 products) | Full store |
| Bilingual | No | Yes (EN + ES) | Yes + additional languages |
| Google Ads setup | No | Basic campaign | Multi-campaign strategy |
| Ongoing maintenance | No (handover) | Basic ($150-$300/mo) | Full ($500+/mo) |

**Step 2: Calculate your base**

```
Hourly rate target: $50-$100/hour (for Puerto Rico market)

Estimated hours × Rate = Base Price

Then multiply by 1.3-1.5 for:
  - Project management overhead
  - Communication time
  - Revision rounds
  - Unforeseen complexity
```

**Step 3: Value-based adjustment**

```
IF the client's business revenue is high (e.g., roofing company doing $500K+/year)
  → Price at the higher end. Your $5K website will pay for itself in 1-2 months.

IF the client is a small startup or personal brand
  → Price competitively. You need the portfolio piece and testimonial.

IF they need video production
  → Add $1,500-$5,000+ depending on:
    • Half-day shoot vs full-day
    • Drone footage (requires your FAA Part 107 license)
    • Number of deliverables (hero, social cuts, reels)
    • Editing complexity
```

### 4.4 — Payment Structure

| Milestone | Amount | When |
|-----------|--------|------|
| **Deposit** | 50% | On contract signing, before ANY work begins |
| **Final Payment** | 50% | On client approval, BEFORE you push the site live |

**NEVER launch a site before receiving final payment.** The site goes live the moment the last payment clears.

For projects over $5K, you can split into 3 payments:
- 40% deposit → start
- 30% after design approval → development
- 30% on launch → go live

### 4.5 — Recurring Revenue (Maintenance Plans)

This is where the real money is. One-time projects are sprints. Monthly maintenance is a marathon that compounds.

| Plan | Monthly Price | What You Do |
|------|-------------|-------------|
| **Basic** | $150-$250/mo | Uptime monitoring, security updates, 1 content change/month |
| **Standard** | $300-$500/mo | Everything in Basic + SEO reporting, 3-4 content changes, GBP updates |
| **Premium** | $500-$1,000+/mo | Everything in Standard + blog posts, social content, Google Ads management |

**Target: 10 clients on $300/mo maintenance = $3,000/mo recurring before you take a single new project.**

---

## 5. Post-Sale: Project Delivery Workflow

### 5.1 — Phase 0: Contract & Payment (Day 0)

```
□ Send proposal/contract (PDF or DocuSign)
□ Client signs
□ Receive 50% deposit
□ Send "welcome" email with:
  - What happens next
  - What you need from them (logo, photos, copy, brand colors, logins)
  - Timeline with specific dates
  - Your communication method (email, WhatsApp, phone)
□ Create project folder (local or cloud)
□ Create private GitHub repository for the project
```

### 5.2 — Phase 1: Discovery & Wireframes (Days 1-5)

```
□ Collect all client assets (logo, photos, copy, credentials)
□ Audit their current site (if any) — save PageSpeed report
□ Research their competitors (save screenshots)
□ Identify target keywords for their market
□ Create wireframes (Figma, pen-and-paper, or directly in code)
□ Present wireframes to client for approval
□ Get written approval before proceeding (email confirmation is fine)
```

### 5.3 — Phase 2: Development (Days 5-15)

```
□ Set up Astro project from your template/boilerplate
□ Configure domain, environment variables, Cloudflare
□ Build the layout and navigation
□ Build each section (hero, services, portfolio, etc.)
□ Implement contact form with their email
□ Set up SEO (meta tags, schema, sitemap, robots.txt)
□ Add analytics (GTM, GA4, GSC)
□ Set up Google Business Profile (if they don't have one)
□ Mobile optimization and cross-browser testing
□ Run Lighthouse audits — target 90+ on all four metrics
□ Set up staging URL for client review
□ Send preview link to client
```

### 5.4 — Phase 3: Review & Revisions (Days 15-22)

```
□ Client reviews staging site
□ Collect feedback (all at once — not piece by piece)
□ Implement revision round 1
□ Send updated preview
□ Client confirms final approval (or uses revision round 2)
□ Get WRITTEN approval: "This is approved for launch"
```

### 5.5 — Phase 4: Launch (Days 22-28)

```
□ Receive final 50% payment
□ Connect production domain
□ Deploy to Cloudflare Pages (production)
□ Verify SSL certificate is active
□ Submit sitemap to Google Search Console
□ Submit to Bing Webmaster Tools
□ Test all forms (submit a test lead)
□ Test all links (internal + external)
□ Run final Lighthouse audit
□ Send "launch" email to client with:
  - Live URL
  - What they own (GitHub repo access)
  - 90-day support details
  - Maintenance plan options
  - Login credentials for any services set up
```

### 5.6 — Phase 5: Post-Launch (Days 28-118)

```
WEEK 1-2 AFTER LAUNCH:
  □ Monitor for issues (broken links, form errors)
  □ Check Google Search Console for crawl issues
  □ Verify GBP is showing the website
  □ Check analytics are tracking correctly

90-DAY SUPPORT WINDOW:
  □ Fix any bugs that arise (your responsibility)
  □ Minor text changes (within reason)
  □ Answer client questions about their site
  □ NOT included: new features, new pages, redesigns

AFTER 90 DAYS:
  □ Offer maintenance plan
  □ If they decline → handover mode (give them all credentials)
  □ If they accept → set up recurring billing, start monthly check-ins
```

---

## 6. Legal Requirements for Puerto Rico

### 6.1 — Business Structure

**Recommended: LLC (Limited Liability Company) registered in Puerto Rico.**

| Option | Pros | Cons |
|--------|------|------|
| **Sole Proprietorship** | Easy, cheap, no filing fees | Personal liability (your personal assets are at risk if you get sued) |
| **LLC** | Liability protection, tax flexibility, professional credibility | More paperwork, annual fees |
| **S-Corp** | Tax advantages on self-employment tax when revenue exceeds ~$50K+ | More complex, required payroll |

**DO THIS:**
1. Register your LLC with the **Puerto Rico Department of State** (Departamento de Estado)
   - Online: [estado.pr.gov](https://www.estado.pr.gov)
   - Filing fee: ~$250-$350
   - Choose a registered agent (can be yourself if you have a PR address)
2. Get your **EIN (Employer Identification Number)** from the IRS
   - Free, online: [irs.gov/businesses](https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online)
   - Takes 5 minutes
3. Register with **SURI** (Sistema Unificado de Rentas Internas)
   - Puerto Rico's tax portal
   - Register for Sales and Use Tax (IVU) — even for services
   - [suri.hacienda.pr.gov](https://suri.hacienda.pr.gov)

### 6.2 — Licenses & Permits

| Requirement | Where | Cost | Notes |
|------------|-------|------|-------|
| **Merchant Registration Certificate** (Certificado de Registro de Comerciante) | SURI / Hacienda | Free | Required to collect IVU (sales tax). Apply through SURI. |
| **Municipal Business License** (Patente Municipal) | Your municipality (Vega Alta) | Varies (~$50-$300+/year) | Contact Vega Alta municipal office. Due annually. |
| **IVU Collection** | SURI | — | You must charge 11.5% IVU (4% State + 7.5% Municipal) on services rendered IN Puerto Rico. Digital services to PR-based clients are taxable. |
| **FAA Part 107** (Drone License) | FAA | ~$175 exam fee | REQUIRED if you offer drone video services commercially. Study + exam at a PSI testing center. [faa.gov/uas](https://www.faa.gov/uas/commercial_operators) |

### 6.3 — Contracts & Legal Documents You Need

**Get a lawyer to draft these, or at minimum use professional templates and customize:**

| Document | What It Covers |
|----------|---------------|
| **Service Agreement / Contract** | Scope of work, deliverables, timeline, price, payment terms, revision policy, ownership transfer, termination clause, limitation of liability |
| **Terms of Service** (for your website) | How visitors can use your site, disclaimer, limitation of liability |
| **Privacy Policy** (for your website) | What data you collect (form submissions, analytics cookies), how you store/use it, GDPR/CCPA mention if you serve mainland US clients |
| **NDA (Non-Disclosure Agreement)** | For clients who share sensitive business info. Protects both parties. Optional but professional. |
| **Maintenance Agreement** | Separate document for ongoing monthly services — what's included, response time SLA, what costs extra |

### 6.4 — Insurance

| Type | Why You Need It | Approximate Cost |
|------|----------------|-----------------|
| **General Liability Insurance** | Protects if a client claims your work caused them financial harm | ~$300-$600/year |
| **Professional Liability (E&O)** | Covers errors and omissions — if your site has a bug that loses them clients | ~$500-$1,200/year |
| **Drone Insurance** | REQUIRED if flying commercially. Covers property damage, injuries | ~$500-$1,000/year |

Consider **Hiscox**, **Next Insurance**, or **The Hartford** for small business policies.

### 6.5 — Intellectual Property

```
WHAT YOU OWN (before transfer):
  - Your custom code, templates, and design system
  - Your Astro boilerplate/starter
  - Any reusable components or tools you built

WHAT THE CLIENT OWNS (after project completion):
  - Their specific website code (delivered via GitHub repo)
  - Their content, photos, branding
  - Their domain name and hosting account

PROTECT YOURSELF:
  - Your contract should state that the source code transfers ONLY
    upon receipt of full payment
  - You retain the right to showcase the project in your portfolio
  - You retain ownership of your underlying tools, templates, and frameworks
    (you license them, not sell them)
  - If a client doesn't pay, you can take the site down
```

---

## 7. Financial & Tax Strategy

### 7.1 — Puerto Rico Tax Obligations

| Tax | Rate | Who Pays | When |
|-----|------|----------|------|
| **IVU (Sales & Use Tax)** | 11.5% | Charge to PR clients | Monthly/quarterly filing on SURI |
| **Income Tax (PR)** | Progressive (0-33%) | You, on net income | Annual filing (April 15) |
| **Self-Employment Tax** | 15.3% (Federal) | You, on net income | Quarterly estimated payments |
| **Federal Income Tax** | Potentially exempt for PR-sourced income* | — | Depends on your tax situation |

*Puerto Rico residents earning income from PR sources generally do NOT pay federal income tax on that income. But you MUST file if you have federal-source income or moved from the mainland within the past 10 years. **CONSULT A PR TAX ACCOUNTANT.**

### 7.2 — Act 60 (Incentives Code)

Puerto Rico offers **Act 60** (formerly Act 20/22) tax incentives:
- **4% fixed income tax** on export services (services sold to clients OUTSIDE Puerto Rico)
- Applies if you have PR-based LLC exporting services to US mainland or international clients

**Requirements:**
- You must be a bona fide resident of Puerto Rico
- Your LLC must be incorporated in PR
- You must apply and be approved for the decree
- Annual filing and compliance reports
- Minimum philanthropy donation requirement

**Is it worth it early on?** Probably not until you're earning $60K+/year in export revenue. The application and compliance costs don't justify it for smaller operations.

### 7.3 — Business Expenses You Can Deduct

```
✓ Computer and equipment (MacBook, monitors, peripherals)
✓ Software subscriptions (Figma, Adobe, Resend, Cloudflare, hosting)
✓ Camera and video equipment
✓ Drone and FAA licensing
✓ Internet and phone (business use %)
✓ Home office (dedicated space — square footage %)
✓ Domain registrations
✓ Business insurance premiums
✓ Professional development (courses, certifications)
✓ Transportation to client meetings / shoot locations
✓ Cloud services (AWS, Cloudflare, Vercel)
✓ Accounting and legal fees
✓ Marketing expenses
```

### 7.4 — Accounting Setup

1. **Open a business bank account** — NEVER mix personal and business money
   - Banco Popular, FirstBank, or Oriental Bank in PR
   - Need: EIN, Articles of Organization, government ID
2. **Set up ATH Móvil Business** — clients in PR prefer this for payments
3. **Track every expense** — use **Wave** (free), **QuickBooks Self-Employed** ($15/mo), or **FreshBooks**
4. **Set aside 25-30% of every payment** for taxes — put it in a separate savings account
5. **Hire a CPA** (Contador Público Autorizado) in Puerto Rico — budget $500-$1,500/year

---

## 8. Tools & Subscriptions You Need

### 8.1 — Essential (Must Have)

| Tool | Cost | Purpose |
|------|------|---------|
| **GitHub** | Free (Pro: $4/mo) | Code hosting, version control, client repo delivery |
| **Cloudflare** | Free tier (sufficient) | Hosting, CDN, DNS, Turnstile, Analytics |
| **Resend** | Free (100 emails/day) | Contact form email delivery |
| **Google Workspace** | $7.20/mo | Professional email (you@lyrixdigital.com), Drive, Calendar |
| **Figma** | Free (Starter) | Wireframing, client presentations |
| **VS Code** | Free | Code editor |
| **Node.js + pnpm** | Free | Runtime + package manager |
| **Google Search Console** | Free | Search performance monitoring |
| **Google Analytics 4** | Free | Traffic analytics |

### 8.2 — Recommended (Worth Paying For)

| Tool | Cost | Purpose |
|------|------|---------|
| **Notion** or **Trello** | Free-$10/mo | Project management, client communication boards |
| **Calendly** | Free-$10/mo | Scheduling discovery calls (no back-and-forth) |
| **Loom** | Free-$15/mo | Record screen walkthroughs for clients (faster than emails) |
| **Canva Pro** | $13/mo | Quick social graphics, proposals, presentations |
| **ChatGPT / Claude Pro** | $20/mo | Content writing assistance, copywriting, debugging |

### 8.3 — For Video Production

| Tool | Cost | Purpose |
|------|------|---------|
| **DaVinci Resolve** | Free (Studio: $295 one-time) | Video editing, color grading |
| **Adobe Premiere Pro** | $23/mo | Alternative video editor |
| **Adobe Lightroom** | $10/mo | Photo editing |
| **CapCut** | Free | Quick social media edits, captions |

---

## 9. Growth Playbook

### 9.1 — Getting Your First 5 Clients

```
CLIENT 1-2: FREE OR DISCOUNTED (Portfolio Building)
  - Build for a friend, family member, or local business you know
  - Charge $500-$1,000 (or free if you NEED the portfolio piece)
  - Condition: They MUST give you a Google review and testimonial
  - Condition: You can feature the project on your portfolio

CLIENT 3-4: REFERRALS + LOCAL NETWORKING
  - Ask clients 1-2 to refer you to other business owners
  - Attend local business events (Cámara de Comercio, PRBA)
  - Join local Facebook groups for contractors/businesses in PR
  - Post your portfolio projects with before/after comparisons

CLIENT 5+: ORGANIC + OUTREACH
  - Your SEO should start generating inbound leads
  - Direct outreach: Find businesses with bad websites, email
    them a free PageSpeed audit with your score comparison
  - Google Ads (small budget: $10-$20/day targeting "web design
    Puerto Rico" and "diseño web Puerto Rico")
```

### 9.2 — Content Marketing (Blog)

Your blog already has 6 articles. Keep publishing:

```
PUBLISHING SCHEDULE: 2 articles per month (1 EN, 1 ES)

ARTICLE IDEAS:
  - "How Much Does a Website Cost in Puerto Rico?"
  - "WordPress vs Astro: Which Is Better for Your PR Business?"
  - "5 Signs Your Contractor Website Is Losing You Money"
  - "Google Business Profile Optimization Guide for PR"
  - "Why Your Website Loads Slow and How to Fix It"
  - Case studies from your actual projects (with permission)

SEO STRATEGY:
  - Target long-tail keywords with low competition
  - Focus on bilingual queries ("diseño web" + "web design")
  - Every article should have a CTA to your contact form
  - Internal link articles to each other and to your service pages
```

### 9.3 — Social Media Strategy

```
INSTAGRAM (@lyrixdigital):
  - Post 3-4x/week
  - Content: project screenshots, before/after, video clips,
    Lighthouse scores, behind-the-scenes, client testimonials
  - Use Reels for short-form (15-30s project walkthroughs)
  - Stories: daily tips, poll questions, client Q&A
  - Bio link → your website (not Linktree)

TIKTOK:
  - Repurpose Instagram Reels
  - Focus on "day in the life" and "satisfying" content
    (watching a Lighthouse score go from 30 to 100)

LINKEDIN:
  - Long-form posts about web performance, business strategy
  - Connect with PR business owners and decision makers
  - Share case studies and insights
```

### 9.4 — Scaling Beyond You

When you hit 3-4 active projects at once and can't take more:

```
OPTION 1: RAISE PRICES
  - Higher prices = fewer clients but more revenue per project
  - Focus on the $5K-$10K+ range

OPTION 2: HIRE SUBCONTRACTORS
  - Find a developer to help with builds (pay $20-$35/hour)
  - You handle sales, design direction, and client management
  - They handle code implementation

OPTION 3: PRODUCTIZE
  - Create a fixed-price package with strict scope
  - "Contractor Authority Pack" — $3K, 5 pages, 2-week delivery
  - Systematize it so you can deliver in your sleep
  - Eventually hire someone to deliver the productized service
```

---

## 10. Things I Want You to Know

### 10.1 — The Real Competitive Advantage

Your website is not just a website. It's a **sales machine** that demonstrates what you can build for clients. When a contractor sees your site load in under 1 second, score 100 on Lighthouse, and look like a NASA control panel — they don't need convincing. The site IS the pitch. Keep it sharp.

### 10.2 — Don't Compete on Price

There will always be someone on Fiverr who'll build a WordPress site for $200. Let them. Those clients aren't your market. Your market is the business owner doing $200K-$2M+/year who understands that a $3K-$7K investment in their digital infrastructure will return 10-50x within a year. Sell the ROI, not the hours.

### 10.3 — The 90-Day Rule

It takes roughly 90 days of consistent effort (blogging, posting on social, networking, outreach) before organic leads start flowing. The first 3 months will feel slow. Don't give up. SEO compounds.

### 10.4 — Client Communication Saves Relationships

80% of client frustration comes from not being updated. Send a weekly progress email even if it's two sentences: "Hey Juan, finished the Services section. Starting Portfolio tomorrow. On track for Thursday preview." That one email prevents 10 anxious messages.

### 10.5 — Your Portfolio Is Your Resume

Nobody cares about your certifications or education. They care about your work. Every single project you deliver should be photographed, documented, and added to your portfolio. Even the $500 projects. Especially the early ones — they show range and growth.

### 10.6 — Always Get the Testimonial

Before you hand over the final files, ask for two things:
1. A Google review for your Google Business Profile
2. A 2-3 sentence testimonial you can use on your website

Do this while the client is happy and the project is fresh. Waiting 2 weeks drops the likelihood by 80%.

### 10.7 — Protect Your Time

- Set office hours. Don't answer client messages at 11 PM.
- Use Calendly for calls — never do back-and-forth scheduling.
- Batch similar tasks (all client emails in the morning, all coding in the afternoon).
- Say "no" to projects that don't excite you or pay well. Every bad project costs you a good one.

### 10.8 — Cash Flow Is King

Revenue means nothing if you can't pay rent. Always:
- Collect 50% upfront before touching a single line of code
- Set aside 25-30% for taxes immediately
- Have 3 months of personal expenses saved before going full-time
- Track your money weekly (not monthly — that's too late to course-correct)

### 10.9 — The Puerto Rico Advantage

You're in a unique position:
- **Bilingual market** — most agencies serve one language. You serve both natively.
- **US jurisdiction** — PR clients get US-standard legal protections and payment methods.
- **Lower cost of living** — your overhead is lower than mainland agencies, so your margins are better.
- **Hurricane-conscious market** — businesses in PR KNOW they need digital resilience. Cloud-hosted, static sites with no database are selling points.
- **Act 60** — as you grow, the tax incentives for export services are extremely favorable.

### 10.10 — This Codebase Is Your Template

The Lyrix Digital website you built is also your **starter template** for client projects. You don't need to build every site from scratch. Fork the repo, strip out the Lyrix content, and you have:
- A fully configured Astro 5 + React + Tailwind setup
- Working contact form with Zod validation + Turnstile
- SEO engine with JSON-LD schema
- Bilingual infrastructure
- GTM analytics integration
- Cloudflare Pages deployment pipeline
- Mobile-first responsive design system

That saves you 10-15 hours on every new project. That's $500-$1,500 of pure profit per client, baked into the deal from day one.

---

## Quick Reference: Your First 30 Days

```
WEEK 1: LEGAL FOUNDATION
  □ Register LLC with PR Department of State
  □ Apply for EIN (IRS.gov)
  □ Register on SURI (Merchant Certificate)
  □ Open business bank account
  □ Set up ATH Móvil Business

WEEK 2: DIGITAL INFRASTRUCTURE
  □ Deploy lyrixdigital.com to production
  □ Set up Google Business Profile
  □ Submit sitemap to Google Search Console
  □ Create @lyrixdigital Instagram
  □ Set up Google Analytics 4 via GTM
  □ Set up Calendly for discovery calls

WEEK 3: FIRST OUTREACH
  □ Identify 20 local businesses with bad websites
  □ Run PageSpeed audits on each
  □ Send personalized outreach emails with audit results
  □ Post first 3 portfolio pieces on Instagram
  □ Ask 3 people you know for referrals

WEEK 4: REFINE & PERSIST
  □ Follow up on all outreach that didn't respond
  □ Publish 1 blog article (EN + ES)
  □ Attend 1 local business event or Zoom networking
  □ Set up a simple CRM (even a spreadsheet works)
  □ Review your pricing — adjust based on market response
```

---

*Last updated: February 11, 2026*
*Version: 1.0*
*Author: Lyrix Digital*
