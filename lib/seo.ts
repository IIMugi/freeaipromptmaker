import { SITE } from '@/lib/site';

export function canonicalUrl(pathname = '/') {
  const normalizedPath = pathname.replace(/^\/+/, '');
  return new URL(normalizedPath, `${SITE.origin}/`).toString();
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.origin,
    description: SITE.description,
  } as const;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/** BreadcrumbList for a page. `items` exclude Home, which is always first. */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  } as const;
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  pathname: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: canonicalUrl(article.pathname),
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    image: article.image ? [article.image] : undefined,
    author: article.author
      ? { '@type': 'Person', name: article.author }
      : { '@type': 'Organization', name: SITE.name, url: SITE.origin },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.origin },
  } as const;
}

/** JSON for a <script type="application/ld+json"> tag, with "<" escaped so text can never close the tag. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
