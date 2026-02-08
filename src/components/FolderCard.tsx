/**
 * ═══════════════════════════════════════════════════════════
 * FOLDER CARD — LYRIX OS
 * macOS-inspired glass folder with hover effects
 * ═══════════════════════════════════════════════════════════
 */

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface FolderCardProps {
  name: string;
  extension: string;
  icon: LucideIcon;
  meta: string;
  size: string;
  delay?: number;
  onClick?: () => void;
}

export default function FolderCard({
  name,
  extension,
  icon: Icon,
  meta,
  size,
  delay = 0,
  onClick,
}: FolderCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.9 + delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 rounded-2xl bg-white/0 group-hover:bg-white/5 blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

      {/* Main card container */}
      <div className="relative w-56 md:w-64 p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/[0.04]">
        {/* Icon container */}
        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300">
          <Icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
        </div>

        {/* File name */}
        <h3 className="text-base font-medium text-white mb-1 transition-colors duration-300">
          {name}
          <span className="text-white/40">.{extension}</span>
        </h3>

        {/* Meta description */}
        <p className="text-sm text-white/50 mb-3 group-hover:text-white/60 transition-colors duration-300">
          {meta}
        </p>

        {/* File metadata bar */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-xs text-white/30 font-mono">
            Size: {size}
          </span>
          <span className="text-xs text-white/30 font-mono">
            Type: Folder
          </span>
        </div>

        {/* Selection indicator (appears on hover) */}
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/0 group-hover:bg-white/40 transition-all duration-300" />
      </div>
    </motion.div>
  );
}
