import Link from 'next/link';
import { breadcrumbJsonLd, serializeJsonLd, type BreadcrumbItem } from '@/lib/seo';
import { cn } from '@/lib/utils';

/**
 * The page's BreadcrumbList JSON-LD, and optionally the visible trail.
 * Items exclude Home (added automatically); the last item is the current page.
 */
export function Breadcrumbs({
  items,
  visible = true,
  className,
}: {
  items: BreadcrumbItem[];
  visible?: boolean;
  className?: string;
}) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd(items)) }} />
      {visible ? (
        <nav aria-label="Breadcrumb" className={cn('text-sm text-ink-3', className)}>
          <ol className="flex flex-wrap items-center gap-x-2">
            {items.slice(0, -1).map((item, index) => (
              <li key={item.path} className="flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                <Link href={item.path} className="text-ink-2 underline-offset-4 hover:text-ink hover:underline">
                  {item.name}
                </Link>
              </li>
            ))}
            <li aria-current="page" className="sr-only">
              {items.at(-1)?.name}
            </li>
          </ol>
        </nav>
      ) : null}
    </>
  );
}
