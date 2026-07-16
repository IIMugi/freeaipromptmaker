import { describe, expect, it } from 'vitest';
import { buildPrompt, getModelInfo } from '@/lib/prompt-builder';

describe('prompt formatting', () => {
  it('formats Midjourney syntax deterministically', () => {
    const config = {
      model: 'midjourney-v7' as const,
      mainConcept: 'quiet red fox portrait',
      styles: ['editorial photography'],
      aspectRatio: '4:5',
      stylize: 150,
      chaos: 0,
      negativePrompt: 'text, watermark',
    };
    expect(buildPrompt(config)).toBe(buildPrompt(config));
    expect(buildPrompt(config)).toContain('--ar 4:5');
    expect(buildPrompt(config)).toContain('--no text, watermark');
  });

  it('does not add unsupported negative syntax to natural-language models', () => {
    expect(
      buildPrompt({
        model: 'dall-e',
        mainConcept: 'quiet red fox portrait',
        styles: [],
        negativePrompt: 'text, watermark',
      }),
    ).toBe('quiet red fox portrait');
    expect(getModelInfo('dall-e')?.supportsNegative).toBe(false);
  });

  it('keeps Flux parameters out of prompt text', () => {
    const prompt = buildPrompt({
      model: 'flux',
      mainConcept: 'quiet red fox portrait',
      styles: [],
      aspectRatio: '4:5',
      negativePrompt: 'text, watermark',
    });
    expect(prompt).toBe('quiet red fox portrait');
    expect(getModelInfo('flux')?.supportsNegative).toBe(false);
  });

  it('returns no prompt until a concept exists', () => {
    expect(buildPrompt({ model: 'flux', mainConcept: ' ', styles: [] })).toBe('');
  });
});
