'use client';

import { AdUnit } from './AdUnit';

/**
 * Sidebar Reklam (Desktop Only)
 * SEO: Blog okurken sağda sabit duran reklam
 * CLS: 600px sabit yükseklik
 */
export function SidebarAd() {
  return (
    <aside 
      className="hidden lg:block sticky top-24 w-[300px]"
      // SEO: Landmark ve yapısal veri
      aria-label="Sidebar Advertisement"
      itemScope
      itemType="https://schema.org/WPAdBlock"
    >
      <AdUnit
        slot="SIDEBAR_AD_SLOT"
        format="vertical"
        minHeight={600}
        className="rounded-xl overflow-hidden"
      />
    </aside>
  );
}

