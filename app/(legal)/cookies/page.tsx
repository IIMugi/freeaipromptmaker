import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Local storage and optional analytics used by Free AI Prompt Maker.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
      <h1 className="text-4xl font-semibold text-[var(--text-primary)]">Cookie policy</h1>
      <p className="mt-3 text-sm text-[var(--text-tertiary)]">Last updated: July 16, 2026</p>
      <div className="mt-10 space-y-8 text-[var(--text-secondary)]">
        <section>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Required local storage</h2>
          <p className="mt-3 leading-relaxed">
            Browser localStorage remembers theme, consent choice, and prompt history on your device.
            These features do not require an account.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Optional analytics</h2>
          <p className="mt-3 leading-relaxed">
            Google Analytics may set cookies only after you choose Allow analytics. Decline is the
            default when no consent is recorded. Use the Privacy button to change or withdraw your choice.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">No advertising cookies</h2>
          <p className="mt-3 leading-relaxed">Advertising is disabled in the readiness build, so the current application does not load advertising cookies.</p>
        </section>
      </div>
      <p className="mt-10 text-[var(--text-secondary)]">See the <Link href="/privacy" className="text-[var(--accent-primary)] hover:underline">privacy policy</Link> for provider and request-data boundaries.</p>
    </article>
  );
}
