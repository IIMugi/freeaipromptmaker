import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';

describe('sitemap', () => {
  it('includes only guides that have been verified', () => {
    const blogArticles = sitemap().filter(({ url }) => url.includes('/blog/'));
    expect(blogArticles.map(({ url }) => url)).toEqual([
      'https://freeaipromptmaker.com/blog/2026-02-22-master-leonardo-ai-negative-prompts',
      'https://freeaipromptmaker.com/blog/2026-02-13-best-stable-diffusion-extensions',
      'https://freeaipromptmaker.com/blog/2026-02-09-master-leonardo-ai-models',
      'https://freeaipromptmaker.com/blog/2026-01-25-stable-diffusion-wildcards-guide',
      'https://freeaipromptmaker.com/blog/2026-01-04-stable-diffusion-regional-prompting-guide',
      'https://freeaipromptmaker.com/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
      'https://freeaipromptmaker.com/blog/2025-11-27-midjourney-v6-complete-prompt-guide',
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
