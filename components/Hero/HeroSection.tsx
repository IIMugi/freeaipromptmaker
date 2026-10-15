import Link from 'next/link';
import { ArrowDown, BookOpen } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] px-6 py-12 shadow-[var(--shadow-card)] sm:px-10 md:py-16">
      <div className="max-w-4xl">
        <p className="text-sm font-medium text-[var(--accent-primary)]">Free, no sign-up</p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl md:text-6xl">
          Free AI Image Prompt Generator
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          Describe the image you want, add style, lighting and camera details, and copy a prompt
          formatted for Midjourney, Stable Diffusion, Flux, Leonardo and more. Your prompts stay in
          your browser.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="#generator"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-[var(--text-inverted)]"
          >
            Open the generator
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] px-5 py-3 text-sm font-medium text-[var(--text-primary)]"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Prompt guides
          </Link>
        </div>
      </div>
    </section>
  );
}
