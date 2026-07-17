import { beforeEach, describe, expect, it, vi } from 'vitest';
import { trackProductEvent } from '@/lib/analytics';
import { CONSENT_KEY, writeConsent } from '@/lib/consent';

describe('analytics events', () => {
  const gtag = vi.fn();

  beforeEach(() => {
    gtag.mockClear();
    localStorage.clear();
    localStorage.setItem(CONSENT_KEY, 'analytics-accepted');
    Object.assign(window, { gtag });
  });

  it('sends only allow-listed scalar fields', () => {
    trackProductEvent('prompt_copy_succeeded', { model: 'flux', variant: 'prompt' });
    expect(gtag).toHaveBeenCalledWith('event', 'prompt_copy_succeeded', {
      model: 'flux',
      variant: 'prompt',
    });
  });

  it('drops prompt or image data even if a caller bypasses TypeScript', () => {
    trackProductEvent(
      'prompt_copy_succeeded',
      { model: 'flux', variant: 'prompt', prompt: 'private prompt', image: 'bytes' } as never,
    );
    expect(gtag).toHaveBeenCalledWith('event', 'prompt_copy_succeeded', {
      model: 'flux',
      variant: 'prompt',
    });
  });

  it('normalizes arbitrary model text instead of sending it', () => {
    trackProductEvent(
      'prompt_generated',
      { model: 'private prompt text https://example.com' } as never,
    );
    expect(gtag).toHaveBeenCalledWith('event', 'prompt_generated', { model: 'other' });
    expect(JSON.stringify(gtag.mock.calls)).not.toContain('private prompt text');
    expect(JSON.stringify(gtag.mock.calls)).not.toContain('example.com');
  });

  it('does not accept arbitrary event names at compile time', () => {
    if (false) {
      // @ts-expect-error arbitrary analytics events are prohibited
      trackProductEvent('scroll_depth', { value: 90 });
      // @ts-expect-error model telemetry accepts only the fixed product-model union
      trackProductEvent('prompt_generated', { model: 'private prompt text' });
    }
    expect(true).toBe(true);
  });

  it('checks current consent on every dispatch, including after withdrawal', () => {
    trackProductEvent('prompt_generated', { model: 'flux' });
    expect(gtag).toHaveBeenCalledWith('event', 'prompt_generated', { model: 'flux' });

    gtag.mockClear();
    writeConsent('declined');
    trackProductEvent('prompt_generated', { model: 'flux' });

    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'denied',
    });
    expect(gtag).not.toHaveBeenCalledWith('event', expect.anything(), expect.anything());
  });

  it.each(['unset', 'declined'] as const)('does not dispatch when consent is %s', (state) => {
    localStorage.clear();
    if (state === 'declined') localStorage.setItem(CONSENT_KEY, state);

    trackProductEvent('image_analysis_succeeded', {});

    expect(gtag).not.toHaveBeenCalled();
  });
});
