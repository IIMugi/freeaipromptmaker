'use client';

import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

type CTA = { title: string; href: string; description?: string };

interface CtaButtonsProps {
  items: CTA[];
}

export function CtaButtons({ items }: CtaButtonsProps) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2">
      {items.map((cta) => (
        <Link
          key={cta.title}
          href={cta.href}
          onClick={() =>
            trackEvent({
              action: 'cta_click',
              category: 'blog',
              label: cta.title,
            })
          }
          className={cn(
            'block rounded-xl border border-slate-800 bg-slate-900/60 p-5',
            'hover:border-violet-500/40 hover:bg-slate-900 transition-colors'
          )}
        >
          <p className="text-sm text-violet-300 font-semibold mb-2">{cta.title}</p>
          {cta.description ? (
            <p className="text-slate-300 text-sm">{cta.description}</p>
          ) : (
            <p className="text-slate-400 text-sm">
              Explore more AI art prompt tutorials and walkthroughs.
            </p>
          )}
          <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-medium mt-3">
            Go →
          </span>
        </Link>
      ))}
    </div>
  );
}

