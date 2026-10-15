'use client';

import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import {
  NEGATIVE_CATEGORIES,
  NEGATIVE_MODELS,
  buildNegativePrompt,
  type NegativeCategoryId,
  type NegativeModelId,
} from '@/lib/negative-prompt';
import { cn, copyToClipboard } from '@/lib/utils';

const chip =
  'inline-flex cursor-pointer items-center rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--accent-primary)]';
const chipOff = 'border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]';
const chipOn = 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--text-primary)]';

export function NegativePromptGenerator() {
  const [model, setModel] = useState<NegativeModelId>('sdxl');
  const [categories, setCategories] = useState<NegativeCategoryId[]>([]);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => buildNegativePrompt(model, categories), [model, categories]);

  const toggleCategory = (id: NegativeCategoryId) => {
    setCopied(false);
    setCategories((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  const handleCopy = async () => {
    if (!result.text || !(await copyToClipboard(result.text))) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] p-5 shadow-[var(--shadow-card)] sm:p-8">
      <fieldset>
        <legend className="text-sm font-semibold text-[var(--text-primary)]">1. Model</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {NEGATIVE_MODELS.map((option) => (
            <label key={option.id} className={cn(chip, model === option.id ? chipOn : chipOff)}>
              <input
                type="radio"
                name="negative-model"
                value={option.id}
                checked={model === option.id}
                onChange={() => {
                  setCopied(false);
                  setModel(option.id);
                }}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6" disabled={!result.supported}>
        <legend className="text-sm font-semibold text-[var(--text-primary)]">2. What to avoid</legend>
        <div className={cn('mt-3 flex flex-wrap gap-2', !result.supported && 'opacity-50')}>
          {NEGATIVE_CATEGORIES.map((category) => {
            const active = categories.includes(category.id);
            return (
              <label key={category.id} className={cn(chip, active ? chipOn : chipOff)}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleCategory(category.id)}
                  className="sr-only"
                />
                {active && <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />}
                {category.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">3. Your negative prompt</h2>
          {result.supported && (
            <span className="text-xs text-[var(--text-tertiary)]" aria-live="polite">
              {result.terms.length} {result.terms.length === 1 ? 'term' : 'terms'}
            </span>
          )}
        </div>
        <div className="relative mt-3">
          {result.text && (
            <button
              type="button"
              className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
              onClick={handleCopy}
              aria-label={copied ? 'Copied to clipboard' : 'Copy negative prompt'}
            >
              {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
              <span aria-hidden>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
          <pre
            className="min-h-[5.5rem] whitespace-pre-wrap rounded-2xl border border-[var(--border-default)] bg-[var(--surface-sunken)] px-4 pb-4 pt-11 font-mono text-sm leading-relaxed text-[var(--text-primary)] [overflow-wrap:anywhere]"
            tabIndex={0}
            aria-live="polite"
          >
            <code>
              {result.text ||
                (result.supported
                  ? 'Pick one or more categories above.'
                  : 'No negative prompt for this model. See the tip below.')}
            </code>
          </pre>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">{result.note}</p>
      </div>
    </div>
  );
}
