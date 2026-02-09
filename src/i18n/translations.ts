/**
 * ═══════════════════════════════════════════════════════════
 * i18n TRANSLATIONS LOOKUP — LYRIX OS
 * Generates typed translation objects for React components
 * ═══════════════════════════════════════════════════════════
 */

import { ui, type Lang, defaultLang } from './ui';

type UIKeys = keyof typeof ui[typeof defaultLang];

/**
 * Pick specific translations for a component.
 * Use this in Astro to generate a minimal translation object
 * to pass as props to React islands.
 * 
 * @example
 * const heroTranslations = pickTranslations(lang, [
 *   'hero.headline',
 *   'hero.subtitle',
 *   'hero.cta'
 * ]);
 */
export function pickTranslations<K extends UIKeys>(
  lang: Lang,
  keys: K[]
): Record<K, string> {
  const result = {} as Record<K, string>;
  for (const key of keys) {
    result[key] = ui[lang]?.[key] ?? ui[defaultLang][key];
  }
  return result;
}

/**
 * Get all translations for a specific prefix.
 * Useful for components that need all keys starting with a pattern.
 * 
 * @example
 * const heroT = getTranslationsByPrefix(lang, 'hero.');
 */
export function getTranslationsByPrefix(
  lang: Lang,
  prefix: string
): Record<string, string> {
  const langUI = ui[lang] ?? ui[defaultLang];
  const result: Record<string, string> = {};
  
  for (const key of Object.keys(langUI) as UIKeys[]) {
    if (key.startsWith(prefix)) {
      // Remove prefix for cleaner access
      const shortKey = key.slice(prefix.length);
      result[shortKey] = langUI[key];
    }
  }
  return result;
}

// Pre-defined translation sets for common components
// This enables better tree-shaking

export const heroKeys = [
  'hero.headline',
  'hero.subtitle',
  'hero.finder',
  'hero.cta',
  'hero.cta.hint',
  'hero.cta.meta',
] as const;

export const statusBarKeys = [
  'statusbar.ready',
  'statusbar.contact',
] as const;

export const ctaKeys = [
  'cta.section.label',
  'cta.terminal',
  'cta.status1',
  'cta.status2',
  'cta.status3',
  'cta.status4',
  'cta.systems',
  'cta.slots',
  'cta.response',
  'cta.headline1',
  'cta.headline2',
  'cta.subheadline',
  'cta.button',
  'cta.trust',
  'cta.delivery',
  'cta.source',
  'cta.support',
  'cta.copyright',
  'cta.privacy',
  'cta.terms',
  'cta.social',
] as const;

export type HeroTranslations = Record<typeof heroKeys[number], string>;
export type StatusBarTranslations = Record<typeof statusBarKeys[number], string>;
export type CTATranslations = Record<typeof ctaKeys[number], string>;
