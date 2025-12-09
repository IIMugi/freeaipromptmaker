import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Tag, User, Share2 } from 'lucide-react';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/blog';
import { MarkdownRenderer } from '@/components/Blog';
import { SidebarAd, InArticleAd } from '@/components/Ads';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Static generation için tüm slug'ları al
export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dinamik metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

  // TOC: h2 başlıklarından list
  const tocHeadings =
    post.content
      .match(/^## (.*)$/gm)
      ?.map((line) => line.replace(/^##\s*/, '').trim())
      .filter(Boolean) || [];

  const tocItems = tocHeadings.map((title) => ({
    title,
    id: slugify(title),
  }));

  const keyTakeaways = tocHeadings.slice(0, 4);

  // Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Free AI Prompt Maker',
    },
    keywords: post.tags.join(', '),
  };

  return (
    <>
      {/* Schema.org Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Featured Image */}
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900/50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              {post.image && post.imageCredit && (
                <div className="absolute bottom-3 right-3 text-xs text-white/70">
                  Photo by{' '}
                  <a
                    href={post.imageCreditUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-white"
                  >
                    {post.imageCredit}
                  </a>
                  {' '}on Unsplash
                </div>
              )}
            </div>

            {/* Header */}
            <header className="mb-8">
              {/* Category Badge */}
              {post.category && (
                <span className="inline-block px-3 py-1 bg-violet-500/20 text-violet-400 rounded-full text-sm mb-4">
                  {post.category}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

          {/* TOC */}
          {tocItems.length >= 3 && (
            <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <p className="text-sm text-slate-400 mb-3 font-semibold">On this page</p>
              <ul className="space-y-2 text-sm text-slate-300">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="hover:text-violet-400 transition-colors"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key takeaways */}
          {keyTakeaways.length >= 2 && (
            <div className="mb-8 rounded-xl border border-violet-500/30 bg-violet-500/5 p-4">
              <p className="text-sm text-violet-300 mb-3 font-semibold">Key takeaways</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
                {keyTakeaways.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

            {/* Content */}
            <div className="prose-custom">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* In-Article Ad (after content) */}
            <InArticleAd />

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <div className="flex items-center gap-4">
                <Share2 className="w-5 h-5 text-slate-400" />
                <span className="text-slate-400">Share this article</span>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://promptmaster.ai/blog/${slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://promptmaster.ai/blog/${slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-xl border border-violet-500/30">
              <h3 className="text-xl font-bold text-white mb-2">
                Ready to create your own prompts?
              </h3>
              <p className="text-slate-400 mb-4">
                Try our visual prompt generator - no memorization needed!
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
              >
                Try Prompt Generator
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-bold text-white mb-6">
                  Related Articles
                </h3>
                <div className="grid gap-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="block p-4 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                    >
                      <h4 className="font-medium text-white mb-1">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-slate-400 line-clamp-1">
                        {relatedPost.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-[300px] flex-shrink-0">
            <div className="sticky top-24">
              <SidebarAd />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}

