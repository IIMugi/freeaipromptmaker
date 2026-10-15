// State of the home page prompt generator: defaults, share links and saved history.
import { ALL_STYLES, CAMERA_OPTIONS, LIGHTING_OPTIONS } from '@/data/prompt-options';
import {
  MIDJOURNEY_DEFAULT_STYLIZE,
  formatPrompt,
  isAspectRatio,
  isFormatId,
  type AspectRatio,
  type FormatId,
  type FormattedPrompt,
} from '@/lib/prompt-format';

export interface BuilderState {
  subject: string;
  format: FormatId;
  styles: string[];
  lighting: string;
  camera: string;
  aspectRatio: AspectRatio;
  negative: string;
  stylize: number;
  chaos: number;
}

export const DEFAULT_STATE: BuilderState = {
  subject: '',
  format: 'midjourney',
  styles: [],
  lighting: '',
  camera: '',
  aspectRatio: '1:1',
  negative: '',
  stylize: MIDJOURNEY_DEFAULT_STYLIZE,
  chaos: 0,
};

export const MAX_SUBJECT_LENGTH = 600;
export const MAX_NEGATIVE_LENGTH = 300;

const styleIds = new Set(ALL_STYLES.map((style) => style.id));

function optionValue(options: readonly { id: string; value: string }[], id: string) {
  return options.find((option) => option.id === id)?.value ?? '';
}

export function negativeTerms(text: string) {
  return text
    .split(',')
    .map((term) => term.trim())
    .filter(Boolean);
}

export function formatState(state: BuilderState, subjectFallback = ''): FormattedPrompt {
  return formatPrompt({
    format: state.format,
    subject: state.subject.trim() ? state.subject : subjectFallback,
    styles: state.styles.map((id) => optionValue(ALL_STYLES, id)),
    light: [optionValue(LIGHTING_OPTIONS, state.lighting), optionValue(CAMERA_OPTIONS, state.camera)],
    aspectRatio: state.aspectRatio,
    negative: negativeTerms(state.negative),
    stylize: state.stylize,
    chaos: state.chaos,
  });
}

function clampInt(value: string | null, min: number, max: number, fallback: number) {
  if (value === null || !/^\d+$/.test(value)) return fallback;
  return Math.min(max, Math.max(min, Number(value)));
}

/** Reads a share link. Unknown values fall back to defaults; `q` keeps working as before. */
export function stateFromSearchParams(params: URLSearchParams): BuilderState {
  const format = params.get('m');
  const aspectRatio = params.get('ar');
  const lighting = params.get('l') ?? '';
  const camera = params.get('c') ?? '';
  return {
    subject: (params.get('q') ?? '').slice(0, MAX_SUBJECT_LENGTH),
    format: isFormatId(format) ? format : DEFAULT_STATE.format,
    styles: [...new Set((params.get('s') ?? '').split(',').filter((id) => styleIds.has(id)))],
    lighting: LIGHTING_OPTIONS.some((option) => option.id === lighting) ? lighting : '',
    camera: CAMERA_OPTIONS.some((option) => option.id === camera) ? camera : '',
    aspectRatio: isAspectRatio(aspectRatio) ? aspectRatio : DEFAULT_STATE.aspectRatio,
    negative: (params.get('neg') ?? '').slice(0, MAX_NEGATIVE_LENGTH),
    stylize: clampInt(params.get('sz'), 0, 1000, DEFAULT_STATE.stylize),
    chaos: clampInt(params.get('ch'), 0, 100, DEFAULT_STATE.chaos),
  };
}

/** Writes only the values that differ from the defaults, so links stay short. */
export function stateToSearchParams(state: BuilderState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.subject.trim()) params.set('q', state.subject.trim());
  if (state.format !== DEFAULT_STATE.format) params.set('m', state.format);
  if (state.styles.length) params.set('s', state.styles.join(','));
  if (state.lighting) params.set('l', state.lighting);
  if (state.camera) params.set('c', state.camera);
  if (state.aspectRatio !== DEFAULT_STATE.aspectRatio) params.set('ar', state.aspectRatio);
  if (state.negative.trim()) params.set('neg', state.negative.trim());
  if (state.stylize !== DEFAULT_STATE.stylize) params.set('sz', String(state.stylize));
  if (state.chaos !== DEFAULT_STATE.chaos) params.set('ch', String(state.chaos));
  return params;
}

export function hasShareableParams(params: URLSearchParams) {
  return ['q', 'm', 's', 'l', 'c', 'ar', 'neg', 'sz', 'ch'].some((key) => params.has(key));
}

// ── History ──

export const HISTORY_KEY = 'prompt-history';
export const HISTORY_LIMIT = 20;

export interface HistoryEntry {
  id: string;
  /** The prompt text as it was copied. */
  prompt: string;
  /** Full builder state, so restoring brings back every setting. */
  state: BuilderState;
  timestamp: string;
  pinned?: boolean;
}

/** Old entries (before 2026-10) only kept the prompt text and a model id. */
interface LegacyEntry {
  id?: unknown;
  prompt?: unknown;
  model?: unknown;
  timestamp?: unknown;
  pinned?: unknown;
}

const LEGACY_MODEL_FORMATS: Record<string, FormatId> = {
  midjourney: 'midjourney',
  'midjourney-v7': 'midjourney',
  'stable-diffusion': 'sdxl',
  leonardo: 'sdxl',
  flux: 'flux',
  'flux-pro': 'flux',
};

function isBuilderState(value: unknown): value is BuilderState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<BuilderState>;
  return (
    typeof state.subject === 'string' &&
    isFormatId(state.format) &&
    Array.isArray(state.styles) &&
    isAspectRatio(state.aspectRatio)
  );
}

/**
 * Reads stored history in either shape. A legacy entry restores its prompt text as the subject with
 * no styles selected, so nothing is added twice.
 */
export function migrateHistory(raw: unknown): HistoryEntry[] {
  if (!Array.isArray(raw)) return [];
  const entries: HistoryEntry[] = [];
  for (const item of raw as LegacyEntry[]) {
    if (!item || typeof item.prompt !== 'string' || !item.prompt.trim()) continue;
    const id = typeof item.id === 'string' ? item.id : `${entries.length}-${item.prompt.length}`;
    const timestamp = typeof item.timestamp === 'string' ? item.timestamp : new Date(0).toISOString();
    const stored = (item as { state?: unknown }).state;
    const state: BuilderState = isBuilderState(stored)
      ? { ...DEFAULT_STATE, ...stored, styles: stored.styles.filter((style) => styleIds.has(style)) }
      : {
          ...DEFAULT_STATE,
          subject: item.prompt.slice(0, MAX_SUBJECT_LENGTH),
          format: LEGACY_MODEL_FORMATS[String(item.model)] ?? 'chat',
        };
    entries.push({ id, prompt: item.prompt, state, timestamp, pinned: item.pinned === true });
    if (entries.length === HISTORY_LIMIT) break;
  }
  return entries;
}

/** Adds an entry at the top, replacing an identical prompt. Pinned entries are kept over unpinned ones. */
export function addToHistory(history: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  const rest = history.filter((item) => !(item.prompt === entry.prompt && item.state.format === entry.state.format));
  const pinned = rest.filter((item) => item.pinned);
  const unpinned = rest.filter((item) => !item.pinned);
  const previous = history.find((item) => item.prompt === entry.prompt && item.state.format === entry.state.format);
  const next = [{ ...entry, pinned: previous?.pinned }, ...pinned, ...unpinned];
  return next.slice(0, HISTORY_LIMIT);
}
