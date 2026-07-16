import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { detectImageType, MAX_IMAGE_FILE_SIZE } from '@/lib/image-upload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

const rateWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 20;
const globalForRateLimit = globalThis as typeof globalThis & {
  __imageToPromptRateStore?: Map<string, RateLimitState>;
};
const rateStore = globalForRateLimit.__imageToPromptRateStore ?? new Map<string, RateLimitState>();
globalForRateLimit.__imageToPromptRateStore = rateStore;

function getClientIdentifier(request: Request) {
  const raw =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'anonymous';
  return raw.replace(/[^a-zA-Z0-9:.\-]/g, '').slice(0, 120) || 'anonymous';
}

function consumeRateLimit(clientId: string): RateLimitResult {
  const now = Date.now();
  const existing = rateStore.get(clientId);
  if (!existing || existing.resetAt <= now) {
    const next = { count: 1, resetAt: now + rateWindowMs };
    rateStore.set(clientId, next);
    return {
      allowed: true,
      retryAfterSeconds: 0,
      remaining: maxRequestsPerWindow - 1,
      limit: maxRequestsPerWindow,
      resetAt: next.resetAt,
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
  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: maxRequestsPerWindow - existing.count,
    limit: maxRequestsPerWindow,
    resetAt: existing.resetAt,
  };
}

function responseHeaders(rateLimit: RateLimitResult) {
  return {
    'Cache-Control': 'no-store, max-age=0',
    'X-RateLimit-Limit': String(rateLimit.limit),
    'X-RateLimit-Remaining': String(Math.max(0, rateLimit.remaining)),
    'X-RateLimit-Reset': String(Math.floor(rateLimit.resetAt / 1000)),
  };
}

function json(payload: Record<string, unknown>, status: number, rateLimit: RateLimitResult) {
  return NextResponse.json(payload, { status, headers: responseHeaders(rateLimit) });
}

function getGeminiKey() {
  const keys = [
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
  return keys.find((key) => typeof key === 'string' && key.trim())?.trim() || null;
}

function parseJson(raw: string) {
  const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(cleaned) as unknown;
  } catch {
    return null;
  }
}

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function strings(value: unknown, max: number) {
  if (!Array.isArray(value)) return null;
  const normalized = value
    .filter((item): item is string => typeof item === 'string' && Boolean(item.trim()))
    .map((item) => item.trim())
    .slice(0, max);
  return normalized.length ? normalized : null;
}

function normalizeResult(value: unknown): ReversePromptResult | null {
  if (!value || typeof value !== 'object') return null;
  const source = value as Record<string, unknown>;
  if (!source.styleDna || typeof source.styleDna !== 'object') return null;
  const style = source.styleDna as Record<string, unknown>;

  const result = {
    styleDna: {
      subject: text(style.subject),
      lighting: text(style.lighting),
      lens: text(style.lens),
      mood: text(style.mood),
      palette: text(style.palette),
      styleTags: strings(style.styleTags, 8),
    },
    prompt: text(source.prompt),
    negativePrompt: text(source.negativePrompt),
    remixes: strings(source.remixes, 3),
  };

  if (
    !result.styleDna.subject ||
    !result.styleDna.lighting ||
    !result.styleDna.lens ||
    !result.styleDna.mood ||
    !result.styleDna.palette ||
    !result.styleDna.styleTags ||
    !result.prompt ||
    !result.negativePrompt ||
    !result.remixes
  ) {
    return null;
  }
  return result as ReversePromptResult;
}

export async function POST(request: Request) {
  const rateLimit = consumeRateLimit(getClientIdentifier(request));
  if (!rateLimit.allowed) {
    const response = json({ code: 'rate_limit_exceeded' }, 429, rateLimit);
    response.headers.set('Retry-After', String(rateLimit.retryAfterSeconds));
    return response;
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ code: 'invalid_request' }, 400, rateLimit);
  }

  const input = formData.get('image');
  if (!(input instanceof File)) return json({ code: 'image_required' }, 400, rateLimit);
  if (input.size > MAX_IMAGE_FILE_SIZE) return json({ code: 'image_too_large' }, 400, rateLimit);

  const bytes = new Uint8Array(await input.arrayBuffer());
  const detectedType = detectImageType(bytes);
  if (!detectedType || detectedType !== input.type) {
    return json({ code: 'invalid_image_signature' }, 400, rateLimit);
  }

  const apiKey = getGeminiKey();
  if (!apiKey) return json({ code: 'analysis_unavailable' }, 503, rateLimit);

  try {
    const ai = new GoogleGenAI({ apiKey });
    const providerResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { inlineData: { data: Buffer.from(bytes).toString('base64'), mimeType: detectedType } },
        `Analyze the image and return only JSON matching this schema:
{"styleDna":{"subject":"","lighting":"","lens":"","mood":"","palette":"","styleTags":[""]},"prompt":"","negativePrompt":"","remixes":[""]}`,
      ],
      config: {
        temperature: 0.4,
        maxOutputTokens: 900,
        responseMimeType: 'application/json',
      },
    });
    const result = normalizeResult(parseJson(providerResponse.text || ''));
    if (!result) return json({ code: 'invalid_provider_response' }, 502, rateLimit);
    return json({ data: result }, 200, rateLimit);
  } catch {
    return json({ code: 'analysis_provider_error' }, 502, rateLimit);
  }
}
