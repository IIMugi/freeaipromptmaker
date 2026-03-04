'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { CONSENT_EVENT, CONSENT_KEY } from '@/lib/consent';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  style?: React.CSSProperties;
  // SEO: Reklam yüklenmeden önce placeholder göster (CLS önleme)
  minHeight?: number;
}

// AdSense client ID
const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXXXXXXXX';
const isConfigured = AD_CLIENT && !AD_CLIENT.includes('XXXX');

const readConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
};

export function AdUnit({
  slot,
  format = 'auto',
  className,
  style,
  minHeight = 100,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
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

  useEffect(() => {
    if (!isConfigured || !slot || !hasConsent) {
      return;
    }

    try {
      // @ts-expect-error - AdSense global
      if (window.adsbygoogle && adRef.current?.getAttribute('data-adsbygoogle-status')) {
        setIsLoaded(true);
        return;
      }
      // AdSense script kuyruğuna push et (script yüklü olmasa bile çalışır, yüklendiğinde kuyruğu eritir)
      // @ts-expect-error - AdSense global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setIsLoaded(true);
    } catch (error) {
      console.error('[AdUnit] Failed to push ad:', error);
    }
  }, [slot, hasConsent]);

  if (!isConfigured || !slot) {
    return (
      <div
        className={cn(
          'ad-container relative overflow-hidden bg-[var(--surface-raised)] border border-dashed border-[var(--border-default)]',
          className
        )}
        style={{ minHeight: `${minHeight}px`, ...style }}
        aria-label="Advertisement placeholder"
        role="complementary"
        data-ad-status="disabled"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-[var(--text-tertiary)]">
            Ad placeholder (configure NEXT_PUBLIC_ADSENSE_CLIENT)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'ad-container relative overflow-hidden transition-colors',
        !isLoaded && 'bg-[var(--surface-sunken)]',
        className
      )}
      style={{
        minHeight: `${minHeight}px`,
        ...style,
      }}
      data-ad-status={isLoaded ? 'loaded' : 'loading'}
      aria-label="Advertisement"
      role="complementary"
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-[var(--text-tertiary)]">Ad</span>
        </div>
      )}
    </div>
  );
}
