'use client';

import { useSyncExternalStore } from 'react';
import { readConsent, subscribeToConsent } from '@/lib/consent';

interface ConsentGateProps {
  children: React.ReactNode;
}

export function ConsentGate({ children }: ConsentGateProps) {
  const consent = useSyncExternalStore(subscribeToConsent, readConsent, () => 'unset');
  return consent === 'analytics-accepted' ? <>{children}</> : null;
}
