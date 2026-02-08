/**
 * ═══════════════════════════════════════════════════════════
 * KNOWLEDGE BASE — LYRIX OS
 * FAQ accordion styled as system manual for objection handling
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronRight, ChevronDown } from 'lucide-react';
import OsWindow from './OsWindow';

// ─── DATA ───

interface KnowledgeEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const knowledgeEntries: KnowledgeEntry[] = [
  {
    id: 'Q001',
    question: 'PROTOCOL_OWNERSHIP: Do I own the source code?',
    answer: 'Affirmative. Unlike Wix or generic agencies, you own the intellectual property. We hand over the GitHub repository keys upon completion. No vendor lock-in.',
    category: 'OWNERSHIP',
  },
  {
    id: 'Q002',
    question: 'MAINTENANCE_MODES: What happens after launch?',
    answer: 'Two options: 1. Managed Mode (We handle updates, security, and content monthly). 2. Handover Mode (We give you the code, and you manage it internally).',
    category: 'SUPPORT',
  },
  {
    id: 'Q003',
    question: 'DEPLOYMENT_TIME: How fast is the build?',
    answer: 'Standard architecture takes 2-4 weeks. Expedited \'Sprint\' protocols available for urgent launches.',
    category: 'TIMELINE',
  },
  {
    id: 'Q004',
    question: 'ROI_CALCULATION: Why is this better than social media?',
    answer: 'Social media is \'rented land\'. A Lyrix System is \'owned real estate\'. It ranks on Google, captures leads automatically, and builds tangible asset value.',
    category: 'STRATEGY',
  },
  {
    id: 'Q005',
    question: 'COST_STRUCTURE: What does a project typically cost?',
    answer: 'Projects range from $1K–$10K+ depending on scope. A single landing page starts lower. Full authority systems with SEO, content, and automation scale up. Every dollar is allocated to measurable output.',
    category: 'PRICING',
  },
  {
    id: 'Q006',
    question: 'TECH_STACK: Why Astro instead of WordPress?',
    answer: 'WordPress is a 20-year-old CMS running PHP. Astro ships zero JavaScript by default, loads 3-5x faster, scores 95+ on PageSpeed, and is virtually unhackable with no database. Speed = SEO = More Leads.',
    category: 'TECHNOLOGY',
  },
  {
    id: 'Q007',
    question: 'GEOGRAPHIC_SCOPE: Do you only work in Puerto Rico?',
    answer: 'Our core market is PR-based contractors and creatives, but the technology is location-agnostic. If you operate in the US mainland or LatAm, the same architecture applies.',
    category: 'COVERAGE',
  },
  {
    id: 'Q008',
    question: 'REVISION_POLICY: What if I don\'t like the design?',
    answer: 'Every project includes 2 revision rounds baked into the contract. We show wireframes before any code is written. You approve direction before we build — no surprises, no wasted time.',
    category: 'PROCESS',
  },
];

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
        className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-white/[0.02] transition-colors duration-200 group"
      >
        {/* Icon */}
        <div className="flex-shrink-0">
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 ml-7 mt-4">
              <div className="p-4 rounded-lg bg-white/[0.01] border border-white/5">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xs font-mono text-[#CCFF00] mt-0.5">
                    {'v [!]'}
                  </span>
                  <span className="text-xs font-mono text-[#CCFF00]/60 uppercase tracking-wider">
                    Response
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

export default function KnowledgeBase() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });

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
    <OsWindow id="manual" className="relative w-full bg-[#050505] px-4 md:px-8 py-8">
    <section ref={containerRef}>
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
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                Knowledge Base
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              System Manual
            </h2>
            <p className="text-sm text-white/40 mt-2 max-w-xl">
              Critical information for decision making. Click to expand protocols.
            </p>
          </motion.div>

          {/* ─── ACCORDION LIST ─── */}
          <div className="rounded-xl border border-white/5 bg-white/[0.01] overflow-hidden">
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
                className="group flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-200"
              >
                <span className="text-xs font-mono text-white/50 group-hover:text-white/70 transition-colors">
                  {'>'} EXPAND_MANUAL ({knowledgeEntries.length - 4} more protocols)
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
                className="group flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-200"
              >
                <span className="text-xs font-mono text-white/50 group-hover:text-white/70 transition-colors">
                  {'>'} COLLAPSE_MANUAL (show essential protocols only)
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
            <span>{knowledgeEntries.length} protocols documented</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
              <span>Manual: Current</span>
            </span>
            <span>Version: 2026.Q1</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
    </OsWindow>
  );
}