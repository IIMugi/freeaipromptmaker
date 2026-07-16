import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { aiTools } from '@/data/ai-tools';

export const metadata: Metadata = {
  title: 'Image Tool Reference',
  description: 'Official provider links and prompt-format boundaries for image-generation products.',
  alternates: { canonical: '/tools' },
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:py-16">
      <h1 className="text-4xl font-semibold text-[var(--text-primary)]">Image tool reference</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-[var(--text-secondary)]">
        This is a neutral list of official provider links, not a ranking or price comparison. Plans,
        models, limits, and interfaces change; confirm current details with the provider before spending money.
      </p>
      <p className="mt-3 text-sm text-[var(--text-tertiary)]">
        The current list contains no paid-placement or commission links.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {aiTools.map((tool) => (
          <article key={tool.id} className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] p-6">
            <p className="text-sm text-[var(--text-tertiary)]">{tool.provider}</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--text-primary)]">{tool.name}</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt className="font-medium text-[var(--text-primary)]">Prompt mode</dt><dd className="mt-1 leading-relaxed text-[var(--text-secondary)]">{tool.promptMode}</dd></div>
              <div><dt className="font-medium text-[var(--text-primary)]">Check before use</dt><dd className="mt-1 leading-relaxed text-[var(--text-secondary)]">{tool.limitation}</dd></div>
            </dl>
            <a href={tool.website} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)] hover:underline">
              Open official provider page <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-6">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Prepare a prompt locally</h2>
        <p className="mt-2 text-[var(--text-secondary)]">Use the formatter, then review the destination provider&apos;s current syntax and settings.</p>
        <Link href="/#generator" className="mt-4 inline-block text-sm font-medium text-[var(--accent-primary)] hover:underline">Open the prompt generator</Link>
      </section>
    </div>
  );
}
