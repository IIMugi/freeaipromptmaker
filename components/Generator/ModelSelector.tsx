'use client';

import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import { Clock3, Sparkles } from 'lucide-react';
import {
  Bot,
  Brush,
  Camera,
  Gem,
  Image as ImageIcon,
  Layers3,
  PenSquare,
  Rocket,
  ScanEye,
  Shield,
  Speech,
  Wand2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/lib/hooks';
import { modelInfoList, type AIModel, type ModelInfo } from '@/lib/prompt-builder';

interface ModelSelectorProps {
  selected: AIModel;
  onChange: (model: AIModel) => void;
  mainConcept?: string;
  quickMode?: boolean;
}

const categoryNames: Record<ModelInfo['category'], string> = {
  popular: 'Popular',
  professional: 'Professional',
  specialized: 'Specialized',
};

const categoryOrder: ModelInfo['category'][] = ['popular', 'professional', 'specialized'];

const modelBrandMap: Record<
  AIModel,
  {
    short: string;
    bestFor: string;
    tone: string;
    icon: LucideIcon;
    badge: 'Speed' | 'Quality' | 'Control' | 'Text';
  }
> = {
  flux: {
    short: 'FLX',
    bestFor: 'Fast photorealism',
    tone: 'text-[#00e5ff] bg-[#00e5ff]/10 border-[#00e5ff]/20',
    icon: Rocket,
    badge: 'Speed',
  },
  'flux-pro': {
    short: 'FLX+',
    bestFor: 'Commercial detail',
    tone: 'text-[#00ffa3] bg-[#00ffa3]/10 border-[#00ffa3]/20',
    icon: Gem,
    badge: 'Quality',
  },
  'midjourney-v7': {
    short: 'MJ7',
    bestFor: 'High-end art quality',
    tone: 'text-[#b388ff] bg-[#b388ff]/10 border-[#b388ff]/20',
    icon: Wand2,
    badge: 'Quality',
  },
  midjourney: {
    short: 'MJ6',
    bestFor: 'Reliable visual style',
    tone: 'text-[#ea80fc] bg-[#ea80fc]/10 border-[#ea80fc]/20',
    icon: Brush,
    badge: 'Quality',
  },
  'stable-diffusion': {
    short: 'SDXL',
    bestFor: 'Maximum control',
    tone: 'text-[#1de9b6] bg-[#1de9b6]/10 border-[#1de9b6]/20',
    icon: Layers3,
    badge: 'Control',
  },
  'dall-e': {
    short: 'D3',
    bestFor: 'Natural language prompts',
    tone: 'text-[#ffea00] bg-[#ffea00]/10 border-[#ffea00]/20',
    icon: Speech,
    badge: 'Text',
  },
  'nano-banana': {
    short: 'NB',
    bestFor: 'Text + edits',
    tone: 'text-[#c6ff00] bg-[#c6ff00]/10 border-[#c6ff00]/20',
    icon: PenSquare,
    badge: 'Text',
  },
  firefly: {
    short: 'AF3',
    bestFor: 'Adobe workflows',
    tone: 'text-[#ff5252] bg-[#ff5252]/10 border-[#ff5252]/20',
    icon: Camera,
    badge: 'Control',
  },
  ideogram: {
    short: 'ID',
    bestFor: 'Typography and logos',
    tone: 'text-[#ff4081] bg-[#ff4081]/10 border-[#ff4081]/20',
    icon: ImageIcon,
    badge: 'Text',
  },
  leonardo: {
    short: 'LIO',
    bestFor: 'Character concepting',
    tone: 'text-[#448aff] bg-[#448aff]/10 border-[#448aff]/20',
    icon: Shield,
    badge: 'Control',
  },
  recraft: {
    short: 'RC',
    bestFor: 'Vector and icon outputs',
    tone: 'text-[#64ffda] bg-[#64ffda]/10 border-[#64ffda]/20',
    icon: ScanEye,
    badge: 'Control',
  },
  gpt4o: {
    short: '4O',
    bestFor: 'Conversation-led iteration',
    tone: 'text-[#e0e0e0] bg-[#e0e0e0]/10 border-[#e0e0e0]/20',
    icon: Bot,
    badge: 'Text',
  },
};

function getRecommendedModels(mainConcept?: string): AIModel[] {
  const text = (mainConcept || '').toLowerCase();
  if (!text.trim()) return ['flux', 'midjourney-v7', 'dall-e', 'stable-diffusion'];

  if (text.includes('logo') || text.includes('poster') || text.includes('text')) {
    return ['ideogram', 'recraft', 'dall-e', 'gpt4o'];
  }

  if (text.includes('anime') || text.includes('character') || text.includes('game')) {
    return ['leonardo', 'midjourney-v7', 'flux-pro', 'stable-diffusion'];
  }

  if (text.includes('photo') || text.includes('portrait') || text.includes('realistic')) {
    return ['flux', 'flux-pro', 'midjourney-v7', 'dall-e'];
  }

  return ['flux', 'midjourney-v7', 'stable-diffusion', 'dall-e'];
}

function badgeTone(label: 'Speed' | 'Quality' | 'Control' | 'Text') {
  if (label === 'Speed') return 'bg-[var(--info)]/10 text-[var(--info)] border-[var(--info)]/40';
  if (label === 'Quality') return 'bg-violet-500/10 text-violet-300 border-violet-500/40';
  if (label === 'Control') return 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/40';
  return 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/40';
}

export function ModelSelector({
  selected,
  onChange,
  mainConcept,
  quickMode = false,
}: ModelSelectorProps) {
  const [showAllModels, setShowAllModels] = useState(!quickMode);
  const [recentModels, setRecentModels] = useLocalStorage<AIModel[]>('recent-models', []);

  const recommended = useMemo(
    () => getRecommendedModels(mainConcept).filter((id) => modelInfoList.some((item) => item.id === id)),
    [mainConcept]
  );

  const groupedModels = useMemo(
    () =>
      categoryOrder.reduce((acc, category) => {
        acc[category] = modelInfoList.filter((model) => model.category === category);
        return acc;
      }, {} as Record<ModelInfo['category'], ModelInfo[]>),
    []
  );

  const recentList = useMemo(
    () =>
      recentModels
        .map((id) => modelInfoList.find((model) => model.id === id))
        .filter((item): item is ModelInfo => Boolean(item))
        .slice(0, 3),
    [recentModels]
  );

  const handleSelect = (model: AIModel) => {
    onChange(model);
    setRecentModels((prev) => {
      const next = [model, ...prev.filter((item) => item !== model)];
      return next.slice(0, 6);
    });
  };

  const scrollContainerClasses = "flex snap-x snap-mandatory overflow-x-auto pb-4 gap-3 sm:grid sm:gap-2 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden";
  const snapChildClasses = "snap-center snap-always min-w-[260px] sm:min-w-0 flex-shrink-0";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.14em]">Select AI Model</h2>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Choose a profile based on speed, quality, and control.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAllModels((prev) => !prev)}
          className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--surface-overlay)] active:scale-95 transition-all"
          aria-expanded={showAllModels}
        >
          {showAllModels ? 'Focus view' : 'Browse all'}
        </button>
      </div>

      {recentList.length > 0 && (
        <div className="space-y-3">
          <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-[var(--text-tertiary)]">
            <Clock3 className="h-3.5 w-3.5" />
            Recent models
          </p>
          <div className={cn(scrollContainerClasses, "sm:grid-cols-3")}>
            {recentList.map((model) => (
              <ModelCard
                key={`recent-${model.id}`}
                model={model}
                selected={selected === model.id}
                onClick={() => handleSelect(model.id)}
                compact
                className={snapChildClasses}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-[var(--accent-primary)]">
          <Sparkles className="h-3.5 w-3.5" />
          Recommended
        </p>
        <div className={cn(scrollContainerClasses, "sm:grid-cols-2 lg:grid-cols-4")}>
          {recommended.map((id) => {
            const model = modelInfoList.find((item) => item.id === id);
            if (!model) return null;
            return (
              <ModelCard
                key={`recommended-${model.id}`}
                model={model}
                selected={selected === model.id}
                onClick={() => handleSelect(model.id)}
                className={snapChildClasses}
              />
            );
          })}
        </div>
      </div>

      {showAllModels && (
        <div className="space-y-6 border-t border-[var(--border-default)] pt-6">
          {categoryOrder.map((category) => (
            <div key={category} className="space-y-3">
              <h3 className="text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.16em]">
                {categoryNames[category]}
              </h3>
              <div className={cn(scrollContainerClasses, "sm:grid-cols-2 lg:grid-cols-4")}>
                {groupedModels[category].map((model) => (
                  <ModelCard
                    key={model.id}
                    model={model}
                    selected={selected === model.id}
                    onClick={() => handleSelect(model.id)}
                    className={snapChildClasses}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ModelCardProps {
  model: ModelInfo;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
  className?: string;
}

function ModelCard({ model, selected, onClick, compact = false, className }: ModelCardProps) {
  const brand = modelBrandMap[model.id];
  const LogoIcon = brand.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`Select ${model.name} model${selected ? ' (selected)' : ''}`}
      className={cn(
        'group relative flex flex-col justify-start overflow-hidden rounded-xl border p-3 text-left transition-all duration-200 active:scale-95 will-change-transform',
        selected
          ? 'border-[var(--accent-primary-strong)] bg-[var(--accent-primary-soft)] shadow-[var(--shadow-glow)]'
          : 'border-[var(--border-subtle)] bg-[var(--surface-sunken)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]',
        compact && 'p-2.5',
        className
      )}
    >
      <div className="flex w-full items-start gap-3">
        <div
          className={cn(
            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border text-[var(--text-primary)] transition-colors',
            brand.tone,
            selected && 'border-[var(--accent-primary-strong)]'
          )}
        >
          <LogoIcon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1 w-full">
            <p className={cn("truncate text-sm font-bold transition-colors", selected ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)] group-hover:text-[var(--text-primary)]")}>
              {model.name}
            </p>
            <span className="flex-shrink-0 rounded-[4px] border border-[var(--border-default)] bg-[var(--surface-raised)] px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              {brand.short}
            </span>
          </div>
          {!compact && <p className="mt-1 truncate text-xs font-medium text-[var(--text-secondary)]">{brand.bestFor}</p>}
          <span
            className={cn(
              'mt-1.5 inline-flex rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide',
              badgeTone(brand.badge)
            )}
          >
            {brand.badge}
          </span>
        </div>
      </div>
    </button>
  );
}
