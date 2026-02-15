/**
 * ═══════════════════════════════════════════════════════════
 * CONSENT BANNER — LYRIX OS "SYSTEM ALERT"
 *
 * Dual-purpose component:
 * 1. Legal: Cookie/analytics consent + links to Privacy & Terms
 * 2. Sales: Scarcity, urgency, social proof & limited-time offer
 *
 * Psychology stack:
 * - Scarcity:     "Only X project slots left this month"
 * - Urgency:      Countdown timer to end of current month
 * - Social proof:  "X businesses in PR already trust us"
 * - Anchoring:    Crossed-out "original" price → discounted price
 * - Loss aversion: "Offer expires" framing
 * - Reciprocity:  Free audit / consultation gift
 *
 * Persisted via localStorage — shown once per visitor.
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, Users, Zap, X, ChevronRight, Copy, Check } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

const STORAGE_KEY = 'lyrix_consent_v1';
const MIN_DELAY_MS = 4000;       // minimum time on page before showing
const SCROLL_THRESHOLD = 0.25;   // 25% of viewport height scrolled

// ─── ENGAGEMENT HOOK ───

/**
 * Detects real user engagement before triggering the banner.
 * Engagement = ANY of:
 *   - Scroll past 25% of viewport height
 *   - Click / tap anywhere on the page
 *   - Keyboard interaction (Tab, Enter, etc.)
 *
 * Plus a minimum time delay so the hero finishes loading first.
 * This prevents the banner from popping for passive/bounce visits
 * and avoids inflated impression metrics.
 */
function useUserEngagement(): boolean {
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let minTimePassed = false;
    let hasEngaged = false;

    function tryShow() {
      if (minTimePassed && hasEngaged && !engaged) {
        setEngaged(true);
        cleanup();
      }
    }

    function onScroll() {
      if (window.scrollY > window.innerHeight * SCROLL_THRESHOLD) {
        hasEngaged = true;
        tryShow();
      }
    }

    function onInteract() {
      hasEngaged = true;
      tryShow();
    }

    const timer = setTimeout(() => {
      minTimePassed = true;
      tryShow();
    }, MIN_DELAY_MS);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('click', onInteract, { once: true });
    window.addEventListener('keydown', onInteract, { once: true });
    window.addEventListener('touchstart', onInteract, { once: true });

    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('touchstart', onInteract);
    }

    return cleanup;
  }, [engaged]);

  return engaged;
}

// ─── COUNTDOWN HOOK ───

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    function calc() {
      const now = new Date();
      // End of current month
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = Math.max(0, endOfMonth.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ days, hours, mins });
    }
    calc();
    const id = setInterval(calc, 60_000); // update every minute
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

// ─── COMPONENT ───

export default function ConsentBanner({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [copied, setCopied] = useState(false);
  const userEngaged = useUserEngagement();

  const PROMO_CODE = 'LYRIX20';

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(PROMO_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);
  const { days, hours, mins } = useCountdown();

  // Current month name for the offer
  const monthName = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString(lang === 'es' ? 'es-PR' : 'en-US', { month: 'long' });
  }, [lang]);

  // Show only after user engagement + localStorage check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return; // already accepted
    if (!userEngaged) return; // wait for real engagement

    setVisible(true);
    trackEvent('consent_banner_shown', { trigger: 'user_engagement' });
  }, [userEngaged]);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setDismissed(true);
    trackEvent('consent_accept', { source: 'banner' });
  };

  const handleClaim = () => {
    trackEvent('consent_claim_offer', { source: 'banner' });
    setClaimed(true);
  };

  const handleDismissAfterClaim = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    setDismissed(true);
  };

  const privacyUrl = `/${lang}/privacy/`;
  const termsUrl = `/${lang}/terms/`;

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-9998 bg-black/60 backdrop-blur-sm"
            onClick={handleAccept}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 40 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-9999 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl shadow-black/80 overflow-hidden">

              {/* ═══ TITLE BAR ═══ */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  </div>
                  <span className="text-[10px] font-mono text-white/75 tracking-wider ml-1.5">
                    {t('consent.titlebar' as any)}
                  </span>
                </div>
                <button
                  onClick={handleAccept}
                  className="p-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5 text-white/75" />
                </button>
              </div>

              {/* ═══ CONTENT ═══ */}
              <div className="px-5 py-5 md:px-6 md:py-6 space-y-5">

                {/* ── PROMO CODE REVEAL (shown after claim) ── */}
                {claimed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    {/* Success header */}
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#28C840]/10 border border-[#28C840]/20">
                      <Check className="w-4 h-4 text-[#28C840] shrink-0" />
                      <span className="text-xs font-mono font-bold text-[#28C840] uppercase tracking-widest">
                        {t('consent.promo.unlocked' as any)}
                      </span>
                    </div>

                    {/* Promo code display */}
                    <div className="text-center space-y-3">
                      <p className="text-sm text-white/70 font-mono">
                        {t('consent.promo.instruction' as any)}
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <div className="px-6 py-3 rounded-lg bg-[#CCFF00]/10 border-2 border-dashed border-[#CCFF00]/40">
                          <span className="text-2xl font-mono font-black text-[#CCFF00] tracking-[0.3em] select-all">
                            {PROMO_CODE}
                          </span>
                        </div>
                        <button
                          onClick={handleCopyCode}
                          className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                          aria-label="Copy code"
                        >
                          {copied
                            ? <Check className="w-5 h-5 text-[#28C840]" />
                            : <Copy className="w-5 h-5 text-white/60" />
                          }
                        </button>
                      </div>
                      {copied && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[11px] font-mono text-[#28C840]"
                        >
                          {t('consent.promo.copied' as any)}
                        </motion.p>
                      )}
                      <p className="text-xs text-white/50 font-mono">
                        {t('consent.promo.hint' as any)}
                      </p>
                    </div>

                    {/* Got it — dismiss */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleDismissAfterClaim}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#CCFF00] text-black text-sm font-mono font-bold uppercase tracking-wider hover:bg-[#d4ff33] transition-all duration-200 cursor-pointer"
                    >
                      {t('consent.promo.gotit' as any)}
                    </motion.button>
                  </motion.div>
                ) : (
                  /* ── Original offer content ── */
                  <>

                {/* ── Urgency header: Limited offer ── */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#CCFF00]/5 border border-[#CCFF00]/15">
                  <Zap className="w-4 h-4 text-[#CCFF00] shrink-0" />
                  <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-widest">
                    {(t('consent.offer.label' as any) as string).replace('{month}', monthName)}
                  </span>
                </div>

                {/* ── Headline + discount info ── */}
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight font-(family-name:--font-oswald) uppercase leading-tight">
                    {t('consent.headline' as any)}
                  </h2>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">
                    {t('consent.newagency' as any)}
                  </p>
                </div>

                {/* ── Scarcity + Social proof indicators ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Scarcity */}
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/2 border border-white/5">
                    <Users className="w-4 h-4 text-[#FF5F57] shrink-0" />
                    <div>
                      <span className="block text-[10px] font-mono text-white/75 uppercase tracking-wider">
                        {t('consent.slots.label' as any)}
                      </span>
                      <span className="text-sm font-mono text-white font-bold">
                        {t('consent.slots.value' as any)}
                      </span>
                    </div>
                  </div>

                  {/* Countdown */}
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/2 border border-white/5">
                    <Clock className="w-4 h-4 text-[#FEBC2E] shrink-0" />
                    <div>
                      <span className="block text-[10px] font-mono text-white/75 uppercase tracking-wider">
                        {t('consent.timer.label' as any)}
                      </span>
                      <span className="text-sm font-mono text-white font-bold">
                        {days}{t('consent.timer.d' as any)} {hours}{t('consent.timer.h' as any)} {mins}{t('consent.timer.m' as any)}
                      </span>
                    </div>
                  </div>

                  {/* Social proof */}
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/2 border border-white/5">
                    <Shield className="w-4 h-4 text-[#28C840] shrink-0" />
                    <div>
                      <span className="block text-[10px] font-mono text-white/75 uppercase tracking-wider">
                        {t('consent.proof.label' as any)}
                      </span>
                      <span className="text-sm font-mono text-white font-bold">
                        {t('consent.proof.value' as any)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── CTA: Claim the offer ── */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClaim}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#CCFF00] text-black text-sm font-mono font-bold uppercase tracking-wider hover:bg-[#d4ff33] transition-all duration-200 cursor-pointer"
                >
                  {t('consent.cta' as any)}
                  <ChevronRight className="w-4 h-4" />
                </motion.button>

                {/* ── Skip link ── */}
                <button
                  onClick={handleAccept}
                  className="block w-full text-center text-xs font-mono text-white/75 hover:text-white/90 transition-colors cursor-pointer"
                >
                  {t('consent.skip' as any)}
                </button>

                </>
                )}

                {/* ═══ LEGAL: Privacy + Terms consent ═══ */}
                <div className="pt-3 border-t border-white/5">
                  <p className="text-[11px] text-white/75 leading-relaxed text-center">
                    {t('consent.legal.prefix' as any)}{' '}
                    <a href={privacyUrl} className="underline text-white/80 hover:text-white transition-colors">
                      {t('consent.legal.privacy' as any)}
                    </a>{' '}
                    {t('consent.legal.and' as any)}{' '}
                    <a href={termsUrl} className="underline text-white/80 hover:text-white transition-colors">
                      {t('consent.legal.terms' as any)}
                    </a>
                    {t('consent.legal.suffix' as any)}
                  </p>
                </div>
              </div>

              {/* ═══ BOTTOM STATUS BAR ═══ */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-white/1">
                <span className="text-[10px] font-mono text-white/75">
                  {t('consent.footer.encrypted' as any)}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-white/75">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#28C840] animate-pulse" />
                  {t('consent.footer.secure' as any)}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
