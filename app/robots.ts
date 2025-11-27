import type { MetadataRoute } from 'next';

/**
 * SEO: robots.txt
 * Arama motorları için crawling kuralları
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeaipromptmaker.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/static/',
        ],
      },
      {
        // Google AdSense bot'una izin ver
        userAgent: 'Mediapartners-Google',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}

