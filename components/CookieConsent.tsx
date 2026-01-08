'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';
import { CONSENT_EVENT, CONSENT_KEY } from '@/lib/consent';


export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        // Small delay to prevent flash on initial load
        const timer = setTimeout(() => setShowBanner(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch {
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
    } catch {
      // Ignore storage errors (private mode, blocked storage, etc.)
    }
    setShowBanner(false);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'declined');
    } catch {
      // Ignore storage errors (private mode, blocked storage, etc.)
    }
    setShowBanner(false);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl border border-slate-700 shadow-2xl shadow-black/50 overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="hidden sm:flex p-2 bg-violet-500/20 rounded-lg">
                  <Cookie className="w-6 h-6 text-violet-400" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    We use cookies
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    We use cookies to improve your experience, analyze traffic, and show relevant ads. 
                    By clicking &quot;Accept&quot;, you consent to our use of cookies. 
                    <Link href="/cookies" className="text-violet-400 hover:text-violet-300 ml-1">
                      Learn more
                    </Link>
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleAccept}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleDecline}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Decline
                    </button>
                    <Link
                      href="/cookies"
                      className="px-4 py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                    >
                      Cookie Settings
                    </Link>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleDecline}
                  className="p-1 text-slate-500 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

