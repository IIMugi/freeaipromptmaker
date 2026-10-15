import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import { getEditorialRecords } from '@/lib/editorial';

const blogPrefix = 'https://freeaipromptmaker.com/blog/';
const records = getEditorialRecords();

describe('sitemap', () => {
  it('includes only guides that have been verified', () => {
    const blogSlugs = sitemap()
      .filter(({ url }) => url.startsWith(blogPrefix))
      .map(({ url }) => url.slice(blogPrefix.length));
    const verifiedSlugs = Object.entries(records)
      .filter(([, record]) => record.state === 'verified')
      .map(([slug]) => slug);

    expect(blogSlugs.sort()).toEqual(verifiedSlugs.sort());
  });

  it('does not invent build-time modification dates', () => {
    const entries = sitemap();
    expect(entries.find(({ url }) => url === 'https://freeaipromptmaker.com/')?.lastModified).toBeUndefined();
    for (const { url, lastModified } of entries.filter(({ url }) => url.startsWith(blogPrefix))) {
      expect(lastModified).toBe(records[url.slice(blogPrefix.length)].lastVerified);
    }
  });
});
