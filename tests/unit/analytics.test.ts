import { beforeEach, describe, expect, it, vi } from 'vitest';
import { trackProductEvent } from '@/lib/analytics';

describe('analytics events', () => {
  const gtag = vi.fn();

  beforeEach(() => {
    gtag.mockClear();
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

  it('does not accept arbitrary event names at compile time', () => {
    if (false) {
      // @ts-expect-error arbitrary analytics events are prohibited
      trackProductEvent('scroll_depth', { value: 90 });
    }
    expect(true).toBe(true);
  });
});
