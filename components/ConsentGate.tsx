'use client';

import { useEffect, useState } from 'react';
import { CONSENT_EVENT, CONSENT_KEY } from '@/lib/consent';

interface ConsentGateProps {
  children: React.ReactNode;
}

const readConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
};

export function ConsentGate({ children }: ConsentGateProps) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const updateConsent = () => {
      setHasConsent(readConsent());
    };

    updateConsent();

    const onStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY) {
        updateConsent();
      }
    };

    window.addEventListener(CONSENT_EVENT, updateConsent);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(CONSENT_EVENT, updateConsent);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  if (!hasConsent) {
    return null;
  }

  return <>{children}</>;
}
