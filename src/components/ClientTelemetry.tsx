/**
 * ═══════════════════════════════════════════════════════════
 * CLIENT TELEMETRY — LYRIX OS
 * Testimonials as infinite scrolling data packets
 * ═══════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import OsWindow from './OsWindow';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

// ─── DATA ───

interface TelemetryPacket {
  id: string;
  source: string;
  signal: number;
  latency: string;
  payload: string;
  user: string;
  role: string;
  clientType: string;
}

const packets: TelemetryPacket[] = [
  {
    id: 'PKT_001',
    source: 'San Juan, PR',
    signal: 100,
    latency: '12ms',
    payload: 'El despliegue fue inmediato. La arquitectura Lyrix aumentó nuestros leads un 300% en la primera semana.',
    user: 'Carlos R.',
    role: 'CEO',
    clientType: 'CONTRACTOR',
  },
  {
    id: 'PKT_002',
    source: 'Bayamón, PR',
    signal: 98,
    latency: '8ms',
    payload: 'Visual identity is now industry standard. Every client mentions how professional we look compared to competition.',
    user: 'Maria S.',
    role: 'Creative Director',
    clientType: 'ARTIST',
  },
  {
    id: 'PKT_003',
    source: 'Ponce, PR',
    signal: 95,
    latency: '15ms',
    payload: 'La mejor inversión del Q4. El ROI fue inmediato y el sistema maneja el tráfico pico sin problemas.',
    user: 'José M.',
    role: 'Owner',
    clientType: 'RETAIL',
  },
  {
    id: 'PKT_004',
    source: 'Carolina, PR',
    signal: 100,
    latency: '9ms',
    payload: 'No more Facebook dependency. We own our digital presence and rank #1 locally for every key term.',
    user: 'Ana L.',
    role: 'Marketing Lead',
    clientType: 'CONTRACTOR',
  },
  {
    id: 'PKT_005',
    source: 'Caguas, PR',
    signal: 97,
    latency: '11ms',
    payload: 'The photography elevated our brand beyond recognition. Bookings increased 400% after launch.',
    user: 'David P.',
    role: 'Founder',
    clientType: 'HOSPITALITY',
  },
  {
    id: 'PKT_006',
    source: 'Arecibo, PR',
    signal: 100,
    latency: '7ms',
    payload: 'Zero downtime since deployment. The infrastructure is military-grade and converts at 18%.',
    user: 'Roberto C.',
    role: 'Director',
    clientType: 'CONTRACTOR',
  },
];

// ─── PACKET COMPONENT ───

function DataPacket({ packet }: { packet: TelemetryPacket }) {
  // Calculate stars from signal (signal/100 * 5)
  const stars = ((packet.signal / 100) * 5).toFixed(1);

  return (
    <div
      className="relative flex-shrink-0 w-80 md:w-96 p-5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm"
    >
      {/* Header - Packet Metadata */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white/40">
            {packet.id}
          </span>
          <div className="w-px h-3 bg-white/10" />
          <span className="text-xs text-white/60">
            {packet.source}
          </span>
        </div>
        <span className="text-xs font-mono text-white/40">
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
            {packet.signal}% satisfaction
          </span>
        </div>
      </div>

      {/* Payload - The Testimonial */}
      <blockquote className="mb-4">
        <p className="text-sm text-white/70 leading-relaxed italic">
          "{packet.payload}"
        </p>
      </blockquote>

      {/* Footer - User Info */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div>
          <span className="text-sm font-medium text-white/80">
            {packet.user}
          </span>
          <span className="text-xs text-white/40 ml-2">
            // {packet.role}
          </span>
        </div>
        <span className="text-xs font-mono px-2 py-1 rounded bg-white/5 text-white/40">
          [{packet.clientType}]
        </span>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───

export default function ClientTelemetry({ lang = 'es' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  // Duplicate packets for seamless loop
  const duplicatedPackets = [...packets, ...packets];

  return (
    <OsWindow id="telemetry" className="relative w-full bg-[#050505] px-4 md:px-8 pb-8">
    <section ref={containerRef}>
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
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                {t('telemetry.status')}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              {t('telemetry.title')}
            </h2>
            <p className="text-sm text-white/40 mt-2 max-w-xl">
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
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />

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
                />
              ))}
            </div>
          </motion.div>

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
    </OsWindow>
  );
}