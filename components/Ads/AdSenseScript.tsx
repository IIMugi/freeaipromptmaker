'use client';

import Script from 'next/script';

/**
 * AdSense Script Loader
 * SEO: afterInteractive ile yükleme - sayfa yüklendikten sonra
 * Performance: Ana içerik öncelikli, reklam script'i sonra
 */
export function AdSenseScript() {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  // AdSense client yoksa hiçbir şey render etme
  if (!adClient || adClient === 'ca-pub-XXXXXXXXXXXXXXXX') {
    return null;
  }

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  );
}

