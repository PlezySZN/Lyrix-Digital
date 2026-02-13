/**
 * ═══════════════════════════════════════════════════════════
 * PRICING — LYRIX OS
 *
 * Three-tier pricing section styled as "system resource allocation."
 * Each tier is a card with icon, code name, price, feature list, and CTA.
 *
 * Data structure:
 *   TIERS array uses i18n key references (not hardcoded text).
 *   Key convention: 'pricing.t{N}.{field}' where N = tier number.
 *   Example: 'pricing.t1.title' → "Landing Page" (EN) / "Landing Page" (ES)
 *   Features: 'pricing.t1.f1', 'pricing.t1.f2', etc.
 *   All strings live in src/i18n/ui.ts under the pricing section.
 *
 * Layout:
 *   - flex flex-col on cards → CTA button is always pinned to bottom
 *   - flex-1 on the features <ul> → pushes CTA down regardless of list length
 *   - Tier 2 (Authority System) is highlighted with neon lime accent
 *
 * Interaction:
 *   - CTA buttons open the ContactModal via openContactModal()
 *   - Section animates in via Framer Motion useInView (once, -80px margin)
 *
 * To change pricing: Edit TIERS below + corresponding i18n keys in ui.ts.
 * ═══════════════════════════════════════════════════════════
 */

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Crown, Rocket, ArrowRight, Check } from 'lucide-react';
import { openContactModal } from '../stores/modalStore';
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

/**
 * TypeScript interface for a pricing tier.
 * All text is resolved via i18n keys at render time.
 */
interface PricingTier {
  icon: React.ElementType;       // Lucide icon component
  titleKey: string;              // i18n key for tier name
  codeNameKey: string;           // i18n key for the "codename" subtitle
  priceKey: string;              // i18n key for price display
  featuresKeys: string[];        // i18n keys for each feature bullet
  highlighted?: boolean;         // If true → neon lime accent + "Recommended" badge
}

/**
 * TIERS — The three pricing tiers.
 * To add/remove a tier, edit this array and add corresponding
 * i18n keys in src/i18n/ui.ts (both ES and EN sections).
 *
 * Key pattern: 'pricing.t{N}.title', 'pricing.t{N}.price',
 *              'pricing.t{N}.f1' through 'pricing.t{N}.fX'
 */

const TIERS: PricingTier[] = [
  {
    icon: Zap,
    titleKey: 'pricing.t1.title',
    codeNameKey: 'pricing.t1.codeName',
    priceKey: 'pricing.t1.price',
    featuresKeys: [
      'pricing.t1.f1',
      'pricing.t1.f2',
      'pricing.t1.f3',
      'pricing.t1.f4',
    ],
  },
  {
    icon: Crown,
    titleKey: 'pricing.t2.title',
    codeNameKey: 'pricing.t2.codeName',
    priceKey: 'pricing.t2.price',
    featuresKeys: [
      'pricing.t2.f1',
      'pricing.t2.f2',
      'pricing.t2.f3',
      'pricing.t2.f4',
      'pricing.t2.f5',
      'pricing.t2.f6',
    ],
    highlighted: true,
  },
  {
    icon: Rocket,
    titleKey: 'pricing.t3.title',
    codeNameKey: 'pricing.t3.codeName',
    priceKey: 'pricing.t3.price',
    featuresKeys: [
      'pricing.t3.f1',
      'pricing.t3.f2',
      'pricing.t3.f3',
      'pricing.t3.f5',
      'pricing.t3.f6',
      'pricing.t3.f7',
    ],
  },
];

export default function Pricing({ lang = 'en' }: { lang?: Lang }) {
  const t = useTranslations(lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-80px' });

  return (
    <div id="pricing" ref={containerRef} className="w-full bg-lyrix-dark px-4 md:px-8 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-6xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-[#CCFF00]/10 border border-[#CCFF00]/20">
            <span className="text-xs font-mono font-bold text-[#CCFF00] uppercase tracking-widest">
              {t('pricing.label')}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight mb-2">
            {t('pricing.title')}
          </h2>
          <p className="text-sm text-white/60 max-w-xl mx-auto">
            {t('pricing.description')}
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {TIERS.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.titleKey}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.15 }}
                className={`
                  relative p-6 rounded-xl border transition-all duration-300 flex flex-col
                  ${tier.highlighted
                    ? 'border-[#CCFF00]/30 bg-[#CCFF00]/3 hover:border-[#CCFF00]/50'
                    : 'border-white/5 bg-white/2 hover:border-white/10'
                  }
                `}
              >
                {/* Recommended badge */}
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#CCFF00] text-black text-[10px] font-mono font-bold uppercase tracking-wider">
                    {t('pricing.recommended')}
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center border
                    ${tier.highlighted
                      ? 'bg-[#CCFF00]/10 border-[#CCFF00]/20'
                      : 'bg-white/5 border-white/10'
                    }
                  `}>
                    <Icon className={`w-5 h-5 ${tier.highlighted ? 'text-[#CCFF00]' : 'text-white/60'}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                      {t(tier.titleKey as any)}
                    </h3>
                    <span className="text-[10px] font-mono text-white/60">
                      {t(tier.codeNameKey as any)}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className={`text-2xl md:text-3xl font-bold tracking-tight ${tier.highlighted ? 'text-[#CCFF00]' : 'text-white'}`}>
                    {t(tier.priceKey as any)}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.featuresKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlighted ? 'text-[#CCFF00]/70' : 'text-white/60'}`} />
                      <span className="text-white/60">{t(key as any)}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA — pinned to bottom */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openContactModal('', 'pricing')}
                  className={`
                    w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                    text-sm font-mono font-medium transition-all duration-200 cursor-pointer
                    ${tier.highlighted
                      ? 'bg-[#CCFF00] text-black hover:bg-[#d4ff33]'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  {t('pricing.cta')}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Variable note */}
        <div className="text-center">
          <p className="text-xs font-mono text-white/60 max-w-2xl mx-auto leading-relaxed">
            {t('pricing.note')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
