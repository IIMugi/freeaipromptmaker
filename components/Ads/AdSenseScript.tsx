'use client';

import { READINESS } from '@/lib/site';

export function AdSenseScript() {
  if (!READINESS.adsEnabled) return null;
  return null;
}
