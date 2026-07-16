import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * SEO: robots.txt
 * Arama motorları için crawling kuralları
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
        ],
      },
      {
        // Allow Google AdSense bot
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
    ],
    sitemap: `${SITE.origin}/sitemap.xml`,
    host: SITE.origin,
  };
}

