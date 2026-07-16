import type { Metadata } from 'next';
import { Github } from 'lucide-react';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Report a factual, privacy, accessibility, or software issue for Free AI Prompt Maker.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:py-16">
      <h1 className="text-4xl font-semibold text-[var(--text-primary)]">Contact and corrections</h1>
      <p className="mt-5 text-lg leading-relaxed text-[var(--text-secondary)]">
        The public repository is the verified contact channel currently exposed by this project. Use
        it for factual corrections, privacy questions, accessibility problems, and software bugs.
      </p>
      <section className="mt-10 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Before opening an issue</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--text-secondary)]">
          <li>Do not include private prompts, uploaded images, API keys, or personal information.</li>
          <li>Include the affected public URL and a concise description of the problem.</li>
          <li>For a factual correction, link the primary source that supports the change.</li>
        </ul>
        <a href={`${SITE.social.github}/issues`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-[var(--text-inverted)]">
          <Github className="h-4 w-4" aria-hidden="true" />
          Open GitHub issues
        </a>
      </section>
    </article>
  );
}
