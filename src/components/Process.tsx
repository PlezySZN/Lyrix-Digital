/**
 * ═══════════════════════════════════════════════════════════
 * DEPLOYMENT SEQUENCE — LYRIX OS
 * 3-step process as a circuit board with scroll-animated SVG path
 * ═══════════════════════════════════════════════════════════
 */

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValueEvent, useMotionValue } from 'framer-motion';
import { Radar, Code2, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import WindowFrame from './WindowFrame';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

// ─── DATA ───

interface StepNode {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const defaultSteps: StepNode[] = [
  { id: '01', label: 'SCAN', title: 'Discovery', description: '', icon: Radar },
  { id: '02', label: 'COMPILE', title: 'Development', description: '', icon: Code2 },
  { id: '03', label: 'GO_LIVE', title: 'Launch', description: '', icon: Rocket },
];

// ─── NODE COMPONENT ───

function ProcessNode({
  step,
  isActive,
  delay,
  isInView,
}: {
  step: StepNode;
  isActive: boolean;
  delay: number;
  isInView: boolean;
}) {
  const Icon = step.icon;
  const isNode02 = step.id === '02';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative flex flex-col items-center text-center"
    >
      {/* Card background for z-layering above SVG line */}
      <div className="relative z-10 flex flex-col items-center p-6 rounded-xl border border-white/5 bg-[#0a0a0a]/90 backdrop-blur-sm">
        {/* Glow ring behind node */}
        <div
          className={`
            absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full
            transition-all duration-700 ease-out
            ${isActive ? 'bg-[#CCFF00]/10 blur-xl scale-150' : 'bg-transparent blur-none scale-100'}
          `}
        />

      {/* Icon Node */}
      <div
        className={`
          relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl
          border transition-all duration-500 ease-out mb-5 bg-white/3
          ${isNode02
            ? (isActive 
               ? 'border-[#CCFF00]/40 bg-[#0a0a0a] shadow-[0_0_30px_rgba(204,255,0,0.15)]' 
               : 'border-white/10 bg-[#0a0a0a]')
            : (isActive
               ? 'border-[#CCFF00]/40 bg-[#CCFF00]/10 shadow-[0_0_30px_rgba(204,255,0,0.15)]'
               : 'border-white/10 bg-white/3')
          }
        `}
      >
        <Icon
          className={`w-7 h-7 transition-colors duration-500 ${isActive ? 'text-[#CCFF00]' : 'text-white/40'}`}
        />
      </div>

      {/* Step Number + Label */}
      <span
        className={`text-xs font-mono tracking-widest mb-1.5 transition-colors duration-500 ${isActive ? 'text-[#CCFF00]/80' : 'text-white/30'}`}
      >
        NODE {step.id}
      </span>

      {/* Title */}
      <h3
        className={`text-lg font-semibold tracking-tight mb-2 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/60'}`}
      >
        [{step.label}]
      </h3>

      {/* Description */}
      <p className="text-sm text-white/40 leading-relaxed max-w-55">
        {step.description}
      </p>
      </div>{/* end card background */}
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───

export default function Process({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathSectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const [activeNodes, setActiveNodes] = useState<number>(0);

  // i18n step data
  const steps: StepNode[] = [
    { id: '01', label: t('deploy.step1.label'), title: t('deploy.step1.title'), description: t('deploy.step1.description'), icon: Radar },
    { id: '02', label: t('deploy.step2.label'), title: t('deploy.step2.title'), description: t('deploy.step2.description'), icon: Code2 },
    { id: '03', label: t('deploy.step3.label'), title: t('deploy.step3.title'), description: t('deploy.step3.description'), icon: Rocket },
  ];

  // ─── VISIBILITY GATE ───
  // Prevents progress from sticking at 100% when the section
  // is collapsed / minimised / hidden by WindowFrame.
  const isSectionActiveRef = useRef(false);
  const [isSectionActive, setIsSectionActive] = useState(false);

  useEffect(() => {
    isSectionActiveRef.current = isSectionActive;
  }, [isSectionActive]);

  useEffect(() => {
    const el = pathSectionRef.current;
    if (!el) return;

    const check = () => {
      const active = el.getBoundingClientRect().height > 50;
      setIsSectionActive(active);
      isSectionActiveRef.current = active;
    };

    const io = new IntersectionObserver(() => check(), { threshold: 0 });
    const ro = new ResizeObserver(() => check());
    io.observe(el);
    ro.observe(el);

    return () => { io.disconnect(); ro.disconnect(); };
  }, []);

  // Reset nodes immediately when section becomes invisible
  useEffect(() => {
    if (!isSectionActive) setActiveNodes(0);
  }, [isSectionActive]);

  // Scroll-linked animation for the SVG path
  const { scrollYProgress } = useScroll({
    target: pathSectionRef,
    offset: ['start 0.8', 'end 0.5'],
  });

  // Gated progress: 0 when hidden, follows scroll when visible
  const visibleProgress = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!isSectionActiveRef.current) {
      visibleProgress.set(0);
      return;
    }
    const v = Math.max(0, Math.min(1, latest));
    visibleProgress.set(v);

    if (v < 0.15) setActiveNodes(0);
    else if (v < 0.5) setActiveNodes(1);
    else if (v < 0.85) setActiveNodes(2);
    else setActiveNodes(3);
  });

  return (
    <WindowFrame id="deployment" className="relative w-full bg-lyrix-dark px-4 md:px-8 pb-8">
    <section ref={containerRef} aria-label={lang === 'es' ? 'Proceso' : 'Process'}>
      {/* ─── CONTENT (window frame provided by OsWindow) ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 30 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* ─── CONTENT ─── */}
        <div ref={pathSectionRef} className="p-6 md:p-10 lg:p-14">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20">
              <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-widest">
                {t('deploy.section.label')}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                {t('deploy.status')}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight" aria-label="How We Work With You">
              {t('deploy.title')}
            </h2>
            <p className="text-xs font-mono text-[#CCFF00]/60 uppercase tracking-widest mt-1">
              {t('deploy.subtitle')}
            </p>
            <p className="text-sm text-white/40 mt-2 max-w-xl">
              {t('deploy.description')}
            </p>
          </motion.div>

          {/* ─── DESKTOP: HORIZONTAL CIRCUIT ─── */}
          <div className="hidden md:block">
            {/* SVG Circuit Line that goes under NODE 02 */}
            <div className="relative mb-12">
              <svg
                viewBox="0 0 900 60"
                className="absolute top-3 left-[calc(16.66%+32px)] w-[calc(66.66%-64px)] h-15 z-0"
                preserveAspectRatio="none"
              >
                {/* Background track path */}
                <path
                  d="M 0 30 L 380 30 L 390 30 Q 400 30 410 35 L 440 45 Q 450 48 460 45 L 490 35 Q 500 30 510 30 L 520 30 L 900 30"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="2"
                  fill="none"
                />
                
                {/* Animated fill path */}
                <motion.path
                  d="M 0 30 L 380 30 L 390 30 Q 400 30 410 35 L 440 45 Q 450 48 460 45 L 490 35 Q 500 30 510 30 L 520 30 L 900 30"
                  stroke="#CCFF00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    pathLength: visibleProgress,
                  }}
                  initial={{ pathLength: 0 }}
                />
              </svg>

              {/* Energy glow on the path */}
              <svg
                viewBox="0 0 900 60"
                className="absolute top-3 left-[calc(16.66%+32px)] w-[calc(66.66%-64px)] h-15 z-0 blur-sm opacity-60"
                preserveAspectRatio="none"
              >
                <motion.path
                  d="M 0 30 L 380 30 L 390 30 Q 400 30 410 35 L 440 45 Q 450 48 460 45 L 490 35 Q 500 30 510 30 L 520 30 L 900 30"
                  stroke="#CCFF00"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    pathLength: visibleProgress,
                  }}
                  initial={{ pathLength: 0 }}
                />
              </svg>

              {/* Nodes Grid */}
              <div className="relative z-10 grid grid-cols-3 gap-8">
                {steps.map((step, index) => (
                  <ProcessNode
                    key={step.id}
                    step={step}
                    isActive={index < activeNodes}
                    delay={0.3 + index * 0.15}
                    isInView={isInView}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ─── MOBILE: VERTICAL CIRCUIT ─── */}
          <div className="md:hidden">
            <div className="relative pl-10">
              {/* Vertical SVG Circuit Line - smaller, from node 01 to node 03 */}
              <svg
                className="absolute left-4.75 top-0 w-1 z-0"
                style={{ height: 'calc(100% - 40px)' }}
                preserveAspectRatio="none"
              >
                {/* Background track */}
                <line x1="2" y1="5%" x2="2" y2="95%" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
                {/* Animated fill */}
                <motion.line
                  x1="2" y1="5%" x2="2" y2="95%"
                  stroke="#CCFF00"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{
                    pathLength: visibleProgress,
                  }}
                  initial={{ pathLength: 0 }}
                />
              </svg>

              {/* Mobile Nodes */}
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index < activeNodes;
                const isNode03 = step.id === '03';

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                    className={`relative pb-10 last:pb-0 ${isNode03 ? 'mt-0.75' : ''}`}
                  >
                    {/* Node Dot - all nodes now have solid backgrounds */}
                    <div
                      className={`
                        absolute -left-10 top-0 w-10 h-10 rounded-xl
                        flex items-center justify-center border
                        transition-all duration-500 bg-[#0a0a0a]
                        ${
                          isActive
                            ? 'border-[#CCFF00]/40 shadow-[0_0_20px_rgba(204,255,0,0.15)]'
                            : 'border-white/10'
                        }
                      `}
                    >
                      <Icon
                        className={`w-5 h-5 transition-colors duration-500 ${isActive ? 'text-[#CCFF00]' : 'text-white/40'}`}
                      />
                    </div>

                    {/* Content */}
                    <div className="ml-4">
                      <span
                        className={`text-xs font-mono tracking-widest transition-colors duration-500 ${isActive ? 'text-[#CCFF00]/80' : 'text-white/30'}`}
                      >
                        NODE {step.id}
                      </span>
                      <h3
                        className={`text-base font-semibold tracking-tight mt-1 mb-1.5 transition-colors duration-500 ${isActive ? 'text-white' : 'text-white/60'}`}
                      >
                        [{step.label}] — {step.title}
                      </h3>
                      <p className="text-sm text-white/40 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ─── FOOTER STATUS ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-10 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/30"
          >
            <span>{t('deploy.footer.protocol')}</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
              <span>{t('deploy.footer.timeline')}</span>
            </span>
            <span>{t('deploy.footer.priority')}</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
    </WindowFrame>
  );
}
