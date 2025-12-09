import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { AdSenseScript } from '@/components/Ads/AdSenseScript';
import { CookieConsent } from '@/components/CookieConsent';
import { ScrollTracker } from '@/components/Analytics';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeaipromptmaker.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Free AI Prompt Maker - Visual Prompt Generator for Midjourney, DALL-E & Stable Diffusion',
    template: '%s | Free AI Prompt Maker',
  },
  description:
    'Free AI prompt generator - create stunning prompts visually for Midjourney, DALL-E 3, and Stable Diffusion. No memorization needed, just click and generate!',
  keywords: [
    'free ai prompt maker',
    'free ai prompt generator',
    'midjourney prompt generator',
    'stable diffusion prompts',
    'dall-e prompt generator',
    'ai art prompts',
    'visual prompt builder',
    'free ai art tools',
    'midjourney prompts free',
  ],
  authors: [{ name: 'Free AI Prompt Maker', url: siteUrl }],
  creator: 'Free AI Prompt Maker',
  publisher: 'Free AI Prompt Maker',
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Free AI Prompt Maker',
    title: 'Free AI Prompt Maker - Create Stunning Prompts Visually',
    description:
      'Free AI prompt generator for Midjourney, DALL-E & Stable Diffusion. No memorization needed!',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free AI Prompt Maker - Visual Prompt Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Prompt Maker - Visual Prompt Generator',
    description: 'Create AI art prompts visually for free. Just click and generate!',
    images: ['/og-image.png'],
    creator: '@FreeAIPromptMkr',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console verification
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* SEO: Schema.org SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Free AI Prompt Maker',
              applicationCategory: 'DesignApplication',
              operatingSystem: 'Web',
              url: siteUrl,
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description:
                'Free visual AI prompt generator for Midjourney, DALL-E 3, and Stable Diffusion',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '2847',
              },
            }),
          }}
        />
        
        {/* SEO: Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Free AI Prompt Maker',
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              sameAs: [
                'https://twitter.com/FreeAIPromptMkr',
                'https://github.com/freeaipromptmaker',
              ],
            }),
          }}
        />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* AdSense Script - afterInteractive yükleme */}
        <AdSenseScript />
        <ScrollTracker />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
