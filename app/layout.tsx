import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { CookieConsent } from '@/components/Consent/CookieConsent';
import { ConsentGate } from '@/components/Consent/ConsentGate';
import { BreadcrumbsJSON } from '@/components/Seo/BreadcrumbsJSON';
import { ScrollTracker, GoogleAnalytics } from '@/components/Analytics';
import { SITE } from '@/lib/site';
import { websiteJsonLd } from '@/lib/seo';
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: {
    default: 'Free AI Prompt Maker',
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.origin }],
  creator: SITE.name,
  publisher: SITE.name,
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.origin,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
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
    title: SITE.name,
    description: SITE.description,
    images: ['/twitter-image'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd()),
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          {/* Optional analytics loads only after explicit consent. */}
          <ConsentGate>
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
