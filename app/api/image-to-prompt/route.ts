import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const maxFileSize = 8 * 1024 * 1024;
const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
const rateWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 20;
const rateLimitCleanupThreshold = 500;

interface ReversePromptResult {
  styleDna: {
    subject: string;
    lighting: string;
    lens: string;
    mood: string;
    palette: string;
    styleTags: string[];
  };
  prompt: string;
  negativePrompt: string;
  remixes: string[];
}

interface RateLimitState {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
  limit: number;
  resetAt: number;
}

const globalForRateLimit = globalThis as typeof globalThis & {
  __imageToPromptRateStore?: Map<string, RateLimitState>;
};

const rateStore = globalForRateLimit.__imageToPromptRateStore ?? new Map<string, RateLimitState>();
if (!globalForRateLimit.__imageToPromptRateStore) {
  globalForRateLimit.__imageToPromptRateStore = rateStore;
}

function getClientIdentifier(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfIp = request.headers.get('cf-connecting-ip');

  const raw = forwardedFor?.split(',')[0]?.trim() || realIp || cfIp || 'anonymous';
  return raw.replace(/[^a-zA-Z0-9:.\-]/g, '').slice(0, 120) || 'anonymous';
}

function consumeRateLimit(clientId: string): RateLimitResult {
  const now = Date.now();

  if (rateStore.size > rateLimitCleanupThreshold) {
    for (const [key, entry] of rateStore.entries()) {
      if (entry.resetAt <= now) rateStore.delete(key);
    }
  }

  const existing = rateStore.get(clientId);

  if (!existing || existing.resetAt <= now) {
    const nextState: RateLimitState = {
      count: 1,
      resetAt: now + rateWindowMs,
    };
    rateStore.set(clientId, nextState);

    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: maxRequestsPerWindow - 1,
      limit: maxRequestsPerWindow,
      resetAt: nextState.resetAt,
    };
  }

  if (existing.count >= maxRequestsPerWindow) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
      remaining: 0,
      limit: maxRequestsPerWindow,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  rateStore.set(clientId, existing);

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: maxRequestsPerWindow - existing.count,
    limit: maxRequestsPerWindow,
    resetAt: existing.resetAt,
  };
}

function buildHeaders(rateLimit: RateLimitResult, retryAfterSeconds?: number) {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, max-age=0');
  headers.set('X-RateLimit-Limit', String(rateLimit.limit));
  headers.set('X-RateLimit-Remaining', String(Math.max(0, rateLimit.remaining)));
  headers.set('X-RateLimit-Reset', String(Math.floor(rateLimit.resetAt / 1000)));

  if (retryAfterSeconds && retryAfterSeconds > 0) {
    headers.set('Retry-After', String(retryAfterSeconds));
  }

  return headers;
}

function jsonResponse(
  payload: Record<string, unknown>,
  status: number,
  rateLimit: RateLimitResult,
  retryAfterSeconds?: number
) {
  return NextResponse.json(payload, {
    status,
    headers: buildHeaders(rateLimit, retryAfterSeconds),
  });
}

function createFallbackResult(fileName: string): ReversePromptResult {
  const inferredSubject =
    fileName
      .replace(/\.[a-z0-9]+$/i, '')
      .replace(/[-_]+/g, ' ')
      .trim() || 'reference image subject';

  const basePrompt = `${inferredSubject}, cinematic composition, high detail, controlled lighting, clean background`;

  return {
    styleDna: {
      subject: inferredSubject,
      lighting: 'Soft directional lighting',
      lens: '50mm style framing',
      mood: 'Polished cinematic mood',
      palette: 'Cool highlights with deep contrast',
      styleTags: ['cinematic', 'clean', 'high-detail'],
    },
    prompt: basePrompt,
    negativePrompt: 'blurry, low detail, noisy artifacts, warped anatomy, watermark, text',
    remixes: [
      `${basePrompt}, moody low-key variation`,
      `${basePrompt}, bright editorial variation`,
      `${basePrompt}, minimal background variation`,
    ],
  };
}

function getGeminiKey(): string | null {
  const envKeys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4,
    process.env.GEMINI_API_KEY_5,
    process.env.GEMINI_API_KEY_6,
    process.env.GEMINI_API_KEY_7,
    process.env.GEMINI_API_KEY_8,
    process.env.GEMINI_API_KEY_9,
    process.env.GEMINI_API_KEY_10,
  ];

  for (const key of envKeys) {
    if (typeof key === 'string' && key.trim().length > 0) {
      return key.trim();
    }
  }

  return null;
}

function parseJsonPayload(raw: string): unknown {
  const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
      return null;
    }
    const candidate = cleaned.slice(start, end + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      return null;
    }
  }
}

function toSafeString(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : fallback;
}

function normalizeResult(value: unknown): ReversePromptResult | null {
  if (!value || typeof value !== 'object') return null;
  const source = value as Record<string, unknown>;
  const styleSource =
    source.styleDna && typeof source.styleDna === 'object'
      ? (source.styleDna as Record<string, unknown>)
      : {};

  const styleTags = Array.isArray(styleSource.styleTags)
    ? styleSource.styleTags.filter((item): item is string => typeof item === 'string').slice(0, 8)
    : [];

  const remixes = Array.isArray(source.remixes)
    ? source.remixes.filter((item): item is string => typeof item === 'string').slice(0, 3)
    : [];

  const normalized: ReversePromptResult = {
    styleDna: {
      subject: toSafeString(styleSource.subject, 'Primary subject not detected'),
      lighting: toSafeString(styleSource.lighting, 'Neutral lighting'),
      lens: toSafeString(styleSource.lens, 'Natural perspective'),
      mood: toSafeString(styleSource.mood, 'Balanced'),
      palette: toSafeString(styleSource.palette, 'Neutral color palette'),
      styleTags,
    },
    prompt: toSafeString(source.prompt, ''),
    negativePrompt: toSafeString(source.negativePrompt, 'blurry, low detail, artifacting'),
    remixes,
  };

  if (!normalized.prompt) return null;
  if (normalized.remixes.length === 0) {
    normalized.remixes = [
      `${normalized.prompt}, dramatic lighting variation`,
      `${normalized.prompt}, cinematic composition variation`,
      `${normalized.prompt}, minimal clean background variation`,
    ];
  }
  if (normalized.styleDna.styleTags.length === 0) {
    normalized.styleDna.styleTags = ['cinematic', 'detailed', 'high contrast'];
  }

  return normalized;
}

export async function POST(request: Request) {
  const clientId = getClientIdentifier(request);
  const rateLimit = consumeRateLimit(clientId);

  if (!rateLimit.allowed) {
    return jsonResponse(
      {
        error: 'Rate limit exceeded. Please wait before sending more images.',
      },
      429,
      rateLimit,
      rateLimit.retryAfterSeconds
    );
  }

  try {
    const formData = await request.formData();
    const input = formData.get('image');

    if (!(input instanceof File)) {
      return jsonResponse({ error: 'Image file is required.' }, 400, rateLimit);
    }

    if (!allowedMimeTypes.has(input.type)) {
      return jsonResponse(
        { error: 'Unsupported file type. Use PNG, JPG, or WEBP.' },
        400,
        rateLimit
      );
    }

    if (input.size > maxFileSize) {
      return jsonResponse({ error: 'Image is too large. Max size is 8MB.' }, 400, rateLimit);
    }

    const apiKey = getGeminiKey();
    if (!apiKey) {
      return jsonResponse(
        {
          data: createFallbackResult(input.name),
          degraded: true,
          reason: 'missing_api_key',
        },
        200,
        rateLimit
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const bytes = Buffer.from(await input.arrayBuffer()).toString('base64');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: bytes,
            mimeType: input.type,
          },
        },
        `Analyze this image and output strict JSON only.
Schema:
{
  "styleDna": {
    "subject": "short string",
    "lighting": "short string",
    "lens": "short string",
    "mood": "short string",
    "palette": "short string",
    "styleTags": ["tag1", "tag2", "tag3"]
  },
  "prompt": "single production-ready image prompt",
  "negativePrompt": "comma separated artifacts to avoid",
  "remixes": ["variation one", "variation two", "variation three"]
}
Rules:
- Keep each field concise.
- Prompt must be ready for Midjourney/Flux/DALL-E style tools.
- Return only JSON and no markdown.`,
      ],
      config: {
        temperature: 0.4,
        maxOutputTokens: 900,
        responseMimeType: 'application/json',
      },
    });

    const raw = response.text || '';
    const parsed = normalizeResult(parseJsonPayload(raw));

    if (!parsed) {
      return jsonResponse(
        {
          data: createFallbackResult(input.name),
          degraded: true,
          reason: 'invalid_model_payload',
        },
        200,
        rateLimit
      );
    }

    return jsonResponse({ data: parsed }, 200, rateLimit);
  } catch (error) {
    console.error('[api/image-to-prompt]', error);
    const fallback = createFallbackResult('uploaded-image');
    return jsonResponse(
      {
        data: fallback,
        degraded: true,
        reason: 'model_request_failed',
      },
      200,
      rateLimit
    );
  }
}
