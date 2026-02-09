/**
 * ═══════════════════════════════════════════════════════════
 * OS WINDOW — LYRIX OS v1.2
 * Reusable window frame with Red/Yellow/Green traffic light controls
 * Manages OPEN / COLLAPSED / DOCKED states via windowStore
 * ═══════════════════════════════════════════════════════════
 */

import { useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import {
  $windows,
  closeWindow,
  minimizeWindow,
  restoreWindow,
  type WindowId,
  WINDOW_REGISTRY,
} from '../stores/windowStore';

// ─── PROPS ───

interface OsWindowProps {
  id: WindowId;
  children: ReactNode;
  /** Override the title from the registry */
  title?: string;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Custom title bar icon (ReactNode) — if not provided, no icon rendered */
  titleIcon?: ReactNode;
  /** Whether the title bar bg uses accent color (for CTA window) */
  accent?: boolean;
}

// ─── COMPONENT ───

export default function WindowFrame({
  id,
  children,
  title,
  className = '',
  titleIcon,
  accent = false,
}: OsWindowProps) {
  const windows = useStore($windows);
  const state = windows[id];
  const meta = WINDOW_REGISTRY[id];
  const displayTitle = title || meta.title;
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── DOCKED: Render nothing (window is hidden, shows in dock) ───
  if (state === 'DOCKED') {
    return <div id={meta.sectionId} />;
  }

  // ─── HANDLERS ───
  const handleRed = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeWindow(id);
  };

  const handleYellow = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeWindow(id);
  };

  const handleGreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    restoreWindow(id);
  };

  return (
    <div id={meta.sectionId} ref={containerRef} className={className}>
      {/* ─── GLASSMORPHIC WINDOW FRAME ─── */}
      <div className="relative w-full rounded-xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl overflow-hidden">

        {/* ─── TITLE BAR ─── */}
        <div
          className={`
            sticky top-0 z-20 flex items-center gap-2 px-4 py-3
            backdrop-blur-xl border-b
            ${accent
              ? 'bg-lyrix-steel/80 border-[#CCFF00]/20'
              : 'bg-lyrix-steel/80 border-white/5'
            }
          `}
        >
          {/* Traffic Light Buttons */}
          <div className="flex items-center gap-2">
            {/* RED — Close / Dock */}
            <button
              onClick={handleRed}
              className="group relative w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-125 transition-all"
              aria-label="Close window"
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black/60 text-[8px] font-bold leading-none">
                ×
              </span>
            </button>

            {/* YELLOW — Minimize / Collapse */}
            <button
              onClick={handleYellow}
              className="group relative w-3 h-3 rounded-full bg-[#FEBC2E] hover:brightness-125 transition-all"
              aria-label="Minimize window"
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black/60 text-[8px] font-bold leading-none">
                −
              </span>
            </button>

            {/* GREEN — Restore / Maximize */}
            <button
              onClick={handleGreen}
              className={`group relative w-3 h-3 rounded-full bg-[#28C840] hover:brightness-125 transition-all ${
                state === 'OPEN' ? 'ring-1 ring-[#28C840]/40' : ''
              }`}
              aria-label="Restore window"
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black/60 text-[8px] font-bold leading-none">
                +
              </span>
            </button>
          </div>

          {/* Window Title */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            {titleIcon && titleIcon}
            <span
              className={`text-xs font-mono tracking-wide ${
                accent ? 'text-[#CCFF00]/60 text-sm' : 'text-white/40'
              }`}
            >
              {displayTitle}
            </span>
          </div>

          {/* Spacer for visual balance */}
          <div className="w-14" />
        </div>

        {/* ─── CONTENT AREA (animated collapse) ─── */}
        <AnimatePresence initial={false}>
          {state === 'OPEN' && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
