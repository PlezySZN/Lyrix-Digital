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
 * Root ("/") resolves to 'en' (default locale served at root).
 * e.g. "/es/about" -> "es", "/en/" -> "en", "/" -> "en"
 */
export function getLangFromUrl(url: URL): Lang {
  const [, langSegment] = url.pathname.split('/');
  if (langSegment in ui) return langSegment as Lang;
  return defaultLang;
}

/**
 * Get a URL path for the opposite language.
 * Accounts for EN root: homepage "/" ↔ "/es/",
 * subpages "/en/blog/…" ↔ "/es/blog/…".
 */
export function getOtherLangUrl(currentUrl: URL, currentLang: Lang): string {
  const otherLang: Lang = currentLang === 'es' ? 'en' : 'es';
  const path = currentUrl.pathname;

  // Homepage: EN at root, ES at /es/
  const isHome = path === '/' || path === '' || /^\/(en|es)\/?$/.test(path);
  if (isHome) {
    return otherLang === 'en' ? '/' : '/es/';
  }

  // Subpages: swap prefix
  return path.replace(`/${currentLang}`, `/${otherLang}`);
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
