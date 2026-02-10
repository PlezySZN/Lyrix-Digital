/**
 * ═══════════════════════════════════════════════════════════
 * SECTION HEADER — LYRIX OS
 * Reusable section header block used across all window panels.
 * Eliminates repeated header patterns in Portfolio, Services,
 * Process, Reviews, FAQ components.
 * ═══════════════════════════════════════════════════════════
 */

import { motion } from 'framer-motion';

interface SectionHeaderProps {
  /** Badge text (e.g., "PORTFOLIO", "SERVICES") */
  badge?: string;
  /** Status line (e.g., "5 Completed Projects") */
  status?: string;
  /** Main heading */
  title: string;
  /** Mono subtitle below heading */
  subtitle?: string;
  /** Body description below subtitle */
  description?: string;
  /** Whether the section is in view (for animation) */
  isInView: boolean;
  /** Animation delay offset in seconds */
  delay?: number;
  /** Status dot color class (default: 'bg-green-500') */
  dotColor?: string;
  /** Extra className for wrapper */
  className?: string;
}

export default function SectionHeader({
  badge,
  status,
  title,
  subtitle,
  description,
  isInView,
  delay = 0.15,
  dotColor = 'bg-green-500',
  className = 'mb-6',
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {badge && (
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20">
          <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-widest">
            {badge}
          </span>
        </div>
      )}

      {status && (
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-2 h-2 rounded-full ${dotColor} animate-pulse`} />
          <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
            {status}
          </span>
        </div>
      )}

      <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
        {title}
      </h2>

      {subtitle && (
        <p className="text-xs font-mono text-[#CCFF00]/60 uppercase tracking-widest mt-1">
          {subtitle}
        </p>
      )}

      {description && (
        <p className="text-sm text-white/60 mt-2 max-w-xl">
          {description}
        </p>
      )}
    </motion.div>
  );
}
