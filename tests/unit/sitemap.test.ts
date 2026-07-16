import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';

describe('sitemap', () => {
  it('includes only guides that have been verified', () => {
    const blogArticles = sitemap().filter(({ url }) => url.includes('/blog/'));
    expect(blogArticles.map(({ url }) => url)).toEqual([
      'https://freeaipromptmaker.com/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
    ]);
  });

  it('does not invent build-time modification dates', () => {
    const entries = sitemap();
    expect(entries.find(({ url }) => url === 'https://freeaipromptmaker.com/')?.lastModified).toBeUndefined();
    expect(
      entries.find(({ url }) => url.endsWith('/2025-11-29-stable-diffusion-negative-prompts-guide'))?.lastModified,
    ).toBe('2026-07-16');
  });
});
