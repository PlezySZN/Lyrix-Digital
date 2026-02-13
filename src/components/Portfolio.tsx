/**
 * ═══════════════════════════════════════════════════════════
 * PROJECT LOGS — LYRIX OS
 *
 * Portfolio section displayed as a "database list view" with hover
 * preview cards. Data sourced from `src/data/projects.ts`.
 *
 * Architecture:
 * - FloatingPreview — Renders a project preview card at the cursor
 *   position via React Portal (avoids overflow:hidden clipping).
 *   Viewport clamping ensures the card stays fully visible.
 * - Main list — Table-style rows with hover state tracking.
 *   Mouse position updates drive the FloatingPreview position.
 * - Clicking a project opens ProjectModal via nanostores.
 *
 * The portal pattern is necessary because the WindowFrame parent
 * has overflow:hidden, which would clip the preview card.
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { openProjectModal } from '../stores/modalStore';
import { getProjects } from '../data/projects';
import WindowFrame from './WindowFrame';
import NoSignalPlaceholder from './NoSignalPlaceholder';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';
import type { Project } from '../types';

// ─── FLOATING PREVIEW CARD (rendered via React Portal) ───

/**
 * Renders a hover-preview card at the mouse position.
 * Uses createPortal to render outside the component tree
 * (directly on document.body) to avoid overflow clipping.
 *
 * Position is clamped to viewport edges so the 280×200px card
 * never extends beyond the visible area.
 *
 * @param project  - The project data to preview
 * @param mousePos - Current cursor position (clientX/clientY)
 */
function FloatingPreview({
  project,
  mousePos,
}: {
  project: Project;
  mousePos: { x: number; y: number };
}) {
  // Use the first real image if available, otherwise gradient
  const hasImage = project.images && project.images.length > 0 && project.images[0];

  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="hidden md:block fixed z-9999 pointer-events-none"
      style={{
        left: Math.min(mousePos.x + 20, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 380),
        top: mousePos.y - 100,
      }}
    >
      <div className="w-80 rounded-xl border border-white/10 bg-lyrix-carbon/95 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Preview Image Area */}
        {hasImage ? (
          <div className="w-full aspect-video overflow-hidden">
            <img
              src={project.images![0]}
              alt={project.client}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <NoSignalPlaceholder
            gradient={project.previewGradient}
            label="preview.render"
          />
        )}

        {/* Preview Details */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-white/60">{project.id}</span>
            <span className={`text-xs font-mono ${project.typeColor}`}>
              [{project.type}]
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white mb-1.5">
            {project.client}
          </h4>
          <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}

// ─── COMPONENT ───

export default function ProjectLogs({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const projects = getProjects(lang);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [mounted, setMounted] = useState(false);

  // Portal needs document.body — only available after mount
  useEffect(() => { setMounted(true); }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
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
              <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
                {t('logs.status').replace('{count}', String(projects.length))}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              {t('logs.title')}
            </h2>
            <p className="text-xs font-mono text-[#CCFF00]/60 uppercase tracking-widest mt-1">
              {t('logs.subtitle')}
            </p>
            <p className="text-sm text-white/60 mt-2 max-w-xl">
              {t('logs.description')}
            </p>
          </motion.div>

          {/* ─── TABLE HEADER ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="hidden md:grid grid-cols-[60px_1fr_140px_120px_80px_40px] gap-4 px-4 py-2 border-b border-white/5 text-xs font-mono text-white/60 uppercase tracking-wider"
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
                  className={`
                    hidden md:grid grid-cols-[60px_1fr_140px_120px_80px_40px] gap-4 items-center
                    px-4 py-4 border-b border-white/5
                    transition-all duration-200 cursor-pointer
                    ${hoveredIndex === index ? 'bg-white/4 border-white/10' : 'hover:bg-white/2'}
                  `}
                >
                  {/* ID */}
                  <span className="text-sm font-mono text-white/60">{project.id}</span>

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
                    <span className={`w-1.5 h-1.5 rounded-full ${project.comingSoon ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <span className={`text-xs font-mono ${project.comingSoon ? 'text-yellow-400/80' : 'text-green-400/80'}`}>{project.status}</span>
                  </span>

                  {/* Year */}
                  <span className="text-xs font-mono text-white/60">{project.year}</span>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white/80 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>

                {/* Mobile Card — single tap opens project */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openProjectModal(project)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProjectModal(project); } }}
                  className={`
                    md:hidden p-4 border-b border-white/5
                    transition-all duration-200 cursor-pointer
                    active:bg-white/4
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-mono text-white/60">{project.id}</span>
                    <span className={`text-xs font-mono px-2 py-1 rounded bg-white/5 border border-white/5 ${project.typeColor}`}>
                      [{project.type}]
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-white/80 mb-1">{project.client}</h3>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${project.comingSoon ? 'bg-yellow-500' : 'bg-green-500'}`} />
                      <span className={`text-xs font-mono ${project.comingSoon ? 'text-yellow-400/80' : 'text-green-400/80'}`}>{project.status}</span>
                    </span>
                    <span className="text-xs font-mono text-white/60">{project.year}</span>
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
            className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/60"
          >
            <span>{t('logs.footer.showing').replace('{count}', String(projects.length)).replace('{total}', String(projects.length))}</span>
            <span>{t('logs.footer.updated')}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* ─── FLOATING PREVIEW CARD (Portal → document.body, escapes stacking contexts) ─── */}
      {mounted && (
        <AnimatePresence>
          {hoveredIndex !== null && (
            <FloatingPreview
              key="preview"
              project={projects[hoveredIndex]}
              mousePos={mousePos}
            />
          )}
        </AnimatePresence>
      )}
    </section>
    </WindowFrame>
  );
}
