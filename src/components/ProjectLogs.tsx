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
import OsWindow from './OsWindow';

// ─── DATA ───

interface Project {
  id: string;
  client: string;
  type: string;
  typeColor: string;
  status: string;
  year: string;
  description: string;
  previewGradient: [string, string]; // placeholder gradient colors
  previews?: Array<{
    type: 'gradient' | 'image';
    background: [string, string] | string;
    label: string;
  }>;
}

const projects: Project[] = [
  {
    id: '#001',
    client: 'Solar Elite PR',
    type: 'WEB_DEV',
    typeColor: 'text-blue-400',
    status: 'DEPLOYED',
    year: '2025',
    description: 'High-conversion landing page with real-time energy calculator and automated lead pipeline.',
    previewGradient: ['#1a1a2e', '#16213e'],
    previews: [
      { type: 'gradient', background: ['#1a1a2e', '#16213e'], label: 'Homepage' },
      { type: 'gradient', background: ['#0f1419', '#1a2328'], label: 'Calculator' },
      { type: 'gradient', background: ['#1a1a0e', '#2e2116'], label: 'Contact Form' },
    ],
  },
  {
    id: '#002',
    client: 'Bad Bunny Trap',
    type: 'MUSIC_PRODUCTION',
    typeColor: 'text-purple-400',
    status: 'DEPLOYED',
    year: '2025',
    description: 'Cinematic visual identity and promotional media for urban music release campaign.',
    previewGradient: ['#2d1b69', '#11001c'],
    previews: [
      { type: 'gradient', background: ['#2d1b69', '#11001c'], label: 'Album Cover' },
      { type: 'gradient', background: ['#4a1c69', '#2d0a3c'], label: 'Music Video' },
      { type: 'gradient', background: ['#1b2d69', '#001c11'], label: 'Social Assets' },
    ],
  },
  {
    id: '#003',
    client: 'Cafe Boricua',
    type: 'BRANDING',
    typeColor: 'text-amber-400',
    status: 'DEPLOYED',
    year: '2024',
    description: 'Complete brand overhaul including identity system, packaging, and digital presence.',
    previewGradient: ['#1a120b', '#2d1f10'],
    previews: [
      { type: 'gradient', background: ['#1a120b', '#2d1f10'], label: 'Logo Design' },
      { type: 'gradient', background: ['#2d1f10', '#1a120b'], label: 'Packaging' },
      { type: 'gradient', background: ['#2d2010', '#1a1f0b'], label: 'Website' },
    ],
  },
  {
    id: '#004',
    client: 'Torres Roofing Co.',
    type: 'WEB_DEV',
    typeColor: 'text-blue-400',
    status: 'DEPLOYED',
    year: '2024',
    description: 'Authority website with before/after gallery, 5-star review integration, and SEO dominance.',
    previewGradient: ['#0a1a0a', '#0f2b0f'],
    previews: [
      { type: 'gradient', background: ['#0a1a0a', '#0f2b0f'], label: 'Homepage' },
      { type: 'gradient', background: ['#1a0a0a', '#2b0f0f'], label: 'Gallery' },
      { type: 'gradient', background: ['#0a0a1a', '#0f0f2b'], label: 'Reviews' },
      { type: 'gradient', background: ['#1a1a0a', '#2b2b0f'], label: 'Contact' },
    ],
  },
  {
    id: '#005',
    client: 'Neon District Studio',
    type: 'MUSIC_VIDEO',
    typeColor: 'text-pink-400',
    status: 'DEPLOYED',
    year: '2025',
    description: 'Editorial product photography and visual campaign for boutique fashion studio.',
    previewGradient: ['#1a0a1a', '#2b0f2b'],
    previews: [
      { type: 'gradient', background: ['#1a0a1a', '#2b0f2b'], label: 'Main Shot' },
      { type: 'gradient', background: ['#0a1a1a', '#0f2b2b'], label: 'Behind Scenes' },
      { type: 'gradient', background: ['#1a1a0a', '#2b2b0f'], label: 'Product Grid' },
    ],
  },
];

// ─── COMPONENT ───

export default function ProjectLogs() {
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
    <OsWindow id="logs" className="relative w-full bg-lyrix-dark px-4 md:px-8 pb-8">
    <section ref={containerRef} onMouseMove={handleMouseMove} className="relative">
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
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                {projects.length} Records Found
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Execution Logs
            </h2>
            <p className="text-sm text-white/40 mt-2 max-w-xl">
              Verified deployments. Every record is a live, measurable result.
            </p>
          </motion.div>

          {/* ─── TABLE HEADER ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="hidden md:grid grid-cols-[60px_1fr_140px_120px_80px_40px] gap-4 px-4 py-2 border-b border-white/5 text-xs font-mono text-white/30 uppercase tracking-wider"
          >
            <span>ID</span>
            <span>Client</span>
            <span>Type</span>
            <span>Status</span>
            <span>Year</span>
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
                  onClick={() => openProjectModal(project)}
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

                {/* Mobile Card */}
                <div
                  className={`
                    md:hidden p-4 border-b border-white/5
                    transition-all duration-200 cursor-pointer
                    ${hoveredIndex === index ? 'bg-white/4' : ''}
                  `}
                  onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
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

                  {/* Mobile expanded preview */}
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-white/5">
                          <p className="text-sm text-white/50 mb-3">{project.description}</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); openProjectModal(project); }}
                            className="w-full aspect-video rounded-lg border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors"
                            style={{
                              background: `linear-gradient(135deg, ${project.previewGradient[0]}, ${project.previewGradient[1]})`,
                            }}
                          >
                            <span className="text-xs font-mono text-white/30">tap to view details</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
            <span>Showing {projects.length} of {projects.length} records</span>
            <span>Last updated: 2025.12.01</span>
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
    </OsWindow>
  );
}
