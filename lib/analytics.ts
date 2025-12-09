export type AnalyticsEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

/**
 * GA4 event tracker (no-op if gtag is not available).
 * Safe to call on client only.
 */
export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;
  // @ts-expect-error gtag runtime
  const gtag = window.gtag as ((...args: unknown[]) => void) | undefined;
  if (!gtag) return;
  try {
    gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event,
    });
  } catch (error) {
    console.warn('[analytics] trackEvent failed', error);
  }
}

