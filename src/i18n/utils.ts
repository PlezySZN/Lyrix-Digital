/**
 * ═══════════════════════════════════════════════════════════
 * i18n UTILITIES — LYRIX OS
 * Helper functions for language detection and translation lookup
 * ═══════════════════════════════════════════════════════════
 */

import { ui, defaultLang, type Lang } from './ui';

/**
 * Get a translation string by key for the given language.
 * Falls back to defaultLang (es) if the key is missing.
 */
export function t(lang: Lang, key: keyof typeof ui[typeof defaultLang]): string {
  return ui[lang]?.[key] ?? ui[defaultLang][key];
}

/**
 * Extract the current language from a URL pathname.
 * e.g. "/es/about" -> "es", "/en/" -> "en", "/" -> "es"
 */
export function getLangFromUrl(url: URL): Lang {
  const [, langSegment] = url.pathname.split('/');
  if (langSegment in ui) return langSegment as Lang;
  return defaultLang;
}

/**
 * Get a URL path for the opposite language.
 * e.g. if current is "/es/", returns "/en/" and vice versa.
 */
export function getOtherLangUrl(currentUrl: URL, currentLang: Lang): string {
  const otherLang: Lang = currentLang === 'es' ? 'en' : 'es';
  return currentUrl.pathname.replace(`/${currentLang}`, `/${otherLang}`);
}

/**
 * Build a useTranslations hook-like function for React components.
 * Pass the lang, get a t() function scoped to that language.
 */
export function useTranslations(lang: Lang) {
  return function translate(key: keyof typeof ui[typeof defaultLang]): string {
    return ui[lang]?.[key] ?? ui[defaultLang][key];
  };
}
