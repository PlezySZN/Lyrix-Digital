/**
 * ═══════════════════════════════════════════════════════════
 * SPOTLIGHT HERO — LYRIX OS
 * macOS-inspired window with particle trail cursor effect
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect, useCallback, type MouseEvent } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Briefcase, Music, User } from 'lucide-react';
import FolderCard from './FolderCard';
import { openContactModal } from '../stores/modalStore';

interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function SpotlightHero() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headlineRef, { once: true, margin: '-100px' });
  const particleIdRef = useRef(0);

  // Particle trail effect - add new particle on mouse move
  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticle: Particle = {
      id: particleIdRef.current++,
      x,
      y,
    };

    setParticles((prev) => [...prev.slice(-20), newParticle]);
  }, []);

  // Auto-remove particles after animation
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 400);
    return () => clearTimeout(timer);
  }, [particles]);

  // Animation variants for staggered text reveal
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  // Folder data
  const folders = [
    {
      name: 'Industry',
      extension: 'folder',
      icon: Briefcase,
      meta: 'For Contractors & Business',
      size: 'Unlimited',
    },
    {
      name: 'Creative',
      extension: 'folder',
      icon: Music,
      meta: 'For Artists & Producers',
      size: 'Unlimited',
    },
    {
      name: 'Personal',
      extension: 'folder',
      icon: User,
      meta: 'For Blogs & Portfolios',
      size: 'Unlimited',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] p-4 md:p-8">
      {/* ─── MACOS WINDOW CONTAINER ─── */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full min-h-[calc(100vh-4rem)] rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden"
      >
        {/* ─── MACOS TITLE BAR ─── */}
        <div className="sticky top-0 z-50 flex items-center gap-2 px-4 py-3 bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-white/5">
          {/* Traffic Light Buttons */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-110 transition-all cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:brightness-110 transition-all cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] hover:brightness-110 transition-all cursor-pointer" />
          </div>

          {/* Window Title */}
          <div className="flex-1 text-center">
            <span className="text-xs font-medium text-white/40 tracking-wide">
              Lyrix Digital — Finder
            </span>
          </div>

          {/* Spacer for balance */}
          <div className="w-14" />
        </div>

        {/* ─── GRID BACKGROUND ─── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* ─── PARTICLE TRAIL ─── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 0.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute w-2 h-2 rounded-full bg-white"
                style={{
                  left: particle.x - 4,
                  top: particle.y - 4,
                  boxShadow: '0 0 8px 2px rgba(255, 255, 255, 0.4)',
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* ─── CONTENT CONTAINER ─── */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 py-20">
          {/* ─── HEADLINE ─── */}
          <motion.div
            ref={headlineRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-center mb-20"
          >
            <motion.h1
              variants={wordVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-3"
            >
              YOUR DIGITAL
            </motion.h1>
            <motion.h1
              variants={wordVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white/60"
            >
              IMAGE
            </motion.h1>
          </motion.div>

          {/* ─── FINDER DOCK / FOLDER GRID ─── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6"
          >
            {folders.map((folder, index) => (
              <FolderCard
                key={folder.name}
                name={folder.name}
                extension={folder.extension}
                icon={folder.icon}
                meta={folder.meta}
                size={folder.size}
                delay={index * 0.1}
                onClick={() => openContactModal(folder.name)}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
