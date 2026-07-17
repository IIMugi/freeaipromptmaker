import type { NextConfig } from "next";
import { permanentRedirects } from './data/redirects';

const apexOrigin = 'https://freeaipromptmaker.com';
const wwwHostCondition = {
  type: 'host' as const,
  value: 'www.freeaipromptmaker.com',
};

export function contentSecurityPolicy(environment = process.env.NODE_ENV) {
  const scriptSources = ["'self'", "'unsafe-inline'"];
  if (environment === 'development') scriptSources.push("'unsafe-eval'");
  scriptSources.push('https://www.googletagmanager.com');

  return [
    "default-src 'self'",
    'script-src ' + scriptSources.join(' '),
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://www.google-analytics.com",
    "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "media-src 'none'",
    "object-src 'none'",
  ].join('; ') + ';';
}

export const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy(),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      ...permanentRedirects.map((redirect) => ({
        source: redirect.source,
        has: [wwwHostCondition],
        destination: apexOrigin + redirect.destination,
        permanent: true,
      })),
      ...permanentRedirects.map((redirect) => ({ ...redirect, permanent: true })),
      {
        source: '/:path*',
        has: [
          {
            ...wwwHostCondition,
          },
        ],
        destination: apexOrigin + '/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
