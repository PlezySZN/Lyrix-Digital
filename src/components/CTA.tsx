/**
 * ═══════════════════════════════════════════════════════════
 * SYSTEM EXECUTION — LYRIX OS
 * Final CTA section styled as command center terminal
 * ═══════════════════════════════════════════════════════════
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal, ArrowRight } from 'lucide-react';
import { openContactModal } from '../stores/modalStore';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

// ─── ROBUST TYPEWRITER HOOK ───
// All mutable state lives in refs so setTimeout closures never go stale.

function useTypewriter(
  phrases: string[],
  { typeSpeed = 80, deleteSpeed = 40, pauseAfterType = 2500, pauseAfterDelete = 400 } = {},
) {
  const [display, setDisplay] = useState('');
  const idx = useRef(0);        // current phrase index
  const char = useRef(0);       // current character position
  const deleting = useRef(false);
  const raf = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keep phrases in a ref so the effect doesn't restart when
  // the parent re-renders with the same translated array.
  const phrasesRef = useRef(phrases);
  phrasesRef.current = phrases;

  const tick = useCallback(() => {
    const list = phrasesRef.current;
    if (!list.length) return;
    const current = list[idx.current % list.length] || '';

    if (!deleting.current) {
      // ─── TYPING ───
      char.current++;
      setDisplay(current.slice(0, char.current));

      if (char.current >= current.length) {
        // Finished typing — pause, then start deleting
        raf.current = setTimeout(() => {
          deleting.current = true;
          tick();
        }, pauseAfterType);
        return;
      }
      raf.current = setTimeout(tick, typeSpeed);
    } else {
      // ─── DELETING ───
      char.current--;
      setDisplay(current.slice(0, char.current));

      if (char.current <= 0) {
        // Finished deleting — advance phrase, pause, then type next
        deleting.current = false;
        idx.current = (idx.current + 1) % list.length;
        raf.current = setTimeout(tick, pauseAfterDelete);
        return;
      }
      raf.current = setTimeout(tick, deleteSpeed);
    }
  }, [typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete]);

  useEffect(() => {
    raf.current = setTimeout(tick, pauseAfterDelete);
    return () => clearTimeout(raf.current);
  }, [tick, pauseAfterDelete]);

  return display;
}

// ─── MAIN COMPONENT ───

export default function CTA({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const statusMessages = [
    t('cta.status1'),
    t('cta.status2'),
    t('cta.status3'),
    t('cta.status4'),
  ];

  const statusText = useTypewriter(statusMessages);

  return (
    <section id="cta-section" ref={containerRef} className="relative w-full bg-lyrix-carbon py-16 md:py-24" aria-label={lang === 'es' ? 'Contacto' : 'Contact'}>
      {/* ─── BACKGROUND GRID PATTERN ─── */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(204,255,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(204,255,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* ─── MAIN TERMINAL CONTAINER ─── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 40 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          {/* Outer glow */}
          <div className="absolute -inset-4 rounded-2xl bg-[#CCFF00]/10 blur-2xl" />
          
          {/* Terminal window */}
          <div className="relative rounded-2xl border border-[#CCFF00]/50 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl shadow-[#CCFF00]/5 overflow-hidden">
            {/* ─── TERMINAL TITLE BAR ─── */}
            <div className="flex items-center gap-2 px-6 py-4 bg-lyrix-steel/80 backdrop-blur-xl border-b border-[#CCFF00]/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex items-center gap-2 flex-1 justify-center">
                <Terminal className="w-4 h-4 text-[#CCFF00]/60" />
                <span className="text-sm font-mono text-[#CCFF00]/60 tracking-wide">
                  {t('cta.terminal')}
                </span>
              </div>
              <div className="w-14" />
            </div>

            {/* ─── TERMINAL CONTENT ─── */}
            <div className="p-8 md:p-12">
              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20">
                  <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-widest">
                    {t('cta.section.label')}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-mono text-[#CCFF00]">{'>'}</span>
                  <span className="text-sm font-mono text-white/60">
                    {statusText}
                  </span>
                  <span className="text-sm font-mono text-[#CCFF00] animate-pulse">
                    █
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                  <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                  <span>{t('cta.systems')}</span>
                  <span className="mx-2">•</span>
                  <span>{t('cta.slots')}</span>
                  <span className="mx-2">•</span>
                  <span>{t('cta.response')}</span>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mb-6 md:mb-8"
              >
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 tracking-tight leading-tight">
                  
                  {t('cta.headline1')}
                  <br />
                  <span className="text-[#CCFF00]">{t('cta.headline2')}</span>
                </h2>
                
                <p className="text-base md:text-lg lg:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed px-4">
                  {t('cta.subheadline')}
                </p>
              </motion.div>

              {/* Execute Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-6 md:mb-8 mt-4 md:mt-0"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openContactModal()}
                  className="group relative w-full overflow-hidden rounded-xl bg-[#CCFF00] text-black font-bold text-base md:text-lg lg:text-xl py-4 md:py-6 px-6 md:px-8 transition-all duration-300 hover:shadow-2xl hover:shadow-[#CCFF00]/25"
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-[#CCFF00] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                  
                  {/* Button content */}
                  <div className="relative flex items-center justify-center gap-3">
                    <span className="font-mono tracking-wider">
                      {t('cta.button')}
                    </span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
                </motion.button>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center"
              >
                <p className="text-sm text-white/60 font-mono mb-4">
                  {t('cta.trust')}
                </p>
                
                <div className="flex items-center justify-center gap-6 text-xs font-mono text-white/30">
                  <span>{t('cta.delivery')}</span>
                  <span>{t('cta.source')}</span>
                  <span>{t('cta.support')}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ─── FOOTER METADATA — Visible trust signals (E-E-A-T) ─── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-12 text-center"
          role="contentinfo"
        >
          {/* ─── BUSINESS TRUST BAR ─── */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-white/30">
            <a href="tel:+17876644109" className="hover:text-[#CCFF00]/60 transition-colors">
              {t('cta.phone')}
            </a>
            <span aria-hidden="true">·</span>
            <span>{t('cta.address')}</span>
            <span aria-hidden="true">·</span>
            <a href="https://instagram.com/lyrix" target="_blank" rel="noopener noreferrer" className="hover:text-[#CCFF00]/60 transition-colors">
              {t('cta.social')}
            </a>
          </div>
          {/* ─── LEGAL ─── */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs font-mono text-white/20">
            <span>{t('cta.copyright')}</span>
            <span className="hidden md:inline" aria-hidden="true">|</span>
            <span>{t('cta.privacy')}</span>
            <span className="hidden md:inline" aria-hidden="true">|</span>
            <span>{t('cta.terms')}</span>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}