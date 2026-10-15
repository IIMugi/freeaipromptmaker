'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard, cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'quiet';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover border-transparent',
  secondary: 'border-line-strong text-ink hover:border-accent',
  quiet: 'border-line text-ink-2 hover:text-ink hover:border-line-strong min-h-8 px-2.5 text-sm',
};

/**
 * Copies `text` and confirms inside the button. `onCopied` runs only after a successful copy.
 * Visible text stays in the accessible name, so speech users can say what they see.
 */
export function CopyButton({
  text,
  label = 'Copy',
  copiedLabel = 'Copied',
  variant = 'secondary',
  disabled,
  onCopied,
  onFailed,
  className,
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  variant?: Variant;
  disabled?: boolean;
  onCopied?: () => void;
  onFailed?: () => void;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleClick = async () => {
    if (!text) return;
    if (await copyToClipboard(text)) {
      setCopied(true);
      onCopied?.();
    } else {
      onFailed?.();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || !text}
      className={cn(
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-control border px-4 text-[0.95rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45',
        variants[variant],
        className,
      )}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
