/**
 * ═══════════════════════════════════════════════════════════
 * CLIENT TELEMETRY — LYRIX OS
 *
 * Testimonials displayed as infinite-scrolling "data packets."
 * Each review is styled as a network telemetry packet with
 * source location, signal strength, latency, and a payload (the review).
 *
 * Infinite scroll technique:
 *   The reviews array is duplicated (rendered twice) inside a
 *   CSS marquee animation. When the first set scrolls out of
 *   view, the duplicate seamlessly takes its place, creating
 *   an infinite loop without JavaScript intervention.
 *   Animation class: .animate-marquee in global.css (60s linear infinite)
 *
 * Star rendering:
 *   signal field (0-5) determines the star display.
 *   Full stars use ★, empty stars use ☆.
 * ═══════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import WindowFrame from './WindowFrame';
import { useTranslations } from '../i18n/utils';
import { openContactModal } from '../stores/modalStore';
import type { Lang } from '../i18n/ui';

// ─── DATA ───

interface ReviewData {
  id: string;
  source: string;
  signal: number;
  latency: string;
  payloadKey: string;
  user: string;
  role: string;
  clientType: string;
}

interface PlaceholderData {
  id: string;
  placeholder: true;
}

type CardData = ReviewData | PlaceholderData;

function isPlaceholder(card: CardData): card is PlaceholderData {
  return 'placeholder' in card;
}

const cards: CardData[] = [
  {
    id: 'PKT_001',
    source: 'Levittown, PR',
    signal: 100,
    latency: '12ms',
    payloadKey: 'telemetry.r1',
    user: 'Sweet Vacations',
    role: 'Propiedad',
    clientType: 'APARTMENTS',
  },
  { id: 'PKT_NEXT_1', placeholder: true },
  {
    id: 'PKT_002',
    source: 'Caguas, PR',
    signal: 97,
    latency: '11ms',
    payloadKey: 'telemetry.r2',
    user: 'Unidine Co.',
    role: 'Restaurante',
    clientType: 'RESTAURANT',
  },
  { id: 'PKT_NEXT_2', placeholder: true },
];

// ─── PACKET COMPONENT ───

function DataPacket({ packet, t }: { packet: ReviewData; t: (key: string) => string }) {
  const stars = ((packet.signal / 100) * 5).toFixed(1);

  return (
    <div
      className="relative shrink-0 w-80 md:w-96 p-5 rounded-xl border border-white/10 bg-white/2 backdrop-blur-sm hover:bg-white/4 hover:border-white/15 transition-all duration-200 cursor-default"
    >
      {/* Header - Packet Metadata */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white/60">
            {packet.id}
          </span>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-xs text-white/60">
            {packet.source}
          </span>
        </div>
        <span className="text-xs font-mono text-white/60">
          {packet.latency}
        </span>
      </div>

      {/* Star Rating */}
      <div className="mb-4">
        <div className="flex flex-col items-center justify-center py-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-3xl font-bold text-[#CCFF00]">
              {stars}
            </span>
            <span className="text-2xl text-[#CCFF00]">★</span>
          </div>
          <span className="text-sm font-mono text-white/60">
            {packet.signal}% {t('telemetry.satisfaction')}
          </span>
        </div>
      </div>

      {/* Payload - The Testimonial */}
      <blockquote className="mb-4">
        <p className="text-sm text-white/70 leading-relaxed italic">
          "{t(packet.payloadKey)}"
        </p>
      </blockquote>

      {/* Footer - User Info */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div>
          <span className="text-sm font-medium text-white/80">
            {packet.user}
          </span>
          <span className="text-xs text-white/60 ml-2">
            // {packet.role}
          </span>
        </div>
        <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-white/60">
          [{packet.clientType}]
        </span>
      </div>
    </div>
  );
}

// ─── PLACEHOLDER "BE THE NEXT" CARD ───

function PlaceholderPacket({ t, onClick }: { t: (key: string) => string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative shrink-0 w-80 md:w-96 p-5 rounded-xl border border-dashed border-[#CCFF00]/20 bg-[#CCFF00]/3 hover:bg-[#CCFF00]/6 hover:border-[#CCFF00]/40 transition-all duration-300 cursor-pointer group text-left"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#CCFF00]/10">
        <span className="text-xs font-mono text-[#CCFF00]/40">
          PKT_????
        </span>
        <span className="text-xs font-mono text-[#CCFF00]/40">
          {t('telemetry.placeholder.waiting')}
        </span>
      </div>

      {/* Center CTA */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#CCFF00]/30 flex items-center justify-center mb-4 group-hover:border-[#CCFF00]/60 transition-colors">
          <span className="text-2xl text-[#CCFF00]/50 group-hover:text-[#CCFF00]/80 transition-colors font-bold">+</span>
        </div>
        <span className="text-base font-semibold text-[#CCFF00]/70 group-hover:text-[#CCFF00] transition-colors uppercase tracking-wider font-mono">
          {t('telemetry.placeholder.headline')}
        </span>
        <span className="text-xs text-white/60 mt-2 text-center max-w-55">
          {t('telemetry.placeholder.sub')}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center pt-2 border-t border-[#CCFF00]/10">
        <span className="text-xs font-mono text-[#CCFF00]/50 group-hover:text-[#CCFF00]/80 transition-colors">
          {'>'} {t('telemetry.placeholder.cta')}
        </span>
      </div>
    </button>
  );
}

// ─── MAIN COMPONENT ───

export default function Reviews({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  // Duplicate cards for seamless loop
  const duplicatedCards = [...cards, ...cards];

  return (
    <WindowFrame id="telemetry" className="relative w-full bg-lyrix-dark px-4 md:px-8 pb-8">
    <section ref={containerRef} aria-label={lang === 'es' ? 'Testimonios' : 'Testimonials'}>
      {/* ─── CONTENT (window frame provided by OsWindow) ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 30 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* ─── CONTENT ─── */}
        <div className="p-6 md:p-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20">
              <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-widest">
                {t('telemetry.section.label')}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
              <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
                {t('telemetry.status')}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              {t('telemetry.title')}
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-xl">
              {t('telemetry.description')}
            </p>
          </motion.div>

          {/* ─── MARQUEE CONTAINER ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative overflow-hidden"
          >
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />

            {/* Scrolling cards */}
            <div
              className="flex gap-4 animate-marquee"
              style={{
                width: `${(duplicatedCards.length * (384 + 16))}px`,
              }}
            >
              {duplicatedCards.map((card, index) => (
                isPlaceholder(card)
                  ? <PlaceholderPacket key={`${card.id}-${index}`} t={t} onClick={() => openContactModal()} />
                  : <DataPacket key={`${card.id}-${index}`} packet={card} t={t} />
              ))}
            </div>
          </motion.div>

          {/* ─── TOUCH HINT (mobile only) ─── */}
          <p className="mt-4 text-center text-xs font-mono text-white/60 sm:hidden">
            {t('telemetry.footer.touchHint')}
          </p>

          {/* ─── STATUS BAR ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/60"
          >
            <span>{t('telemetry.footer.connections').replace('{count}', String(cards.filter(c => !isPlaceholder(c)).length))}</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
              <span>{t('telemetry.footer.stream')}</span>
            </span>
            <span>{t('telemetry.footer.latency')}</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
    </WindowFrame>
  );
}