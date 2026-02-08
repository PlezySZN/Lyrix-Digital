/**
 * ═══════════════════════════════════════════════════════════
 * SYSTEM EXECUTION — LYRIX OS
 * Final CTA section styled as command center terminal
 * ═══════════════════════════════════════════════════════════
 */

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal, ArrowRight } from 'lucide-react';
import { openContactModal } from '../stores/modalStore';

// ─── BLINKING CURSOR HOOK ───

function useBlinkingCursor() {
  const [show, setShow] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setShow(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return show;
}

// ─── CYCLING TYPEWRITER HOOK ───

const statusMessages = [
  'SYSTEM STATUS: READY FOR DEPLOYMENT',
  'AWAITING INPUT...',
  'SECURE CONNECTION ESTABLISHED',
  'ALL MODULES OPERATIONAL',
];

function useCyclingTypewriter(messages: string[], typingSpeed = 40, pauseDuration = 2500) {
  const [text, setText] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const currentMessage = messages[messageIndex];
    let charIndex = 0;
    let isDeleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!isDeleting) {
        // Typing forward
        setText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex >= currentMessage.length) {
          // Pause at the end before deleting
          timeout = setTimeout(() => {
            isDeleting = true;
            tick();
          }, pauseDuration);
          return;
        }
        timeout = setTimeout(tick, typingSpeed);
      } else {
        // Deleting
        setText(currentMessage.slice(0, charIndex));
        charIndex--;
        if (charIndex < 0) {
          isDeleting = false;
          setMessageIndex((prev) => (prev + 1) % messages.length);
          return;
        }
        timeout = setTimeout(tick, typingSpeed / 2);
      }
    };

    tick();
    return () => clearTimeout(timeout);
  }, [messageIndex, messages, typingSpeed, pauseDuration]);

  return text;
}

// ─── MAIN COMPONENT ───

export default function SystemExecution() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });
  const showCursor = useBlinkingCursor();
  const statusText = useCyclingTypewriter(statusMessages);

  return (
    <section ref={containerRef} className="relative w-full bg-[#111111] py-16 md:py-24">
      {/* ─── BACKGROUND GRID PATTERN ─── */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(204,255,0,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(204,255,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* ─── MAIN TERMINAL CONTAINER ─── */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 40 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative"
        >
          {/* Outer glow */}
          <div className="absolute -inset-4 rounded-2xl bg-[#CCFF00]/10 blur-2xl" />
          
          {/* Terminal window */}
          <div className="relative rounded-2xl border border-[#CCFF00]/50 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl shadow-[#CCFF00]/5 overflow-hidden">
            {/* ─── TERMINAL TITLE BAR ─── */}
            <div className="flex items-center gap-2 px-6 py-4 bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-[#CCFF00]/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex items-center gap-2 flex-1 justify-center">
                <Terminal className="w-4 h-4 text-[#CCFF00]/60" />
                <span className="text-sm font-mono text-[#CCFF00]/60 tracking-wide">
                  Command_Center.terminal
                </span>
              </div>
              <div className="w-14" />
            </div>

            {/* ─── TERMINAL CONTENT ─── */}
            <div className="p-8 md:p-12">
              {/* System Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-mono text-[#CCFF00]">{'>'}</span>
                  <span className="text-sm font-mono text-white/60">
                    {statusText}
                  </span>
                  <span className={`text-sm font-mono text-[#CCFF00] ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
                    █
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                  <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                  <span>All systems operational</span>
                  <span className="mx-2">•</span>
                  <span>Q1 2026 slots available</span>
                  <span className="mx-2">•</span>
                  <span>Response time: &lt;24hrs</span>
                </div>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
                  Initialize Your Digital
                  <br />
                  <span className="text-[#CCFF00]">Transformation</span>
                </h2>
                
                <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                  Slots for Q1 are limited. Secure your high-performance architecture today.
                </p>
              </motion.div>

              {/* Execute Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-8"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openContactModal()}
                  className="group relative w-full overflow-hidden rounded-xl bg-[#CCFF00] text-black font-bold text-lg md:text-xl py-6 px-8 transition-all duration-300 hover:shadow-2xl hover:shadow-[#CCFF00]/25"
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-[#CCFF00] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                  
                  {/* Button content */}
                  <div className="relative flex items-center justify-center gap-3">
                    <span className="font-mono tracking-wider">
                      {'> EXECUTE_PROJECT'}
                    </span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300" />
                </motion.button>
              </motion.div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-center"
              >
                <p className="text-sm text-white/40 font-mono mb-4">
                  No contracts. No retainers. No bullshit.
                </p>
                
                <div className="flex items-center justify-center gap-6 text-xs font-mono text-white/30">
                  <span>✓ 2-4 week delivery</span>
                  <span>✓ Source code included</span>
                  <span>✓ 90-day support</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ─── FOOTER METADATA ─── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs font-mono text-white/20">
            <span>Lyrix Digital © 2026</span>
            <span className="hidden md:inline">|</span>
            <a href="#" className="hover:text-white/40 transition-colors duration-200">
              Privacy.txt
            </a>
            <span className="hidden md:inline">|</span>
            <a href="#" className="hover:text-white/40 transition-colors duration-200">
              Terms.md
            </a>
            <span className="hidden md:inline">|</span>
            <a href="#" className="hover:text-white/40 transition-colors duration-200">
              IG: @lyrix
            </a>
          </div>
        </motion.footer>
      </div>
    </section>
  );
}