/**
 * ═══════════════════════════════════════════════════════════
 * STATUS BAR — LYRIX OS v1.2
 * macOS-inspired fixed footer with Window Dock system
 * Left: System info | Center: Window Dock | Right: System Tray
 * ═══════════════════════════════════════════════════════════
 */

import { motion } from 'framer-motion';
import {
  MessageCircle,
  Wifi,
  Battery,
  Cpu,
  FolderOpen,
  Rocket,
  Radio,
  BookOpen,
  Globe,
} from 'lucide-react';
import { useStore } from '@nanostores/react';
import { openContactModal } from '../stores/modalStore';
import {
  $windows,
  restoreWindow,
  minimizeWindow,
  ALL_WINDOW_IDS,
  WINDOW_REGISTRY,
  type WindowId,
  type WindowState,
} from '../stores/windowStore';
import type { StatusBarTranslations } from '../i18n/translations';
import type { Lang } from '../i18n/ui';

// ─── ICON MAP ───

const ICON_MAP: Record<string, React.ElementType> = {
  Cpu,
  FolderOpen,
  Rocket,
  Radio,
  BookOpen,
};

// ─── DOCK ITEM ───

function DockItem({ id, state }: { id: WindowId; state: WindowState }) {
  const meta = WINDOW_REGISTRY[id];
  const Icon = ICON_MAP[meta.icon];
  const isActive = state === 'OPEN';
  const isDocked = state === 'DOCKED';

  const handleClick = () => {
    if (isDocked || state === 'COLLAPSED') {
      // Restore and scroll to section
      restoreWindow(id);
      setTimeout(() => {
        const el = document.getElementById(meta.sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (isActive) {
      // Minimize it
      minimizeWindow(id);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.15, y: -4 }}
      whileTap={{ scale: 0.9 }}
      className="relative group flex flex-col items-center gap-1"
      title={meta.title}
    >
      {/* Icon Container */}
      <div
        className={`
          relative w-8 h-8 rounded-lg flex items-center justify-center
          transition-all duration-200
          ${isDocked
            ? 'bg-white/5 border border-white/10 text-white/30'
            : isActive
              ? 'bg-white/10 border border-white/15 text-white/70'
              : 'bg-white/5 border border-white/10 text-white/40'
          }
          hover:bg-white/15 hover:text-white/80
        `}
      >
        {Icon && <Icon className="w-3.5 h-3.5" />}

        {/* Dock badge for DOCKED (red) windows */}
        {isDocked && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF5F57] ring-1 ring-[#FF5F57]/30" />
        )}
      </div>

      {/* Active dot indicator */}
      <div
        className={`
          w-1 h-1 rounded-full transition-all duration-300
          ${isActive
            ? 'bg-[#CCFF00] shadow-[0_0_6px_rgba(204,255,0,0.6)]'
            : state === 'COLLAPSED'
              ? 'bg-white/30'
              : 'bg-transparent'
          }
        `}
      />

      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 px-2 py-1 rounded bg-lyrix-steel border border-white/10 text-[10px] font-mono text-white/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {meta.title}
      </div>
    </motion.button>
  );
}

// ─── MAIN STATUS BAR ───

interface StatusBarProps {
  translations: StatusBarTranslations;
  lang?: Lang;
}

export default function StatusBar({ translations: t, lang = 'en' }: StatusBarProps) {
  const windows = useStore($windows);

  // Language switcher — swaps /es/ <-> /en/ in the URL
  const otherLang: Lang = lang === 'es' ? 'en' : 'es';
  const handleLangSwitch = () => {
    const currentPath = window.location.pathname;
    const hasLangPrefix = currentPath === `/${lang}` || currentPath.startsWith(`/${lang}/`);
    const newPath = hasLangPrefix
      ? currentPath.replace(`/${lang}`, `/${otherLang}`)
      : `/${otherLang}/`;
    window.location.href = newPath || `/${otherLang}/`;
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="fixed bottom-0 left-0 right-0 z-50"
    >
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-xl border-t border-white/5" />

      {/* Content */}
      <div className="relative flex items-center justify-between px-4 md:px-6 py-2.5">
        {/* ─── LEFT: System Info ─── */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <span className="text-xs font-mono text-white/60 hidden md:inline">
            Lyrix OS v1.2
          </span>
          <span className="text-xs font-mono text-white/60 hidden">
            LX 1.2
          </span>
          <div className="h-3 w-px bg-white/10 hidden md:block" />
          <span className="text-xs text-white/30 hidden md:inline">
            {t['statusbar.ready']}
          </span>
        </div>

        {/* ─── CENTER: Window Dock ─── */}
        <nav aria-label={lang === 'es' ? 'Panel de ventanas' : 'Window dock'} className="flex items-end gap-1.5 md:gap-2 px-3 py-1 rounded-xl bg-white/2 border border-white/5 pt-2.5">
          {ALL_WINDOW_IDS.map((id) => (
            <DockItem key={id} id={id} state={windows[id]} />
          ))}
        </nav>

        {/* ─── RIGHT: System Tray ─── */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Signal indicator */}
          <div className="hidden md:flex items-center gap-1 text-white/60" aria-hidden="true">
            <Wifi className="w-3.5 h-3.5" />
          </div>

          {/* Battery indicator */}
          <div className="hidden md:flex items-center gap-1 text-white/60">
            <Battery className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">100%</span>
          </div>

          <div className="h-3 w-px bg-white/10" />

          {/* Language Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLangSwitch}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            <Globe className="w-3 h-3 text-[#CCFF00]/60" />
            <span className="sr-only">
              {lang === 'es' ? 'Cambiar a Ingles' : 'Switch to Espanol'}
            </span>
            <span className="text-xs font-mono" aria-hidden="true">
              <span className={lang === 'es' ? 'text-[#CCFF00]' : 'text-white/40'}>ES</span>
              <span className="text-white/20 mx-0.5">/</span>
              <span className={lang === 'en' ? 'text-[#CCFF00]' : 'text-white/40'}>EN</span>
            </span>
          </motion.button>

          {/* Contact button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openContactModal()}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            <MessageCircle className="w-3.5 h-3.5 text-white/60" />
            <span className="text-xs text-white/60">{t['statusbar.contact']}</span>
          </motion.button>
        </div>
      </div>
    </motion.footer>
  );
}
