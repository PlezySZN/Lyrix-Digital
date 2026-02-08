/**
 * ═══════════════════════════════════════════════════════════
 * MODAL STORE — LYRIX OS v1.1
 * Global state management for modals using nanostores
 * ═══════════════════════════════════════════════════════════
 */

import { atom } from 'nanostores';

// ─── CONTACT MODAL ───

/** Whether the Contact Modal is open */
export const $contactModalOpen = atom(false);

/** Pre-selected subject/sector when opening from a specific context */
export const $contactSubject = atom<string>('');

/** Open the contact modal with an optional subject pre-selection */
export function openContactModal(subject = '') {
  $contactSubject.set(subject);
  $contactModalOpen.set(true);
}

/** Close the contact modal and reset subject */
export function closeContactModal() {
  $contactModalOpen.set(false);
  $contactSubject.set('');
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
