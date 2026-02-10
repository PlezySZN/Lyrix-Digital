/**
 * ═══════════════════════════════════════════════════════════
 * SIDEBAR HINT STORE — LYRIX OS
 *
 * Tracks whether the user has ever opened the sidebar.
 * Persisted in localStorage so the hero arrow hint
 * disappears permanently after first interaction.
 *
 * IMPORTANT (Hydration-safe):
 * The atom starts as `false` on BOTH server and client.
 * Components must call `hydrateSidebarHint()` inside a
 * useEffect to read localStorage only after mount,
 * preventing React hydration mismatches.
 * ═══════════════════════════════════════════════════════════
 */

import { atom } from 'nanostores';

/** localStorage key for persistence across sessions */
const STORAGE_KEY = 'lyrix-sidebar-opened';

/**
 * Whether the user has opened the sidebar at least once.
 * Starts `false` (server-safe default). Hydrated client-side
 * via `hydrateSidebarHint()` after React mounts.
 */
export const $sidebarOpened = atom<boolean>(false);

/**
 * Transient state for "Interaction Kill-Switch".
 * If user interacts with relevant UI (Language toggle, Sidebar toggle),
 * we dismiss the onboarding hints immediately.
 */
export const $hintsDismissed = atom<boolean>(false);

/**
 * Dismiss onboarding hints for this session (interaction detected).
 */
export function dismissHints() {
  $hintsDismissed.set(true);
}

/**
 * Call once from a useEffect to read the persisted value
 * from localStorage. Returns the hydrated value.
 */
export function hydrateSidebarHint(): boolean {
  const wasOpened = localStorage.getItem(STORAGE_KEY) === '1';
  $sidebarOpened.set(wasOpened);
  return wasOpened;
}

/**
 * Mark the sidebar as opened — persists to localStorage
 * so the hero hint never shows again.
 */
export function markSidebarOpened() {
  if ($sidebarOpened.get()) return; // already set, skip write
  $sidebarOpened.set(true);
  localStorage.setItem(STORAGE_KEY, '1');
}
