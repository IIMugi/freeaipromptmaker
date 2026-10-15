import { describe, expect, it } from 'vitest';
import {
  DEFAULT_STATE,
  HISTORY_LIMIT,
  addToHistory,
  formatState,
  migrateHistory,
  stateFromSearchParams,
  stateToSearchParams,
  type BuilderState,
  type HistoryEntry,
} from '@/lib/builder-state';

const filled: BuilderState = {
  subject: 'a red fox asleep in fresh snow',
  format: 'sdxl',
  styles: ['watercolor', 'calm'],
  lighting: 'golden-hour',
  camera: '85mm',
  aspectRatio: '4:5',
  negative: 'blurry, text',
  stylize: 250,
  chaos: 10,
};

describe('share links', () => {
  it('round-trips every setting through the URL', () => {
    expect(stateFromSearchParams(stateToSearchParams(filled))).toEqual(filled);
  });

  it('keeps links short by leaving out defaults', () => {
    const params = stateToSearchParams({ ...DEFAULT_STATE, subject: 'a lighthouse' });
    expect(params.toString()).toBe('q=a+lighthouse');
  });

  it('keeps the old ?q= links working', () => {
    expect(stateFromSearchParams(new URLSearchParams('q=quiet+red+fox'))).toEqual({
      ...DEFAULT_STATE,
      subject: 'quiet red fox',
    });
  });

  it('falls back to defaults for unknown or out-of-range values', () => {
    const state = stateFromSearchParams(
      new URLSearchParams('m=dalle&s=watercolor,nope,watercolor&l=disco&c=85mm&ar=7:3&sz=99999&ch=-4'),
    );
    expect(state).toEqual({ ...DEFAULT_STATE, styles: ['watercolor'], camera: '85mm', stylize: 1000 });
  });
});

describe('formatState', () => {
  it('turns option ids into prompt text', () => {
    const result = formatState(filled);
    expect(result.prompt).toBe(
      'a red fox asleep in fresh snow, watercolor painting, soft bleeding edges, paper texture, calm, serene, muted palette, golden hour light, 85mm portrait lens',
    );
    expect(result.negative).toBe('blurry, text');
  });

  it('uses the fallback subject only while the box is empty', () => {
    expect(formatState({ ...DEFAULT_STATE }, 'a lighthouse').prompt).toBe('a lighthouse --ar 1:1');
    expect(formatState({ ...DEFAULT_STATE, subject: 'a fox' }, 'a lighthouse').prompt).toBe('a fox --ar 1:1');
  });
});

describe('history', () => {
  it('restores a legacy entry as plain text, so styles are not added twice', () => {
    const [entry] = migrateHistory([
      {
        id: 'old',
        prompt: 'portrait of an old fisherman, cyberpunk style --ar 16:9 --s 100',
        model: 'midjourney-v7',
        timestamp: '2026-01-01T00:00:00.000Z',
        pinned: true,
        favorite: true,
      },
    ]);
    expect(entry).toEqual({
      id: 'old',
      prompt: 'portrait of an old fisherman, cyberpunk style --ar 16:9 --s 100',
      state: {
        ...DEFAULT_STATE,
        subject: 'portrait of an old fisherman, cyberpunk style --ar 16:9 --s 100',
        format: 'midjourney',
      },
      timestamp: '2026-01-01T00:00:00.000Z',
      pinned: true,
    });
  });

  it('maps old models without a negative field to a sentence format', () => {
    const entries = migrateHistory([
      { id: 'a', prompt: 'x', model: 'dall-e', timestamp: '2026-01-01T00:00:00.000Z' },
      { id: 'b', prompt: 'y', model: 'leonardo', timestamp: '2026-01-01T00:00:00.000Z' },
    ]);
    expect(entries.map((entry) => entry.state.format)).toEqual(['chat', 'sdxl']);
  });

  it('keeps full snapshots and drops broken entries', () => {
    const snapshot: HistoryEntry = { id: 'n', prompt: 'p', state: filled, timestamp: '2026-10-16T00:00:00.000Z' };
    expect(migrateHistory([snapshot, null, { prompt: '' }, 42])).toEqual([{ ...snapshot, pinned: false }]);
    expect(migrateHistory('not an array')).toEqual([]);
  });

  it('moves a re-copied prompt to the top, keeps its pin and stays within the limit', () => {
    const make = (index: number, pinned = false): HistoryEntry => ({
      id: String(index),
      prompt: `prompt ${index}`,
      state: DEFAULT_STATE,
      timestamp: '2026-10-16T00:00:00.000Z',
      pinned,
    });
    const history = Array.from({ length: HISTORY_LIMIT }, (_, index) => make(index, index === 5));
    const next = addToHistory(history, { ...make(5), id: 'again' });
    expect(next).toHaveLength(HISTORY_LIMIT);
    expect(next[0]).toMatchObject({ id: 'again', prompt: 'prompt 5', pinned: true });
    expect(next.filter((entry) => entry.prompt === 'prompt 5')).toHaveLength(1);

    const added = addToHistory(history, { ...make(99) });
    expect(added).toHaveLength(HISTORY_LIMIT);
    expect(added.some((entry) => entry.pinned)).toBe(true);
  });
});
