import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';

describe('sitemap', () => {
  it('excludes every guide that has not been verified', () => {
    const blogArticles = sitemap().filter(({ url }) => url.includes('/blog/'));
    expect(blogArticles).toEqual([]);
  });

  it('does not invent build-time modification dates', () => {
    const generatedAt = new Date().toISOString().slice(0, 10);
    const unknownDates = sitemap().filter(({ lastModified }) =>
      String(lastModified || '').startsWith(generatedAt),
    );
    expect(unknownDates).toEqual([]);
  });
});
