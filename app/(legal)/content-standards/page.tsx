import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Content Standards',
  description: 'The editorial states and verification requirements used by Free AI Prompt Maker.',
  alternates: { canonical: '/content-standards' },
};

const requirements = [
  'Claims are checked against primary documentation or a clearly identified source.',
  'Model and interface versions are stated when they materially affect the instructions.',
  'Examples do not invent first-person testing, credentials, results, ratings, or audience data.',
  'The page records a verification date and sources before it can enter guide hubs or the sitemap.',
];

export default function ContentStandardsPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
      <h1 className="text-4xl font-semibold text-[var(--text-primary)]">Content standards</h1>
      <p className="mt-3 text-sm text-[var(--text-tertiary)]">Last updated: July 16, 2026</p>
      <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)]">
        Every guide has one explicit state: verified, needs review, or archived. Only verified guides
        may be indexed, appear in the sitemap, or be promoted from a hub.
      </p>

      <section className="mt-10 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Verification requirements</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-[var(--text-secondary)]">
          {requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">AI-assisted legacy content</h2>
        <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">
          The repository contains a legacy automated corpus. Those pages default to needs review.
          Automated direct publishing is disabled; any future draft requires manual review and an
          explicit editorial-state change.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] p-6">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Commercial readiness</h2>
        <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">
          Advertising is disabled in the readiness build and there are no affiliate links in the
          tool directory. AdSense approval is not guaranteed by these changes or by this policy.
        </p>
      </section>

      <p className="mt-8 text-[var(--text-secondary)]">
        Found a factual issue? Use the <Link href="/contact" className="text-[var(--accent-primary)] hover:underline">contact page</Link>.
      </p>
    </article>
  );
}
