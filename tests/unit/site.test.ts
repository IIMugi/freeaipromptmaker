import { describe, expect, it } from 'vitest';
import { READINESS, SITE } from '@/lib/site';

describe('site facts', () => {
  it('contains only supported publisher facts', () => {
    expect(SITE.origin).toBe('https://freeaipromptmaker.com');
    expect(SITE.social.github).toBe('https://github.com/IIMugi/freeaipromptmaker');
    expect(JSON.stringify(SITE)).not.toMatch(/100,?000|50,?000|4\.9|2847|since 2022/i);
  });

  it('ships readiness advertising disabled', () => {
    expect(READINESS.adsEnabled).toBe(false);
  });
});
