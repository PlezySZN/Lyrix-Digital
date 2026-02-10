/**
 * ═══════════════════════════════════════════════════════════
 * OS WINDOW — LYRIX OS v1.2
 * Reusable window frame with Red/Yellow/Green traffic light controls
 * Manages OPEN / COLLAPSED / DOCKED states via windowStore
 *
 * IMPORTANT — Children are ALWAYS mounted (never unmounted).
 * This prevents a class of bugs where child components use
 * useInView(ref, { once: true }) — if children unmounted and
 * remounted, the IntersectionObserver would watch a dead DOM
 * element and isInView would never fire again, leaving content
 * permanently invisible after a collapse/dock → restore cycle.
 *
 * Visibility strategy:
 *   OPEN      → Window frame + content visible (height: auto)
 *   COLLAPSED → Title bar visible, content animated to height: 0
 *   DOCKED    → Entire wrapper hidden via display:none (Tailwind `hidden`)
 * ═══════════════════════════════════════════════════════════
 */

import { useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
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
  /** When true, traffic light dots are bright & clickable. When false, dots are decorational & dimmed. Defaults to true. */
  interactive?: boolean;
}

// ─── EASING ───

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

// ─── COMPONENT ───

export default function WindowFrame({
  id,
  children,
  title,
  className = '',
  titleIcon,
  accent = false,
  interactive = true,
}: OsWindowProps) {
  const windows = useStore($windows);
  const state = windows[id];
  const meta = WINDOW_REGISTRY[id];
  const displayTitle = title || meta.title;
  const containerRef = useRef<HTMLDivElement>(null);

  // Derived booleans for readability
  const isOpen = state === 'OPEN';
  const isDocked = state === 'DOCKED';

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
    <div
      id={meta.sectionId}
      ref={containerRef}
      className={`${className} ${isDocked ? 'hidden' : ''}`}
    >
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
          {/* Traffic Light Buttons — Bright=Clickable, Dimmed=Decorational */}
          <div className="flex items-center gap-1.5">
            {interactive ? (
              <>
                {/* RED — Close / Dock */}
                <div className="flex items-center justify-center w-6 h-6">
                  <button
                    onClick={handleRed}
                    className="group relative w-3 h-3 rounded-full bg-[#FF5F57] cursor-pointer hover:brightness-125 hover:scale-110 transition-all"
                    aria-label="Close window"
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black/60 text-[8px] font-bold leading-none">
                      ×
                    </span>
                  </button>
                </div>
                {/* YELLOW — Minimize / Collapse */}
                <div className="flex items-center justify-center w-6 h-6">
                  <button
                    onClick={handleYellow}
                    className="group relative w-3 h-3 rounded-full bg-[#FEBC2E] cursor-pointer hover:brightness-125 hover:scale-110 transition-all"
                    aria-label="Minimize window"
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black/60 text-[8px] font-bold leading-none">
                      −
                    </span>
                  </button>
                </div>
                {/* GREEN — Restore / Maximize */}
                <div className="flex items-center justify-center w-6 h-6">
                  <button
                    onClick={handleGreen}
                    className={`group relative w-3 h-3 rounded-full bg-[#28C840] cursor-pointer hover:brightness-125 hover:scale-110 transition-all ${
                      isOpen ? 'ring-1 ring-[#28C840]/40' : ''
                    }`}
                    aria-label="Restore window"
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-black/60 text-[8px] font-bold leading-none">
                      +
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Decorational dots — dimmed, non-interactive */}
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]/50" aria-hidden="true" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]/50" aria-hidden="true" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]/50" aria-hidden="true" />
              </>
            )}
          </div>

          {/* Window Title */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            {titleIcon && titleIcon}
            <span
              className={`text-xs font-mono tracking-wide ${
                accent ? 'text-[#CCFF00]/60 text-sm' : 'text-white/60'
              }`}
            >
              {displayTitle}
            </span>
          </div>

          {/* Spacer for visual balance */}
          <div className="w-14" />
        </div>

        {/* ─── CONTENT AREA ───
             Children stay mounted at all times to preserve useInView refs.
             Visibility is controlled purely via height + opacity animation. */}
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: EASE }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
