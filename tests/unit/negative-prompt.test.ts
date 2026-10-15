import { describe, expect, it } from 'vitest';
import {
  NEGATIVE_CATEGORIES,
  NEGATIVE_MODELS,
  buildNegativePrompt,
  type NegativeModelId,
} from '@/lib/negative-prompt';

describe('buildNegativePrompt', () => {
  it('starts SDXL from the short starter list', () => {
    const result = buildNegativePrompt('sdxl', []);
    expect(result.supported).toBe(true);
    expect(result.text).toBe(
      'lowres, blurry, jpeg artifacts, watermark, signature, text, deformed, bad anatomy, extra fingers, cropped, out of frame',
    );
  });

  it('uses the Illustrious XL model card list as the base', () => {
    expect(buildNegativePrompt('illustrious', []).text).toMatch(/^worst quality, comic, multiple views/);
  });

  it('adds categories after the base list without repeating terms', () => {
    const result = buildNegativePrompt('sdxl', ['photo', 'text']);
    expect(result.terms).toContain('cartoon');
    expect(result.terms).toContain('caption');
    expect(new Set(result.terms).size).toBe(result.terms.length);
    expect(result.terms.indexOf('lowres')).toBeLessThan(result.terms.indexOf('cartoon'));
  });

  it('keeps the category order stable regardless of selection order', () => {
    expect(buildNegativePrompt('sd15', ['text', 'photo']).text).toBe(buildNegativePrompt('sd15', ['photo', 'text']).text);
  });

  it('ignores unknown category ids', () => {
    expect(buildNegativePrompt('sdxl', ['nope' as never]).text).toBe(buildNegativePrompt('sdxl', []).text);
  });

  it('leaves Pony empty by default and explains why', () => {
    const result = buildNegativePrompt('pony', []);
    expect(result.supported).toBe(true);
    expect(result.text).toBe('');
    expect(result.note).toMatch(/score_9/);
  });

  it('formats Midjourney as a --no parameter', () => {
    const result = buildNegativePrompt('midjourney', ['text']);
    expect(result.text.startsWith('--no ')).toBe(true);
    expect(result.text).toContain('watermark');
    expect(buildNegativePrompt('midjourney', []).text).toBe('');
  });

  it('reports Flux as unsupported with no list', () => {
    const result = buildNegativePrompt('flux', ['photo', 'text']);
    expect(result.supported).toBe(false);
    expect(result.text).toBe('');
    expect(result.note).toMatch(/describe/i);
  });

  it('defines every model and category it offers', () => {
    const ids: NegativeModelId[] = ['sd15', 'sdxl', 'illustrious', 'pony', 'leonardo', 'midjourney', 'flux'];
    expect(NEGATIVE_MODELS.map((model) => model.id)).toEqual(ids);
    for (const category of NEGATIVE_CATEGORIES) {
      expect(category.terms.length).toBeGreaterThan(0);
      expect(category.terms.every((term) => term === term.trim() && term.length > 0 && !term.includes(','))).toBe(true);
    }
  });
});
