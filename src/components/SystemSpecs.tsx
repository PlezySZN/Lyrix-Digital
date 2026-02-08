/**
 * ═══════════════════════════════════════════════════════════
 * SYSTEM SPECS — LYRIX OS
 * Glassmorphic window displaying agency services as system specs
 * ═══════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Aperture, Activity } from 'lucide-react';
import SpecModule from './SpecModule';
import OsWindow from './OsWindow';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

export default function SystemSpecs({ lang = 'es' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Service modules data — i18n
  const modules = [
    {
      icon: Aperture,
      title: t('specs.module2.title'),
      codeName: t('specs.module2.codeName'),
      specs: [
        { label: 'QUALITY', value: t('specs.module2.quality') },
        { label: 'FORMAT', value: t('specs.module2.format') },
        { label: 'DRONE', value: t('specs.module2.drone') },
      ],
      description: t('specs.module2.description'),
      isOptional: true,
    },
        {
      icon: Cpu,
      title: t('specs.module1.title'),
      codeName: t('specs.module1.codeName'),
      specs: [
        { label: 'SPEED', value: t('specs.module1.speed') },
        { label: 'DEVICE', value: t('specs.module1.device') },
        { label: 'SECURITY', value: t('specs.module1.security') },
        { label: 'SYSTEM', value: t('specs.module1.system') },
      ],
      description: t('specs.module1.description'),
      isOptional: false,
    },
    {
      icon: Activity,
      title: t('specs.module3.title'),
      codeName: t('specs.module3.codeName'),
      specs: [
        { label: 'RANKING', value: t('specs.module3.ranking') },
        { label: 'TARGET', value: t('specs.module3.target') },
        { label: 'STATUS', value: t('specs.module3.status') },
      ],
      description: t('specs.module3.description'),
      isOptional: true,
    },
  ];

  return (
    <OsWindow id="specs" className="relative w-full bg-[#050505] px-4 md:px-8 pb-8">
      <section ref={containerRef}>
      {/* ─── CONTENT ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 40 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* ─── CONTENT AREA ─── */}
        <div className="p-6 md:p-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20">
              <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-widest">
                {t('specs.section.label')}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                {t('specs.status')}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              {t('specs.title')}
            </h2>
            <p className="text-xs font-mono text-[#CCFF00]/60 uppercase tracking-widest mt-1">
              {t('specs.subtitle')}
            </p>
            <p className="text-sm text-white/40 mt-2 max-w-xl">
              {t('specs.description')}
            </p>
          </motion.div>

          {/* ─── MODULES GRID ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {modules.map((module, index) => (
              <SpecModule
                key={module.title}
                icon={module.icon}
                title={module.title}
                specs={module.specs}
                description={module.description}
                isOptional={module.isOptional}
                delay={index * 150}
                isInView={isInView}
              />
            ))}
          </div>

          {/* ─── FOOTER STATUS BAR ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/30"
          >
            <span>{t('specs.footer.modules')}</span>
            <span>{t('specs.footer.revenue')}</span>
            <span>{t('specs.footer.status')}</span>
          </motion.div>
        </div>
      </motion.div>
      </section>
    </OsWindow>
  );
}
