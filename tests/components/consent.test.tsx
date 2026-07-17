import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConsentGate } from '@/components/Consent/ConsentGate';
import { CookieConsent } from '@/components/Consent/CookieConsent';
import {
  CONSENT_EVENT,
  CONSENT_KEY,
  readConsent,
  subscribeToConsent,
  writeConsent,
} from '@/lib/consent';

describe('analytics consent', () => {
  const gtag = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    gtag.mockClear();
    Object.assign(window, { gtag });
    document.cookie = '_ga=; Max-Age=0; Path=/';
    document.cookie = '_ga_TEST=; Max-Age=0; Path=/';
    document.cookie = 'session=; Max-Age=0; Path=/';
  });

  it('defaults to declined and reacts to acceptance and withdrawal', () => {
    render(
      <ConsentGate>
        <span>analytics loaded</span>
      </ConsentGate>,
    );
    expect(screen.queryByText('analytics loaded')).not.toBeInTheDocument();

    localStorage.setItem(CONSENT_KEY, 'analytics-accepted');
    fireEvent(window, new Event(CONSENT_EVENT));
    expect(screen.getByText('analytics loaded')).toBeInTheDocument();

    localStorage.setItem(CONSENT_KEY, 'declined');
    fireEvent(window, new Event(CONSENT_EVENT));
    expect(screen.queryByText('analytics loaded')).not.toBeInTheDocument();
  });

  it('offers clear analytics choices without advertising or CMP claims', () => {
    render(<CookieConsent />);
    expect(screen.getByRole('button', { name: 'Allow analytics' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Decline analytics' })).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/personalized ads|relevant ads|certified cmp/i);
  });

  it('lets a returning user reopen privacy settings and withdraw', () => {
    localStorage.setItem(CONSENT_KEY, 'analytics-accepted');
    render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name: 'Privacy settings' }));
    fireEvent.click(screen.getByRole('button', { name: 'Decline analytics' }));
    expect(localStorage.getItem(CONSENT_KEY)).toBe('declined');
  });

  it('updates Consent Mode without ever granting advertising consent', () => {
    writeConsent('analytics-accepted');
    expect(gtag).toHaveBeenLastCalledWith('consent', 'update', {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'granted',
    });

    writeConsent('declined');
    expect(gtag).toHaveBeenLastCalledWith('consent', 'update', {
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      analytics_storage: 'denied',
    });
  });

  it('removes reachable GA cookies on withdrawal and preserves unrelated cookies', () => {
    document.cookie = '_ga=client-id; Path=/';
    document.cookie = '_ga_TEST=session-id; Path=/';
    document.cookie = '_gid=visitor-id; Path=/';
    document.cookie = '_gat_PROPERTY=1; Path=/';
    document.cookie = '_gac_PROPERTY=campaign; Path=/';
    document.cookie = '_dc_gtm_PROPERTY=1; Path=/';
    document.cookie = 'session=keep-me; Path=/';

    writeConsent('declined');

    expect(document.cookie).not.toMatch(/(?:^|;\s*)_ga(?:_|=)/);
    expect(document.cookie).not.toMatch(/(?:^|;\s*)_(?:gid|gat|gac|dc_gtm)/);
    expect(document.cookie).toContain('session=keep-me');
  });

  it('still updates consent and dispatches the change event when storage is unavailable', () => {
    const listener = vi.fn();
    window.addEventListener(CONSENT_EVENT, listener);
    const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    writeConsent('declined');

    expect(gtag).toHaveBeenCalledWith('consent', 'update', expect.objectContaining({
      analytics_storage: 'denied',
    }));
    expect(listener).toHaveBeenCalledTimes(1);
    storage.mockRestore();
    window.removeEventListener(CONSENT_EVENT, listener);
  });

  it('fails closed when accepting analytics cannot be persisted', () => {
    const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    writeConsent('analytics-accepted');

    expect(readConsent()).toBe('declined');
    expect(gtag).toHaveBeenLastCalledWith('consent', 'update', expect.objectContaining({
      analytics_storage: 'denied',
    }));
    storage.mockRestore();
  });

  it.each(['declined', null] as const)(
    'applies withdrawal side effects received from another tab (%s)',
    (newValue) => {
    localStorage.setItem(CONSENT_KEY, 'analytics-accepted');
    document.cookie = '_ga=client-id; Path=/';
    const onChange = vi.fn();
    const unsubscribe = subscribeToConsent(onChange);

    window.dispatchEvent(new StorageEvent('storage', {
      key: CONSENT_KEY,
      newValue,
    }));

    expect(gtag).toHaveBeenCalledWith('consent', 'update', expect.objectContaining({
      analytics_storage: 'denied',
    }));
    expect(document.cookie).not.toContain('_ga=');
    expect(onChange).toHaveBeenCalledTimes(1);
    unsubscribe();
    },
  );
});
