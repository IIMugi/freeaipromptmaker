'use client';

import { InArticleAd } from '@/components/Ads';

interface DynamicAdInjectorProps {
  contentLength: number; // Karakter sayısı veya kelime sayısı
}

/**
 * İçerik uzunluğuna göre dinamik ad injection
 * 
 * Strateji (AdSense Best Practices):
 * - Kısa içerik (<2000 kelime): 1 ad
 * - Orta içerik (2000-4000 kelime): 2 ad
 * - Uzun içerik (4000+ kelime): 3-4 ad
 * 
 * CLS güvenli: Tüm adlar sabit minHeight ile
 */
export function DynamicAdInjector({ contentLength }: DynamicAdInjectorProps) {
  // Kelime sayısını tahmin et (ortalama 5 karakter/kelime)
  const estimatedWords = Math.floor(contentLength / 5);
  
  let adCount = 1;
  if (estimatedWords >= 4000) {
    adCount = 4;
  } else if (estimatedWords >= 3000) {
    adCount = 3;
  } else if (estimatedWords >= 2000) {
    adCount = 2;
  }

  return (
    <>
      {Array.from({ length: adCount }, (_, i) => (
        <InArticleAd key={`dynamic-ad-${i}`} />
      ))}
    </>
  );
}

