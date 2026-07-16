import { describe, expect, it } from 'vitest';
import { permanentRedirects } from '@/data/redirects';
import { GET as removedKeywordRoute } from '@/app/blog/2026-02-05-ai-art-reference-guide-inspiration-prompts/keyword/route';

describe('URL decisions', () => {
  it('uses unique one-hop permanent redirects', () => {
    expect(permanentRedirects).toContainEqual({
      source: '/flux-pro',
      destination: '/prompt-generators',
    });
    expect(permanentRedirects).toContainEqual({
      source: '/blog/2025-11-27-stable-diffusion-negative-prompts-guide',
      destination: '/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
    });
    expect(new Set(permanentRedirects.map((item) => item.source)).size).toBe(
      permanentRedirects.length,
    );
    const sources = new Set<string>(permanentRedirects.map((item) => item.source));
    expect(permanentRedirects.some((item) => sources.has(item.destination))).toBe(false);
  });

  it('returns 410 for the accidental nested keyword URL', async () => {
    expect((await removedKeywordRoute()).status).toBe(410);
  });
});
