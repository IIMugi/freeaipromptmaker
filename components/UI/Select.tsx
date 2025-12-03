'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  id?: string;
}

export function Select({
  label,
  value,
  options,
  onChange,
  className,
  placeholder = 'Select an option',
  id: externalId,
}: SelectProps) {
  const generatedId = useId();
  const selectId = externalId || `select-${generatedId}`;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label || placeholder}
          className="w-full appearance-none bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 pr-10
            text-white placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
            hover:border-slate-600 transition-colors cursor-pointer"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" 
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

