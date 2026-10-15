import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  // Overrides the layout's index,follow; Next adds its own noindex on top.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-[clamp(2.4rem,5.5vw,3.75rem)] text-ink">This page does not exist</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">
          It may have been removed or renamed, or the address has a typo. These are the places most people are looking
          for:
        </p>
        <ul className="mt-6 border-t border-line">
          {[
            { href: '/', label: 'Prompt generator' },
            { href: '/negative-prompt-generator', label: 'Negative prompt generator' },
            { href: '/prompt-generators', label: 'Prompt generators by use case' },
            { href: '/blog', label: 'Prompt guides' },
          ].map((item) => (
            <li key={item.href} className="border-b border-line">
              <Link href={item.href} className="flex min-h-12 items-center text-ink hover:text-accent hover:underline hover:underline-offset-4">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
