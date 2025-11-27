'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { modelInfoList, type AIModel, type ModelInfo } from '@/lib/prompt-builder';
import { useState } from 'react';

interface ModelSelectorProps {
  selected: AIModel;
  onChange: (model: AIModel) => void;
}

const categoryNames: Record<ModelInfo['category'], string> = {
  popular: '🔥 Popular',
  professional: '💼 Professional',
  specialized: '🎯 Specialized',
};

const categoryOrder: ModelInfo['category'][] = ['popular', 'professional', 'specialized'];

export function ModelSelector({ selected, onChange }: ModelSelectorProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Get popular models for initial view
  const popularModels = modelInfoList.filter(m => m.category === 'popular');
  const allModels = modelInfoList;
  
  const displayModels = showAll ? allModels : popularModels;
  
  // Group models by category
  const groupedModels = categoryOrder.reduce((acc, category) => {
    acc[category] = displayModels.filter(m => m.category === category);
    return acc;
  }, {} as Record<ModelInfo['category'], ModelInfo[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Select AI Model
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          {showAll ? 'Show Less' : `Show All (${allModels.length})`}
        </button>
      </div>
      
      {showAll ? (
        // Categorized view
        <div className="space-y-6">
          {categoryOrder.map((category) => {
            const models = groupedModels[category];
            if (models.length === 0) return null;
            
            return (
              <div key={category} className="space-y-3">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {categoryNames[category]}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {models.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      selected={selected === model.id}
                      onClick={() => onChange(model.id)}
                      compact
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Simple grid view for popular models
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {popularModels.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              selected={selected === model.id}
              onClick={() => onChange(model.id)}
            />
          ))}
        </div>
      )}
      
      {/* Selected model features */}
      <SelectedModelInfo modelId={selected} />
    </div>
  );
}

interface ModelCardProps {
  model: ModelInfo;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}

function ModelCard({ model, selected, onClick, compact }: ModelCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative p-3 rounded-xl border text-left transition-all duration-200',
        selected
          ? 'bg-violet-600/20 border-violet-500 ring-2 ring-violet-500/20'
          : 'bg-slate-800 border-slate-700 hover:border-slate-600',
        compact && 'p-2'
      )}
    >
      <div className={cn('flex items-start gap-2', compact && 'items-center')}>
        <span className={cn('text-2xl', compact && 'text-xl')}>{model.icon}</span>
        <div className="min-w-0 flex-1">
          <h4 className={cn('font-semibold text-white truncate', compact && 'text-sm')}>
            {model.name}
          </h4>
          {!compact && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {model.description}
            </p>
          )}
        </div>
      </div>
      {selected && (
        <motion.div
          layoutId="model-indicator"
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

function SelectedModelInfo({ modelId }: { modelId: AIModel }) {
  const model = modelInfoList.find(m => m.id === modelId);
  if (!model) return null;
  
  return (
    <motion.div
      key={modelId}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{model.icon}</span>
        <span className="font-medium text-white">{model.name}</span>
        <span className="text-xs px-2 py-0.5 bg-slate-700 rounded-full text-slate-300">
          {model.category}
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-2">{model.description}</p>
      <div className="flex flex-wrap gap-1">
        {model.features.map((feature, i) => (
          <span
            key={i}
            className="text-xs px-2 py-0.5 bg-violet-600/20 text-violet-300 rounded-full"
          >
            {feature}
          </span>
        ))}
      </div>
      <div className="flex gap-3 mt-2 text-xs text-slate-500">
        {model.supportsNegative && <span>✓ Negative prompts</span>}
        {model.supportsAspectRatio && <span>✓ Aspect ratio</span>}
        {model.supportsStylize && <span>✓ Stylize</span>}
        {model.supportsChaos && <span>✓ Chaos</span>}
      </div>
    </motion.div>
  );
}
