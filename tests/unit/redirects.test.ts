import { describe, expect, it } from 'vitest';
import { permanentRedirects } from '@/data/redirects';
import { GET as removedKeywordRoute } from '@/app/blog/2026-02-05-ai-art-reference-guide-inspiration-prompts/keyword/route';
import nextConfig from '@/next.config';

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

  it('orders combined www and legacy redirects before generic redirects', async () => {
    const redirects = await nextConfig.redirects!();
    const combined = redirects.findIndex(
      (rule) =>
        rule.source === '/flux-pro' &&
        rule.destination === 'https://freeaipromptmaker.com/prompt-generators' &&
        rule.has?.some((condition) => condition.type === 'host'),
    );
    const legacy = redirects.findIndex(
      (rule) => rule.source === '/flux-pro' && rule.destination === '/prompt-generators',
    );
    const genericHost = redirects.findIndex(
      (rule) => rule.source === '/:path*' && rule.has?.some((condition) => condition.type === 'host'),
    );

    expect(combined).toBeGreaterThanOrEqual(0);
    expect(combined).toBeLessThan(legacy);
    expect(combined).toBeLessThan(genericHost);
  });
});
