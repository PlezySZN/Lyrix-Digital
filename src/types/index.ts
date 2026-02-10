/**
 * ═══════════════════════════════════════════════════════════
 * SHARED TYPES — LYRIX OS
 * Centralized TypeScript interfaces used across components
 * ═══════════════════════════════════════════════════════════
 */

import type { LucideIcon } from 'lucide-react';

// ─── PROJECT (Portfolio / Modal) ───

/** A single image preview entry for a project */
export interface ProjectPreview {
  /** Render strategy: gradient placeholder or real image */
  type: 'gradient' | 'image';
  /** Gradient tuple OR image URL string */
  background: [string, string] | string;
  /** Caption label shown beneath the preview */
  label: string;
}

/** Structural (non-translatable) project data stored in `src/data/projects.ts` */
export interface ProjectStructure {
  id: string;
  client: string;
  typeColor: string;
  year: string;
  previewGradient: [string, string];
  previewGradients: [string, string][];
  /** Optional live URL (language-agnostic base). Provide full URL for the default language. */
  liveUrl?: string;
  /** Optional live URL for Spanish variant */
  liveUrlEs?: string;
  /**
   * Paths to real screenshots / images (relative to `public/` or remote URLs).
   * If empty or missing, the UI renders a stylish "NO_SIGNAL" placeholder.
   */
  images?: string[];
  /** Whether this project is not yet live (renders yellow status) */
  comingSoon?: boolean;
}

/** Fully-resolved project with translatable fields merged in */
export interface Project {
  id: string;
  client: string;
  type: string;
  typeColor: string;
  status: string;
  year: string;
  description: string;
  previewGradient: [string, string];
  previews: ProjectPreview[];
  /** Optional live URL for the current language */
  liveUrl?: string;
  /** Optional paths to real images */
  images?: string[];
  /** Whether this project is not yet live */
  comingSoon?: boolean;
}

// ─── SERVICE (Specs Section) ───

export interface ServiceSpec {
  label: string;
  value: string;
}

export interface ServiceModule {
  icon: LucideIcon;
  title: string;
  codeName: string;
  specs: ServiceSpec[];
  description: string;
  isOptional: boolean;
}

// ─── REVIEW (Telemetry Section) ───

export interface Review {
  id: string;
  source: string;
  signal: number;
  latency: string;
  payload: string;
  user: string;
  role: string;
  clientType: string;
}

// ─── PROCESS STEP (Deployment Sequence) ───

export interface ProcessStep {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

// ─── FAQ (Knowledge Base) ───

export interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  _response: string;
}
