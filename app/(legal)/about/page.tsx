import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'How Free AI Prompt Maker works, what it does not claim, and where to inspect the project.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
      <p className="text-sm font-medium text-[var(--accent-primary)]">About the project</p>
      <h1 className="mt-3 text-4xl font-semibold text-[var(--text-primary)]">Free AI Prompt Maker</h1>
      <p className="mt-5 text-lg leading-relaxed text-[var(--text-secondary)]">
        This is an open-source browser tool for structuring image prompts. It helps users organize a
        subject, visual style, camera cues, and supported text parameters before copying the result
        into a separate image-generation product.
      </p>

      <div className="mt-10 space-y-8">
        <Section title="What the core generator does">
          Prompt formatting runs locally in the browser. It does not generate an image, predict
          output quality, inspect a user&apos;s prompt on a server, or promise a result from another provider.
        </Section>
        <Section title="What is separate">
          Image analysis is an optional server-backed feature. It reports unavailable instead of
          fabricating output when its provider is not configured or fails.
        </Section>
        <Section title="How content is handled">
          Legacy generated guides remain accessible for review but are excluded from search, the
          sitemap, and guide hubs until their claims, sources, and model versions are verified.
        </Section>
        <Section title="Inspect or report an issue">
          The source and issue history are public. Visit the{' '}
          <a className="text-[var(--accent-primary)] hover:underline" href={SITE.social.github} target="_blank" rel="noopener noreferrer">
            GitHub repository
          </a>{' '}
          or read the <Link className="text-[var(--accent-primary)] hover:underline" href="/content-standards">content standards</Link>.
        </Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] p-6">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
      <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">{children}</p>
    </section>
  );
}
