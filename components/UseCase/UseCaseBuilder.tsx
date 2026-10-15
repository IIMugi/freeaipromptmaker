'use client';

import { useId, useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { trackProductEvent } from '@/lib/analytics';
import {
  USE_CASE_MODELS,
  buildUseCasePrompt,
  defaultSelections,
  type AspectRatio,
  type UseCaseBuilderConfig,
  type UseCaseModelId,
} from '@/lib/use-case-prompt';
import { cn, copyToClipboard } from '@/lib/utils';

const chip =
  'inline-flex cursor-pointer items-center rounded-xl border px-3.5 py-2 text-sm font-medium transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--accent-primary)]';
const chipOff = 'border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]';
const chipOn = 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--text-primary)]';
const copyButton =
  'absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]';
const output =
  'whitespace-pre-wrap rounded-2xl border border-[var(--border-default)] bg-[var(--surface-sunken)] px-4 pb-4 pt-11 font-mono text-sm leading-relaxed text-[var(--text-primary)] [overflow-wrap:anywhere]';

function OutputBox({ label, text, placeholder, onCopy }: { label: string; text: string; placeholder: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text || !(await copyToClipboard(text))) return;
    setCopied(true);
    onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-3">
      {text && (
        <button type="button" className={copyButton} onClick={handleCopy} aria-label={copied ? 'Copied to clipboard' : `Copy ${label}`}>
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          <span aria-hidden>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      )}
      <pre className={cn(output, 'min-h-[5.5rem]')} tabIndex={0} aria-label={label} aria-live="polite">
        <code>{text || placeholder}</code>
      </pre>
    </div>
  );
}

export function UseCaseBuilder({ config }: { config: UseCaseBuilderConfig }) {
  const uid = useId();
  const [model, setModel] = useState<UseCaseModelId>('midjourney');
  const [subject, setSubject] = useState(config.defaultSubject);
  const [selections, setSelections] = useState(() => defaultSelections(config));
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(config.aspectRatios[0]!);
  const [avoid, setAvoid] = useState(true);

  const result = useMemo(
    () => buildUseCasePrompt(config, { model, subject, selections, aspectRatio, avoid }),
    [config, model, subject, selections, aspectRatio, avoid],
  );
  const analyticsModel = USE_CASE_MODELS.find((option) => option.id === model)!.analyticsModel;
  const avoidAvailable = model === 'midjourney' || model === 'sdxl';

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

  return (
    <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] p-5 shadow-[var(--shadow-card)] sm:p-8">
      <label htmlFor={`${uid}-subject`} className="text-sm font-semibold text-[var(--text-primary)]">
        {config.subjectLabel}
      </label>
      <textarea
        id={`${uid}-subject`}
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        rows={2}
        maxLength={300}
        className="mt-2 w-full resize-y rounded-2xl border border-[var(--border-default)] bg-[var(--surface-sunken)] px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
        placeholder={config.defaultSubject}
      />

      {config.groups.map((group) => (
        <fieldset key={group.id} className="mt-5">
          <legend className="text-sm font-semibold text-[var(--text-primary)]">
            {group.label}
            {group.multiple && <span className="ml-2 font-normal text-[var(--text-tertiary)]">any</span>}
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
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
                  {active && <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />}
                  {option.label}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <fieldset>
          <legend className="text-sm font-semibold text-[var(--text-primary)]">Aspect ratio</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
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
          <legend className="text-sm font-semibold text-[var(--text-primary)]">Negative prompt</legend>
          <label className={cn(chip, 'mt-2.5', avoid && avoidAvailable ? chipOn : chipOff, !avoidAvailable && 'cursor-not-allowed opacity-50')}>
            <input type="checkbox" checked={avoid} onChange={() => setAvoid((value) => !value)} className="sr-only" />
            {avoid && avoidAvailable && <Check className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />}
            Add common fixes
          </label>
        </fieldset>
      </div>

      <div className="mt-6 border-t border-[var(--border-default)]" aria-hidden="true" />
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-[var(--text-primary)]">Format for</legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {USE_CASE_MODELS.map((option) => (
            <label key={option.id} className={cn(chip, model === option.id ? chipOn : chipOff)}>
              <input
                type="radio"
                name={`${uid}-model`}
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

      <h2 className="mt-5 text-sm font-semibold text-[var(--text-primary)]">Your prompt</h2>
      <OutputBox
        label="prompt"
        text={result.prompt}
        placeholder="Describe your subject above."
        onCopy={() => trackProductEvent('prompt_copy_succeeded', { model: analyticsModel, variant: 'prompt' })}
      />
      {result.negative && (
        <>
          <h3 className="mt-4 text-sm font-semibold text-[var(--text-primary)]">Negative prompt</h3>
          <OutputBox
            label="negative prompt"
            text={result.negative}
            placeholder=""
            onCopy={() => trackProductEvent('prompt_copy_succeeded', { model: analyticsModel, variant: 'with-negative' })}
          />
        </>
      )}
      {result.settings && <p className="mt-3 font-mono text-sm text-[var(--text-primary)]">{result.settings}</p>}
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{result.note}</p>
    </div>
  );
}

export function ExamplePrompt({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!(await copyToClipboard(text))) return;
    setCopied(true);
    trackProductEvent('guide_snippet_copied', {});
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <li className="group relative rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] py-3 pl-4 pr-20">
      <p className="text-sm leading-relaxed text-[var(--text-primary)] [overflow-wrap:anywhere]">{text}</p>
      <button
        type="button"
        className="absolute right-2 top-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
        onClick={handleCopy}
        aria-label={copied ? 'Copied to clipboard' : 'Copy example prompt'}
      >
        {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
        <span aria-hidden>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </li>
  );
}
