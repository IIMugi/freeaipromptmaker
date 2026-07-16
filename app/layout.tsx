import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { CookieConsent } from '@/components/Consent/CookieConsent';
import { ConsentGate } from '@/components/Consent/ConsentGate';
import { BreadcrumbsJSON } from '@/components/Seo/BreadcrumbsJSON';
import { GoogleAnalytics } from '@/components/Analytics';
import { SITE } from '@/lib/site';
import { websiteJsonLd } from '@/lib/seo';
import './globals.css';

const themeInitScript = `(function(){try{var key='theme-preference';var stored=localStorage.getItem(key);var valid=stored==='light'||stored==='dark'||stored==='system'?stored:'system';var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=valid==='system'?(dark?'dark':'light'):valid;document.documentElement.dataset.theme=resolved;document.documentElement.style.colorScheme=resolved;}catch(e){document.documentElement.dataset.theme='light';document.documentElement.style.colorScheme='light';}})();`;

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
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd()),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only fixed left-4 top-4 z-[200] rounded-lg bg-[var(--surface-overlay)] px-4 py-3 text-[var(--text-primary)] focus:not-sr-only"
          >
            Skip to main content
          </a>
          {/* Optional analytics loads only after explicit consent. */}
          <ConsentGate>
            <GoogleAnalytics />
          </ConsentGate>
          <BreadcrumbsJSON />
          <Header />
          <main id="main-content" tabIndex={-1} className="flex-1 w-full pt-20">{children}</main>
          <Footer />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
