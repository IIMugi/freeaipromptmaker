import Link from 'next/link';
import { ArrowDown, Github } from 'lucide-react';
import { SITE } from '@/lib/site';

export function HeroSection() {
  return (
    <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] px-6 py-12 shadow-[var(--shadow-card)] sm:px-10 md:py-16">
      <div className="max-w-4xl">
        <p className="text-sm font-medium text-[var(--accent-primary)]">Local prompt formatter</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl">
          Build a clearer image prompt.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          Choose a target model, describe the image, add optional style and camera cues, then copy
          the locally formatted result. No account is required and prompt text stays in your browser.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#generator"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-[var(--text-inverted)]"
          >
            Open the generator
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a
            href={SITE.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] px-5 py-3 text-sm font-medium text-[var(--text-primary)]"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            Inspect the source
          </a>
        </div>
      </div>
    </section>
  );
}
