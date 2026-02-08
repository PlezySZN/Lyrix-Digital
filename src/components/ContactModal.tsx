/**
 * ═══════════════════════════════════════════════════════════
 * CONTACT MODAL — LYRIX OS v1.1
 * Glassmorphic "System Configuration" overlay with lead capture form
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@nanostores/react';
import { X, Send } from 'lucide-react';
import CustomSelect from './CustomSelect';
import {
  $contactModalOpen,
  $contactSubject,
  closeContactModal,
} from '../stores/modalStore';

// ─── DATA ───

const sectors = [
  { value: '', label: 'Select Sector...' },
  { value: 'Industry', label: 'Contractors & Trades' },
  { value: 'Creative', label: 'Artists & Producers' },
  { value: 'Personal', label: 'Blogs & Portfolios' },
  { value: 'Business', label: 'Business & Startup' },
];

const budgetRanges = [
  '$1K–$3K',
  '$3K–$5K',
  '$5K–$10K',
  '$10K+',
];

const maintenanceModes = [
  { value: 'managed', label: 'Managed Mode', desc: 'We handle everything' },
  { value: 'handover', label: 'Handover Mode', desc: 'You take the keys' },
  { value: 'undecided', label: 'Undecided', desc: 'Discuss later' },
];

// ─── COMPONENT ───

export default function ContactModal() {
  const isOpen = useStore($contactModalOpen);
  const prefilledSubject = useStore($contactSubject);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sector, setSector] = useState('');
  const [maintenance, setMaintenance] = useState('undecided');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // Sync pre-filled subject when modal opens
  useEffect(() => {
    if (isOpen && prefilledSubject) {
      setSector(prefilledSubject);
    }
  }, [isOpen, prefilledSubject]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContactModal();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In production, this would POST to an API endpoint
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setSector('');
      setMaintenance('undecided');
      setBudget('');
      setMessage('');
      closeContactModal();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={closeContactModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Modal Window */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-2xl shadow-2xl"
          >
            {/* ─── TITLE BAR ─── */}
            <div className="sticky top-0 z-10 flex items-center gap-2 px-4 py-3 bg-[#1a1a1a]/90 backdrop-blur-xl border-b border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={closeContactModal}
                  className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-125 transition-all"
                />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs font-mono text-white/40 tracking-wide">
                  System_Config.form
                </span>
              </div>
              <button
                onClick={closeContactModal}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ─── FORM CONTENT ─── */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 flex items-center justify-center">
                  <Send className="w-7 h-7 text-[#CCFF00]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Transmission Sent
                </h3>
                <p className="text-sm text-white/50 font-mono">
                  {'>'} Response ETA: {'<'}24 hours
                </p>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Section Label */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                    Initialize Project Request
                  </span>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Torres"
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(787) 555-0100"
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20 transition-all"
                  />
                </div>

                {/* Sector Dropdown */}
                <CustomSelect
                  label="Sector"
                  options={sectors}
                  value={sector}
                  onChange={setSector}
                  required
                  placeholder="Select Sector..."
                />

                {/* Maintenance Protocol */}
                <div>
                  <label className="block text-xs font-mono text-white/40 mb-2 uppercase tracking-wider">
                    Maintenance Protocol
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {maintenanceModes.map((mode) => (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => setMaintenance(mode.value)}
                        className={`
                          p-3 rounded-lg border text-left transition-all duration-200
                          ${maintenance === mode.value
                            ? 'border-[#CCFF00]/40 bg-[#CCFF00]/5'
                            : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
                          }
                        `}
                      >
                        <span className={`block text-xs font-mono font-semibold mb-0.5 ${maintenance === mode.value ? 'text-[#CCFF00]' : 'text-white/60'}`}>
                          {mode.label}
                        </span>
                        <span className="block text-[10px] text-white/30">
                          {mode.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Range */}
                <div>
                  <label className="block text-xs font-mono text-white/40 mb-2 uppercase tracking-wider">
                    Budget Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {budgetRanges.map((range) => (
                      <button
                        key={range}
                        type="button"
                        onClick={() => setBudget(budget === range ? '' : range)}
                        className={`
                          px-4 py-2 rounded-lg border text-xs font-mono transition-all duration-200
                          ${budget === range
                            ? 'border-[#CCFF00]/40 bg-[#CCFF00]/5 text-[#CCFF00]'
                            : 'border-white/5 bg-white/[0.01] text-white/50 hover:border-white/10 hover:bg-white/[0.02]'
                          }
                        `}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
                    Mission Brief
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your project scope, goals, and timeline..."
                    className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20 transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-[#CCFF00] text-black font-bold text-sm font-mono tracking-wider hover:shadow-lg hover:shadow-[#CCFF00]/20 transition-shadow duration-300"
                >
                  {'>'} TRANSMIT_REQUEST
                </motion.button>

                {/* Footer note */}
                <p className="text-center text-xs font-mono text-white/20">
                  Encrypted • Response ETA: {'<'}24hrs • No spam
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
