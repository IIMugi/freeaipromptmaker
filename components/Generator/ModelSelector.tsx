'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { AIModel } from '@/lib/prompt-builder';

interface ModelSelectorProps {
  selected: AIModel;
  onChange: (model: AIModel) => void;
}

const models: { id: AIModel; name: string; description: string; icon: string }[] = [
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'v6 - Best for artistic imagery',
    icon: '🎨',
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'SDXL - Open source powerhouse',
    icon: '🔥',
  },
  {
    id: 'dall-e',
    name: 'DALL-E 3',
    description: 'OpenAI - Natural language',
    icon: '🤖',
  },
];

export function ModelSelector({ selected, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
        Select Model
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {models.map((model) => (
          <motion.button
            key={model.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(model.id)}
            className={cn(
              'relative p-4 rounded-xl border text-left transition-all duration-200',
              selected === model.id
                ? 'bg-violet-600/20 border-violet-500 ring-2 ring-violet-500/20'
                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
            )}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{model.icon}</span>
              <div>
                <h4 className="font-semibold text-white">{model.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{model.description}</p>
              </div>
            </div>
            {selected === model.id && (
              <motion.div
                layoutId="model-indicator"
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

