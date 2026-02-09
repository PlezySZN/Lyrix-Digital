/**
 * ═══════════════════════════════════════════════════════════
 * SPEC MODULE — LYRIX OS
 * Individual service card styled as system hardware spec
 * ═══════════════════════════════════════════════════════════
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Spec {
  label: string;
  value: string;
}

interface SpecModuleProps {
  icon: LucideIcon;
  title: string;
  specs: Spec[];
  description: string;
  isOptional?: boolean;
  delay?: number;
  isInView: boolean;
}

// Typewriter hook for terminal effect
function useTypewriter(text: string, isActive: boolean, delay: number = 0) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (!isActive) return;
    
    let currentIndex = 0;
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(startDelay);
  }, [text, isActive, delay]);
  
  return displayedText;
}

export default function ServiceCard({
  icon: Icon,
  title,
  specs,
  description,
  isOptional = false,
  delay = 0,
  isInView,
}: SpecModuleProps) {
  const [showSpecs, setShowSpecs] = useState(false);
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowSpecs(true), delay + 400);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.5, delay: delay / 1000, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      {/* Module Card */}
      <div className="relative p-6 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 hover:border-white/10 transition-all duration-300">
        {/* Icon + Title Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10">
            <Icon className="w-5 h-5 text-white/70" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-wide uppercase">
                {title}
              </h3>
              {isOptional && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#CCFF00]/10 border border-[#CCFF00]/20 text-[#CCFF00]/70 uppercase tracking-wider">
                  [OPTIONAL MODULE]
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-white/40 font-mono">ONLINE</span>
            </div>
          </div>
        </div>

        {/* Specs Terminal Block */}
        <div className="mb-4 p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-xs">
          {specs.map((spec, index) => (
            <SpecLine 
              key={spec.label}
              spec={spec}
              isActive={showSpecs}
              delay={index * 150}
            />
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed">
          {description}
        </p>

        {/* Hover glow */}
        <div className="absolute -inset-px rounded-xl bg-linear-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.article>
  );
}

// Individual spec line with typewriter effect
function SpecLine({ spec, isActive, delay }: { spec: Spec; isActive: boolean; delay: number }) {
  const displayedValue = useTypewriter(spec.value, isActive, delay);
  
  return (
    <div className="flex items-start gap-2 py-1 text-white/60">
      <span className="text-[#CCFF00]/60 mt-0.5">✓</span>
      <span className="text-white/50 min-w-20">{spec.label}:</span>
      <span className="text-white/80 flex-1">{displayedValue}</span>
      {isActive && displayedValue.length < spec.value.length && (
        <span className="inline-block w-2 h-3.5 bg-white/60 animate-pulse mt-0.5" />
      )}
    </div>
  );
}
