'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/UI';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/UI/Badge';

const quickExamples = [
  'cinematic portrait of a cyberpunk detective in rainy neon alley',
  'anime hero close-up, sunset rim light, dynamic framing',
  'product photo of luxury perfume bottle, studio light',
  'minimal logo concept for AI startup, clean geometry',
];

export function HeroSection() {
  const router = useRouter();
  const [concept, setConcept] = useState('');
  const [activeExample, setActiveExample] = useState(0);

  const canSubmit = concept.trim().length > 2;

  const previewTokens = useMemo(() => {
    const source = concept.trim() || quickExamples[activeExample];
    return source.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 4);
  }, [activeExample, concept]);

  const handleLaunch = () => {
    const value = concept.trim();
    const query = value ? `?q=${encodeURIComponent(value)}` : '';
    router.push(`/${query}#generator`);
  };

  return (
    <section className="relative overflow-visible rounded-[2.5rem] border-[0.5px] border-[var(--border-strong)] bg-[var(--surface-base)]/50 px-6 py-12 sm:px-8 md:px-12 md:py-20 shadow-[0_0_80px_-20px_rgba(0,240,255,0.15)] glass-2">
      <div className="absolute inset-0 rounded-[2.5rem] bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="cyan" size="sm" icon={<Sparkles className="h-3 w-3" />}>
            2026 Prompt OS
          </Badge>

          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tighter text-[var(--text-primary)] sm:text-6xl md:text-7xl lg:text-[4.5rem] drop-shadow-2xl">
            Build better AI prompts
            <span className="block brand-gradient pb-2 mt-2">before your first generation.</span>
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] xl:text-xl font-medium tracking-wide">
            Premium prompt engine for Midjourney v7, Flux Pro, DALL-E, and SDXL with live syntax
            translation, quick mode, and one-click workflows.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-xl rounded-2xl p-2 glass-2 border border-[var(--border-default)] shadow-[var(--shadow-card)]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={concept}
                onChange={(event) => setConcept(event.target.value)}
                placeholder="Describe your 2026 concept..."
                className="h-14 flex-1 rounded-xl border border-[var(--border-default)] bg-black/40 px-5 text-base text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--accent-primary-strong)] focus:ring-2 focus:ring-[var(--accent-primary-soft)] focus:outline-none transition-all shadow-inner"
              />
              <Button
                onClick={handleLaunch}
                size="md"
                className={cn('h-12 rounded-xl px-6 min-w-[120px]', !canSubmit && 'opacity-90')}
                icon={<Wand2 className="h-4 w-4" />}
              >
                Launch
              </Button>
            </div>
          </motion.div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mr-1">Try:</span>
            {quickExamples.map((example, index) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setActiveExample(index);
                  setConcept(example);
                }}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs transition-all duration-200',
                  activeExample === index
                    ? 'border-[var(--accent-primary-strong)] bg-[var(--accent-primary-soft)] text-[var(--accent-primary)] shadow-[var(--shadow-glow)]'
                    : 'border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]'
                )}
              >
                Example {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Right side interactive preview */}
        <div className="glass-1 rounded-2xl p-5 border border-[var(--border-default)] card-hover reveal-on-scroll hidden lg:block">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Live Token Preview</p>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--error)]/70 mix-blend-screen" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]/70 mix-blend-screen" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--success)]/70 mix-blend-screen" />
            </div>
          </div>

          <div className="min-h-[220px] rounded-2xl border-[0.5px] border-[var(--border-strong)] bg-black/50 p-6 font-mono shadow-inner flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-primary-soft)] to-transparent opacity-10 pointer-events-none" />
            <AnimatePresence mode="popLayout">
              <div className="flex flex-wrap gap-2">
                {previewTokens.map((token, i) => (
                  <motion.span
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.5, delay: i * 0.1 }}
                    key={`${token}-${i}-${activeExample}`}
                    className="rounded-lg border-[0.5px] border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] px-3 py-1.5 text-sm text-[var(--accent-primary)] shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                  >
                    {token}
                  </motion.span>
                ))}
              </div>
            </AnimatePresence>

            <p className="text-xs text-[var(--text-secondary)] font-sans border-t border-[var(--border-default)] pt-4 mt-8">
              Launch into the generator to apply style presets, aspect ratios, and model-specific syntax to these core tokens.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
