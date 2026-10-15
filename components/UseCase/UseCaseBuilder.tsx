'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { trackProductEvent } from '@/lib/analytics';
import {
  USE_CASE_MODELS,
  buildUseCasePrompt,
  defaultSelections,
  type AspectRatio,
  type UseCaseBuilderConfig,
  type UseCaseModelId,
} from '@/lib/use-case-prompt';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/Builder/CopyButton';
import { Proof, ProofLegend } from '@/components/Builder/Proof';

const chip =
  'inline-flex min-h-9 cursor-pointer items-center rounded-control border px-3 text-[0.95rem] transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus';
const chipOff = 'border-line text-ink-2 hover:border-line-strong hover:text-ink';
const chipOn = 'border-accent bg-accent-wash font-medium text-ink';

export function UseCaseBuilder({ config }: { config: UseCaseBuilderConfig }) {
  const uid = useId();
  const [model, setModel] = useState<UseCaseModelId>('midjourney');
  const [subject, setSubject] = useState(config.defaultSubject);
  const [selections, setSelections] = useState(() => defaultSelections(config));
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(config.aspectRatios[0]!);
  const [avoid, setAvoid] = useState(true);
  const [status, setStatus] = useState('');

  const result = useMemo(
    () => buildUseCasePrompt(config, { model, subject, selections, aspectRatio, avoid }),
    [config, model, subject, selections, aspectRatio, avoid],
  );
  const format = USE_CASE_MODELS.find((option) => option.id === model)!;
  const avoidAvailable = format.negativeField;

  const toggle = (groupId: string, optionId: string, multiple: boolean) => {
    setSelections((current) => {
      const chosen = current[groupId] ?? [];
      const next = chosen.includes(optionId)
        ? chosen.filter((id) => id !== optionId)
        : multiple
          ? [...chosen, optionId]
          : [optionId];
      return { ...current, [groupId]: next };
    });
  };

  const copied = (variant: 'prompt' | 'with-negative') => {
    trackProductEvent('prompt_copy_succeeded', { model: format.analyticsModel, variant });
    setStatus(variant === 'prompt' ? 'Prompt copied.' : 'Negative prompt copied.');
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,6fr)]">
      <div className="space-y-8">
        <div>
          <label htmlFor={`${uid}-subject`} className="block text-lg font-semibold text-ink">
            {config.subjectLabel}
          </label>
          <textarea
            id={`${uid}-subject`}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            rows={2}
            maxLength={300}
            className="mt-3 w-full resize-y rounded-panel border border-line-strong bg-surface px-4 py-3 text-lg text-ink placeholder:text-ink-3 focus-visible:border-accent"
            placeholder={config.defaultSubject}
          />
        </div>

        {config.groups.map((group) => (
          <fieldset key={group.id} className="border-t border-line pt-5">
            <legend className="float-left mb-3 w-full text-lg font-semibold text-ink">
              {group.label}
              {group.multiple && <span className="ml-2 text-sm font-normal text-ink-3">pick any</span>}
            </legend>
            <div className="clear-left flex flex-wrap gap-2">
              {group.options.map((option) => {
                const active = (selections[group.id] ?? []).includes(option.id);
                return (
                  <label key={option.id} className={cn(chip, active ? chipOn : chipOff)}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggle(group.id, option.id, group.multiple)}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div className="grid gap-8 border-t border-line pt-5 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-3 text-lg font-semibold text-ink">Aspect ratio</legend>
            <div className="flex flex-wrap gap-2">
              {config.aspectRatios.map((ratio) => (
                <label key={ratio} className={cn(chip, aspectRatio === ratio ? chipOn : chipOff)}>
                  <input
                    type="radio"
                    name={`${uid}-ratio`}
                    value={ratio}
                    checked={aspectRatio === ratio}
                    onChange={() => setAspectRatio(ratio)}
                    className="sr-only"
                  />
                  {ratio}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset disabled={!avoidAvailable}>
            <legend className="mb-3 text-lg font-semibold text-ink">Negative prompt</legend>
            <label
              className={cn(
                chip,
                avoid && avoidAvailable ? chipOn : chipOff,
                !avoidAvailable && 'cursor-not-allowed opacity-50',
              )}
            >
              <input type="checkbox" checked={avoid} onChange={() => setAvoid((value) => !value)} className="sr-only" />
              Add common fixes
            </label>
            {!avoidAvailable ? <p className="mt-2 text-sm text-ink-3">{format.label} has no negative prompt.</p> : null}
          </fieldset>
        </div>
      </div>

      <section aria-labelledby={`${uid}-proof-title`} className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-panel border border-line bg-surface shadow-panel">
          <h2 id={`${uid}-proof-title`} className="sr-only">
            Your prompt
          </h2>
          <fieldset className="min-w-0 border-b border-line px-2 pt-2">
            <legend className="sr-only">Format the prompt for</legend>
            <div className="-mb-px flex overflow-x-auto [scrollbar-width:none]">
              {USE_CASE_MODELS.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    'flex min-h-11 flex-none cursor-pointer items-center whitespace-nowrap border-b-2 px-3 text-[0.95rem] font-medium transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-focus',
                    model === option.id ? 'border-accent text-ink' : 'border-transparent text-ink-3 hover:text-ink',
                  )}
                >
                  <input
                    type="radio"
                    name={`${uid}-model`}
                    value={option.id}
                    checked={model === option.id}
                    onChange={() => setModel(option.id)}
                    className="sr-only"
                  />
                  {option.short}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="px-5 pb-5 pt-4 sm:px-6">
            {result.prompt ? (
              <Proof segments={result.segments} />
            ) : (
              <p className="text-ink-3">Describe your subject to build a prompt.</p>
            )}
            {result.negative ? (
              <div className="mt-4 border-t border-dashed border-line-strong pt-3">
                <p className="text-sm font-medium text-ink-2">Negative prompt</p>
                <Proof segments={result.negativeSegments} className="mt-1" />
              </div>
            ) : null}
            {result.settings ? <p className="mt-3 font-mono text-sm text-ink-2">{result.settings}</p> : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <CopyButton
                text={result.prompt}
                label="Copy prompt"
                copiedLabel="Prompt copied"
                variant="primary"
                onCopied={() => copied('prompt')}
              />
              {result.negative ? (
                <CopyButton
                  text={result.negative}
                  label="Copy negative"
                  copiedLabel="Negative copied"
                  onCopied={() => copied('with-negative')}
                />
              ) : null}
            </div>
            <p role="status" aria-live="polite" className="sr-only">
              {status}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-2">{result.note}</p>
            <ProofLegend
              segments={[...result.segments, ...result.negativeSegments]}
              className="mt-4 border-t border-line pt-3"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export function ExamplePrompt({ text }: { text: string }) {
  return (
    <li className="flex flex-col gap-3 border-b border-line py-4 sm:flex-row sm:items-start sm:gap-6">
      <p className="min-w-0 flex-1 font-mono text-[0.9rem] leading-relaxed text-ink [overflow-wrap:anywhere]">{text}</p>
      <div className="flex flex-none gap-2">
        <CopyButton
          text={text}
          variant="quiet"
          label="Copy"
          copiedLabel="Copied"
          onCopied={() => trackProductEvent('guide_snippet_copied', {})}
        />
        <Link
          href={`/?q=${encodeURIComponent(text)}`}
          className="inline-flex min-h-8 items-center rounded-control border border-line px-2.5 text-sm text-ink-2 hover:border-line-strong hover:text-ink"
        >
          Edit in generator
        </Link>
      </div>
    </li>
  );
}
