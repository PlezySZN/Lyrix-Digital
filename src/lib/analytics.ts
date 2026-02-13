/**
 * ═══════════════════════════════════════════════════════════
 * ANALYTICS — GA4 Event Utility
 *
 * Lightweight event tracking via gtag.js (main thread).
 * No GTM/Partytown overhead.
 *
 * Usage:
 *   trackEvent('generate_lead', { sector: 'Industry', budget: '$5K-$10K' })
 *
 * GA4 Event Names:
 * ─ cta_click       → Any CTA button pressed
 * ─ generate_lead   → Contact form submitted
 * ─ modal_open      → Contact modal opened
 * ─ modal_close     → Contact modal closed
 * ─ contact_call    → Phone number link clicked
 * ─ contact_email   → Email link clicked
 * ─ social_click    → Social media link clicked
 * ═══════════════════════════════════════════════════════════
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Push an event to GA4 via gtag.
 * No-ops silently if gtag isn't available (SSR / blocked).
 */
export function trackEvent(
  event: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}
