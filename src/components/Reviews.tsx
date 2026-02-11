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

const packets: ReviewData[] = [
  {
    id: 'PKT_001',
    source: 'San Juan, PR',
    signal: 100,
    latency: '12ms',
    payloadKey: 'telemetry.r1',
    user: 'Carlos R.',
    role: 'CEO',
    clientType: 'CONTRACTOR',
  },
  {
    id: 'PKT_002',
    source: 'Bayamón, PR',
    signal: 98,
    latency: '8ms',
    payloadKey: 'telemetry.r2',
    user: 'Maria S.',
    role: 'Creative Director',
    clientType: 'ARTIST',
  },
  {
    id: 'PKT_003',
    source: 'Ponce, PR',
    signal: 95,
    latency: '15ms',
    payloadKey: 'telemetry.r3',
    user: 'José M.',
    role: 'Owner',
    clientType: 'RETAIL',
  },
  {
    id: 'PKT_004',
    source: 'Carolina, PR',
    signal: 100,
    latency: '9ms',
    payloadKey: 'telemetry.r4',
    user: 'Ana L.',
    role: 'Marketing Lead',
    clientType: 'CONTRACTOR',
  },
  {
    id: 'PKT_005',
    source: 'Caguas, PR',
    signal: 97,
    latency: '11ms',
    payloadKey: 'telemetry.r5',
    user: 'David P.',
    role: 'Founder',
    clientType: 'HOSPITALITY',
  },
  {
    id: 'PKT_006',
    source: 'Arecibo, PR',
    signal: 100,
    latency: '7ms',
    payloadKey: 'telemetry.r6',
    user: 'Roberto C.',
    role: 'Director',
    clientType: 'CONTRACTOR',
  },
];

// ─── PACKET COMPONENT ───

function DataPacket({ packet, t }: { packet: ReviewData; t: (key: string) => string }) {
  // Calculate stars from signal (signal/100 * 5)
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
          <span className="text-sm font-mono text-white/50">
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

// ─── MAIN COMPONENT ───

export default function Reviews({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  // Duplicate packets for seamless loop
  const duplicatedPackets = [...packets, ...packets];

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

            {/* Scrolling packets */}
            <div
              className="flex gap-4 animate-marquee"
              style={{
                width: `${(duplicatedPackets.length * (384 + 16))}px`, // 384px = w-96, 16px = gap-4
              }}
            >
              {duplicatedPackets.map((packet, index) => (
                <DataPacket 
                  key={`${packet.id}-${index}`}
                  packet={packet}
                  t={t}
                />
              ))}
            </div>
          </motion.div>

          {/* ─── TOUCH HINT (mobile only) ─── */}
          <p className="mt-4 text-center text-xs font-mono text-white/40 sm:hidden">
            {t('telemetry.footer.touchHint')}
          </p>

          {/* ─── STATUS BAR ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/30"
          >
            <span>{t('telemetry.footer.connections').replace('{count}', String(packets.length))}</span>
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