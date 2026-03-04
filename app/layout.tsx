import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { AdSenseScript } from '@/components/Ads/AdSenseScript';
import { CookieConsent } from '@/components/Consent/CookieConsent';
import { ConsentGate } from '@/components/Consent/ConsentGate';
import { BreadcrumbsJSON } from '@/components/Seo/BreadcrumbsJSON';
import { ScrollTracker, GoogleAnalytics } from '@/components/Analytics';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-code',
  subsets: ['latin'],
  weight: ['400'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeaipromptmaker.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Free AI Prompt Generator | Midjourney v7, Flux & DALL-E 3',
    template: '%s | Free AI Prompt Maker',
  },
  description:
    'Stop guessing AI prompts. Use our free visual generator to build professional, copy-paste ready prompts for Midjourney v7, Flux Pro, and DALL-E 3 instantly.',
  keywords: [
    'ai prompt generator',
    'midjourney v7 prompt helper',
    'flux pro prompt builder',
    'dall-e prompt generator',
    'stable diffusion prompt builder',
    'image to prompt generator',
    'midjourney prompt generator',
    'ai art prompt builder',
    'prompt generator for logos',
    'anime prompt generator ai',
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
    title: 'Free AI Prompt Generator | Midjourney v7, Flux & DALL-E 3',
    description:
      'Stop guessing AI prompts. Use our free visual generator to build professional, copy-paste ready prompts instantly.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Free AI Prompt Maker - Visual Prompt Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Prompt Generator | Midjourney v7, Flux & DALL-E 3',
    description: 'Stop guessing AI prompts. Use our free visual generator to build professional, copy-paste ready prompts instantly.',
    images: ['/twitter-image'],
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
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
                'https://github.com/IIMugi/freeaipromptmaker',
              ],
            }),
          }}
        />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
      </head>
      <body
        className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          {/* AdSense Script + Analytics (after consent) */}
          <ConsentGate>
            <AdSenseScript />
            <GoogleAnalytics />
          </ConsentGate>
          <ScrollTracker />
          <BreadcrumbsJSON />
          <Header />
          <main className="flex-1 w-full pt-28 md:pt-36">{children}</main>
          <Footer />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
