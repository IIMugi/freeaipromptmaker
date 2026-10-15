'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { readConsent, subscribeToConsent, writeConsent } from '@/lib/consent';

const OPEN_EVENT = 'privacy-settings-open';

/** Reopens the analytics choice. Lives in the footer so it never covers page controls. */
export function PrivacySettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className}>
      Privacy settings
    </button>
  );
}

export function CookieConsent() {
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, () => 'unset');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const showDialog = consent === 'unset' || settingsOpen;

  useEffect(() => {
    const open = () => setSettingsOpen(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const choose = (value: 'analytics-accepted' | 'declined') => {
    writeConsent(value);
    setSettingsOpen(false);
  };

  if (!showDialog) return null;

  return (
    <section
      className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[26rem]"
      aria-label="Analytics privacy settings"
    >
      <div className="rounded-panel border border-line-strong bg-surface p-5 shadow-panel">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-ink">Optional analytics</h2>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-2">
              Allow Google Analytics to count visits so we can see which tools help. Everything works without it.
            </p>
          </div>

          {consent !== 'unset' ? (
            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="-mr-1 -mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-control text-ink-3 hover:text-ink"
              aria-label="Close privacy settings"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => choose('analytics-accepted')}
            className="min-h-10 rounded-control border border-line-strong px-3 text-[0.95rem] font-semibold text-ink hover:border-accent"
          >
            Allow analytics
          </button>
          <button
            type="button"
            onClick={() => choose('declined')}
            className="min-h-10 rounded-control border border-line-strong px-3 text-[0.95rem] font-semibold text-ink hover:border-accent"
          >
            Decline analytics
          </button>
        </div>
        <Link
          href="/cookies"
          className="mt-3 inline-flex min-h-6 items-center text-sm text-ink-2 underline underline-offset-4 hover:text-ink"
        >
          How analytics cookies are used
        </Link>
      </div>
    </section>
  );
}
