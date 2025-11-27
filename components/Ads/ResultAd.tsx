'use client';

import { AdUnit } from './AdUnit';

/**
 * Sonuç Kutusu Altı Reklam
 * SEO: EN DEĞERLİ ALAN - Kullanıcı "Kopyala" dedikten sonra gözünün gittiği yer
 * CLS: 250px sabit yükseklik (300x250 rectangle)
 */
export function ResultAd() {
  return (
    <div 
      className="mt-6 flex justify-center"
      // SEO: Yapısal veri
      itemScope
      itemType="https://schema.org/WPAdBlock"
    >
      <AdUnit
        slot="RESULT_AD_SLOT"
        format="rectangle"
        minHeight={250}
        style={{ maxWidth: '336px' }}
        className="rounded-lg overflow-hidden"
      />
    </div>
  );
}

