/**
 * ═══════════════════════════════════════════════════════════
 * BLOG CONTENT — LYRIX OS
 * React island that renders blog preview cards inside WindowFrame.
 * Post data is serialized from Astro at build time and passed as props.
 * ═══════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import WindowFrame from './WindowFrame';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

// ─── TYPES ───

export interface BlogPostData {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string; // ISO string (serialized from Astro)
  wordCount: number;
}

interface BlogContentProps {
  lang?: Lang;
  posts: BlogPostData[];
}

// ─── COMPONENT ───

export default function BlogContent({ lang = 'en', posts }: BlogContentProps) {
  const t = useTranslations(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <WindowFrame id="blog" className="relative w-full bg-lyrix-dark px-4 md:px-8 pb-8">
      <section ref={containerRef} id="blog-section" aria-label={lang === 'es' ? 'Blog' : 'Blog'}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 30 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="p-6 md:p-8">
            {/* ── Section Header ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20">
                <div className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
                <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-widest">
                  {t('blog.section.label')}
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2 uppercase"
                style={{ fontFamily: 'var(--font-oswald, var(--font-barlow, sans-serif))' }}
              >
                {t('blog.heading')}
              </h2>
              <p className="text-sm text-white/50 max-w-xl">
                {t('blog.subtitle')}
              </p>
            </motion.div>

            {/* ── Posts Grid ── */}
            {posts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              >
                {posts.map((post) => {
                  const formattedDate = new Date(post.date).toLocaleDateString(
                    lang === 'es' ? 'es-PR' : 'en-US',
                    { year: 'numeric', month: 'short', day: 'numeric' }
                  );
                  const readingTime = Math.max(1, Math.ceil(post.wordCount / 200));

                  return (
                    <a
                      key={post.slug}
                      href={`/${lang}/blog/${post.slug}/`}
                      className="group flex flex-col p-6 rounded-xl border border-white/5 bg-white/2 hover:border-[#CCFF00]/20 hover:bg-[#CCFF00]/2 transition-all duration-300"
                    >
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-white/40 uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-semibold text-white group-hover:text-[#CCFF00] transition-colors duration-200 mb-2 tracking-tight leading-snug">
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-2 flex-1">
                        {post.description}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                        <div className="flex items-center gap-3 text-xs font-mono text-white/30">
                          <span>{formattedDate}</span>
                          <span>{readingTime} {t('blog.minRead')}</span>
                        </div>
                        <span className="text-xs font-mono text-[#CCFF00]/60 group-hover:text-[#CCFF00] transition-colors duration-200">
                          {t('blog.readMore')} →
                        </span>
                      </div>
                    </a>
                  );
                })}
              </motion.div>
            )}

            {/* ── View All CTA ── */}
            <div className="text-center">
              <a
                href={`/${lang}/blog/`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/3 text-sm font-mono text-white/60 hover:text-[#CCFF00] hover:border-[#CCFF00]/30 hover:bg-[#CCFF00]/5 transition-all duration-300"
              >
                {t('blog.viewAll')} →
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </WindowFrame>
  );
}
