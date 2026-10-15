'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

const OPTIONS: Array<{ value: Theme; label: string; Icon: typeof Sun }> = [
  { value: 'system', label: 'Use system theme', Icon: Monitor },
  { value: 'light', label: 'Use light theme', Icon: Sun },
  { value: 'dark', label: 'Use dark theme', Icon: Moon },
];

export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn('inline-flex rounded-control border border-line p-0.5', className)}
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-pressed={theme === value}
          aria-label={label}
          title={label}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-[6px] transition-colors',
            theme === value ? 'bg-accent-wash text-ink' : 'text-ink-3 hover:text-ink',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
