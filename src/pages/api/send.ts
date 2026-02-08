/**
 * ═══════════════════════════════════════════════════════════
 * API ROUTE — /api/send
 * Receives contact form data, sends styled email via Resend
 * ═══════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { buildLeadEmail, type LeadData } from '../../lib/emailTemplate';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as LeadData;

    // ─── VALIDATION ───
    if (!body.name || !body.email) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ─── RESEND ───
    const apiKey = import.meta.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error('[Lyrix API] RESEND_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'Server configuration error.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(apiKey);
    const html = buildLeadEmail(body);

    const sectorTag = body.sector || 'General';
    const modules = body.cinematic ? 'Web + Video' : 'Web Only';

    const { error } = await resend.emails.send({
      from: 'Lyrix Digital <notifications@lyrixdigital.com>',
      to: ['hello@lyrixdigital.com'],
      replyTo: body.email,
      subject: `[LEAD] ${body.name} — ${sectorTag} — ${modules}`,
      html,
    });

    if (error) {
      console.error('[Lyrix API] Resend error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[Lyrix API] Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Unexpected server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
