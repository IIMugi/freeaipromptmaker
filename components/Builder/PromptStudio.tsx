'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { Pin, PinOff, RotateCcw, Trash2, X } from 'lucide-react';
import {
  CAMERA_OPTIONS,
  COMMON_NEGATIVES,
  EXAMPLE_SUBJECTS,
  LIGHTING_OPTIONS,
  STYLE_CATEGORIES,
  ALL_STYLES,
  type PromptOption,
} from '@/data/prompt-options';
import {
  DEFAULT_STATE,
  HISTORY_KEY,
  MAX_NEGATIVE_LENGTH,
  MAX_SUBJECT_LENGTH,
  addToHistory,
  formatState,
  hasShareableParams,
  migrateHistory,
  negativeTerms,
  stateFromSearchParams,
  stateToSearchParams,
  type BuilderState,
  type HistoryEntry,
} from '@/lib/builder-state';
import { ASPECT_RATIOS, FORMATS, getFormat, type AspectRatio } from '@/lib/prompt-format';
import { trackProductEvent } from '@/lib/analytics';
import { cn, generateId } from '@/lib/utils';
import { CopyButton } from '@/components/Builder/CopyButton';
import { Proof, ProofLegend } from '@/components/Builder/Proof';

export const SUBJECT_INPUT_ID = 'prompt-subject';

const chipBase = 'inline-flex min-h-9 items-center rounded-control border px-3 text-[0.95rem] transition-colors';
const chipOff = 'border-line text-ink-2 hover:border-line-strong hover:text-ink';
const chipOn = 'border-accent bg-accent-wash text-ink font-medium';

function readHistory(): HistoryEntry[] {
  try {
    return migrateHistory(JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? '[]'));
  } catch {
    return [];
  }
}

function writeHistory(entries: HistoryEntry[]) {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // History is a convenience; the prompt still copies without it.
  }
}

// Current time for "5 min ago" labels, refreshed every minute. 0 on the server, which renders no label.
let nowValue = 0;
function subscribeToNow(onChange: () => void) {
  nowValue = Date.now();
  onChange();
  const timer = window.setInterval(() => {
    nowValue = Date.now();
    onChange();
  }, 60_000);
  return () => window.clearInterval(timer);
}

function relativeTime(iso: string, now: number) {
  const seconds = Math.round((now - new Date(iso).getTime()) / 1000);
  if (!now || !Number.isFinite(seconds) || seconds < 0) return '';
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;
  return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

export function PromptStudio() {
  const uid = useId();
  const [state, setState] = useState<BuilderState>(DEFAULT_STATE);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [category, setCategory] = useState(STYLE_CATEGORIES[0]!.id);
  const [status, setStatus] = useState('');
  const [flash, setFlash] = useState(0);
  const subjectRef = useRef<HTMLTextAreaElement>(null);
  const trackedRef = useRef(false);

  const update = useCallback((patch: Partial<BuilderState>) => setState((current) => ({ ...current, ...patch })), []);

  // Share links and saved history are read once in the browser; the server renders the empty tool.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect */
    if (hasShareableParams(params)) setState(stateFromSearchParams(params));
    setHistory(readHistory());
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const hasSubject = state.subject.trim().length > 0;
  const format = getFormat(state.format);
  const result = useMemo(() => formatState(state, EXAMPLE_SUBJECTS[0]), [state]);

  useEffect(() => {
    if (!hasSubject) {
      trackedRef.current = false;
      return;
    }
    if (!trackedRef.current) {
      trackProductEvent('prompt_generated', { model: format.analyticsModel });
      trackedRef.current = true;
    }
  }, [hasSubject, format.analyticsModel]);

  const saveToHistory = useCallback(() => {
    setHistory((current) => {
      const next = addToHistory(current, {
        id: generateId(),
        prompt: result.prompt,
        state,
        timestamp: new Date().toISOString(),
      });
      writeHistory(next);
      return next;
    });
  }, [result.prompt, state]);

  const onCopied = useCallback(
    (variant: 'prompt' | 'with-negative') => {
      trackProductEvent('prompt_copy_succeeded', { model: format.analyticsModel, variant });
      setStatus(variant === 'prompt' ? 'Prompt copied.' : 'Negative prompt copied.');
      if (variant === 'prompt') saveToHistory();
    },
    [format.analyticsModel, saveToHistory],
  );

  const onCopyFailed = useCallback(() => {
    trackProductEvent('prompt_copy_failed', { model: format.analyticsModel, variant: 'prompt' });
    setStatus('Copy failed. Select the prompt text and copy it by hand.');
  }, [format.analyticsModel]);

  const shareUrl = useMemo(() => {
    if (!hasSubject || typeof window === 'undefined') return '';
    const query = stateToSearchParams(state).toString();
    return `${window.location.origin}/${query ? `?${query}` : ''}`;
  }, [hasSubject, state]);

  // "/" jumps to the subject box. Ctrl/Cmd+Enter copies the prompt.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.closest('input, textarea, select, [contenteditable="true"]');
      if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        subjectRef.current?.focus();
      }
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && hasSubject) {
        event.preventDefault();
        document.getElementById(`${uid}-copy`)?.querySelector('button')?.click();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [hasSubject, uid]);

  const toggleStyle = (id: string) =>
    setState((current) => ({
      ...current,
      styles: current.styles.includes(id) ? current.styles.filter((style) => style !== id) : [...current.styles, id],
    }));

  const addCommonNegatives = () => {
    const terms = negativeTerms(state.negative);
    const merged = [...terms, ...COMMON_NEGATIVES.filter((term) => !terms.includes(term))];
    update({ negative: merged.join(', ').slice(0, MAX_NEGATIVE_LENGTH) });
  };

  const restore = (entry: HistoryEntry) => {
    setState(entry.state);
    setStatus('Prompt restored.');
    subjectRef.current?.focus();
  };

  const changeHistory = (next: HistoryEntry[]) => {
    setHistory(next);
    writeHistory(next);
  };

  const now = useSyncExternalStore(subscribeToNow, () => nowValue, () => 0);
  const sortedHistory = [...history].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  const selectedStyles = state.styles
    .map((id) => ALL_STYLES.find((style) => style.id === id))
    .filter((style): style is PromptOption => Boolean(style));
  const negativeIgnored = !format.negativeField && state.negative.trim().length > 0;

  return (
    <div>
      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,6fr)]">
        {/* 1. Subject */}
        <div className="lg:col-start-1 lg:row-start-1">
          <label htmlFor={SUBJECT_INPUT_ID} className="block text-lg font-semibold text-ink">
            What should the image show?
          </label>
          <textarea
            id={SUBJECT_INPUT_ID}
            ref={subjectRef}
            value={state.subject}
            onChange={(event) => update({ subject: event.target.value.slice(0, MAX_SUBJECT_LENGTH) })}
            rows={3}
            placeholder={`For example: ${EXAMPLE_SUBJECTS[0]}`}
            className="mt-3 w-full resize-y rounded-panel border border-line-strong bg-surface px-4 py-3.5 text-lg leading-relaxed text-ink placeholder:text-ink-3 focus-visible:border-accent"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-ink-3">Try</span>
            {EXAMPLE_SUBJECTS.map((example, index) => (
              <button
                key={example}
                type="button"
                onClick={() => update({ subject: example })}
                className={cn(index > 1 && 'hidden sm:inline-flex', 'min-h-8 rounded-control px-2 text-sm text-ink-2 underline decoration-line-strong underline-offset-4 hover:text-ink hover:decoration-accent')}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Proof */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <section aria-labelledby={`${uid}-proof-title`} className="lg:sticky lg:top-24">
            <div className="rounded-panel border border-line bg-surface shadow-panel">
              <h2 id={`${uid}-proof-title`} className="sr-only">
                Your prompt
              </h2>
              <fieldset className="border-b border-line px-2 pt-2">
                <legend className="sr-only">Format the prompt for</legend>
                <div className="-mb-px flex overflow-x-auto [scrollbar-width:none]">
                  {FORMATS.map((option) => (
                    <label
                      key={option.id}
                      className={cn(
                        'flex min-h-11 flex-none cursor-pointer items-center whitespace-nowrap border-b-2 px-3 text-[0.95rem] font-medium transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-focus',
                        state.format === option.id
                          ? 'border-accent text-ink'
                          : 'border-transparent text-ink-3 hover:text-ink',
                      )}
                    >
                      <input
                        type="radio"
                        name={`${uid}-format`}
                        value={option.id}
                        checked={state.format === option.id}
                        onChange={() => {
                          update({ format: option.id });
                          setFlash((count) => count + 1);
                        }}
                        className="sr-only"
                      />
                      {option.short}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="px-5 pb-5 pt-4 sm:px-6">
                <p className="text-sm text-ink-3">
                  {hasSubject ? `For ${format.models}` : 'Example. Describe your image to make it yours.'}
                </p>
                <div key={flash} className={cn('-mx-2 mt-2 rounded-control px-2 py-1', flash > 0 && 'proof-flash')}>
                  <Proof segments={result.segments} muted={!hasSubject} />
                </div>

                {result.negative ? (
                  <div className="mt-4 border-t border-dashed border-line-strong pt-3">
                    <p className="text-sm font-medium text-ink-2">Negative prompt</p>
                    <Proof segments={result.negativeSegments} muted={!hasSubject} className="mt-1" />
                  </div>
                ) : null}

                {result.settings ? <p className="mt-3 font-mono text-sm text-ink-2">{result.settings}</p> : null}

                <div className="mt-5 flex flex-wrap items-center gap-2" id={`${uid}-copy`}>
                  <CopyButton
                    text={hasSubject ? result.prompt : ''}
                    label="Copy prompt"
                    copiedLabel="Prompt copied"
                    variant="primary"
                    onCopied={() => onCopied('prompt')}
                    onFailed={onCopyFailed}
                  />
                  {result.negative ? (
                    <CopyButton
                      text={hasSubject ? result.negative : ''}
                      label="Copy negative"
                      copiedLabel="Negative copied"
                      onCopied={() => onCopied('with-negative')}
                      onFailed={onCopyFailed}
                    />
                  ) : null}
                  <CopyButton
                    text={shareUrl}
                    label="Copy link"
                    copiedLabel="Link copied"
                    variant="quiet"
                    className="ml-auto"
                    onCopied={() => setStatus('Link copied. It opens this prompt with the same settings.')}
                  />
                </div>
                <p role="status" aria-live="polite" className="sr-only">
                  {status}
                </p>

                <p className="mt-4 text-sm leading-relaxed text-ink-2">{result.note}</p>
                {negativeIgnored ? (
                  <p className="mt-2 text-sm leading-relaxed text-warn">
                    Your “things to avoid” are left out: {format.label} has no negative prompt.
                  </p>
                ) : null}
                <ProofLegend
                  segments={[...result.segments, ...result.negativeSegments]}
                  className="mt-4 border-t border-line pt-3"
                />
              </div>
            </div>

            {sortedHistory.length > 0 ? (
              <HistoryList
                entries={sortedHistory}
                now={now}
                onRestore={restore}
                onTogglePin={(id) =>
                  changeHistory(history.map((entry) => (entry.id === id ? { ...entry, pinned: !entry.pinned } : entry)))
                }
                onRemove={(id) => changeHistory(history.filter((entry) => entry.id !== id))}
                onClear={() => changeHistory(history.filter((entry) => entry.pinned))}
              />
            ) : null}
          </section>
        </div>

        {/* 3. Controls */}
        <div className="space-y-9 lg:col-start-1 lg:row-start-2">
          <Group
            title="Style"
            aside={
              selectedStyles.length ? (
                <button
                  type="button"
                  onClick={() => update({ styles: [] })}
                  className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink"
                >
                  Clear {selectedStyles.length}
                </button>
              ) : null
            }
          >
            <div role="tablist" aria-label="Style groups" className="flex gap-1">
              {STYLE_CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${item.id}`}
                  aria-selected={category === item.id}
                  aria-controls={`${uid}-panel`}
                  onClick={() => setCategory(item.id)}
                  onKeyDown={(event) => {
                    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
                    const index = STYLE_CATEGORIES.findIndex((entry) => entry.id === category);
                    const step = event.key === 'ArrowRight' ? 1 : -1;
                    const next = STYLE_CATEGORIES[(index + step + STYLE_CATEGORIES.length) % STYLE_CATEGORIES.length]!;
                    setCategory(next.id);
                    document.getElementById(`${uid}-tab-${next.id}`)?.focus();
                  }}
                  tabIndex={category === item.id ? 0 : -1}
                  className={cn(
                    'min-h-9 rounded-control px-3 text-[0.95rem] font-medium',
                    category === item.id ? 'bg-ink text-paper' : 'text-ink-2 hover:text-ink',
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div
              id={`${uid}-panel`}
              role="tabpanel"
              aria-labelledby={`${uid}-tab-${category}`}
              className="mt-3 flex flex-wrap gap-2"
            >
              {STYLE_CATEGORIES.find((item) => item.id === category)!.options.map((option) => (
                <Chip key={option.id} active={state.styles.includes(option.id)} onClick={() => toggleStyle(option.id)}>
                  {option.label}
                </Chip>
              ))}
            </div>
            {selectedStyles.length ? (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Selected styles">
                {selectedStyles.map((style) => (
                  <li key={style.id}>
                    <button
                      type="button"
                      onClick={() => toggleStyle(style.id)}
                      className="inline-flex min-h-8 items-center gap-1.5 rounded-control bg-sunken px-2.5 text-sm text-role-style"
                      aria-label={`Remove ${style.label}`}
                    >
                      {style.label}
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </Group>

          <SingleChoice
            title="Light"
            options={LIGHTING_OPTIONS}
            value={state.lighting}
            onChange={(lighting) => update({ lighting })}
          />
          <SingleChoice
            title="Camera"
            options={CAMERA_OPTIONS}
            value={state.camera}
            onChange={(camera) => update({ camera })}
          />

          <Group title="Shape">
            <div role="radiogroup" aria-label="Aspect ratio" className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((ratio) => (
                <Chip
                  key={ratio}
                  role="radio"
                  active={state.aspectRatio === ratio}
                  onClick={() => update({ aspectRatio: ratio })}
                >
                  <RatioGlyph ratio={ratio} />
                  {ratio}
                </Chip>
              ))}
            </div>
          </Group>

          <details className="group border-t border-line pt-5" open={Boolean(state.negative) || undefined}>
            <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between text-lg font-semibold text-ink">
              Things to avoid and Midjourney settings
              <span
                className="text-2xl font-normal text-ink-3 transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <div className="mt-4 space-y-7">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <label htmlFor={`${uid}-negative`} className="font-medium text-ink">
                    Things to avoid
                  </label>
                  <button
                    type="button"
                    onClick={addCommonNegatives}
                    className="text-sm text-accent underline underline-offset-4"
                  >
                    Add common fixes
                  </button>
                </div>
                <p className="mt-1 text-sm text-ink-2" id={`${uid}-negative-help`}>
                  Comma separated. Midjourney gets them as --no, Stable Diffusion as a negative prompt. Flux and ChatGPT
                  have no field for them.
                </p>
                <textarea
                  id={`${uid}-negative`}
                  aria-describedby={`${uid}-negative-help`}
                  value={state.negative}
                  onChange={(event) => update({ negative: event.target.value.slice(0, MAX_NEGATIVE_LENGTH) })}
                  rows={2}
                  placeholder="blurry, watermark, text"
                  className="mt-2 w-full resize-y rounded-control border border-line-strong bg-surface px-3 py-2.5 text-ink placeholder:text-ink-3 focus-visible:border-accent"
                />
              </div>
              <Slider
                id={`${uid}-stylize`}
                label="Stylize"
                help="Midjourney only. Higher values give Midjourney more artistic freedom. Default 100."
                min={0}
                max={1000}
                step={25}
                value={state.stylize}
                onChange={(stylize) => update({ stylize })}
              />
              <Slider
                id={`${uid}-chaos`}
                label="Chaos"
                help="Midjourney only. Higher values make the four results differ more. Default 0."
                min={0}
                max={100}
                step={5}
                value={state.chaos}
                onChange={(chaos) => update({ chaos })}
              />
            </div>
          </details>
        </div>
      </div>

      {/* Mobile: keep the copy action in reach while scrolling through the controls. */}
      {hasSubject ? (
        <div className="sticky bottom-0 z-30 -mx-4 border-t border-line bg-paper px-4 py-3 sm:-mx-6 sm:px-6 lg:hidden">
          <div className="flex items-center gap-3">
            <p className="proof min-w-0 flex-1 truncate !whitespace-nowrap text-sm" aria-hidden="true">
              {result.prompt}
            </p>
            <CopyButton
              text={result.prompt}
              label="Copy prompt"
              copiedLabel="Copied"
              variant="primary"
              onCopied={() => onCopied('prompt')}
              onFailed={onCopyFailed}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Group({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Chip({
  active,
  onClick,
  role,
  children,
}: {
  active: boolean;
  onClick: () => void;
  role?: 'radio';
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role={role}
      aria-pressed={role ? undefined : active}
      aria-checked={role ? active : undefined}
      onClick={onClick}
      className={cn(chipBase, 'gap-2', active ? chipOn : chipOff)}
    >
      {children}
    </button>
  );
}

function SingleChoice({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: readonly PromptOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <Group
      title={title}
      aside={
        value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink"
          >
            Clear
          </button>
        ) : null
      }
    >
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Chip
            key={option.id}
            active={value === option.id}
            onClick={() => onChange(value === option.id ? '' : option.id)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </Group>
  );
}

function RatioGlyph({ ratio }: { ratio: AspectRatio }) {
  const [w, h] = ratio.split(':').map(Number) as [number, number];
  const scale = 14 / Math.max(w, h);
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="flex-none">
      <rect
        x={(16 - w * scale) / 2}
        y={(16 - h * scale) / 2}
        width={w * scale}
        height={h * scale}
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function Slider({
  id,
  label,
  help,
  min,
  max,
  step,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-medium text-ink">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-sm text-ink">
          {value}
        </output>
      </div>
      <p className="mt-1 text-sm text-ink-2" id={`${id}-help`}>
        {help}
      </p>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-describedby={`${id}-help`}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-accent"
      />
    </div>
  );
}

function HistoryList({
  entries,
  now,
  onRestore,
  onTogglePin,
  onRemove,
  onClear,
}: {
  entries: HistoryEntry[];
  now: number;
  onRestore: (entry: HistoryEntry) => void;
  onTogglePin: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  return (
    <section aria-labelledby="history-title" className="mt-8">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="history-title" className="font-semibold text-ink">
          Recent prompts
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink"
        >
          Clear unpinned
        </button>
      </div>
      <p className="mt-1 text-sm text-ink-3">Saved in this browser when you copy a prompt.</p>
      <ul className="mt-3 divide-y divide-line border-y border-line">
        {entries.map((entry) => (
          <li key={entry.id} className="flex items-start gap-2 py-2.5">
            <button
              type="button"
              onClick={() => onRestore(entry)}
              className="min-w-0 flex-1 rounded-control text-left"
              aria-label={`Restore: ${entry.prompt}`}
            >
              <span className="line-clamp-2 font-mono text-sm text-ink [overflow-wrap:anywhere]">{entry.prompt}</span>
              <span className="mt-0.5 block text-sm text-ink-3">
                {getFormat(entry.state.format).label}
                {relativeTime(entry.timestamp, now) ? `, ${relativeTime(entry.timestamp, now)}` : ''}
              </span>
            </button>
            <IconButton label={`Restore: ${entry.prompt}`} onClick={() => onRestore(entry)} hiddenFromTree>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </IconButton>
            <IconButton
              label={entry.pinned ? 'Unpin prompt' : 'Pin prompt'}
              onClick={() => onTogglePin(entry.id)}
              pressed={Boolean(entry.pinned)}
            >
              {entry.pinned ? (
                <PinOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Pin className="h-4 w-4" aria-hidden="true" />
              )}
            </IconButton>
            <IconButton label="Delete prompt" onClick={() => onRemove(entry.id)}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          </li>
        ))}
      </ul>
    </section>
  );
}

function IconButton({
  label,
  onClick,
  pressed,
  hiddenFromTree,
  children,
}: {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  hiddenFromTree?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      aria-hidden={hiddenFromTree || undefined}
      tabIndex={hiddenFromTree ? -1 : undefined}
      className={cn(
        'inline-flex h-9 w-9 flex-none items-center justify-center rounded-control text-ink-3 hover:bg-sunken hover:text-ink',
        hiddenFromTree && 'hidden sm:inline-flex',
        pressed && 'text-accent',
      )}
    >
      {children}
    </button>
  );
}
