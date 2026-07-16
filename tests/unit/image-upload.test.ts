import { describe, expect, it } from 'vitest';
import { detectImageType } from '@/lib/image-upload';

describe('image signatures', () => {
  it('detects supported bytes independent of the declared MIME type', () => {
    expect(
      detectImageType(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    ).toBe('image/png');
    expect(detectImageType(Uint8Array.from([0xff, 0xd8, 0xff]))).toBe('image/jpeg');
  });

  it('rejects arbitrary bytes', () => {
    expect(detectImageType(new TextEncoder().encode('not-an-image'))).toBeNull();
  });
});
