/**
 * ═══════════════════════════════════════════════════════════
 * KNOWLEDGE BASE — LYRIX OS
 * FAQ accordion styled as system manual for objection handling
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import WindowFrame from './WindowFrame';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

// ─── DATA ───

interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  _response: string;
}

const knowledgeIds = ['Q001', 'Q002', 'Q003', 'Q004', 'Q005', 'Q006', 'Q007', 'Q008'] as const;

// ─── ACCORDION ITEM COMPONENT ───

function KnowledgeItem({
  entry,
  isOpen,
  onToggle,
  delay,
  isInView,
}: {
  entry: KnowledgeEntry;
  isOpen: boolean;
  onToggle: () => void;
  delay: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.3, delay }}
      className="border-b border-white/5 last:border-b-0"
    >
      {/* Question Button */}
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${entry.id}`}
        className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-white/2 transition-colors duration-200 group"
      >
        {/* Icon */}
        <div className="shrink-0">
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-[#CCFF00] transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors duration-200" />
          )}
        </div>

        {/* Question */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-white/30">
              {entry.id}
            </span>
            <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/30">
              [{entry.category}]
            </span>
          </div>
          <span
            id={`faq-question-${entry.id}`}
            className={`font-mono text-sm transition-colors duration-200 ${
              isOpen ? 'text-[#CCFF00]' : 'text-white/60 group-hover:text-white/80'
            }`}
          >
            {'>'} {entry.question}
          </span>
        </div>
      </button>

      {/* Answer Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-answer-${entry.id}`}
            role="region"
            aria-labelledby={`faq-question-${entry.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 ml-7 mt-4">
              <div className="p-4 rounded-lg bg-white/1 border border-white/5">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xs font-mono text-[#CCFF00] mt-0.5">
                    {'v [!]'}
                  </span>
                  <span className="text-xs font-mono text-[#CCFF00]/60 uppercase tracking-wider">
                    {entry._response}
                  </span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed pl-6">
                  {entry.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───

export default function FAQ({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });

  // Build FAQ entries from i18n dictionary
  const knowledgeEntries: KnowledgeEntry[] = knowledgeIds.map((_, i) => {
    const n = i + 1;
    const qKey = `kb.q${n}.question` as keyof ReturnType<typeof t> & string;
    const aKey = `kb.q${n}.answer` as keyof ReturnType<typeof t> & string;
    const cKey = `kb.q${n}.category` as keyof ReturnType<typeof t> & string;
    return {
      id: `Q00${n}`,
      question: t(qKey as any),
      answer: t(aKey as any),
      category: t(cKey as any),
      _response: t('kb.response'),
    };
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <WindowFrame id="manual" className="relative w-full bg-lyrix-dark px-4 md:px-8 pb-8">
    <section ref={containerRef} aria-label={lang === 'es' ? 'Preguntas frecuentes' : 'Frequently asked questions'}>
      {/* ─── CONTENT (window frame provided by OsWindow) ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 30 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-4xl mx-auto"
      >
        {/* ─── CONTENT ─── */}
        <div className="p-6 md:p-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
              <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
                {t('kb.status')}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              {t('kb.title')}
            </h2>
            <p className="text-sm text-white/60 mt-2 max-w-xl">
              {t('kb.description')}
            </p>
          </motion.div>

          {/* ─── ACCORDION LIST ─── */}
          <div className="rounded-xl border border-white/5 bg-white/1 overflow-hidden">
            {(showAll ? knowledgeEntries : knowledgeEntries.slice(0, 4)).map((entry, index) => (
              <KnowledgeItem
                key={entry.id}
                entry={entry}
                isOpen={openItems.has(entry.id)}
                onToggle={() => toggleItem(entry.id)}
                delay={0.3 + index * 0.1}
                isInView={isInView}
              />
            ))}
          </div>

          {/* ─── EXPAND / COLLAPSE TOGGLE ─── */}
          {!showAll && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="mt-4 flex justify-center"
            >
              <button
                onClick={() => setShowAll(true)}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-white/2 hover:bg-white/4 hover:border-white/15 transition-all duration-200"
              >
                <span className="text-xs font-mono text-white/50 group-hover:text-white/70 transition-colors">
                  {t('kb.expand').replace('{count}', String(knowledgeEntries.length - 4))}
                </span>
              </button>
            </motion.div>
          )}

          {/* ─── VIEW LESS TOGGLE ─── */}
          {showAll && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-4 flex justify-center"
            >
              <button
                onClick={() => setShowAll(false)}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-white/2 hover:bg-white/4 hover:border-white/15 transition-all duration-200"
              >
                <span className="text-xs font-mono text-white/50 group-hover:text-white/70 transition-colors">
                  {t('kb.collapse')}
                </span>
              </button>
            </motion.div>
          )}

          {/* ─── FOOTER STATUS ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/30"
          >
            <span>{t('kb.footer.protocols').replace('{count}', String(knowledgeEntries.length))}</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
              <span>{t('kb.footer.manual')}</span>
            </span>
            <span>{t('kb.footer.version')}</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
    </WindowFrame>
  );
}