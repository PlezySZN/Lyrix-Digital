/**
 * ═══════════════════════════════════════════════════════════
 * WINDOW STORE — LYRIX OS v1.2
 * Global state for OS-style window management (Open/Collapsed/Docked)
 * ═══════════════════════════════════════════════════════════
 */

import { map } from 'nanostores';

// ─── TYPES ───

export type WindowState = 'OPEN' | 'COLLAPSED' | 'DOCKED';

export type WindowId = 'specs' | 'logs' | 'deployment' | 'telemetry' | 'manual';

export interface WindowMeta {
  id: WindowId;
  title: string;
  icon: string; // lucide icon name
  sectionId: string; // DOM id for scroll targeting
}

// ─── WINDOW REGISTRY ───
// Maps each window ID to its display metadata

export const WINDOW_REGISTRY: Record<WindowId, WindowMeta> = {
  specs: {
    id: 'specs',
    title: 'Business_Architecture.exe',
    icon: 'Cpu',
    sectionId: 'capabilities',
  },
  logs: {
    id: 'logs',
    title: 'Project_Database.log',
    icon: 'FolderOpen',
    sectionId: 'projects',
  },
  deployment: {
    id: 'deployment',
    title: 'Initiation_Protocol.sh',
    icon: 'Rocket',
    sectionId: 'process',
  },
  telemetry: {
    id: 'telemetry',
    title: 'Incoming_Telemetry.stream',
    icon: 'Radio',
    sectionId: 'testimonials',
  },
  manual: {
    id: 'manual',
    title: 'Manual_Override.readme',
    icon: 'BookOpen',
    sectionId: 'manual',
  },
};

// ─── STATE ───

export const $windows = map<Record<WindowId, WindowState>>({
  specs: 'OPEN',
  logs: 'OPEN',
  deployment: 'OPEN',
  telemetry: 'OPEN',
  manual: 'OPEN',
});

// ─── ACTIONS ───

/** Red button: Dock the window (hide completely, show in dock) */
export function closeWindow(id: WindowId) {
  $windows.setKey(id, 'DOCKED');
}

/** Yellow button: Collapse window (show only title bar) */
export function minimizeWindow(id: WindowId) {
  $windows.setKey(id, 'COLLAPSED');
}

/** Green button / dock click: Restore window to full open */
export function restoreWindow(id: WindowId) {
  $windows.setKey(id, 'OPEN');
}

/** Toggle between OPEN and COLLAPSED */
export function toggleWindow(id: WindowId) {
  const current = $windows.get()[id];
  if (current === 'OPEN') {
    $windows.setKey(id, 'COLLAPSED');
  } else {
    $windows.setKey(id, 'OPEN');
  }
}

/** Get all docked windows */
export function getDockedWindows(): WindowId[] {
  const state = $windows.get();
  return (Object.keys(state) as WindowId[]).filter(
    (id) => state[id] === 'DOCKED'
  );
}

/** Get all window IDs for dock rendering (all managed windows) */
export const ALL_WINDOW_IDS: WindowId[] = ['specs', 'logs', 'deployment', 'telemetry', 'manual'];
