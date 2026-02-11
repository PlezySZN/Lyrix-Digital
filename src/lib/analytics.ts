/**
 * ═══════════════════════════════════════════════════════════
 * ANALYTICS — GTM DataLayer Event Utility
 *
 * Centralized event tracking that pushes custom events to the
 * GTM dataLayer. Since GTM runs via Partytown (off main-thread),
 * we push to window.dataLayer which Partytown forwards.
 *
 * Usage:
 *   trackEvent('generate_lead', { sector: 'Industry', budget: '$5K-$10K' })
 *
 * GTM Event Names (GA4-aligned):
 * ─ cta_click       → Any CTA button pressed (source: hero|cta|pricing|statusbar|spotlight)
 * ─ generate_lead   → Contact form submitted successfully
 * ─ modal_open      → Contact modal opened
 * ─ modal_close     → Contact modal closed
 * ─ contact_call    → Phone number link clicked
 * ─ contact_email   → Email link clicked
 * ─ social_click    → Social media link clicked (platform: instagram)
 * ═══════════════════════════════════════════════════════════
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Push a custom event to the GTM dataLayer.
 * No-ops silently if dataLayer isn't available (SSR / blocked).
 */
export function trackEvent(
  event: string,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...params,
  });
}
