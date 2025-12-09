'use client';

import { AdUnit } from './AdUnit';

/**
 * Generator Results Ad
 * SEO: Prompt kopyalama sonrası CTA + ad slotu
 * CLS: 250px sabit yükseklik (mobile-friendly)
 */
export function GeneratorResultAd() {
  return (
    <div 
      className="mt-8 border-t border-slate-800 pt-6"
      itemScope
      itemType="https://schema.org/WPAdBlock"
    >
      <div className="relative">
        <span className="absolute -top-3 left-0 text-xs text-slate-600 uppercase tracking-wider">
          Advertisement
        </span>
        <AdUnit
          slot="GENERATOR_RESULT_AD_SLOT"
          format="auto"
          minHeight={250}
          className="rounded-lg overflow-hidden bg-slate-800/20"
        />
      </div>
    </div>
  );
}

