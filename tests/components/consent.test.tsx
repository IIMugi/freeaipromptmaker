import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ConsentGate } from '@/components/Consent/ConsentGate';
import { CookieConsent } from '@/components/Consent/CookieConsent';
import { CONSENT_EVENT, CONSENT_KEY } from '@/lib/consent';

describe('analytics consent', () => {
  beforeEach(() => localStorage.clear());

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
});
