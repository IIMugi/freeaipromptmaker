'use client';

import { useState, useSyncExternalStore } from 'react';
import { Cookie, Settings, X } from 'lucide-react';
import Link from 'next/link';
import { readConsent, subscribeToConsent, writeConsent } from '@/lib/consent';

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, () => 'unset');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const showDialog = consent === 'unset' || settingsOpen;

  const choose = (value: 'analytics-accepted' | 'declined') => {
    writeConsent(value);
    setSettingsOpen(false);
  };

  if (!showDialog) {
    return (
      <button
        type="button"
        onClick={() => setSettingsOpen(true)}
        className="fixed bottom-4 left-4 z-[100] inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--surface-raised)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] shadow-[var(--shadow-card)] hover:text-[var(--text-primary)]"
        aria-label="Privacy settings"
      >
        <Settings className="h-4 w-4" aria-hidden="true" />
        Privacy
      </button>
    );
  }

  return (
    <section
      className="fixed bottom-4 left-4 right-4 z-[100] w-auto sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md"
      aria-label="Analytics privacy settings"
    >
      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-overlay)] p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent-primary-soft)] p-2.5 text-[var(--accent-primary)]">
              <Cookie className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--text-primary)]">Optional analytics</h2>
              <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                Allow privacy-safe traffic measurement to help us improve the tools. The site works
                without analytics cookies.
              </p>
            </div>
          </div>

          {consent !== 'unset' ? (
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="rounded-lg p-1 text-[var(--text-tertiary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
              aria-label="Close privacy settings"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => choose('analytics-accepted')}
            className="rounded-xl bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-[var(--text-inverted)]"
          >
            Allow analytics
          </button>
          <button
            type="button"
            onClick={() => choose('declined')}
            className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] px-4 py-2 text-xs font-medium text-[var(--text-primary)]"
          >
            Decline analytics
          </button>
          <Link
            href="/cookies"
            className="ml-auto text-[11px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:underline"
          >
            Learn more about analytics cookies
          </Link>
        </div>
      </div>
    </section>
  );
}
