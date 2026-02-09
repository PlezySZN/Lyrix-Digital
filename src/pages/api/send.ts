/**
 * ═══════════════════════════════════════════════════════════
 * API ROUTE — /api/send
 * DEFENSE-IN-DEPTH:
 *   1. Zod schema validation (shared with client)
 *   2. Honeypot rejection (silent — fakes success to bots)
 *   3. Cloudflare Turnstile server-side token verification
 *   4. HTML escaping via emailTemplate.ts escapeHtml()
 *
 * RATE LIMITING NOTE:
 *   Code-level rate limiting isn't practical on stateless
 *   Cloudflare Workers. Configure Cloudflare Rate Limiting Rules
 *   in the dashboard: Security → WAF → Rate limiting rules.
 *   Recommended: 5 requests / 10 min per IP on POST /api/send.
 * ═══════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { buildLeadEmail, type LeadData } from '../../lib/emailTemplate';
import { contactSchema } from '../../schemas/contact';

export const prerender = false;

// ─── SECURITY HEADERS (applied to every response) ───
const SEC_HEADERS = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), { status, headers: SEC_HEADERS });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // ─── 1. PARSE & VALIDATE WITH ZOD ───
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return jsonResponse({ error: 'Invalid request body.' }, 400);
    }

    const parsed = contactSchema.safeParse(raw);

    if (!parsed.success) {
      return jsonResponse(
        { error: 'Validation failed.', issues: parsed.error.issues },
        400
      );
    }

    const body = parsed.data;

    // ─── 2. HONEYPOT CHECK ───
    // If the hidden field has content, it's a bot. Return fake success
    // so the bot thinks it succeeded — never reveal detection.
    if (body._honeypot) {
      return jsonResponse({ success: true }, 200);
    }

    // ─── 3. TURNSTILE VERIFICATION ───
    const turnstileSecret = import.meta.env.TURNSTILE_SECRET_KEY;

    if (turnstileSecret) {
      if (!body.turnstileToken) {
        return jsonResponse({ error: 'Security verification required.' }, 403);
      }

      const verifyRes = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: turnstileSecret,
            response: body.turnstileToken,
            remoteip: request.headers.get('cf-connecting-ip') ?? '',
          }),
        }
      );

      const verifyData = (await verifyRes.json()) as { success: boolean };

      if (!verifyData.success) {
        console.warn('[Lyrix API] Turnstile verification failed');
        return jsonResponse({ error: 'Security verification failed.' }, 403);
      }
    }

    // ─── 4. RESEND EMAIL ───
    const apiKey = import.meta.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('[Lyrix API] RESEND_API_KEY is not set');
      return jsonResponse({ error: 'Server configuration error.' }, 500);
    }

    const resend = new Resend(apiKey);

    // Build sanitized email (emailTemplate.ts escapeHtml handles XSS)
    const leadData: LeadData = {
      name: body.name,
      email: body.email,
      phone: body.phone ?? '',
      sector: body.sector ?? '',
      maintenance: body.maintenance,
      budget: body.budget ?? '',
      cinematic: body.cinematic,
      message: body.message ?? '',
      lang: body.lang,
    };

    const html = buildLeadEmail(leadData);

    const sectorTag = leadData.sector || 'General';
    const modules = leadData.cinematic ? 'Web + Video' : 'Web Only';

    const { error } = await resend.emails.send({
      from: 'Lyrix Digital <notifications@lyrixdigital.com>',
      to: ['lyrixdigitals@gmail.com'],
      replyTo: body.email,
      subject: `[LEAD] ${body.name} — ${sectorTag} — ${modules}`,
      html,
    });

    if (error) {
      console.error('[Lyrix API] Resend error:', error);
      return jsonResponse({ error: 'Failed to send email.' }, 500);
    }

    return jsonResponse({ success: true }, 200);
  } catch (err) {
    console.error('[Lyrix API] Unexpected error:', err);
    return jsonResponse({ error: 'Unexpected server error.' }, 500);
  }
};
