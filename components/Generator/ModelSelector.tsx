'use client';

import { useMemo, useState } from 'react';
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
    tone: 'text-[var(--accent-primary)] bg-[var(--accent-primary-soft)] border-[var(--accent-primary-strong)]',
    icon: Rocket,
    badge: 'Speed',
  },
  'flux-pro': {
    short: 'FLX+',
    bestFor: 'Commercial detail',
    tone: 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]/40',
    icon: Gem,
    badge: 'Quality',
  },
  'midjourney-v7': {
    short: 'MJ7',
    bestFor: 'High-end art quality',
    tone: 'text-[var(--accent-violet)] bg-[var(--accent-violet-soft)] border-[var(--accent-violet)]/40',
    icon: Wand2,
    badge: 'Quality',
  },
  midjourney: {
    short: 'MJ6',
    bestFor: 'Reliable visual style',
    tone: 'text-[var(--accent-violet)] bg-[var(--accent-violet-soft)] border-[var(--accent-violet)]/40',
    icon: Brush,
    badge: 'Quality',
  },
  'stable-diffusion': {
    short: 'SDXL',
    bestFor: 'Maximum control',
    tone: 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]/40',
    icon: Layers3,
    badge: 'Control',
  },
  'dall-e': {
    short: 'D3',
    bestFor: 'Natural language prompts',
    tone: 'text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]/40',
    icon: Speech,
    badge: 'Text',
  },
  'nano-banana': {
    short: 'NB',
    bestFor: 'Text + edits',
    tone: 'text-[var(--warning)] bg-[var(--warning)]/10 border-[var(--warning)]/40',
    icon: PenSquare,
    badge: 'Text',
  },
  firefly: {
    short: 'AF3',
    bestFor: 'Adobe workflows',
    tone: 'text-[var(--error)] bg-[var(--error)]/10 border-[var(--error)]/40',
    icon: Camera,
    badge: 'Control',
  },
  ideogram: {
    short: 'ID',
    bestFor: 'Typography and logos',
    tone: 'text-[var(--accent-rose)] bg-[var(--accent-rose-soft)] border-[var(--accent-rose)]/40',
    icon: ImageIcon,
    badge: 'Text',
  },
  leonardo: {
    short: 'LIO',
    bestFor: 'Character concepting',
    tone: 'text-[var(--accent-primary)] bg-[var(--accent-primary-soft)] border-[var(--accent-primary-strong)]',
    icon: Shield,
    badge: 'Control',
  },
  recraft: {
    short: 'RC',
    bestFor: 'Vector and icon outputs',
    tone: 'text-[var(--success)] bg-[var(--success)]/10 border-[var(--success)]/40',
    icon: ScanEye,
    badge: 'Control',
  },
  gpt4o: {
    short: '4O',
    bestFor: 'Conversation-led iteration',
    tone: 'text-[var(--text-primary)] bg-[var(--surface-raised)] border-[var(--border-default)]',
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
  if (label === 'Speed') return 'bg-[var(--surface-raised)] text-[var(--text-primary)] border-[var(--accent-primary-strong)]';
  if (label === 'Quality') return 'bg-[var(--surface-raised)] text-[var(--text-primary)] border-[var(--accent-violet)]/40';
  if (label === 'Control') return 'bg-[var(--surface-raised)] text-[var(--text-primary)] border-[var(--success)]/40';
  return 'bg-[var(--surface-raised)] text-[var(--text-primary)] border-[var(--warning)]/40';
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
