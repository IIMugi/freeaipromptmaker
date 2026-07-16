import { describe, expect, it } from 'vitest';
import { canonicalUrl, websiteJsonLd } from '@/lib/seo';

describe('SEO contracts', () => {
  it('builds canonical URLs without duplicate slashes', () => {
    expect(canonicalUrl('/blog/example')).toBe('https://freeaipromptmaker.com/blog/example');
    expect(canonicalUrl('blog/example')).toBe('https://freeaipromptmaker.com/blog/example');
  });

  it('never emits unsupported ratings or offers', () => {
    const json = JSON.stringify(websiteJsonLd());
    expect(json).not.toMatch(/AggregateRating|ratingValue|ratingCount|Offer/);
  });
});
