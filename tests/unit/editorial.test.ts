import { describe, expect, it } from 'vitest';
import { getEditorialPolicy } from '@/lib/editorial';

describe('editorial policy', () => {
  it('indexes only verified content', () => {
    expect(getEditorialPolicy('verified')).toEqual({ index: true, inSitemap: true, inHub: true });
    expect(getEditorialPolicy('needs-review')).toEqual({ index: false, inSitemap: false, inHub: false });
    expect(getEditorialPolicy('archived')).toEqual({ index: false, inSitemap: false, inHub: false });
  });
});
