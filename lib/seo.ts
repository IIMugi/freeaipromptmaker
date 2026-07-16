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

export function breadcrumbJsonLd(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE.origin,
      },
      ...segments.map((segment, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        item: canonicalUrl(`/${segments.slice(0, index + 1).join('/')}`),
      })),
    ],
  } as const;
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  pathname: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
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
    author: { '@type': 'Organization', name: SITE.name, url: SITE.origin },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.origin },
  } as const;
}
