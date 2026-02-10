/**
 * ═══════════════════════════════════════════════════════════
 * SPOTLIGHT HERO — LYRIX OS
 *
 * macOS-inspired window with interactive text headline and CTA folder.
 *
 * Key features:
 * 1. Per-character hover color cycling — hovering a letter triggers
 *    rapid color cycling through HOVER_COLORS at 80ms intervals.
 * 2. Mouse particle trail — white glowing dots follow the cursor
 *    within the container, fading after 400ms.
 *
 * NOTE: The sidebar/language onboarding hints have been moved to
 * OnboardingHints.tsx (fixed-position, viewport-level component)
 * to escape the Hero's `contain: layout|paint` boundary.
 *
 * PERFORMANCE:
 * - Translations are passed as props from Astro (SSR) to avoid
 *   bundling the full i18n dictionary in the client JS bundle.
 * - CLS prevention: explicit min-h per breakpoint on the headline
 *   container locks the layout before fonts load.
 * - No initial animations (opacity:1) on subtitle and CTA to prevent
 *   layout shifts during hydration.
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect, useCallback, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, ArrowRight } from 'lucide-react';
import { openContactModal } from '../stores/modalStore';
import type { HeroTranslations } from '../i18n/translations';

// ─── HOVER COLOR PALETTE ───
// 15 vivid colors used for the per-character hover effect.
// When a user hovers a letter, a random color is picked and
// then rapidly cycled at 80ms intervals until mouse leaves.
const HOVER_COLORS = [
  '#CCFF00', '#FF00FF', '#00FFFF', '#FF3366', '#FFD700',
  '#00FF88', '#FF6600', '#7B68EE', '#FF1493', '#00BFFF',
  '#39FF14', '#FF4500', '#DA70D6', '#FF0040', '#00FFAB',
];

// ─── PARTICLE ───

/** Represents a single particle in the mouse trail effect */
interface Particle {
  id: number;
  x: number;
  y: number;
}

// ─── PROPS ───

/** HeroContent receives pre-resolved translation strings from Hero.astro */
interface HeroContentProps {
  translations: HeroTranslations;
}

// ─── MAIN COMPONENT ───

export default function HeroContent({ translations: t }: HeroContentProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);

  // ─── PER-CHARACTER HOVER COLOR ───
  const [hoveredChar, setHoveredChar] = useState<number | null>(null);
  const [charColor, setCharColor] = useState('#CCFF00');

  const handleCharHover = useCallback((index: number) => {
    setHoveredChar(index);
    setCharColor(HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)]);
  }, []);

  // Rapid color cycling while a character is hovered
  useEffect(() => {
    if (hoveredChar === null) return;
    const interval = setInterval(() => {
      setCharColor(HOVER_COLORS[Math.floor(Math.random() * HOVER_COLORS.length)]);
    }, 80);
    return () => clearInterval(interval);
  }, [hoveredChar]);

  // Particle trail effect
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setParticles((prev) => [
      ...prev.slice(-20),
      { id: particleIdRef.current++, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => setParticles((prev) => prev.slice(1)), 400);
    return () => clearTimeout(timer);
  }, [particles]);



  return (
    <div className="min-h-screen w-full bg-lyrix-dark p-4 md:p-8">
      {/* ─── MACOS WINDOW CONTAINER ─── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-[calc(100vh-4rem)] rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden"
      >
        {/* ─── MACOS TITLE BAR ─── */}
        <div className="sticky top-0 z-50 flex items-center gap-2 px-4 py-3 bg-lyrix-steel/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs font-medium text-white/60 tracking-wide">
              {t['hero.finder']}
            </span>
          </div>
          <div className="w-14" />
        </div>

        {/* ─── GRID BACKGROUND ─── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* ─── PARTICLE TRAIL ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 0.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute w-3 h-3 rounded-full bg-white"
                style={{
                  left: particle.x - 6,
                  top: particle.y - 6,
                  boxShadow: '0 0 12px 4px rgba(255, 255, 255, 0.5)',
                  mixBlendMode: 'difference',
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* ─── CONTENT CONTAINER ─── */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 py-20">

          {/* ─── HEADLINE (Hover-Color) ─── */}
          {/* CLS fix: explicit min-h per breakpoint locks the box before fonts load */}
          <div
            className="hero-headline-container text-center mb-6 min-h-[72px] sm:min-h-[84px] md:min-h-[110px] lg:min-h-[84px] flex items-center justify-center"
          >
            <div
              role="presentation"
              aria-hidden="true"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] cursor-default select-none"
              style={{ fontFamily: 'var(--font-oswald, var(--font-barlow, sans-serif))' }}
              onMouseLeave={() => setHoveredChar(null)}
            >
              {t['hero.headline'].split('').map((char, i) => (
                <span
                  key={i}
                  onMouseEnter={() => handleCharHover(i)}
                  className="inline-block transition-colors duration-[50ms]"
                  style={{
                    color: hoveredChar === i ? charColor : undefined,
                    textShadow: hoveredChar === i ? `0 0 20px ${charColor}, 0 0 40px ${charColor}40` : 'none',
                    minWidth: char === ' ' ? '0.25em' : undefined,
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* ─── SUBTITLE ─── */}
          {/* CLS FIX: No initial animation - content visible immediately */}
          <motion.p
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm sm:text-base md:text-lg text-white/50 max-w-2xl leading-relaxed mb-14 md:mb-20 px-4"
          >
            {t['hero.subtitle']}
          </motion.p>

          {/* ─── MASTER NODE — Single CTA Folder ─── */}
          {/* CLS FIX: No initial animation - prevent layout shifts */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              onClick={() => openContactModal()}
              className="group relative cursor-pointer"
            >
              {/* Breathing neon glow — compositor-optimized (transform + opacity only) */}
              <div className="absolute -inset-3 rounded-3xl bg-[#CCFF00]/10 blur-2xl animate-pulse-perf group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-b from-[#CCFF00]/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

              {/* Card body — macOS folder style */}
              <div className="relative w-72 sm:w-80 md:w-96 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-md overflow-hidden transition-all duration-300 group-hover:border-[#CCFF00]/30 group-hover:bg-white/6">

                {/* Folder tab */}
                <div className="flex items-center gap-2 px-5 pt-4 pb-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#CCFF00]/10 border border-[#CCFF00]/20 group-hover:bg-[#CCFF00]/20 group-hover:border-[#CCFF00]/40 transition-all duration-300">
                    <FolderOpen className="w-5 h-5 text-[#CCFF00]" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-xs font-mono text-[#CCFF00]/60 uppercase tracking-widest">
                      Lyrix Digital
                    </span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse-perf" />
                </div>

                {/* Divider */}
                <div className="mx-5 border-t border-white/5" />

                {/* CTA label */}
                <div className="px-5 py-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base md:text-lg font-bold text-white tracking-wide group-hover:text-[#CCFF00] transition-colors duration-300">
                      {t['hero.cta']}
                    </span>
                    <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-[#CCFF00] group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <p className="text-xs text-white/30 font-mono mt-2">
                    {t['hero.cta.hint']}
                  </p>
                </div>

                {/* Footer bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-white/2 border-t border-white/5">
                  <span className="text-[11px] text-white/25 font-mono">
                    {t['hero.cta.meta']}
                  </span>
                  <span className="text-[11px] text-white/25 font-mono">
                    Type: Project
                  </span>
                </div>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
