/**
 * ═══════════════════════════════════════════════════════════
 * SYSTEM SPECS — LYRIX OS
 * Glassmorphic window displaying agency services as system specs
 * ═══════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Aperture, Activity } from 'lucide-react';
import SpecModule from './SpecModule';
import OsWindow from './OsWindow';

export default function SystemSpecs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  // Service modules data
  const modules = [
    {
      icon: Cpu,
      title: 'DIGITAL HEADQUARTERS',
      codeName: 'Web_Engine',
      specs: [
        { label: 'SPEED', value: 'Instant Load Time (0.5s)' },
        { label: 'DEVICE', value: 'Mobile-First Architecture' },
        { label: 'SECURITY', value: 'Bank-Grade Encryption' },
        { label: 'SYSTEM', value: 'Auto-Booking & Lead Capture' },
      ],
      description: 'Not just a website. A 24/7 sales employee that captures leads, ranks on Google, and works perfectly on any phone.',
      isOptional: false,
    },
    {
      icon: Aperture,
      title: 'CINEMATIC AUTHORITY',
      codeName: 'Media_Engine',
      specs: [
        { label: 'QUALITY', value: 'Netflix/Cinema Standard' },
        { label: 'FORMAT', value: 'Social Media Ready' },
        { label: 'DRONE', value: '4K Aerial Surveillance' },
      ],
      description: 'Your work is premium; your image should match. We deploy film crews to capture your projects, making your competition look amateur.',
      isOptional: true,
    },
    {
      icon: Activity,
      title: 'MARKET DOMINATION',
      codeName: 'Growth_Engine',
      specs: [
        { label: 'RANKING', value: 'Google Maps Priority' },
        { label: 'TARGET', value: 'High-Net-Worth Client Filtering' },
        { label: 'STATUS', value: 'Competitor Displacement' },
      ],
      description: 'Stop chasing clients. We engineer your system to appear exactly when high-value customers are searching for your services.',
      isOptional: true,
    },
  ];

  return (
    <OsWindow id="specs" className="relative w-full bg-[#050505] px-4 md:px-8 pb-8">
      <section ref={containerRef}>
      {/* ─── CONTENT ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 40 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* ─── CONTENT AREA ─── */}
        <div className="p-6 md:p-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                All Systems Operational
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
              Business Capabilities
            </h2>
            <p className="text-sm text-white/40 mt-2 max-w-xl">
              Revenue-generating systems engineered for contractors, creatives, and professionals who demand results.
            </p>
          </motion.div>

          {/* ─── MODULES GRID ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {modules.map((module, index) => (
              <SpecModule
                key={module.title}
                icon={module.icon}
                title={module.title}
                specs={module.specs}
                description={module.description}
                isOptional={module.isOptional}
                delay={index * 150}
                isInView={isInView}
              />
            ))}
          </div>

          {/* ─── FOOTER STATUS BAR ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/30"
          >
            <span>3 modules loaded</span>
            <span>Revenue: Optimized</span>
            <span>Status: Ready for Deployment</span>
          </motion.div>
        </div>
      </motion.div>
      </section>
    </OsWindow>
  );
}
