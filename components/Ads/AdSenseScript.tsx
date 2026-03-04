'use client';

import { useEffect } from 'react';

export function AdSenseScript() {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!adClient || adClient === 'ca-pub-XXXXXXXXXXXXXXXX') return;
    if (document.querySelector('script[data-adsense-managed="true"]')) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
    script.crossOrigin = 'anonymous';
    script.dataset.adsenseManaged = 'true';
    document.head.appendChild(script);
  }, [adClient]);

  return null;
}
