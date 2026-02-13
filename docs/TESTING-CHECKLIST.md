# LYRIX DIGITAL — Analytics & Launch Testing Checklist

> Step-by-step guide to verify GA4, Google Business Profile, Google Search Console,
> and Cloudflare Web Analytics are all working correctly.
>
> **Last Updated:** 2026-02-13

---

## Table of Contents

1. [Google Analytics 4 (GA4)](#1-google-analytics-4-ga4)
2. [Google Business Profile (GBP)](#2-google-business-profile-gbp)
3. [Google Search Console (GSC)](#3-google-search-console-gsc)
4. [Cloudflare Web Analytics](#4-cloudflare-web-analytics)
5. [Bounce Rate Verification](#5-bounce-rate-verification)
6. [Event Tracking Verification](#6-event-tracking-verification)
7. [Cloudflare Dashboard Actions](#7-cloudflare-dashboard-actions)

---

## 1. Google Analytics 4 (GA4)

### 1.1 — Verify the Tag Is Firing

Your Measurement ID is `G-9S6JHDLHVB`. It's loaded via deferred `requestIdleCallback` (3s delay) in `main.astro`.

**Step 1: Open your site in Chrome**
```
https://lyrixdigital.com
```

**Step 2: Open Chrome DevTools → Network tab**
1. Press `F12` or `Ctrl+Shift+I`
2. Click the **Network** tab
3. In the filter box, type `collect` or `google-analytics`
4. Wait 5-6 seconds (GA4 loads with a 3s idle delay)
5. You should see requests to `google-analytics.com/g/collect`

**Step 3: Verify in GA4 Realtime**
1. Go to [analytics.google.com](https://analytics.google.com)
2. Select your property (Lyrix Digital)
3. Click **Reports → Realtime**
4. Open your website in another tab
5. You should see yourself appear as an active user within 30 seconds

**Step 4: Use GA4 DebugView**
1. Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable it (the icon turns green)
3. Go to GA4 → **Admin → DebugView**
4. Browse your site — you'll see every event in real-time:
   - `page_view` — fires on every page load
   - `session_start` — fires on new session
   - `first_visit` — fires for new visitors
   - `user_engagement` — fires when user is actively engaged

### 1.2 — Verify Custom Events

Browse your site and trigger each action. Check DebugView for these events:

| Action | Expected Event | Parameters |
|--------|---------------|------------|
| Click any CTA button | `cta_click` | `source` (hero, pricing, statusbar, cta_section) |
| Open Contact Modal | `modal_open` | `source` |
| Close Contact Modal | `modal_close` | — |
| Submit contact form | `generate_lead` | `sector`, `budget`, `cinematic`, `language` |
| Click phone number | `contact_call` | — |
| Click email address | `contact_email` | — |
| Click social media link | `social_click` | `platform` |

### 1.3 — Set Up Conversions

1. Go to GA4 → **Admin → Events**
2. Find `generate_lead` in the list
3. Toggle the **"Mark as conversion"** switch to ON
4. Also mark `contact_call` as a conversion
5. These will now appear in your Conversions report

---

## 2. Google Business Profile (GBP)

### 2.1 — Create or Claim Your Profile

1. Go to [business.google.com](https://business.google.com)
2. Search for "Lyrix Digital"
3. If it exists → click **"Claim this business"**
4. If it doesn't → click **"Add your business"**
5. Fill in:
   - **Business name:** Lyrix Digital
   - **Category:** Web Designer (primary)
   - **Secondary categories:** Internet Marketing Service, SEO Company, Graphic Designer
   - **Address:** Your business address in Vega Alta, PR 00692
   - **Phone:** Your business phone
   - **Website:** `https://lyrixdigital.com`

### 2.2 — Verification

Google will verify you via one of these methods:
- **Postcard** — Physical mail to your address (5-14 days)
- **Phone** — Automated call with verification code
- **Email** — Link sent to your business email
- **Video** — Record a video showing your business address/location

### 2.3 — Optimize Your Profile

After verification, complete these:

- [ ] **Description** — 750 chars max. Include keywords: "web design," "Puerto Rico," "bilingual," "SEO," "fast websites," "Lighthouse 90+," "Vega Alta"
- [ ] **Services** — Add ALL 20+ services from the SEO-KEYWORDS doc (Section 11)
- [ ] **Photos** — Upload:
  - Logo (square, high-res)
  - Cover photo (landscape)
  - Portfolio screenshots (3-5 projects)
  - Behind-the-scenes / office photos
- [ ] **Hours** — Set your business hours
- [ ] **Attributes** — Mark: Online appointments, Online estimates
- [ ] **Q&A** — Seed 5-10 questions yourself (use question keywords from SEO-KEYWORDS Section 7)

### 2.4 — Verify GBP Shows Your Website

1. Google your business name: `"Lyrix Digital"`
2. Your GBP panel should appear on the right side
3. Click the **Website** button — it should go to `https://lyrixdigital.com`
4. Check the **"Website"** link in the business info section

### 2.5 — Get Your First Reviews

- Ask Sweet Vacations and Unidine Co. (existing clients) for Google reviews
- Send them a direct review link:
  1. Go to your GBP dashboard
  2. Click **"Ask for reviews"** → copy the short link
  3. Send via WhatsApp/email with a personal message

---

## 3. Google Search Console (GSC)

### 3.1 — Verify Domain Ownership

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click **"Add property"**
3. Choose **"URL prefix"** → enter `https://lyrixdigital.com`
4. **Verification method:** If your domain is on Cloudflare:
   - Choose **DNS record** verification
   - Copy the TXT record Google gives you
   - Go to Cloudflare Dashboard → DNS → Add Record:
     - Type: `TXT`
     - Name: `@`
     - Content: (paste Google's verification string)
   - Wait 5 minutes → click "Verify" in GSC

### 3.2 — Submit Your Sitemap

1. In GSC, go to **Sitemaps** (left sidebar)
2. Enter: `sitemap-index.xml`
3. Click **Submit**
4. Status should show **"Success"** within a few hours
5. Google will discover all your pages from the sitemap

### 3.3 — Check Index Coverage

After 2-3 days:

1. Go to **Pages** in GSC (left sidebar)
2. Check the **Indexed** count — should match your total pages (~30+)
3. Check **Not indexed** — look for:
   - "Crawled - currently not indexed" → normal at first, give it time
   - "Excluded by 'noindex' tag" → check if you accidentally added noindex
   - "Blocked by robots.txt" → check your robots.txt file
4. No **errors** should appear — if they do, fix immediately

### 3.4 — Request Indexing for Key Pages

For your most important pages, manually request indexing:

1. In GSC, paste the URL in the top search bar (URL Inspection)
2. Click **"Request indexing"**
3. Do this for:
   - `https://lyrixdigital.com/`
   - `https://lyrixdigital.com/es/`
   - `https://lyrixdigital.com/en/blog/`
   - `https://lyrixdigital.com/es/blog/`
   - `https://lyrixdigital.com/en/blog/website-cost-puerto-rico/`
   - All city pages

### 3.5 — Monitor Performance

After 1-2 weeks:
1. Go to **Performance** in GSC
2. Check:
   - **Clicks** — How many searchers clicked to your site
   - **Impressions** — How many times you appeared in search
   - **Average CTR** — Click-through rate (target: >3%)
   - **Average Position** — Where you rank (target: <20 initially)
3. Look at **Queries** tab — what search terms are showing your site

### 3.6 — Core Web Vitals

1. Go to **Core Web Vitals** in GSC (left sidebar)
2. After enough traffic data, it will show:
   - **LCP** — should be "Good" (<2.5s)
   - **INP** — should be "Good" (<200ms)
   - **CLS** — should be "Good" (<0.1)
3. If any show "Needs improvement" or "Poor" → investigate specific URLs

---

## 4. Cloudflare Web Analytics

### 4.1 — Verify the Beacon Is Active

Cloudflare Pages injects the analytics beacon automatically.

**Step 1: Check in the HTML source**
1. Open your site → View Page Source (`Ctrl+U`)
2. Search for `cloudflareinsights`
3. You should see a single `beacon.min.js` script with `data-cf-beacon`.
4. Do not add a second manual beacon snippet in app code.

**Step 2: Check in DevTools Network**
1. Open DevTools → Network tab
2. Filter by `cdn-cgi/rum`
3. You should see:
   - `OPTIONS` request → `200`
   - `POST` request → `204`

**Step 3: Check the Cloudflare Dashboard**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Select your domain (`lyrixdigital.com`)
3. Click **Web Analytics** in the left sidebar
4. You should see:
   - Page views
   - Unique visitors
   - Top pages
   - Top referrers
   - Countries
   - Core Web Vitals (LCP, FID, CLS)

### 4.2 — What to Look For

- **Page views trending up** — If flat or zero, the beacon isn't firing
- **Top pages** — Your homepage should be #1
- **Core Web Vitals** — All should be green
- **Referrers** — Once GSC starts ranking you, you'll see `google.com` here

---

## 5. Bounce Rate Verification

**The #1 thing to check in GA4.** A 100% bounce rate means the tag isn't tracking engagement properly.

### What's Normal

| Bounce Rate | Meaning |
|-------------|---------|
| 100% | BROKEN — GA4 isn't tracking engagement events |
| 70-90% | Normal for a service/landing page site |
| 50-70% | Good — visitors are exploring |
| 30-50% | Excellent — strong engagement |

### How to Check

1. Go to GA4 → **Reports → Engagement → Pages and screens**
2. Look at the **Bounce rate** column
3. If you don't see it, click **"Customize report"** → add "Bounce rate" metric

### If Bounce Rate Is 100%

This means GA4 is NOT receiving `user_engagement` events. Possible causes:

1. **GA4 tag not loading** — Check Network tab (Section 1.1 Step 2)
2. **Ad blocker** — Disable and retest
3. **Deferred loading too late** — Our 3s delay is fine; engagement events fire automatically after 10s of active time

### How GA4 Calculates Bounce Rate

GA4's bounce rate = sessions that were NOT "engaged sessions."

An "engaged session" requires ONE of:
- User spent **10+ seconds** on the page
- User triggered a **conversion event** (like `generate_lead`)
- User viewed **2+ pages**

**To test:** Open your site, stay on it for 15 seconds, then check GA4 Realtime → you should see `user_engagement` fire.

---

## 6. Event Tracking Verification

### Quick Test Protocol

1. Open your site in Chrome Incognito (no ad blockers)
2. Open GA4 DebugView in another tab
3. Perform these actions and verify each event appears:

```
□ Page loads                    → page_view ✓
□ Wait 10 seconds               → user_engagement ✓
□ Click hero CTA button         → cta_click (source: hero) ✓
□ Contact modal opens           → modal_open ✓
□ Close modal (X button)        → modal_close ✓
□ Click pricing CTA             → cta_click (source: pricing) ✓
□ Click phone number            → contact_call ✓
□ Click email address           → contact_email ✓
□ Click Instagram link          → social_click (platform: instagram) ✓
□ Submit contact form           → generate_lead ✓
□ Navigate to /es/              → page_view (new page) ✓
```

### If Events Are Missing

1. Check `src/lib/analytics.ts` — make sure the `trackEvent()` function calls `gtag()`
2. Check the component that should fire the event — look for `trackEvent()` calls
3. Open DevTools Console → type `gtag` — if it returns `undefined`, GA4 didn't load
4. Check for JavaScript errors in Console that might block execution

---

## 7. Cloudflare Dashboard Actions

### 7.1 — REQUIRED: Disable Email Address Obfuscation

Cloudflare injects `email-decode.min.js` by default, which hurts Lighthouse scores.

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Select your domain
3. Navigate to **Scrape Shield** (or **Security → Settings**)
4. Find **"Email Address Obfuscation"**
5. Toggle it **OFF**
6. This removes the injected JS file (~2KB, but blocks render)

### 7.2 — Verify Security Headers

1. Go to your site → DevTools → Network tab
2. Click on the main HTML document request
3. Check Response Headers for:
   - `x-content-type-options: nosniff` ✓
   - `x-frame-options: DENY` ✓
   - `strict-transport-security: max-age=...` ✓
   - `content-security-policy: ...` ✓

### 7.3 — Cache Verification

1. In DevTools Network, reload the page
2. Check response headers on `.js` and `.css` files:
   - `/_astro/*` files → `cache-control: public, max-age=31536000, immutable`
   - Font files → `cache-control: public, max-age=31536000, immutable`
   - HTML files → `cache-control: public, max-age=3600, must-revalidate`

### 7.4 — Turnstile Verification

1. Open your contact form
2. The Turnstile widget should appear (invisible or managed challenge)
3. Submit a test form — it should succeed
4. Check Cloudflare Dashboard → **Turnstile** → you should see the solve count

---

## Quick Reference: Full Launch Checklist

```
PRE-LAUNCH:
  □ Build passes (pnpm build — no errors)
  □ All tests pass (pnpm test:run)
  □ Lighthouse mobile score 85+ (Performance, A11y, BP, SEO)
  □ All pages render correctly (EN + ES + city pages + blog)
  □ Contact form submits successfully (test with real email)
  □ Phone/email links work on mobile

ANALYTICS:
  □ GA4 tag fires (Network tab → google-analytics.com/g/collect)
  □ GA4 Realtime shows active user
  □ GA4 DebugView shows page_view events
  □ Cloudflare Web Analytics beacon loads (200 OK)
  □ Cloudflare dashboard shows page views
  □ Custom events fire (cta_click, modal_open, etc.)
  □ Bounce rate is NOT 100% (check after 24h with real traffic)

GOOGLE INTEGRATIONS:
  □ Google Business Profile verified and published
  □ GBP shows correct website URL
  □ GBP has all services listed
  □ GBP has photos uploaded
  □ Google Search Console domain verified
  □ Sitemap submitted and accepted
  □ No index coverage errors
  □ Key pages manually submitted for indexing

CLOUDFLARE:
  □ Email Address Obfuscation → OFF (Scrape Shield)
  □ SSL certificate active (green lock)
  □ Cache headers correct
  □ Turnstile working on contact form

POST-LAUNCH (After 1 Week):
  □ GA4 showing real traffic (not just you)
  □ GSC showing impressions (even if clicks = 0)
  □ Cloudflare analytics showing visitors
  □ No crawl errors in GSC
  □ GBP appearing in Google Maps searches
  □ First Google review requested from a client
```

---

*This checklist is your launch bible. Run through it top-to-bottom before going live, and revisit weekly for the first month.*
