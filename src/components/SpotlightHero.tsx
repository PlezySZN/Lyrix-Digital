/**
 * ═══════════════════════════════════════════════════════════
 * SPOTLIGHT HERO — LYRIX OS
 * macOS-inspired window with text-scramble headline
 * and a single "Master Node" CTA folder
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect, useCallback, type MouseEvent } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FolderOpen, ArrowRight } from 'lucide-react';
import { openContactModal } from '../stores/modalStore';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

// ─── TEXT SCRAMBLE HOOK ───
// Decrypts text character-by-character from random glyphs

const GLYPHS = 'X#01!>_░▒▓█▀▄';

function useTextScramble(text: string, { delay = 0, duration = 1200, trigger = true } = {}) {
  const [display, setDisplay] = useState('');
  const frameRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!trigger) { setDisplay(''); return; }

    const chars = text.split('');
    const total = chars.length;
    const perChar = duration / total;
    let revealed = 0;

    const startTimeout = setTimeout(() => {
      // Tick: reveal one more real character per interval
      const tick = () => {
        revealed++;
        const out = chars.map((ch, i) => {
          if (i < revealed) return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }).join('');
        setDisplay(out);

        if (revealed < total) {
          frameRef.current = setTimeout(tick, perChar);
        }
      };

      // Initial scrambled state
      setDisplay(chars.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join(''));
      frameRef.current = setTimeout(tick, perChar);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(frameRef.current);
    };
  }, [text, delay, duration, trigger]);

  return display;
}

// ─── PARTICLE ───

interface Particle {
  id: number;
  x: number;
  y: number;
}

// ─── MAIN COMPONENT ───

export default function SpotlightHero({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headlineRef, { once: true, margin: '-100px' });
  const particleIdRef = useRef(0);

  // Scramble headline text
  const scrambledHeadline = useTextScramble(t('hero.headline'), {
    delay: 400,
    duration: 1400,
    trigger: isInView,
  });

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

  // Staggered reveal variants
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
  };
  const wordVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

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
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-110 transition-all cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:brightness-110 transition-all cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] hover:brightness-110 transition-all cursor-pointer" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs font-medium text-white/40 tracking-wide">
              {t('hero.finder')}
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
                className="absolute w-2 h-2 rounded-full bg-white"
                style={{
                  left: particle.x - 4,
                  top: particle.y - 4,
                  boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.4)',
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* ─── CONTENT CONTAINER ─── */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 py-20">

          {/* ─── HEADLINE (Scramble) ─── */}
          <motion.div
            ref={headlineRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-center mb-6"
          >
            <motion.h1
              variants={wordVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
              style={{ fontFamily: "'Oswald', 'Barlow Condensed', sans-serif" }}
            >
              {scrambledHeadline || '\u00A0'}
            </motion.h1>
          </motion.div>

          {/* ─── SUBTITLE ─── */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-center text-sm sm:text-base md:text-lg text-white/50 max-w-2xl leading-relaxed mb-14 md:mb-20 px-4"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* ─── MASTER NODE — Single CTA Folder ─── */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.92 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openContactModal()}
              className="group relative cursor-pointer"
            >
              {/* Breathing neon glow */}
              <div className="absolute -inset-3 rounded-3xl bg-[#CCFF00]/10 blur-2xl animate-pulse opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-b from-[#CCFF00]/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500" />

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
                  <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                </div>

                {/* Divider */}
                <div className="mx-5 border-t border-white/5" />

                {/* CTA label */}
                <div className="px-5 py-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base md:text-lg font-bold text-white tracking-wide group-hover:text-[#CCFF00] transition-colors duration-300">
                      {t('hero.cta')}
                    </span>
                    <ArrowRight className="w-5 h-5 text-white/40 group-hover:text-[#CCFF00] group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                  <p className="text-xs text-white/30 font-mono mt-2">
                    {t('hero.cta.hint')}
                  </p>
                </div>

                {/* Footer bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-white/2 border-t border-white/5">
                  <span className="text-[11px] text-white/25 font-mono">
                    {t('hero.cta.meta')}
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
