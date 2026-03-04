'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';
import { CONSENT_EVENT, CONSENT_KEY } from '@/lib/consent';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        const timer = setTimeout(() => setShowBanner(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
    } catch { }
    setShowBanner(false);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'declined');
    } catch { }
    setShowBanner(false);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[100] sm:max-w-md w-full"
        >
          <div className="glass-2 rounded-2xl border border-[var(--border-default)] p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent-primary-soft)] p-2.5 text-[var(--accent-primary)]">
                  <Cookie className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                    We value your privacy
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    We use cookies to improve your experience, analyze traffic, and show relevant ads.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDecline}
                className="flex-shrink-0 rounded-lg p-1 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                onClick={handleAccept}
                className="flex-1 rounded-xl bg-[var(--accent-primary-strong)] px-4 py-2 text-xs font-semibold text-[var(--accent-primary)] transition-all hover:bg-[var(--accent-primary)] hover:text-[var(--text-inverted)] active:scale-95 sm:flex-none"
              >
                Accept All
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] px-4 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-overlay)] active:scale-95 sm:flex-none"
              >
                Decline
              </button>
              <Link
                href="/cookies"
                className="ml-auto text-[11px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:underline sm:ml-2"
              >
                Manage
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
