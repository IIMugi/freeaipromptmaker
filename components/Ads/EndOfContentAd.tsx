'use client';

import { AdUnit } from './AdUnit';

export function EndOfContentAd() {
  return (
    <div 
      className="my-12 border-t border-slate-800 pt-8"
      itemScope
      itemType="https://schema.org/WPAdBlock"
    >
      <div className="relative">
        <span className="absolute -top-5 left-0 text-xs text-slate-600 uppercase tracking-wider">
          Advertisement
        </span>
        <AdUnit
          slot="END_OF_CONTENT_AD_SLOT"
          format="auto"
          minHeight={280}
          className="rounded-lg overflow-hidden bg-slate-800/20"
        />
      </div>
    </div>
  );
}

