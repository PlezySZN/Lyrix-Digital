/**
 * ═══════════════════════════════════════════════════════════
 * NAVIGATION — LYRIX OS
 * Desktop: Collapsed arrow on left edge → expands to Finder sidebar on click
 *          Collapses when cursor leaves the sidebar
 * Mobile:  Compact top header bar (hamburger → slide-down)
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  FolderOpen,
  Cpu,
  Radio,
  Rocket,
  BookOpen,
  Terminal,
  Menu,
  X,
  ChevronRight,
  DollarSign,
  Newspaper,
  Phone,
} from 'lucide-react';
import type { Lang } from '../i18n/ui';
import { markSidebarOpened, dismissHints } from '../stores/sidebarHintStore';

// ─── NAV ITEMS ───

interface NavItem {
  id: string;
  sectionId: string;
  icon: React.ElementType;
  labelEn: string;
  labelEs: string;
  isExternal?: boolean;
  href?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', sectionId: 'top', icon: Monitor, labelEn: 'Home', labelEs: 'Inicio' },
  { id: 'portfolio', sectionId: 'projects', icon: FolderOpen, labelEn: 'Portfolio', labelEs: 'Portafolio' },
  { id: 'services', sectionId: 'capabilities', icon: Cpu, labelEn: 'Services', labelEs: 'Servicios' },
  { id: 'reviews', sectionId: 'testimonials', icon: Radio, labelEn: 'Reviews', labelEs: 'Reseñas' },
  { id: 'process', sectionId: 'process', icon: Rocket, labelEn: 'Process', labelEs: 'Proceso' },
  { id: 'pricing', sectionId: 'pricing', icon: DollarSign, labelEn: 'Pricing', labelEs: 'Precios' },
  { id: 'faq', sectionId: 'manual', icon: BookOpen, labelEn: 'FAQ', labelEs: 'FAQ' },
  { id: 'blog', sectionId: 'blog-section', icon: Newspaper, labelEn: 'Blog', labelEs: 'Blog' },
  { id: 'cta', sectionId: 'cta-section', icon: Terminal, labelEn: 'Contact', labelEs: 'Contacto' },
];

// ─── SCROLL HANDLER ───

/**
 * Smooth-scrolls the page to a section by its DOM id.
 * Special case: 'top' scrolls to the very top of the page.
 * Used by both desktop sidebar items and mobile menu items.
 */
function scrollToSection(sectionId: string) {
  if (sectionId === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ─── SIDEBAR ITEM ───

/**
 * Individual navigation row inside the Finder sidebar.
 * Renders an icon + label + chevron indicator.
 * Handles internal smooth scrolling and external page navigation.
 *
 * @param item     - NavItem config (id, sectionId, icon, labels)
 * @param lang     - Current language for label resolution
 * @param isActive - Highlights the item if currently in viewport
 * @param onClick  - Additional callback after navigation
 */
function SidebarItem({
  item,
  lang,
  isActive,
  onClick,
}: {
  item: NavItem;
  lang: Lang;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const Icon = item.icon;
  const label = lang === 'es' ? item.labelEs : item.labelEn;

  const handleClick = () => {
    if (item.isExternal) {
      window.location.href = `/${lang}/blog/`;
      return;
    }
    scrollToSection(item.sectionId);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        group flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left
        transition-all duration-200 cursor-pointer
        ${isActive
          ? 'bg-white/10 text-white'
          : 'text-white/50 hover:bg-white/5 hover:text-white/80'
        }
      `}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="text-xs font-mono tracking-wide truncate">{label}</span>
      <ChevronRight className={`w-3 h-3 ml-auto shrink-0 transition-opacity duration-200 ${isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'}`} />
    </button>
  );
}

// ─── DESKTOP SIDEBAR ───

/**
 * Desktop navigation (visible on lg: breakpoint and above).
 *
 * Interaction flow:
 * 1. Default state: A thin arrow tab fixed to the left edge (ChevronRight).
 * 2. User clicks the arrow → sidebar expands with Finder-style chrome.
 *    Also calls markSidebarOpened() to permanently dismiss the Hero hint arrow.
 * 3. User moves cursor away → sidebar collapses after 300ms debounce.
 *    The debounce prevents accidental close when the cursor briefly leaves.
 * 4. AnimatePresence mode="wait" crossfades between arrow and sidebar states.
 */
function DesktopSidebar({ lang }: { lang: Lang }) {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  /** Cancel any pending auto-close when cursor re-enters the sidebar area */
  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = undefined;
    }
  };

  /**
   * Start a 300ms countdown to close the sidebar.
   * This debounce gives the user time to move their cursor
   * back into the sidebar without it closing immediately.
   */
  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  return (
    <div
      className="hidden lg:block fixed left-0 top-1/2 -translate-y-1/2 z-40"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ─── COLLAPSED: Arrow tab ─── */
          <motion.button
            key="arrow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onClick={() => { setIsOpen(true); markSidebarOpened(); dismissHints(); }}
            onMouseEnter={() => dismissHints()}
            className="group flex items-center justify-center w-8 h-20 rounded-r-xl
                       bg-black/70 backdrop-blur-xl border border-l-0 border-white/10
                       hover:bg-white/5 hover:border-[#CCFF00]/20
                       transition-all duration-200 cursor-pointer"
            aria-label={lang === 'es' ? 'Abrir navegación' : 'Open navigation'}
          >
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#CCFF00] transition-colors duration-200" />
          </motion.button>
        ) : (
          /* ─── EXPANDED: Finder sidebar ─── */
          <motion.aside
            key="sidebar"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="ml-2"
          >
            <div className="w-48 rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/50">
              {/* Sidebar title bar */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/5 bg-white/2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                  <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                </div>
                <span className="text-[10px] font-mono text-white/40 tracking-wider ml-1">FINDER</span>
              </div>

              {/* Favorites label */}
              <div className="px-3 pt-3 pb-1">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
                  {lang === 'es' ? 'Favoritos' : 'Favorites'}
                </span>
              </div>

              {/* Nav items */}
              <nav className="px-2 pb-3 flex flex-col gap-0.5">
                {NAV_ITEMS.map((item) => (
                  <SidebarItem key={item.id} item={item} lang={lang} />
                ))}
              </nav>

              {/* Footer */}
              <div className="px-3 py-2 border-t border-white/5 bg-white/2">
                <span className="text-[10px] font-mono text-white/20">
                  {NAV_ITEMS.length} {lang === 'es' ? 'elementos' : 'items'}
                </span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MOBILE HEADER ───

/**
 * Mobile navigation (visible below lg: breakpoint).
 *
 * Structure:
 * - Fixed top bar with LYRIX OS brand + hamburger toggle
 * - AnimatePresence dropdown menu that slides down from the header
 * - Nav items use 150ms delay after close before navigating (allows
 *   the close animation to complete before scroll/navigation)
 */
function MobileHeader({ lang }: { lang: Lang }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = useCallback((item: NavItem) => {
    setIsOpen(false);
    if (item.isExternal) {
      setTimeout(() => { window.location.href = `/${lang}/blog/`; }, 150);
      return;
    }
    setTimeout(() => scrollToSection(item.sectionId), 150);
  }, [lang]);

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
      {/* Header bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="flex items-center justify-between px-4 py-2.5 bg-black/80 backdrop-blur-xl border-b border-white/5"
      >
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
          <span className="text-xs font-mono font-bold text-white/80 tracking-wider">LYRIX OS</span>
        </div>

        {/* Right group: Call + Hamburger */}
        <div className="flex items-center gap-2">
          {/* Call CTA */}
          <a
            href="tel:+17876644109"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20 hover:bg-[#CCFF00]/20 transition-all duration-200"
            aria-label={lang === 'es' ? 'Llamar' : 'Call'}
          >
            <Phone className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span className="text-xs font-mono text-[#CCFF00]">{lang === 'es' ? 'Llamar' : 'Call'}</span>
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
            aria-label={isOpen ? (lang === 'es' ? 'Cerrar menú' : 'Close menu') : (lang === 'es' ? 'Abrir menú' : 'Open menu')}
          >
            {isOpen ? (
              <X className="w-4 h-4 text-white/70" />
            ) : (
              <Menu className="w-4 h-4 text-white/70" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-black/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const label = lang === 'es' ? item.labelEs : item.labelEn;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-mono">{label}</span>
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN EXPORT ───

/**
 * Root Navigation component — renders both Desktop and Mobile variants.
 * Astro hydrates this with client:idle so it's interactive shortly
 * after the page becomes idle (doesn't block LCP).
 *
 * @param lang - Current language, defaults to 'en'
 */
export default function Navigation({ lang = 'en' }: { lang?: Lang }) {
  return (
    <>
      <DesktopSidebar lang={lang} />
      <MobileHeader lang={lang} />
    </>
  );
}
