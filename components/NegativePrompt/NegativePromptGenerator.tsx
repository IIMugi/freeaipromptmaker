'use client';

import { useMemo, useState } from 'react';
import {
  NEGATIVE_CATEGORIES,
  NEGATIVE_MODELS,
  buildNegativePrompt,
  type NegativeCategoryId,
  type NegativeModelId,
} from '@/lib/negative-prompt';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/Builder/CopyButton';

const chip =
  'inline-flex min-h-9 cursor-pointer items-center rounded-control border px-3 text-[0.95rem] transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus';
const chipOff = 'border-line text-ink-2 hover:border-line-strong hover:text-ink';
const chipOn = 'border-accent bg-accent-wash font-medium text-ink';

export function NegativePromptGenerator() {
  const [model, setModel] = useState<NegativeModelId>('sdxl');
  const [categories, setCategories] = useState<NegativeCategoryId[]>([]);
  const [status, setStatus] = useState('');

  const result = useMemo(() => buildNegativePrompt(model, categories), [model, categories]);

  const toggleCategory = (id: NegativeCategoryId) =>
    setCategories((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,6fr)]">
      <div className="space-y-8">
        <fieldset>
          <legend className="mb-3 text-lg font-semibold text-ink">Model</legend>
          <div className="flex flex-wrap gap-2">
            {NEGATIVE_MODELS.map((option) => (
              <label key={option.id} className={cn(chip, model === option.id ? chipOn : chipOff)}>
                <input
                  type="radio"
                  name="negative-model"
                  value={option.id}
                  checked={model === option.id}
                  onChange={() => setModel(option.id)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="border-t border-line pt-5" disabled={!result.supported}>
          <legend className="float-left mb-3 w-full text-lg font-semibold text-ink">What to avoid</legend>
          <div className={cn('clear-left flex flex-wrap gap-2', !result.supported && 'opacity-50')}>
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
                  {category.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <section aria-labelledby="negative-result" className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-panel border border-line bg-surface px-5 pb-5 pt-4 shadow-panel sm:px-6">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="negative-result" className="font-semibold text-ink">
              Your negative prompt
            </h2>
            {result.supported ? (
              <span className="text-sm text-ink-3">
                {result.terms.length} {result.terms.length === 1 ? 'term' : 'terms'}
              </span>
            ) : null}
          </div>
          <p className="proof mt-3 min-h-[3.5rem]">
            {result.text ? (
              <span data-role="negative">{result.text}</span>
            ) : (
              <span className="font-sans text-ink-3">
                {result.supported
                  ? 'Pick one or more things to avoid.'
                  : 'No negative prompt for this model. See the note below.'}
              </span>
            )}
          </p>
          <div className="mt-5">
            <CopyButton
              text={result.text}
              label="Copy negative prompt"
              copiedLabel="Negative prompt copied"
              variant="primary"
              onCopied={() => setStatus('Negative prompt copied.')}
            />
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            {status}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-2">{result.note}</p>
        </div>
      </section>
    </div>
  );
}
