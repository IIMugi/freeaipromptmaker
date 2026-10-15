import { describe, expect, it } from 'vitest';
import { FORMATS, formatPrompt, segmentsToText, type PromptInput } from '@/lib/prompt-format';

const input: Omit<PromptInput, 'format'> = {
  subject: ' an old fisherman mending nets. ',
  styles: ['oil painting', 'muted palette'],
  light: ['golden hour light', '85mm lens'],
  aspectRatio: '4:5',
  negative: ['blurry', 'extra fingers'],
  stylize: 250,
  chaos: 10,
};

describe('formatPrompt', () => {
  it('writes Midjourney keywords with real flags only', () => {
    const result = formatPrompt({ ...input, format: 'midjourney' });
    expect(result.prompt).toBe(
      'an old fisherman mending nets, oil painting, muted palette, golden hour light, 85mm lens --ar 4:5 --s 250 --chaos 10 --no blurry, extra fingers',
    );
    expect(result.negative).toBe('');
  });

  it('leaves out --s at the Midjourney default and --chaos at zero', () => {
    const result = formatPrompt({ ...input, format: 'midjourney', stylize: 100, chaos: 0, negative: [] });
    expect(result.prompt).toBe('an old fisherman mending nets, oil painting, muted palette, golden hour light, 85mm lens --ar 4:5');
  });

  it('gives SDXL a separate negative prompt and a native resolution, no flags', () => {
    const result = formatPrompt({ ...input, format: 'sdxl' });
    expect(result.prompt).toBe('an old fisherman mending nets, oil painting, muted palette, golden hour light, 85mm lens');
    expect(result.negative).toBe('blurry, extra fingers');
    expect(result.settings).toBe('Size: 896 × 1152');
    expect(result.prompt).not.toMatch(/--/);
  });

  it('writes Flux as a sentence and drops the negative', () => {
    const result = formatPrompt({ ...input, format: 'flux' });
    expect(result.prompt).toBe('An old fisherman mending nets, oil painting, muted palette, golden hour light, 85mm lens.');
    expect(result.negative).toBe('');
    expect(result.settings).toBe('Aspect ratio: 4:5 (set it in your app)');
  });

  it('writes ChatGPT / Gemini as a sentence with the format in words', () => {
    const result = formatPrompt({ ...input, format: 'chat' });
    expect(result.prompt).toBe(
      'An old fisherman mending nets, oil painting, muted palette, golden hour light, 85mm lens. Vertical 4:5 format.',
    );
    expect(result.prompt).not.toMatch(/--|negative/i);
  });

  it('produces a different prompt for every format', () => {
    const prompts = FORMATS.map((format) => formatPrompt({ ...input, format: format.id }).prompt);
    expect(new Set(prompts).size).toBe(FORMATS.length);
  });

  it.each(FORMATS.map((format) => format.id))('%s segments spell out exactly the prompt text', (format) => {
    const result = formatPrompt({ ...input, format });
    expect(segmentsToText(result.segments)).toBe(result.prompt);
    expect(segmentsToText(result.negativeSegments)).toBe(result.negative);
    expect(result.segments.find((segment) => segment.role === 'subject')?.text.toLowerCase()).toBe(
      'an old fisherman mending nets',
    );
  });

  it('marks each part with its role', () => {
    const { segments } = formatPrompt({ ...input, format: 'midjourney' });
    const roles = segments.filter((segment) => segment.role).map((segment) => [segment.role, segment.text]);
    expect(roles).toEqual([
      ['subject', 'an old fisherman mending nets'],
      ['style', 'oil painting'],
      ['style', 'muted palette'],
      ['light', 'golden hour light'],
      ['light', '85mm lens'],
      ['param', '--ar 4:5'],
      ['param', '--s 250'],
      ['param', '--chaos 10'],
      ['negative', '--no blurry, extra fingers'],
    ]);
  });

  it('returns nothing to copy without a subject', () => {
    for (const format of FORMATS) {
      const result = formatPrompt({ ...input, format: format.id, subject: '  ' });
      expect(result.prompt).toBe('');
      expect(result.segments).toEqual([]);
    }
  });

  it('ignores blank fragments', () => {
    const result = formatPrompt({ ...input, format: 'sdxl', styles: [' ', 'ink'], light: [''], negative: [' '] });
    expect(result.prompt).toBe('an old fisherman mending nets, ink');
    expect(result.negative).toBe('');
  });
});
