import { readConsent } from '@/lib/consent';
import type { AIModel } from '@/lib/prompt-builder';

export type AnalyticsModel = AIModel | 'other';

export type ProductEventMap = {
  prompt_generated: { model: AnalyticsModel };
  prompt_copy_succeeded: {
    model: AnalyticsModel;
    variant: 'prompt' | 'with-negative' | 'json';
  };
  prompt_copy_failed: {
    model: AnalyticsModel;
    variant: 'prompt' | 'with-negative' | 'json';
  };
  image_upload_rejected: { reason: 'size' | 'type' | 'signature' };
  image_analysis_succeeded: Record<string, never>;
  image_analysis_failed: { reason: 'unavailable' | 'provider' | 'validation' };
};

type GtagWindow = Window & {
  gtag?: (command: 'event', name: string, params: Record<string, string>) => void;
};

const copyVariants = new Set(['prompt', 'with-negative', 'json']);
const uploadReasons = new Set(['size', 'type', 'signature']);
const analysisReasons = new Set(['unavailable', 'provider', 'validation']);
const analyticsModels = new Set<AnalyticsModel>([
  'midjourney',
  'midjourney-v7',
  'stable-diffusion',
  'dall-e',
  'flux',
  'flux-pro',
  'ideogram',
  'leonardo',
  'firefly',
  'nano-banana',
  'recraft',
  'gpt4o',
  'other',
]);

function safeString(value: unknown) {
  return typeof value === 'string' ? value.slice(0, 80) : '';
}

export function normalizeAnalyticsModel(value: unknown): AnalyticsModel {
  const normalized = safeString(value).trim().toLowerCase().replace(/\s+/g, '-');
  return analyticsModels.has(normalized as AnalyticsModel)
    ? (normalized as AnalyticsModel)
    : 'other';
}

function sanitizeEvent(name: keyof ProductEventMap, params: unknown): Record<string, string> {
  const input = params && typeof params === 'object' ? (params as Record<string, unknown>) : {};
  switch (name) {
    case 'prompt_generated':
      return { model: normalizeAnalyticsModel(input.model) };
    case 'prompt_copy_succeeded':
    case 'prompt_copy_failed': {
      const variant = safeString(input.variant);
      return {
        model: normalizeAnalyticsModel(input.model),
        variant: copyVariants.has(variant) ? variant : 'prompt',
      };
    }
    case 'image_upload_rejected': {
      const reason = safeString(input.reason);
      return { reason: uploadReasons.has(reason) ? reason : 'type' };
    }
    case 'image_analysis_failed': {
      const reason = safeString(input.reason);
      return { reason: analysisReasons.has(reason) ? reason : 'provider' };
    }
    case 'image_analysis_succeeded':
      return {};
  }
}

export function trackProductEvent<K extends keyof ProductEventMap>(
  name: K,
  params: ProductEventMap[K],
) {
  if (typeof window === 'undefined') return;
  if (readConsent() !== 'analytics-accepted') return;
  const gtag = (window as GtagWindow).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', name, sanitizeEvent(name, params));
}
