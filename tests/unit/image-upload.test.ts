import { describe, expect, it } from 'vitest';
import sharp from 'sharp';
import * as imageUpload from '@/lib/image-upload';
import { readBoundedRequestBody, validateImageBytes } from '@/lib/image-upload.server';

const {
  detectImageType,
  validateImageGeometry,
} = imageUpload;

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

describe('image geometry', () => {
  it('rejects missing, excessive, or decompression-bomb dimensions', () => {
    expect(validateImageGeometry({ width: 1, height: 1 })).toBe(true);
    expect(validateImageGeometry({ width: 12001, height: 1 })).toBe(false);
    expect(validateImageGeometry({ width: 10000, height: 5000 })).toBe(false);
    expect(validateImageGeometry({ width: undefined, height: 10 })).toBe(false);
  });
});

describe('decoded image validation', () => {
  it.each([
    ['png', 'image/png'],
    ['jpeg', 'image/jpeg'],
    ['webp', 'image/webp'],
  ] as const)('accepts a real %s and returns decoded dimensions', async (format, mimeType) => {
    const pipeline = sharp({
      create: { width: 2, height: 3, channels: 3, background: '#ffffff' },
    });
    const bytes = new Uint8Array(await pipeline[format]().toBuffer());

    await expect(validateImageBytes(bytes, mimeType)).resolves.toEqual({
      ok: true,
      mimeType,
      width: 2,
      height: 3,
    });
  });

  it('rejects corrupt content even when its signature is allowed', async () => {
    const bytes = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    await expect(validateImageBytes(bytes, 'image/png')).resolves.toEqual({
      ok: false,
      code: 'invalid_image_data',
    });
  });

  it('rejects a partial file whose metadata header alone is readable', async () => {
    const valid = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAADElEQVR4nGP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC',
      'base64',
    );
    const headerReadableButUndecodable = new Uint8Array(valid.subarray(0, 70));

    await expect(validateImageBytes(headerReadableButUndecodable, 'image/png')).resolves.toEqual({
      ok: false,
      code: 'invalid_image_data',
    });
  });
});

describe('bounded request reads', () => {
  it('stops a chunked request as soon as the byte limit is exceeded', async () => {
    const request = new Request('http://localhost/upload', {
      method: 'POST',
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(Uint8Array.from([1, 2, 3]));
          controller.enqueue(Uint8Array.from([4, 5, 6]));
          controller.close();
        },
      }),
      // Required by Node for a streaming request body; browsers omit it.
      duplex: 'half',
    } as RequestInit & { duplex: 'half' });

    await expect(readBoundedRequestBody(request, 5)).resolves.toBeNull();
  });
});
