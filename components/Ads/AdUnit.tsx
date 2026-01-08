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

// AdSense client ID - .env'den alınacak
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

    // AdSense script yüklenmiş mi kontrol et
    const loadAd = () => {
      try {
        // @ts-expect-error - AdSense global
        if (window.adsbygoogle && adRef.current) {
          // @ts-expect-error - AdSense push
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('[AdUnit] Failed to load ad:', error);
      }
    };

    // Script yüklendiyse hemen çalıştır, yoksa bekle
    // @ts-expect-error - AdSense global
    if (window.adsbygoogle) {
      loadAd();
    } else {
      // Script yüklenene kadar bekle
      const checkInterval = setInterval(() => {
        // @ts-expect-error - AdSense global
        if (window.adsbygoogle) {
          loadAd();
          clearInterval(checkInterval);
        }
      }, 100);

      // 5 saniye sonra vazgeç
      setTimeout(() => clearInterval(checkInterval), 5000);
    }
  }, [slot, hasConsent]);

  // AdSense yapılandırılmadıysa placeholder göster, script çalıştırma
  if (!isConfigured || !slot) {
    return (
      <div
        className={cn(
          'ad-container relative overflow-hidden bg-slate-800/40 border border-dashed border-slate-700',
          className
        )}
        style={{ minHeight: `${minHeight}px`, ...style }}
        aria-label="Advertisement placeholder"
        role="complementary"
        data-ad-status="disabled"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-slate-500">
            Ad placeholder (configure NEXT_PUBLIC_ADSENSE_CLIENT)
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'ad-container relative overflow-hidden',
        // SEO: CLS önlemek için sabit minimum yükseklik
        !isLoaded && 'bg-slate-800/30',
        className
      )}
      style={{
        minHeight: `${minHeight}px`,
        ...style,
      }}
      // SEO: Reklam alanını işaretle
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
      
      {/* SEO: Placeholder - CLS önleme */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs text-slate-600">Ad</span>
        </div>
      )}
    </div>
  );
}

