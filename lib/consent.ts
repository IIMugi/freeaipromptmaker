export type ConsentState = 'unset' | 'analytics-accepted' | 'declined';

export const CONSENT_KEY = 'site-consent-v2';
export const CONSENT_EVENT = 'site-consent-change';

export const DENIED_AD_CONSENT = {
  ad_personalization: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
} as const;

type ConsentModeWindow = Window & {
  gtag?: (
    command: 'consent',
    action: 'update',
    params: typeof DENIED_AD_CONSENT & { analytics_storage: 'granted' | 'denied' },
  ) => void;
};

let volatileConsent: 'declined' | null = null;

export function readConsent(): ConsentState {
  if (typeof window === 'undefined') return 'unset';
  if (volatileConsent) return volatileConsent;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'analytics-accepted' || value === 'declined' ? value : 'unset';
  } catch {
    return 'unset';
  }
}

export function writeConsent(value: Exclude<ConsentState, 'unset'>) {
  let effectiveValue = value;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    volatileConsent = null;
  } catch {
    effectiveValue = 'declined';
    volatileConsent = 'declined';
  }
  applyConsentRuntime(effectiveValue);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

function applyConsentRuntime(value: Exclude<ConsentState, 'unset'>) {
  const analyticsStorage = value === 'analytics-accepted' ? 'granted' : 'denied';
  const gtag = (window as ConsentModeWindow).gtag;
  if (typeof gtag === 'function') {
    gtag('consent', 'update', {
      ...DENIED_AD_CONSENT,
      analytics_storage: analyticsStorage,
    });
  }
  if (value === 'declined') clearReachableAnalyticsCookies();
}

function clearReachableAnalyticsCookies() {
  let names: string[] = [];
  try {
    names = document.cookie
      .split(';')
      .map((part) => part.trim().split('=', 1)[0] || '')
      .filter((name) =>
        name === '_ga' ||
        name.startsWith('_ga_') ||
        name === '_gid' ||
        name === '_gat' ||
        name.startsWith('_gat_') ||
        name.startsWith('_gac_') ||
        name.startsWith('_dc_gtm_'),
      );
  } catch {
    return;
  }

  for (const name of names) {
    const encodedName = encodeURIComponent(name);
    const expiry = `${encodedName}=; Max-Age=0; Path=/; SameSite=Lax`;
    try {
      document.cookie = expiry;
      const hostname = window.location.hostname;
      if (hostname && hostname !== 'localhost') {
        const labels = hostname.split('.');
        const domains = new Set<string>([hostname, `.${hostname}`]);
        for (let index = 1; index < labels.length - 1; index += 1) {
          domains.add(`.${labels.slice(index).join('.')}`);
        }
        for (const domain of domains) {
          document.cookie = `${expiry}; Domain=${domain}`;
        }
      }
    } catch {
      // Only first-party cookies reachable from this document can be removed.
    }
  }
}

export function subscribeToConsent(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== CONSENT_KEY) return;
    volatileConsent = null;
    if (event.newValue === 'analytics-accepted' || event.newValue === 'declined') {
      applyConsentRuntime(event.newValue);
    } else {
      applyConsentRuntime('declined');
    }
    onChange();
  };
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}
