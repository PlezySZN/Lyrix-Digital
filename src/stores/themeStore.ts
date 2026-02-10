/**
 * ═══════════════════════════════════════════════════════════
 * THEME STORE — LYRIX OS
 * Global dark/light theme state with localStorage persistence.
 *
 * The inline <script> in main.astro sets [data-theme] on <html>
 * BEFORE first paint — this store syncs the React island state.
 * ═══════════════════════════════════════════════════════════
 */

import { atom } from 'nanostores';

export type Theme = 'dark' | 'light';

export const $theme = atom<Theme>('dark');

/**
 * Sync the nanostore with the current DOM attribute.
 * Called once when the StatusBar island hydrates.
 */
export function initTheme() {
  const current = document.documentElement.getAttribute('data-theme') as Theme | null;
  $theme.set(current === 'light' ? 'light' : 'dark');
}

/**
 * Toggle between dark and light mode.
 * Persists to localStorage + sets data-theme on <html>.
 */
export function toggleTheme() {
  const next: Theme = $theme.get() === 'dark' ? 'light' : 'dark';
  $theme.set(next);
  localStorage.setItem('lyrix-theme', next);
  document.documentElement.setAttribute('data-theme', next);
}
