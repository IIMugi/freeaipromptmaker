import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { getAllPromptUseCaseSlugs } from '@/data/prompt-use-cases';
import { canonicalUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: canonicalUrl('/'), changeFrequency: 'weekly', priority: 1 },
    { url: canonicalUrl('/blog'), changeFrequency: 'weekly', priority: 0.8 },
    { url: canonicalUrl('/tools'), changeFrequency: 'monthly', priority: 0.7 },
    { url: canonicalUrl('/prompt-generators'), changeFrequency: 'monthly', priority: 0.8 },
    { url: canonicalUrl('/image-to-prompt'), changeFrequency: 'monthly', priority: 0.8 },
    { url: canonicalUrl('/about'), changeFrequency: 'monthly', priority: 0.6 },
    { url: canonicalUrl('/content-standards'), changeFrequency: 'yearly', priority: 0.4 },
    { url: canonicalUrl('/privacy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: canonicalUrl('/terms'), changeFrequency: 'yearly', priority: 0.3 },
    { url: canonicalUrl('/contact'), changeFrequency: 'yearly', priority: 0.5 },
    { url: canonicalUrl('/cookies'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = getAllPosts({ hubOnly: true }).map((post) => ({
    url: canonicalUrl(`/blog/${post.slug}`),
    lastModified: post.lastVerified || post.date,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const useCasePages: MetadataRoute.Sitemap = getAllPromptUseCaseSlugs().map((useCase) => ({
    url: canonicalUrl(`/prompt-generator-for/${useCase}`),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...useCasePages];
}
