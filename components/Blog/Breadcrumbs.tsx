import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  title: string;
  category?: string;
}

/**
 * Breadcrumbs Navigation
 * SEO: Hierarchical site structure + schema markup
 */
export function Breadcrumbs({ title, category }: BreadcrumbsProps) {
  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://freeaipromptmaker.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://freeaipromptmaker.com/blog',
      },
      ...(category
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: category,
              item: `https://freeaipromptmaker.com/blog?category=${encodeURIComponent(category)}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: category ? 4 : 3,
        name: title,
      },
    ],
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Visual Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-slate-400">
          <li>
            <Link href="/" className="hover:text-violet-400 transition-colors">
              Home
            </Link>
          </li>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <li>
            <Link href="/blog" className="hover:text-violet-400 transition-colors">
              Blog
            </Link>
          </li>
          {category && (
            <>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
              <li>
                <span className="text-violet-400">{category}</span>
              </li>
            </>
          )}
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
          <li>
            <span className="text-slate-300 line-clamp-1">{title}</span>
          </li>
        </ol>
      </nav>
    </>
  );
}

