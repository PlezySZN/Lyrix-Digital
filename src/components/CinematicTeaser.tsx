/**
 * ═══════════════════════════════════════════════════════════
 * CINEMATIC TEASER — LYRIX OS
 *
 * When `vimeoId` is provided → renders a Vimeo embed player.
 * When absent → shows an animated "coming soon" placeholder.
 *
 * USAGE (ready to swap):
 *   Before video: <CinematicTeaser lang={lang} client:visible />
 *   After video:  <CinematicTeaser lang={lang} vimeoId="123456789" client:visible />
 * ═══════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Film, Play } from 'lucide-react';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

interface CinematicTeaserProps {
  lang?: Lang;
  /** Vimeo video ID — when provided, shows the embed instead of the placeholder */
  vimeoId?: string;
}

export default function CinematicTeaser({ lang = 'en', vimeoId }: CinematicTeaserProps) {
  const t = useTranslations(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  const hasVideo = !!vimeoId;

  return (
    <div ref={containerRef} className="w-full bg-lyrix-dark px-4 md:px-8 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-4xl mx-auto"
      >
        {/* Video container — cinematic aspect ratio */}
        <div className="relative rounded-xl border border-white/10 bg-[#050505] overflow-hidden">
          {/* Aspect ratio container (2.39:1 — anamorphic cinema) */}
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>

            {hasVideo ? (
              /* ═══ VIMEO EMBED ═══ */
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?autoplay=0&title=0&byline=0&portrait=0&color=CCFF00&dnt=1`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
                title={t('teaser.title')}
              />
            ) : (
              /* ═══ "COMING SOON" PLACEHOLDER ═══ */
              <div className="absolute inset-0">
                {/* Horizontal scan lines */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                  }}
                />
                {/* Subtle vignette */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)',
                  }}
                />
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  {/* Play button ring */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-[#CCFF00]/30 flex items-center justify-center">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-[#CCFF00]/20 bg-[#CCFF00]/5 flex items-center justify-center">
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-[#CCFF00]/60 ml-0.5" />
                      </div>
                    </div>
                    {/* Pulse ring */}
                    <motion.div
                      animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-full border border-[#CCFF00]/20"
                    />
                  </motion.div>

                  {/* Coming soon text */}
                  <div className="text-center">
                    <motion.p
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-xs md:text-sm font-mono text-[#CCFF00]/70 uppercase tracking-[0.3em]"
                    >
                      {t('teaser.coming')}
                    </motion.p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom info bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 md:px-6 py-3 border-t border-white/5 bg-white/2">
            <div className="flex items-center gap-2 min-w-0">
              <Film className="w-3.5 h-3.5 flex-shrink-0 text-white/40" />
              <span className="text-[11px] font-mono text-white/40 truncate">{t('teaser.title')}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[11px] font-mono text-white/30">{t('teaser.format')}</span>
              {hasVideo ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
                  <span className="text-[11px] font-mono text-[#CCFF00]/70">{t('teaser.statusLive')}</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  <span className="text-[11px] font-mono text-yellow-500/70">{t('teaser.status')}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="text-center text-xs text-white/30 font-mono mt-4">
          {hasVideo ? t('teaser.captionLive') : t('teaser.caption')}
        </p>
      </motion.div>
    </div>
  );
}
