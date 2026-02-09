/**
 * ═══════════════════════════════════════════════════════════
 * PROJECT LOGS — LYRIX OS
 * Portfolio as a database list view with hover preview cards
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { openProjectModal } from '../stores/modalStore';
import WindowFrame from './WindowFrame';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

// ─── DATA ───

interface Project {
  id: string;
  client: string;
  type: string;
  typeColor: string;
  status: string;
  year: string;
  description: string;
  previewGradient: [string, string];
  previews?: Array<{
    type: 'gradient' | 'image';
    background: [string, string] | string;
    label: string;
  }>;
}

// Structural data only (non-translatable).
// Translatable fields (type, status, description, preview labels) are resolved inside the component.
const projectStructure = [
  {
    id: '#001',
    client: 'Solar Elite PR',
    typeColor: 'text-blue-400',
    year: '2025',
    previewGradient: ['#1a1a2e', '#16213e'] as [string, string],
    previewGradients: [
      ['#1a1a2e', '#16213e'],
      ['#0f1419', '#1a2328'],
      ['#1a1a0e', '#2e2116'],
    ] as [string, string][],
  },
  {
    id: '#002',
    client: 'Bad Bunny Trap',
    typeColor: 'text-purple-400',
    year: '2025',
    previewGradient: ['#2d1b69', '#11001c'] as [string, string],
    previewGradients: [
      ['#2d1b69', '#11001c'],
      ['#4a1c69', '#2d0a3c'],
      ['#1b2d69', '#001c11'],
    ] as [string, string][],
  },
  {
    id: '#003',
    client: 'Cafe Boricua',
    typeColor: 'text-amber-400',
    year: '2024',
    previewGradient: ['#1a120b', '#2d1f10'] as [string, string],
    previewGradients: [
      ['#1a120b', '#2d1f10'],
      ['#2d1f10', '#1a120b'],
      ['#2d2010', '#1a1f0b'],
    ] as [string, string][],
  },
  {
    id: '#004',
    client: 'Torres Roofing Co.',
    typeColor: 'text-blue-400',
    year: '2024',
    previewGradient: ['#0a1a0a', '#0f2b0f'] as [string, string],
    previewGradients: [
      ['#0a1a0a', '#0f2b0f'],
      ['#1a0a0a', '#2b0f0f'],
      ['#0a0a1a', '#0f0f2b'],
      ['#1a1a0a', '#2b2b0f'],
    ] as [string, string][],
  },
  {
    id: '#005',
    client: 'Neon District Studio',
    typeColor: 'text-pink-400',
    year: '2025',
    previewGradient: ['#1a0a1a', '#2b0f2b'] as [string, string],
    previewGradients: [
      ['#1a0a1a', '#2b0f2b'],
      ['#0a1a1a', '#0f2b2b'],
      ['#1a1a0a', '#2b2b0f'],
    ] as [string, string][],
  },
];

// ─── COMPONENT ───

export default function ProjectLogs({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);

  // Build translated project entries from structural data + i18n dictionary
  const projects: Project[] = projectStructure.map((p, i) => {
    const n = i + 1;
    const previewLabels = p.previewGradients.map((_, j) =>
      t(`logs.p${n}.preview${j + 1}` as any)
    );
    return {
      ...p,
      type: t(`logs.p${n}.type` as any),
      status: t(`logs.p${n}.status` as any),
      description: t(`logs.p${n}.description` as any),
      previews: p.previewGradients.map((grad, j) => ({
        type: 'gradient' as const,
        background: grad,
        label: previewLabels[j],
      })),
    };
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <WindowFrame id="logs" className="relative w-full bg-lyrix-dark px-4 md:px-8 pb-8">
    <section ref={containerRef} onMouseMove={handleMouseMove} className="relative" aria-label={lang === 'es' ? 'Portafolio' : 'Portfolio'}>
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
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20">
              <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-widest">
                {t('logs.section.label')}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                {t('logs.status').replace('{count}', String(projects.length))}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight" aria-label="Businesses That Trusted Us">
              {t('logs.title')}
            </h2>
            <p className="text-xs font-mono text-[#CCFF00]/60 uppercase tracking-widest mt-1">
              {t('logs.subtitle')}
            </p>
            <p className="text-sm text-white/40 mt-2 max-w-xl">
              {t('logs.description')}
            </p>
          </motion.div>

          {/* ─── TABLE HEADER ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="hidden md:grid grid-cols-[60px_1fr_140px_120px_80px_40px] gap-4 px-4 py-2 border-b border-white/5 text-xs font-mono text-white/30 uppercase tracking-wider"
          >
            <span>{t('logs.table.id')}</span>
            <span>{t('logs.table.client')}</span>
            <span>{t('logs.table.type')}</span>
            <span>{t('logs.table.status')}</span>
            <span>{t('logs.table.year')}</span>
            <span />
          </motion.div>

          {/* ─── PROJECT ROWS ─── */}
          <div className="relative">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative"
              >
                {/* Desktop Row */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openProjectModal(project)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProjectModal(project); } }}
                  aria-label={`${t('logs.table.view' as any) || 'View project'}: ${project.client}`}
                  className={`
                    hidden md:grid grid-cols-[60px_1fr_140px_120px_80px_40px] gap-4 items-center
                    px-4 py-4 border-b border-white/5
                    transition-all duration-200 cursor-pointer
                    ${hoveredIndex === index ? 'bg-white/4 border-white/10' : 'hover:bg-white/2'}
                  `}
                >
                  {/* ID */}
                  <span className="text-sm font-mono text-white/30">{project.id}</span>

                  {/* Client */}
                  <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-200">
                    {project.client}
                  </span>

                  {/* Type Badge */}
                  <span>
                    <span className={`text-xs font-mono px-2 py-1 rounded bg-white/5 border border-white/5 ${project.typeColor}`}>
                      [{project.type}]
                    </span>
                  </span>

                  {/* Status */}
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-mono text-green-400/80">{project.status}</span>
                  </span>

                  {/* Year */}
                  <span className="text-xs font-mono text-white/40">{project.year}</span>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>

                {/* Mobile Card — single tap opens project */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openProjectModal(project)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProjectModal(project); } }}
                  aria-label={`${t('logs.table.view' as any) || 'View project'}: ${project.client}`}
                  className={`
                    md:hidden p-4 border-b border-white/5
                    transition-all duration-200 cursor-pointer
                    active:bg-white/4
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-white/30">{project.id}</span>
                    <span className={`text-xs font-mono px-2 py-1 rounded bg-white/5 border border-white/5 ${project.typeColor}`}>
                      [{project.type}]
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-white/80 mb-1">{project.client}</h3>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-xs font-mono text-green-400/80">{project.status}</span>
                    </span>
                    <span className="text-xs font-mono text-white/40">{project.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ─── FOOTER ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/30"
          >
            <span>{t('logs.footer.showing').replace('{count}', String(projects.length)).replace('{total}', String(projects.length))}</span>
            <span>{t('logs.footer.updated')}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ─── FLOATING PREVIEW CARD (Desktop only) ─── */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="hidden md:block fixed z-50 pointer-events-none"
            style={{
              left: Math.min(mousePos.x + 20, window.innerWidth - 380),
              top: mousePos.y - 100,
            }}
          >
            <div className="w-80 rounded-xl border border-white/10 bg-lyrix-carbon/95 backdrop-blur-2xl shadow-black/50 overflow-hidden">
              {/* Preview Image Area */}
              <div
                className="w-full aspect-video flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${projects[hoveredIndex].previewGradient[0]}, ${projects[hoveredIndex].previewGradient[1]})`,
                }}
              >
                {/* Placeholder grid overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="relative flex flex-col items-center gap-2">
                  <ExternalLink className="w-6 h-6 text-white/30" />
                  <span className="text-xs font-mono text-white/40">preview.render</span>
                </div>
              </div>

              {/* Preview Details */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-white/40">{projects[hoveredIndex].id}</span>
                  <span className={`text-xs font-mono ${projects[hoveredIndex].typeColor}`}>
                    [{projects[hoveredIndex].type}]
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1.5">
                  {projects[hoveredIndex].client}
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  {projects[hoveredIndex].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
    </WindowFrame>
  );
}
