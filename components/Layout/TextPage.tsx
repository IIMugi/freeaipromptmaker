import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/Seo/Breadcrumbs';

/** Layout for reading pages: about, policies, contact. */
export function TextPage({
  title,
  path,
  lead,
  updated,
  children,
}: {
  title: string;
  path: string;
  lead?: ReactNode;
  /** ISO date the text last changed. */
  updated?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-7xl px-4 sm:px-6">
      <Breadcrumbs items={[{ name: title, path }]} visible={false} />
      <header className="max-w-3xl pb-8 pt-10 sm:pt-14">
        <h1 className="font-display text-[clamp(2.4rem,5.5vw,3.75rem)] text-ink">{title}</h1>
        {lead ? <p className="mt-4 text-lg leading-relaxed text-ink-2 sm:text-xl">{lead}</p> : null}
        {updated ? (
          <p className="mt-4 text-sm text-ink-3">
            Last updated{' '}
            <time dateTime={updated}>
              {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(
                new Date(updated),
              )}
            </time>
          </p>
        ) : null}
      </header>
      <div className="prose-text max-w-[44rem] border-t border-line pt-2">{children}</div>
    </article>
  );
}
