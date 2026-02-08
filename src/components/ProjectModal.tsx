/**
 * ═══════════════════════════════════════════════════════════
 * PROJECT MODAL — LYRIX OS v1.1
 * "File Properties" window displaying project details
 * ═══════════════════════════════════════════════════════════
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { X, ExternalLink, Calendar, Tag, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  $projectModalOpen,
  $activeProject,
  closeProjectModal,
} from '../stores/modalStore';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

export default function ProjectModal({ lang = 'es' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const isOpen = useStore($projectModalOpen);
  const project = useStore($activeProject);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset image index when project changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [project]);

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
      if (e.key === 'Escape') closeProjectModal();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!project) return null;

  const previews = project.previews || [
    { type: 'gradient' as const, background: project.previewGradient, label: 'Preview' }
  ];
  const currentPreview = previews[currentImageIndex];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % previews.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + previews.length) % previews.length);
  };

  // Meta data grid
  const metaFields = [
    { label: t('project.meta.client'), value: project.client, icon: Tag },
    { label: t('project.meta.type'), value: project.type.replace('_', ' '), icon: Activity },
    { label: t('project.meta.status'), value: project.status, icon: Activity },
    { label: t('project.meta.year'), value: project.year, icon: Calendar },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={closeProjectModal}
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
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-2xl"
          >
            {/* ─── TITLE BAR ─── */}
            <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 bg-[#1a1a1a]/90 backdrop-blur-xl border-b border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={closeProjectModal}
                  className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-125 transition-all"
                />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs font-mono text-white/40 tracking-wide">
                  {t('project.titlebar').replace('{id}', project.id)}
                </span>
              </div>
              <button
                onClick={closeProjectModal}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ─── HERO PREVIEW ─── */}
            <div className="relative">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full aspect-video relative overflow-hidden"
                style={{
                  background: currentPreview.type === 'gradient' 
                    ? `linear-gradient(135deg, ${(currentPreview.background as [string, string])[0]}, ${(currentPreview.background as [string, string])[1]})`
                    : currentPreview.background as string,
                }}
              >
              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '25px 25px',
                }}
              />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <ExternalLink className="w-8 h-8 text-white/25 mx-auto mb-2" />
                    <span className="text-xs font-mono text-white/30">{currentPreview.label}</span>
                  </div>
                </div>

                {/* Type badge overlay */}
                <div className="absolute top-4 right-4">
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-lg bg-black/50 border border-white/10 backdrop-blur ${project.typeColor}`}>
                    [{project.type}]
                  </span>
                </div>
              </motion.div>
              
              {/* Navigation Arrows (only show if multiple images) */}
              {previews.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 transition-all duration-200 z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 transition-all duration-200 z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                    {previews.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex 
                            ? 'bg-[#CCFF00] scale-110' 
                            : 'bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ─── CONTENT ─── */}
            <div className="p-6">
              {/* Project Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-white/30">{project.id}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-mono text-green-400/80">{project.status}</span>
                  </span>
                </div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">
                  {project.client}
                </h2>
              </div>

              {/* ─── DATA GRID ─── */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {metaFields.map((field) => {
                  const FieldIcon = field.icon;
                  return (
                    <div
                      key={field.label}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <FieldIcon className="w-3 h-3 text-white/30" />
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                          {field.label}
                        </span>
                      </div>
                      <span className="text-sm font-mono text-white/80">
                        {field.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* ─── DESCRIPTION ─── */}
              <div className="mb-6 p-4 rounded-lg bg-white/[0.01] border border-white/5">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs font-mono text-[#CCFF00]/60">{'>'}</span>
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                    {t('project.brief')}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* ─── ACTION BUTTONS ─── */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={closeProjectModal}
                  className="flex-1 py-3 rounded-lg border border-white/10 bg-white/[0.03] text-sm font-mono text-white/60 hover:bg-white/[0.06] hover:text-white/80 transition-all"
                >
                  {t('project.close')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-lg bg-[#CCFF00] text-black text-sm font-mono font-bold hover:shadow-lg hover:shadow-[#CCFF00]/20 transition-shadow duration-300 flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('project.viewLive')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
