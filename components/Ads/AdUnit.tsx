'use client';

import { READINESS } from '@/lib/site';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
  minHeight?: number;
}

export function AdUnit(_props: AdUnitProps) {
  void _props;
  if (!READINESS.adsEnabled) return null;

  // The readiness build intentionally has no advertising implementation.
  // Future enablement belongs behind this single boundary after account approval.
  return null;
}
