/**
 * ═══════════════════════════════════════════════════════════
 * NO SIGNAL PLACEHOLDER — LYRIX OS
 * High-tech "No Signal" visual for missing project images.
 * Renders a scan-line noise aesthetic with animated borders.
 * ═══════════════════════════════════════════════════════════
 */

import { motion } from 'framer-motion';
import { MonitorOff } from 'lucide-react';

interface NoSignalPlaceholderProps {
  /** Gradient tuple for branded tinting */
  gradient?: [string, string];
  /** Label text below the icon */
  label?: string;
  /** Additional classes */
  className?: string;
}

export default function NoSignalPlaceholder({
  gradient = ['#111111', '#0a0a0a'],
  label = 'NO_SIGNAL',
  className = '',
}: NoSignalPlaceholderProps) {
  return (
    <div
      className={`relative w-full aspect-video overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
      }}
    >
      {/* ─── SCAN-LINE OVERLAY ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.03) 2px,
            rgba(255,255,255,0.03) 4px
          )`,
        }}
      />

      {/* ─── GRID OVERLAY ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* ─── NOISE TEXTURE (CSS only) ─── */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
        }}
      />

      {/* ─── ANIMATED CORNER BRACKETS ─── */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-white/20" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-white/20" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-white/20" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-white/20" />

      {/* ─── CENTER CONTENT ─── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MonitorOff className="w-8 h-8 text-white/60" />
        </motion.div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.25em]">
            {label}
          </span>
          <motion.div
            className="w-16 h-px bg-white/10"
            animate={{ scaleX: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-[9px] font-mono text-white/60 uppercase tracking-wider">
            awaiting_asset.upload
          </span>
        </div>
      </div>

      {/* ─── VIGNETTE ─── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
}
