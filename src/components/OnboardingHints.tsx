/**
 * ═══════════════════════════════════════════════════════════
 * ONBOARDING HINTS — LYRIX OS
 *
 * Two fixed-position indicators that appear on page load to
 * orient first-time visitors:
 *   1. Menu Pointer     → anchored to the left edge (desktop sidebar)
 *   2. Language Pointer  → anchored above the StatusBar language toggle
 *
 * Both hints auto-dismiss after exactly 5 seconds with a smooth
 * fade-out. They use `pointer-events: none` so they never block
 * interaction with the underlying UI.
 *
 * MUST be rendered OUTSIDE any `contain: layout|paint` ancestors
 * (e.g. Hero's <header>) because these create new containing
 * blocks that trap `position: fixed` descendants.
 *
 * Placed at the page level in index.astro / [lang]/index.astro,
 * alongside StatusBar and modals.
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Globe } from 'lucide-react';
import { useStore } from '@nanostores/react';
import { $hintsDismissed } from '../stores/sidebarHintStore';

interface OnboardingHintsProps {
  lang?: string;
}

const HINT_DURATION_MS = 5000;
const FADE_DURATION_S = 0.8;

export default function OnboardingHints({ lang = 'en' }: OnboardingHintsProps) {
  const [visible, setVisible] = useState(true);
  const dismissed = useStore($hintsDismissed);

  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => setVisible(false), HINT_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  // Immediate dismissal if interaction detected
  useEffect(() => {
    if (dismissed) setVisible(false);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ─── MENU POINTER (Desktop only, lg:+) ─── */}
          <motion.div
            key="menu-hint"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="hidden lg:flex fixed left-14 top-1/2 -translate-y-1/2 z-60 items-center gap-2 pointer-events-none"
          >
            {/* Pulsing glow ring */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-10 h-10 rounded-full bg-[#CCFF00]/20"
              />
              <motion.div
                animate={{ x: [0, -6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5 text-[#CCFF00]" />
              </motion.div>
            </div>

            {/* Label */}
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[11px] font-mono text-[#CCFF00]/70 uppercase tracking-widest whitespace-nowrap"
            >
              Menu
            </motion.span>
          </motion.div>

          {/* ─── LANGUAGE POINTER (All viewports) ─── */}
          <motion.div
            key="lang-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="fixed bottom-20 right-16 sm:right-[13.7rem] md:right-[14.6rem] z-60 flex items-center gap-2 pointer-events-none"
          >
            {/* Label */}
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[11px] font-mono text-[#CCFF00]/70 uppercase tracking-widest whitespace-nowrap"
            >
              LANGUAGE
            </motion.span>

            {/* Pulsing glow ring + icon */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-10 h-10 rounded-full bg-[#CCFF00]/20"
              />
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 backdrop-blur-sm"
              >
                <Globe className="w-5 h-5 text-[#CCFF00]" />
              </motion.div>

              {/* Downward arrow indicator pointing to StatusBar (Centered relative to globe) */}
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[#CCFF00]/50 text-lg"
                aria-hidden="true"
              >
                ▼
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
