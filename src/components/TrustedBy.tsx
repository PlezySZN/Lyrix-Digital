/**
 * ═══════════════════════════════════════════════════════════
 * TRUSTED BY — LYRIX OS
 * Client logo strip between Hero and Portfolio
 * Styled as a system authentication / verified partners bar
 * ═══════════════════════════════════════════════════════════
 */

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

const CLIENTS = [
  { name: 'Sweet Vacations', type: 'APARTMENTS' },
  { name: 'Unidine Co.', type: 'RESTAURANT' },
  { name: 'Juan Plumbing Co.', type: 'CONTRACTOR' },
];

export default function TrustedBy({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  return (
    <div ref={containerRef} className="w-full bg-lyrix-dark px-4 md:px-8 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px flex-1 max-w-20 bg-white/10" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00]/60" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
              {t('trusted.label')}
            </span>
          </div>
          <div className="h-px flex-1 max-w-20 bg-white/10" />
        </div>

        {/* Client cards */}
        <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
          {CLIENTS.map((client, i) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-white/5 bg-white/2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]/60" />
              <div>
                <span className="text-sm font-mono font-medium text-white/70 tracking-wide">
                  {client.name}
                </span>
                <span className="text-[10px] font-mono text-white/30 ml-2 hidden sm:inline">
                  [{client.type}]
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
