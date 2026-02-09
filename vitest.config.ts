/**
 * ═══════════════════════════════════════════════════════════
 * VITEST CONFIG — LYRIX OS TEST HARNESS
 * Configures React JSX, path aliases, jsdom, and setup files.
 * ═══════════════════════════════════════════════════════════
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  test: {
    // ── Environment ──
    environment: 'jsdom',
    globals: true,

    // ── Setup (jest-dom matchers) ──
    setupFiles: ['./test/setup.ts'],

    // ── Include patterns ──
    include: ['src/**/*.{test,spec}.{ts,tsx}'],

    // ── CSS handling (avoid parse errors on Tailwind imports) ──
    css: false,
  },
});
