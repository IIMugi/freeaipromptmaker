'use client';

import { AdUnit } from './AdUnit';

/**
 * Header Banner Reklam
 * SEO: İnce şerit, sayfanın üstünde, görünür ama dikkat dağıtmayan
 * CLS: Sabit 90px yükseklik
 */
export function HeaderAd() {
  return (
    <div 
      className="w-full bg-slate-900/50 border-b border-slate-800"
      // SEO: Yapısal veri için işaretleme
      itemScope
      itemType="https://schema.org/WPAdBlock"
    >
      <div className="max-w-7xl mx-auto px-4">
        <AdUnit
          slot="HEADER_AD_SLOT"
          format="horizontal"
          minHeight={90}
          className="py-2"
        />
      </div>
    </div>
  );
}

