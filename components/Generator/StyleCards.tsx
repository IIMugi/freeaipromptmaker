'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import stylesData from '@/data/styles.json';

interface StyleCardsProps {
  selectedStyles: string[];
  onToggleStyle: (styleId: string) => void;
}

export function StyleCards({ selectedStyles, onToggleStyle }: StyleCardsProps) {
  return (
    <div className="space-y-6">
      {stylesData.categories.map((category) => (
        <div key={category.name} className="space-y-3">
          <h2 className="text-sm font-medium text-slate-300 uppercase tracking-wider">
            {category.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {category.styles.map((style) => {
              const isSelected = selectedStyles.includes(style.id);
              return (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onToggleStyle(style.id)}
                  aria-label={`${isSelected ? 'Remove' : 'Add'} ${style.name} style`}
                  aria-pressed={isSelected}
                  className={cn(
                    'p-3 rounded-lg border text-center transition-all duration-200',
                    isSelected
                      ? 'bg-violet-600/30 border-violet-500 text-white'
                      : 'bg-slate-800/50 border-slate-700 text-slate-200 hover:border-slate-600 hover:text-white'
                  )}
                >
                  <span className="text-xl block mb-1" aria-hidden="true">{style.icon}</span>
                  <span className="text-xs font-medium">{style.name}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
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

