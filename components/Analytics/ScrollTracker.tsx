'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

const thresholds = [25, 50, 75, 90];

export function ScrollTracker() {
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      if (scrollHeight <= 0) return;
      const percent = (scrollTop / scrollHeight) * 100;

      thresholds.forEach((t) => {
        if (percent >= t && !fired.current.has(t)) {
          fired.current.add(t);
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: `${t}%`,
            value: t,
          });
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}

