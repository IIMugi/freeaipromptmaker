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
    <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-[clamp(2.4rem,5.5vw,3.75rem)] text-ink">This page could not load</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2">
          Try again. If it keeps happening, report the page address through the contact page.
        </p>
        {error.digest ? <p className="mt-3 text-sm text-ink-3">Error reference: {error.digest}</p> : null}
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center rounded-control bg-accent px-5 font-semibold text-on-accent hover:bg-accent-hover"
          >
            Try again
          </button>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-control border border-line-strong px-5 font-semibold text-ink hover:border-accent">
            Go to the prompt generator
          </Link>
          <Link href="/contact" className="inline-flex min-h-11 items-center px-2 text-accent underline underline-offset-4">
            Report the problem
          </Link>
        </div>
      </div>
    </section>
  );
}
