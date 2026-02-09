/**
 * ═══════════════════════════════════════════════════════════
 * CUSTOM SELECT UI — LYRIX OS v1.1 
 * Glassmorphic dropdown to replace native HTML select
 * ═══════════════════════════════════════════════════════════
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

// ─── INTERFACES ───

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

// ─── COMPONENT ───

export default function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  required = false,
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Find selected option for display
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption?.label || placeholder;
  const isPlaceholder = !selectedOption || selectedOption.value === '';

  // ─── KEYBOARD NAVIGATION ───
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;

      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : options.length - 1
        );
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0 && options[focusedIndex]) {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
    }
  };

  // ─── CLICK OUTSIDE HANDLER ───
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // ─── EVENT HANDLERS ───
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFocusedIndex(selectedOption ? options.indexOf(selectedOption) : 0);
    }
  };

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // ─── RENDER ───
  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block text-xs font-mono text-white/40 mb-1.5 uppercase tracking-wider">
          {label}
          {required && <span className="text-[#CCFF00] ml-1">*</span>}
        </label>
      )}

      {/* Trigger Button */}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={`
            w-full px-4 py-3 rounded-lg text-left
            bg-[#0a0a0a] border border-white/10
            text-sm font-mono transition-all duration-200
            focus:outline-none focus:border-[#CCFF00]/40 focus:ring-1 focus:ring-[#CCFF00]/20
            hover:border-white/20
            ${isPlaceholder 
              ? 'text-white/20' 
              : 'text-white'
            }
          `}
        >
          <span className="block truncate">
            {displayText}
          </span>

          {/* Chevron */}
          <ChevronDown 
            className={`
              absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 
              transition-transform duration-200 pointer-events-none
              ${isOpen ? 'rotate-180' : 'rotate-0'}
            `} 
          />
        </button>

        {/* Dropdown Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`
                absolute top-full left-0 right-0 z-50 mt-1
                bg-[#0a0a0a]/95 backdrop-blur-xl 
                border border-white/10 rounded-lg
                shadow-2xl shadow-black/50
                max-h-60 overflow-y-auto
              `}
            >
              {options.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = index === focusedIndex;
                
                return (
                  <button
                    key={option.value || `option-${index}`}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full px-4 py-3 text-left text-sm font-mono
                      flex items-center justify-between
                      transition-all duration-150
                      ${isFocused 
                        ? 'bg-white/10 text-[#CCFF00]' 
                        : isSelected
                          ? 'bg-white/5 text-white'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }
                      ${index === 0 ? 'rounded-t-lg' : ''}
                      ${index === options.length - 1 ? 'rounded-b-lg' : 'border-b border-white/5'}
                    `}
                  >
                    <span className="truncate">
                      {option.label}
                    </span>
                    
                    {/* Check Icon for Selected */}
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#CCFF00] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}