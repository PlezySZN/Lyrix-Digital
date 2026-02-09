/**
 * ═══════════════════════════════════════════════════════════
 * CONTACT FORM SCHEMA — LYRIX OS DEFENSE LAYER
 * Shared Zod validation: runs on BOTH client (instant feedback)
 * and server (trust-no-one enforcement).
 * ═══════════════════════════════════════════════════════════
 */

import { z } from 'zod';

// ─── SCHEMA ───

export const contactSchema = z.object({
  // ── Identity ──
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters')
    .regex(/^[\p{L}\p{M}\s'.\-]+$/u, 'Name contains invalid characters'),

  email: z.email({ error: 'Invalid email address' })
    .max(254, 'Email is too long'),

  phone: z.string()
    .max(20, 'Phone number is too long')
    .regex(/^[+\d\s()\-]*$/, 'Invalid phone format')
    .optional()
    .or(z.literal('')),

  // ── Project Config ──
  sector: z.enum(['', 'Industry', 'Creative', 'Personal', 'Business'])
    .optional()
    .default(''),

  maintenance: z.enum(['managed', 'handover', 'undecided'])
    .default('undecided'),

  budget: z.enum(['', '$1K–$3K', '$3K–$5K', '$5K–$10K', '$10K+'])
    .optional()
    .default(''),

  cinematic: z.boolean()
    .default(false),

  message: z.string()
    .max(2000, 'Message must be under 2,000 characters')
    .optional()
    .or(z.literal('')),

  lang: z.enum(['en', 'es'])
    .default('en'),

  // ── Security ──
  _honeypot: z.string()
    .max(0, 'Validation failed')
    .optional()
    .or(z.literal('')),

  turnstileToken: z.string()
    .optional()
    .default(''),
});

// ─── TYPES ───

export type ContactFormData = z.infer<typeof contactSchema>;

// ─── HELPERS ───

/**
 * Extract the first error message per field from a ZodError.
 * Returns a flat record: { fieldName: "Error message" }
 */
export function getFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? '');
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }
  return errors;
}
