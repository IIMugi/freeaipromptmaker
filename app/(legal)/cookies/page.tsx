import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/Layout/TextPage';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'How Free AI Prompt Maker uses browser local storage and optional Google Analytics cookies, which load only after you choose Allow analytics.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesPage() {
  return (
    <TextPage title="Cookie policy" path="/cookies" updated="2026-10-16">
      <h2>Local storage on your device</h2>
      <p>
        Your browser&apos;s local storage remembers your theme, your analytics choice and the prompts you copied. It stays
        on your device, needs no account and is removed when you clear this site&apos;s data.
      </p>
      <h2>Optional analytics</h2>
      <p>
        Google Analytics may set cookies only after you choose Allow analytics. Analytics stay off when no choice is
        recorded. Use Privacy settings at the bottom of any page to change or withdraw your choice.
      </p>
      <h2>No advertising cookies</h2>
      <p>The site currently shows no advertising, so it does not load advertising cookies.</p>
      <p>
        See the <Link href="/privacy">privacy policy</Link> for what is sent where.
      </p>
    </TextPage>
  );
}
