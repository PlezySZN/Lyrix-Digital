/**
 * ═══════════════════════════════════════════════════════════
 * PROJECT DATABASE — LYRIX OS
 *
 * Single source of truth for all portfolio projects.
 * ─────────────────────────────────────────────────────────
 * HOW TO ADD A NEW PROJECT:
 *   1. Add a new entry to `projectStructure` below.
 *   2. Add matching i18n keys in `src/i18n/ui.ts`
 *      (logs.pN.type, logs.pN.status, logs.pN.description, logs.pN.previewX)
 *   3. Optionally drop screenshots into `public/projects/<slug>/`
 *      and reference them in the `images` array.
 * ═══════════════════════════════════════════════════════════
 */

import type { ProjectStructure, Project, ProjectPreview } from '../types';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

// ─── STRUCTURAL DATA (non-translatable) ───

export const projectStructure: ProjectStructure[] = [
  {
    id: '#001',
    client: 'Sweet Vacations',
    typeColor: 'text-blue-400',
    year: '2026',
    previewGradient: ['#1a1a2e', '#16213e'],
    previewGradients: [
      ['#1a1a2e', '#16213e'],
      ['#0f1419', '#1a2328'],
      ['#1a1a0e', '#2e2116'],
      ['#162e3e', '#1a1a2e'],
      ['#1a2328', '#0f1419'],
      ['#2e2116', '#1a1a0e'],
    ],
    liveUrl: 'https://sweet-vacations.vercel.app/en',
    liveUrlEs: 'https://sweet-vacations.vercel.app/es',
    images: [
      '/SweetVacations_Hero.png',
      '/SweetVacations_Apartments_Grid.png',
      '/SweetVacations_Ameneties.png',
      '/SweetVacations_FAQ.png',
      '/SweetVacations_First_CTA.png',
      '/SweetVacations_Second_CTA.png',
    ],
  },
  {
    id: '#002',
    client: 'Unidine Co.',
    typeColor: 'text-amber-400',
    year: '2025',
    previewGradient: ['#1a120b', '#2d1f10'],
    previewGradients: [
      ['#1a120b', '#2d1f10'],
      ['#2d1f10', '#1a120b'],
      ['#2d2010', '#1a1f0b'],
      ['#1a1f0b', '#2d2010'],
      ['#1a120b', '#2d2010'],
    ],
    liveUrl: 'https://restaurant-psi-fawn.vercel.app/',
    images: [
      '/Unidine_hero.png',
      '/Unidine_signature_dishes.png',
      '/Unidine_menu.png',
      '/Unidine_photo_gallery.png',
      '/Unidine_cta.png',
    ],
  },
  {
    id: '#003',
    client: 'Juan Plumbing Co.',
    typeColor: 'text-pink-400',
    year: '2025',
    previewGradient: ['#1a0a1a', '#2b0f2b'],
    previewGradients: [
      ['#1a0a1a', '#2b0f2b'],
      ['#0a1a1a', '#0f2b2b'],
      ['#1a1a0a', '#2b2b0f'],
    ],
    comingSoon: true,
    images: [],
  },
];

// ─── RESOLVER ───

/**
 * Resolve structural data + i18n translations into fully hydrated `Project[]`.
 * This is the ONLY function consumers should call.
 */
export function getProjects(lang: Lang): Project[] {
  const t = useTranslations(lang);

  return projectStructure.map((p, i) => {
    const n = i + 1;

    // Build preview entries — prefer real images, fall back to gradients
    const previews: ProjectPreview[] =
      p.images && p.images.length > 0
        ? p.images.map((src, j) => ({
            type: 'image' as const,
            background: src,
            label: t(`logs.p${n}.preview${j + 1}` as any) || `Preview ${j + 1}`,
          }))
        : p.previewGradients.map((grad, j) => ({
            type: 'gradient' as const,
            background: grad,
            label: t(`logs.p${n}.preview${j + 1}` as any) || `Preview ${j + 1}`,
          }));

    // Resolve live URL by language
    const liveUrl = lang === 'es' && p.liveUrlEs ? p.liveUrlEs : p.liveUrl;

    return {
      id: p.id,
      client: p.client,
      type: t(`logs.p${n}.type` as any),
      typeColor: p.typeColor,
      status: t(`logs.p${n}.status` as any),
      year: p.year,
      description: t(`logs.p${n}.description` as any),
      previewGradient: p.previewGradient,
      previews,
      liveUrl,
      images: p.images,
      comingSoon: p.comingSoon ?? false,
    };
  });
}
