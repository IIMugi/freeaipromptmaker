export type ConsentState = 'unset' | 'analytics-accepted' | 'declined';

export const CONSENT_KEY = 'site-consent-v2';
export const CONSENT_EVENT = 'site-consent-change';

export function readConsent(): ConsentState {
  if (typeof window === 'undefined') return 'unset';
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'analytics-accepted' || value === 'declined' ? value : 'unset';
  } catch {
    return 'unset';
  }
}

export function writeConsent(value: Exclude<ConsentState, 'unset'>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Consent remains effectively declined when storage is unavailable.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function subscribeToConsent(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY) onChange();
  };
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}
