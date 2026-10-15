import { describe, expect, it } from 'vitest';
import { buildUseCasePrompt, defaultSelections, SDXL_SIZES, type UseCaseBuilderConfig } from '@/lib/use-case-prompt';

const config: UseCaseBuilderConfig = {
  subjectLabel: 'Subject',
  defaultSubject: 'a knight',
  tag: 'pixel art',
  sentence: 'Pixel art of',
  groups: [
    {
      id: 'view',
      label: 'View',
      multiple: false,
      options: [
        { id: 'side', label: 'Side', value: 'side view' },
        { id: 'iso', label: 'Isometric', value: 'isometric view' },
      ],
    },
    {
      id: 'extras',
      label: 'Extras',
      multiple: true,
      options: [
        { id: 'outline', label: 'Outline', value: 'clean dark outlines' },
        { id: 'tile', label: 'Tile', value: 'seamless tileable' },
      ],
    },
  ],
  defaults: { view: ['side', 'missing'], extras: ['outline'] },
  aspectRatios: ['1:1', '16:9'],
  negatives: ['blurry', 'smooth gradients'],
  midjourneyNo: ['blur', 'gradient'],
};

const base = {
  subject: '  a knight   with a blue cape. ',
  selections: { view: ['side'], extras: ['outline', 'tile'] },
  aspectRatio: '16:9' as const,
  avoid: true,
};

describe('buildUseCasePrompt', () => {
  it('formats Midjourney with --ar and single-word --no', () => {
    const result = buildUseCasePrompt(config, { ...base, model: 'midjourney' });
    expect(result.prompt).toBe(
      'pixel art, a knight with a blue cape, side view, clean dark outlines, seamless tileable --ar 16:9 --no blur, gradient',
    );
    expect(result.negative).toBe('');
  });

  it('drops --no when the negative toggle is off', () => {
    const result = buildUseCasePrompt(config, { ...base, model: 'midjourney', avoid: false });
    expect(result.prompt).not.toContain('--no');
    expect(result.prompt.endsWith('--ar 16:9')).toBe(true);
  });

  it('puts the SDXL negative in its own field with an SDXL resolution', () => {
    const result = buildUseCasePrompt(config, { ...base, model: 'sdxl' });
    expect(result.prompt).toBe('pixel art, a knight with a blue cape, side view, clean dark outlines, seamless tileable');
    expect(result.negative).toBe('blurry, smooth gradients');
    expect(result.settings).toBe(`Size: ${SDXL_SIZES['16:9']}`);
  });

  it('writes a sentence without a negative for Flux and chat models', () => {
    const flux = buildUseCasePrompt(config, { ...base, model: 'flux' });
    expect(flux.prompt).toBe('Pixel art of a knight with a blue cape, side view, clean dark outlines, seamless tileable.');
    expect(flux.negative).toBe('');
    expect(flux.note).toMatch(/no standard negative prompt/i);

    const chat = buildUseCasePrompt(config, { ...base, model: 'chat' });
    expect(chat.prompt).toBe(
      'Pixel art of a knight with a blue cape, side view, clean dark outlines, seamless tileable. Wide 16:9 landscape format.',
    );
    expect(chat.negative).toBe('');
  });

  it('returns nothing to copy for an empty subject', () => {
    const result = buildUseCasePrompt(config, { ...base, subject: '   ', model: 'midjourney' });
    expect(result.prompt).toBe('');
    expect(result.negative).toBe('');
  });

  it('ignores selections that are not options of the group', () => {
    const result = buildUseCasePrompt(config, { ...base, model: 'sdxl', selections: { view: ['nope'] } });
    expect(result.prompt).toBe('pixel art, a knight with a blue cape');
  });

  it('builds default selections only from existing options', () => {
    expect(defaultSelections(config)).toEqual({ view: ['side'], extras: ['outline'] });
  });
});
