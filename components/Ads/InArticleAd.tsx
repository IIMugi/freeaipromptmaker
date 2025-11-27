'use client';

import { AdUnit } from './AdUnit';

/**
 * In-Article Reklam
 * SEO: Blog yazılarının her 3 paragrafında bir yerleşen doğal reklamlar
 * CLS: 280px sabit yükseklik
 */
export function InArticleAd() {
  return (
    <div 
      className="my-8"
      // SEO: İçerik akışı içinde doğal görünüm
      itemScope
      itemType="https://schema.org/WPAdBlock"
    >
      <div className="relative">
        {/* SEO: Reklam etiketi - şeffaflık için */}
        <span className="absolute -top-5 left-0 text-xs text-slate-600 uppercase tracking-wider">
          Advertisement
        </span>
        <AdUnit
          slot="IN_ARTICLE_AD_SLOT"
          format="auto"
          minHeight={280}
          className="rounded-lg overflow-hidden bg-slate-800/20"
        />
      </div>
    </div>
  );
}

