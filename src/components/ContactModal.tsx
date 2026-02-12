/**
 * ═══════════════════════════════════════════════════════════
 * CONTACT MODAL — LYRIX OS v1.1
 * Glassmorphic "System Configuration" overlay with lead capture form
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { X, Send, Film, Loader2, AlertTriangle } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { trackEvent } from '../lib/analytics';
import {
  $contactModalOpen,
  $contactSubject,
  $contactPreset,
  closeContactModal,
  type ContactPreset,
} from '../stores/modalStore';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';
import { contactSchema, getFieldErrors } from '../schemas/contact';

// ─── TURNSTILE TYPES ───

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';
const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';

function ensureTurnstileScriptLoaded() {
  if (document.getElementById(TURNSTILE_SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = TURNSTILE_SCRIPT_ID;
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

// ─── DATA ───

const budgetRanges = [
  '$800–$1.5K',
  '$1.5K–$3K',
  '$3K–$6K',
  '$6K–$10K',
  '$10K+',
];

// ─── COMPONENT ───

export default function ContactModal({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);

  const sectors = [
    { value: '', label: t('contact.sector.placeholder') },
    { value: 'Industry', label: t('contact.sector.industry') },
    { value: 'Creative', label: t('contact.sector.creative') },
    { value: 'Personal', label: t('contact.sector.personal') },
    { value: 'Business', label: t('contact.sector.business') },
  ];

  const maintenanceModes = [
    { value: 'managed', label: t('contact.maintenance.managed'), desc: t('contact.maintenance.managed.desc') },
    { value: 'handover', label: t('contact.maintenance.handover'), desc: t('contact.maintenance.handover.desc') },
    { value: 'undecided', label: t('contact.maintenance.undecided'), desc: t('contact.maintenance.undecided.desc') },
  ];
  const isOpen = useStore($contactModalOpen);
  const prefilledSubject = useStore($contactSubject);
  const preset = useStore($contactPreset);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sector, setSector] = useState('');
  const [maintenance, setMaintenance] = useState('undecided');
  const [budget, setBudget] = useState('');
  const [cinematic, setCinematic] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // ─── SECURITY STATE ───
  const [_honeypot, setHoneypot] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // ─── PRESET MAPPING ───
  const presetToSector: Record<ContactPreset, string> = {
    INDUSTRY: 'Industry',
    CREATIVE: 'Creative',
    PERSONAL: 'Personal',
    '': '',
  };

  const presetTitleKey: Record<ContactPreset, string> = {
    INDUSTRY: 'contact.titlebar.industry',
    CREATIVE: 'contact.titlebar.creative',
    PERSONAL: 'contact.titlebar.personal',
    '': 'contact.titlebar',
  };

  const presetPlaceholderKey: Record<ContactPreset, string> = {
    INDUSTRY: 'contact.placeholder.industry',
    CREATIVE: 'contact.placeholder.creative',
    PERSONAL: 'contact.placeholder.personal',
    '': 'contact.message.placeholder',
  };

  // Resolve dynamic values
  const modalTitle = t(presetTitleKey[preset || ''] as any);
  const messagePlaceholder = t(presetPlaceholderKey[preset || ''] as any);

  // Sync pre-filled subject / preset when modal opens
  useEffect(() => {
    if (isOpen) {
      if (preset) {
        setSector(presetToSector[preset] || '');
      } else if (prefilledSubject) {
        setSector(prefilledSubject);
      }
    }
  }, [isOpen, prefilledSubject, preset]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContactModal();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // ─── TURNSTILE: Invisible CAPTCHA ───
  useEffect(() => {
    if (!isOpen || !TURNSTILE_SITE_KEY) return;

    ensureTurnstileScriptLoaded();

    const renderWidget = () => {
      if (!turnstileContainerRef.current || !window.turnstile) return;
      if (turnstileWidgetId.current !== null) return;

      turnstileWidgetId.current = window.turnstile.render(
        turnstileContainerRef.current,
        {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => setTurnstileToken(token),
          'expired-callback': () => {
            setTurnstileToken('');
            if (turnstileWidgetId.current !== null && window.turnstile) {
              window.turnstile.reset(turnstileWidgetId.current);
            }
          },
          'error-callback': () => setTurnstileToken(''),
          theme: 'dark',
          size: 'invisible',
        }
      );
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 200);
      const timeout = setTimeout(() => clearInterval(interval), 10_000);
      return () => { clearInterval(interval); clearTimeout(timeout); };
    }

    return () => {
      if (turnstileWidgetId.current !== null && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
        turnstileWidgetId.current = null;
      }
      setTurnstileToken('');
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setError('');

    // ─── CLIENT-SIDE ZOD VALIDATION ───
    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      sector,
      maintenance,
      budget,
      cinematic,
      message: message.trim(),
      lang,
      _honeypot,
      turnstileToken,
    };

    const result = contactSchema.safeParse(payload);
    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error));
      return;
    }

    setSending(true);

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) throw new Error('API error');

      trackEvent('generate_lead', {
        sector: sector || 'not_selected',
        budget: budget || 'not_selected',
        cinematic,
        lang,
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setPhone('');
        setSector('');
        setMaintenance('undecided');
        setBudget('');
        setCinematic(false);
        setMessage('');
        setError('');
        setFieldErrors({});
        setHoneypot('');
        closeContactModal();
      }, 2500);
    } catch {
      setError(t('contact.error'));
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          onClick={closeContactModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Modal Window */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-2xl"
          >
            {/* ─── TITLE BAR ─── */}
            <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 bg-lyrix-steel/90 backdrop-blur-xl border-b border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={closeContactModal}
                  aria-label={lang === 'es' ? 'Cerrar ventana' : 'Close window'}
                  className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-125 transition-all"
                />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 text-center">
                <span id="contact-modal-title" className="text-xs font-mono text-white/60 tracking-wide">
                  {modalTitle}
                </span>
              </div>
              <button
                onClick={closeContactModal}
                aria-label={lang === 'es' ? 'Cerrar' : 'Close'}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ─── FORM CONTENT ─── */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center">
                  <Send className="w-7 h-7 text-[#CCFF00]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t('contact.submitted.title')}
                </h3>
                <p className="text-sm text-white/50 font-mono">
                  {t('contact.submitted.eta')}
                </p>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* ─── HONEYPOT (invisible to humans, bots fill it) ─── */}
                <div className="absolute -left-2499.75" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    name="website"
                    value={_honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Turnstile invisible widget container */}
                <div ref={turnstileContainerRef} />

                {/* Section Label */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                  <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
                    {t('contact.init')}
                  </span>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-white/60 mb-1.5 uppercase tracking-wider">
                    {t('contact.name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('contact.name.placeholder')}
                    className={`w-full px-4 py-3 rounded-lg bg-white/3 border text-sm text-white placeholder:text-white/20 font-mono focus:outline-none transition-all ${
                      fieldErrors.name
                        ? 'border-red-500/50 focus:border-red-400/60 focus:ring-1 focus:ring-red-400/20'
                        : 'border-white/10 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20'
                    }`}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-mono text-red-400">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-white/60 mb-1.5 uppercase tracking-wider">
                    {t('contact.email')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('contact.email.placeholder')}
                    className={`w-full px-4 py-3 rounded-lg bg-white/3 border text-sm text-white placeholder:text-white/20 font-mono focus:outline-none transition-all ${
                      fieldErrors.email
                        ? 'border-red-500/50 focus:border-red-400/60 focus:ring-1 focus:ring-red-400/20'
                        : 'border-white/10 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-mono text-red-400">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="contact-phone" className="block text-xs font-mono text-white/60 mb-1.5 uppercase tracking-wider">
                    {t('contact.phone')}
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('contact.phone.placeholder')}
                    className={`w-full px-4 py-3 rounded-lg bg-white/3 border text-sm text-white placeholder:text-white/20 font-mono focus:outline-none transition-all ${
                      fieldErrors.phone
                        ? 'border-red-500/50 focus:border-red-400/60 focus:ring-1 focus:ring-red-400/20'
                        : 'border-white/10 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-mono text-red-400">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Sector Dropdown */}
                <CustomSelect
                  label={t('contact.sector')}
                  options={sectors}
                  value={sector}
                  onChange={setSector}
                  required
                  placeholder={t('contact.sector.placeholder')}
                />

                {/* Maintenance Protocol */}
                <div>
                  <label className="block text-xs font-mono text-white/60 mb-2 uppercase tracking-wider">
                    {t('contact.maintenance')}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {maintenanceModes.map((mode) => (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => setMaintenance(mode.value)}
                        aria-pressed={maintenance === mode.value}
                        className={`
                          p-3 rounded-lg border text-left transition-all duration-200
                          ${maintenance === mode.value
                            ? 'border-[#CCFF00]/40 bg-[#CCFF00]/5'
                            : 'border-white/5 bg-white/1 hover:border-white/10 hover:bg-white/2'
                          }
                        `}
                      >
                        <span className={`block text-xs font-mono font-semibold mb-0.5 ${maintenance === mode.value ? 'text-[#CCFF00]' : 'text-white/60'}`}>
                          {mode.label}
                        </span>
                        <span className="block text-[10px] text-white/30">
                          {mode.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-xs font-mono text-white/60 mb-2 uppercase tracking-wider">
                    {t('contact.budget')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {budgetRanges.map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setBudget(budget === range ? '' : range)}
                        aria-pressed={budget === range}
                        className={`
                          px-4 py-2 rounded-lg border text-xs font-mono transition-all duration-200
                          ${budget === range
                            ? 'border-[#CCFF00]/40 bg-[#CCFF00]/5 text-[#CCFF00]'
                            : 'border-white/5 bg-white/1 text-white/50 hover:border-white/10 hover:bg-white/2'
                          }
                        `}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono text-white/60 mb-1.5 uppercase tracking-wider">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={messagePlaceholder}
                    className={`w-full px-4 py-3 rounded-lg bg-white/3 border text-sm text-white placeholder:text-white/20 font-mono focus:outline-none transition-all resize-none ${
                      fieldErrors.message
                        ? 'border-red-500/50 focus:border-red-400/60 focus:ring-1 focus:ring-red-400/20'
                        : 'border-white/10 focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20'
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-mono text-red-400">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      {fieldErrors.message}
                    </p>
                  )}
                </div>

                {/* ─── CINEMATIC PRODUCTION TOGGLE ─── */}
                <div>
                  <label className="block text-xs font-mono text-white/60 mb-2 uppercase tracking-wider">
                    {t('contact.cinematic')}
                  </label>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={cinematic}
                    onClick={() => setCinematic(!cinematic)}
                    className={`
                      w-full flex items-center gap-3 p-4 rounded-lg border transition-all duration-300
                      ${cinematic
                        ? 'border-[#CCFF00]/40 bg-[#CCFF00]/5 shadow-[0_0_20px_rgba(204,255,0,0.08)]'
                        : 'border-white/5 bg-white/1 hover:border-white/10 hover:bg-white/2'
                      }
                    `}
                  >
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300
                      ${cinematic
                        ? 'bg-[#CCFF00]/10 border border-[#CCFF00]/30'
                        : 'bg-white/3 border border-white/10'
                      }
                    `}>
                      <Film className={`w-5 h-5 transition-colors duration-300 ${cinematic ? 'text-[#CCFF00]' : 'text-white/40'}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <span className={`block text-xs font-mono font-semibold tracking-wider transition-colors duration-300 ${cinematic ? 'text-[#CCFF00]' : 'text-white/40'}`}>
                        {t('contact.cinematic.toggle')}
                      </span>
                      <span className="block text-[10px] text-white/30 mt-0.5">
                        {t('contact.cinematic.desc')}
                      </span>
                    </div>
                    {/* ── Track ── */}
                    <div className={`
                      relative w-12 h-6 rounded-md shrink-0 transition-colors duration-300 ease-in-out
                      ${cinematic ? 'bg-[#CCFF00]' : 'bg-zinc-800'}
                    `}>
                      {/* ── Thumb ── */}
                      <div
                        className={`
                          absolute top-1 w-4 h-4 rounded-sm bg-black transition-transform duration-300 ease-in-out
                          ${cinematic ? 'translate-x-6.5' : 'translate-x-1'}
                        `}
                      />
                    </div>
                  </button>
                </div>

                {/* ─── LIVE MANIFEST SUMMARY ─── */}
                {sector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-lg border border-white/5 bg-white/2 overflow-hidden"
                  >
                    <div className="px-4 py-2.5 border-b border-white/5 bg-white/2">
                      <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                        {t('contact.manifest')}
                      </span>
                    </div>
                    <div className="px-4 py-3 space-y-1.5 font-mono text-xs">
                      <div className="flex gap-2">
                        <span className="text-[#CCFF00]/60">&gt;</span>
                        <span className="text-white/30">{t('contact.manifest.target')}:</span>
                        <span className="text-white/70">{sectors.find(s => s.value === sector)?.label || '—'}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#CCFF00]/60">&gt;</span>
                        <span className="text-white/30">{t('contact.manifest.budget' as any)}:</span>
                        <span className="text-white/70">{budget || t('contact.manifest.budget.pending' as any)}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#CCFF00]/60">&gt;</span>
                        <span className="text-white/30">{t('contact.manifest.protocol')}:</span>
                        <span className="text-white/70">
                          {maintenanceModes.find(m => m.value === maintenance)?.label || '—'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[#CCFF00]/60">&gt;</span>
                        <span className="text-white/30">{t('contact.manifest.modules')}:</span>
                        <span className="text-white/70">
                          {t('contact.manifest.module.web')}{cinematic ? ` ${t('contact.manifest.module.video')}` : ''}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="px-4 py-3 rounded-lg border border-red-500/30 bg-red-500/5 text-xs font-mono text-red-400">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: sending ? 1 : 1.01 }}
                  whileTap={{ scale: sending ? 1 : 0.98 }}
                  className={`
                    w-full py-4 rounded-xl font-bold text-sm font-mono tracking-wider transition-all duration-300 flex items-center justify-center gap-2
                    ${sending
                      ? 'bg-[#CCFF00]/50 text-black/50 cursor-wait'
                      : 'bg-[#CCFF00] text-black hover:shadow-lg hover:shadow-[#CCFF00]/20'
                    }
                  `}
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('contact.sending')}
                    </>
                  ) : (
                    t('contact.submit')
                  )}
                </motion.button>

                {/* Footer note */}
                <p className="text-center text-xs font-mono text-white/20">
                  {t('contact.footer')}
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
