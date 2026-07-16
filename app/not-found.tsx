import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-16">
      <div>
        <p className="text-sm font-medium text-[var(--accent-primary)]">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-[var(--text-primary)]">Page not found</h1>
        <p className="mt-4 max-w-xl leading-relaxed text-[var(--text-secondary)]">
          This URL is not part of the current site. It may have been removed, renamed, or typed incorrectly.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/#generator" className="rounded-xl bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-[var(--text-inverted)]">Open the generator</Link>
          <Link href="/prompt-generators" className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] px-5 py-3 text-sm font-medium text-[var(--text-primary)]">Browse prompt pages</Link>
        </div>
      </div>
    </section>
  );
}
