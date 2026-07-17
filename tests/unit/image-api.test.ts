// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GoogleGenAI } from '@google/genai';
import {
  POST,
  consumeRateLimit,
  maxRateLimitEntries,
  maxRequestsPerWindow,
  rateWindowMs,
  resetRateLimitStoreForTests,
  rateLimitStoreSizeForTests,
} from '@/app/api/image-to-prompt/route';
import { MAX_IMAGE_FILE_SIZE } from '@/lib/image-upload';

const generateContent = vi.fn();

vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn(),
}));

function imageRequest(bytes: number[], type = 'image/png', name = 'private-name.png') {
  const formData = new FormData();
  formData.set('image', new File([Uint8Array.from(bytes)], name, { type }));
  return new Request('http://localhost/api/image-to-prompt', { method: 'POST', body: formData });
}

const pngBytes = [...Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAADElEQVR4nGP4//8/AAX+Av4N70a4AAAAAElFTkSuQmCC',
  'base64',
)];
const truncatedPngBytes = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

describe('image analysis API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetRateLimitStoreForTests();
    for (const key of Object.keys(process.env)) {
      if (key.startsWith('GEMINI_API_KEY')) delete process.env[key];
    }
    vi.mocked(GoogleGenAI).mockImplementation(function MockGoogleGenAI() {
      return { models: { generateContent } } as unknown as GoogleGenAI;
    });
  });

  it('returns 429 after the bounded per-client allowance', () => {
    const now = 1_000;
    for (let count = 0; count < maxRequestsPerWindow; count += 1) {
      expect(consumeRateLimit('bounded-client', now).allowed).toBe(true);
    }
    const rejected = consumeRateLimit('bounded-client', now);
    expect(rejected.allowed).toBe(false);
    expect(rejected.retryAfterSeconds).toBe(Math.ceil(rateWindowMs / 1000));
  });

  it('expires old entries and admits the client in a new window', () => {
    consumeRateLimit('expiring-client', 1_000);
    const renewed = consumeRateLimit('expiring-client', 1_000 + rateWindowMs);
    expect(renewed.allowed).toBe(true);
    expect(renewed.remaining).toBe(maxRequestsPerWindow - 1);
  });

  it('caps unique-client state and evicts old entries', () => {
    for (let index = 0; index < maxRateLimitEntries + 25; index += 1) {
      consumeRateLimit(`client-${index}`, 1_000);
    }
    expect(rateLimitStoreSizeForTests()).toBe(maxRateLimitEntries);
  });

  it('fails closed when analysis is not configured', async () => {
    const response = await POST(imageRequest(pngBytes));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ code: 'analysis_unavailable' });
  });

  it('rejects bytes that do not match the declared image type', async () => {
    const response = await POST(imageRequest([1, 2, 3, 4]));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ code: 'invalid_image_signature' });
  });

  it('rejects a truncated file with a valid signature before calling the provider', async () => {
    process.env.GEMINI_API_KEY = 'test-key';

    const response = await POST(imageRequest(truncatedPngBytes));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ code: 'invalid_image_data' });
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('rejects an oversized multipart request before parsing it', async () => {
    const request = imageRequest(pngBytes);
    request.headers.set('content-length', String(MAX_IMAGE_FILE_SIZE + 1024 * 1024));

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ code: 'image_too_large' });
    expect(generateContent).not.toHaveBeenCalled();
  });

  it('returns a bounded provider failure', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    generateContent.mockRejectedValueOnce(new Error('secret provider detail'));
    const response = await POST(imageRequest(pngBytes));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ code: 'analysis_provider_error' });
  });

  it('rejects invalid provider JSON instead of inventing output', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    generateContent.mockResolvedValueOnce({ text: 'not-json' });
    const response = await POST(imageRequest(pngBytes));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ code: 'invalid_provider_response' });
  });

  it('returns only normalized provider output on success', async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    generateContent.mockResolvedValueOnce({
      text: JSON.stringify({
        styleDna: {
          subject: 'A red fox',
          lighting: 'Soft daylight',
          lens: '50mm',
          mood: 'Quiet',
          palette: 'Rust and green',
          styleTags: ['editorial'],
        },
        prompt: 'A red fox in soft daylight',
        negativePrompt: 'blur',
        remixes: ['A red fox at dusk'],
      }),
    });
    const response = await POST(imageRequest(pngBytes));
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.data.prompt).toBe('A red fox in soft daylight');
    expect(JSON.stringify(payload)).not.toMatch(/degraded|private-name/);
  });
});
