'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[route-error]', error);
  }, [error]);

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-16">
      <div>
        <p className="text-sm font-medium text-[var(--danger)]">Route error</p>
        <h1 className="mt-3 text-4xl font-semibold text-[var(--text-primary)]">This page could not load</h1>
        <p className="mt-4 max-w-xl leading-relaxed text-[var(--text-secondary)]">
          Retry the route. If the problem continues, report the public URL through the contact page.
        </p>
        {error.digest ? <p className="mt-3 text-xs text-[var(--text-tertiary)]">Error reference: {error.digest}</p> : null}
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="rounded-xl bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-[var(--text-inverted)]">Try again</button>
          <Link href="/" className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] px-5 py-3 text-sm font-medium text-[var(--text-primary)]">Go home</Link>
          <Link href="/contact" className="rounded-xl px-5 py-3 text-sm font-medium text-[var(--accent-primary)]">Report the issue</Link>
        </div>
      </div>
    </section>
  );
}
