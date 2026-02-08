/**
 * ═══════════════════════════════════════════════════════════
 * MODAL STORE — LYRIX OS v1.1
 * Global state management for modals using nanostores
 * ═══════════════════════════════════════════════════════════
 */

import { atom } from 'nanostores';
import type { Lang } from '../i18n/ui';

// ─── GLOBAL LANGUAGE STATE ───

/** Current language — set by the page, readable by all React islands */
export const $lang = atom<Lang>('es');

export function setLang(lang: Lang) {
  $lang.set(lang);
}

// ─── CONTACT MODAL ───

export type ContactPreset = 'INDUSTRY' | 'CREATIVE' | 'PERSONAL' | '';

/** Whether the Contact Modal is open */
export const $contactModalOpen = atom(false);

/** Pre-selected subject/sector when opening from a specific context */
export const $contactSubject = atom<string>('');

/** Active card preset (drives title, sector auto-select, placeholder) */
export const $contactPreset = atom<ContactPreset>('');

/** Open the contact modal with an optional preset or raw subject string */
export function openContactModal(presetOrSubject: ContactPreset | string = '') {
  const presets: ContactPreset[] = ['INDUSTRY', 'CREATIVE', 'PERSONAL'];
  if (presets.includes(presetOrSubject as ContactPreset)) {
    $contactPreset.set(presetOrSubject as ContactPreset);
    $contactSubject.set('');
  } else {
    $contactPreset.set('');
    $contactSubject.set(presetOrSubject);
  }
  $contactModalOpen.set(true);
}

/** Close the contact modal and reset subject */
export function closeContactModal() {
  $contactModalOpen.set(false);
  $contactSubject.set('');
  $contactPreset.set('');
}

// ─── PROJECT MODAL ───

export interface ProjectData {
  id: string;
  client: string;
  type: string;
  typeColor: string;
  status: string;
  year: string;
  description: string;
  previewGradient: [string, string];
  previews?: Array<{
    type: 'gradient' | 'image';
    background: [string, string] | string;
    label: string;
  }>;
}

/** Whether the Project Modal is open */
export const $projectModalOpen = atom(false);

/** The active project to display in the modal */
export const $activeProject = atom<ProjectData | null>(null);

/** Open the project modal with a specific project */
export function openProjectModal(project: ProjectData) {
  $activeProject.set(project);
  $projectModalOpen.set(true);
}

/** Close the project modal and clear active project */
export function closeProjectModal() {
  $projectModalOpen.set(false);
  $activeProject.set(null);
}
