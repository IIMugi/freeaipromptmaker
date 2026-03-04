'use client';

import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  Box,
  Brush,
  Building2,
  Castle,
  Cog,
  Cpu,
  Droplets,
  Film,
  Grid3X3,
  Leaf,
  Microscope,
  Minus,
  Moon,
  Mountain,
  Orbit,
  Package,
  Palette,
  Shirt,
  Sparkles,
  Stars,
  Sunset,
  Tv,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import stylesData from '@/data/styles.json';

interface StyleCardsProps {
  selectedStyles: string[];
  onToggleStyle: (styleId: string) => void;
  quickMode?: boolean;
  onClearStyles?: () => void;
}

const styleIconMap: Record<string, LucideIcon> = {
  cyberpunk: Cpu,
  'oil-painting': Brush,
  watercolor: Droplets,
  '3d-render': Box,
  anime: Sparkles,
  'pixel-art': Grid3X3,
  'pop-art': Palette,
  surrealism: Orbit,
  minimalist: Minus,
  steampunk: Cog,
  vaporwave: Sunset,
  gothic: Castle,
  portrait: User,
  landscape: Mountain,
  macro: Microscope,
  street: Building2,
  fashion: Shirt,
  product: Package,
  dramatic: Film,
  ethereal: Stars,
  dark: Moon,
  vibrant: Palette,
  nostalgic: Tv,
  peaceful: Leaf,
};

const styleImpactMap: Record<string, 'High' | 'Medium' | 'Low'> = {
  cyberpunk: 'High',
  'oil-painting': 'High',
  watercolor: 'Medium',
  '3d-render': 'High',
  anime: 'High',
  'pixel-art': 'Medium',
  'pop-art': 'Medium',
  surrealism: 'High',
  minimalist: 'Low',
  steampunk: 'High',
  vaporwave: 'Medium',
  gothic: 'Medium',
  portrait: 'High',
  landscape: 'Medium',
  macro: 'Medium',
  street: 'Low',
  fashion: 'High',
  product: 'High',
  dramatic: 'Medium',
  ethereal: 'Medium',
  dark: 'High',
  vibrant: 'Medium',
  nostalgic: 'Low',
  peaceful: 'Low',
};

const categoryDescriptions: Record<string, string> = {
  'Art Styles': 'Art direction and rendering language',
  'Photography Styles': 'Camera intent and framing behavior',
  'Moods & Atmospheres': 'Emotional tone and visual energy',
};

function impactTone(impact: 'High' | 'Medium' | 'Low') {
  if (impact === 'High') return 'border-cyan-300/40 bg-cyan-300/12 text-cyan-100';
  if (impact === 'Medium') return 'border-violet-300/40 bg-violet-300/10 text-violet-100';
  return 'border-white/20 bg-white/[0.05] text-slate-300';
}

export function StyleCards({
  selectedStyles,
  onToggleStyle,
  quickMode = false,
  onClearStyles,
}: StyleCardsProps) {
  const categories = quickMode ? stylesData.categories.slice(0, 1) : stylesData.categories;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Style Matrix</h2>
          <p className="mt-1 text-xs text-slate-400">
            {selectedStyles.length} selected styles shaping your current prompt.
          </p>
        </div>
        {selectedStyles.length > 0 && onClearStyles && (
          <button
            type="button"
            onClick={onClearStyles}
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-200 hover:bg-white/[0.08]"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {categories.map((category) => (
        <div key={category.name} className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-[11px] font-semibold text-slate-300 uppercase tracking-[0.14em]">
                {category.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {categoryDescriptions[category.name] || 'Prompt style controls'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {(quickMode ? category.styles.slice(0, 6) : category.styles).map((style) => {
              const isSelected = selectedStyles.includes(style.id);
              const StyleIcon = styleIconMap[style.id] || Sparkles;
              const impact = styleImpactMap[style.id] || 'Medium';
              const summary = style.value.split(',').slice(0, 2).join(', ');

              return (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onToggleStyle(style.id)}
                  aria-label={`${isSelected ? 'Remove' : 'Add'} ${style.name} style`}
                  aria-pressed={isSelected}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-all duration-200',
                    isSelected
                      ? 'bg-cyan-300/12 border-cyan-300/45 text-white shadow-[0_18px_36px_-28px_rgba(0,229,255,0.95)]'
                      : 'bg-[#111c2f] border-white/12 text-slate-200 hover:border-white/25 hover:text-white'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={cn(
                        'inline-flex h-8 w-8 items-center justify-center rounded-lg border',
                        isSelected
                          ? 'border-cyan-300/40 bg-cyan-300/15 text-cyan-100'
                          : 'border-white/15 bg-white/[0.03] text-slate-300'
                      )}
                    >
                      <StyleIcon className="h-4 w-4" />
                    </span>
                    <span
                      className={cn(
                        'rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]',
                        impactTone(impact)
                      )}
                    >
                      {impact} impact
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium">{style.name}</p>
                  <p className="mt-1 text-[11px] text-slate-400 leading-4">{summary}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
      {quickMode && (
        <p className="text-xs text-slate-400">
          Quick Mode shows high-impact starter styles. Switch to Pro Mode for full style library.
        </p>
      )}
    </div>
  );
}

// Seçilen stil ID'lerinden değerleri al
export function getStyleValues(selectedIds: string[]): string[] {
  const allStyles = stylesData.categories.flatMap(cat => cat.styles);
  return selectedIds
    .map(id => allStyles.find(s => s.id === id)?.value)
    .filter((v): v is string => v !== undefined);
}

