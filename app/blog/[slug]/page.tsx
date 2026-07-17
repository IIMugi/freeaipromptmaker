import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Tag, User, Share2, Check, X } from 'lucide-react';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/blog';
import { MarkdownRenderer, RelatedPosts, CtaButtons, Breadcrumbs } from '@/components/Blog';
import { getEditorialPolicy } from '@/lib/editorial';
import { articleJsonLd, canonicalUrl } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const QUARANTINED_DESCRIPTION =
  'This preserved guide URL is withheld from publication while its claims, sources, and current tool version are reviewed.';

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

  const canonical = canonicalUrl(`/blog/${slug}`);
  const policy = getEditorialPolicy(post.editorialState);

  if (!policy.index) {
    return {
      title: post.title,
      description: QUARANTINED_DESCRIPTION,
      keywords: [],
      authors: [],
      robots: { index: false, follow: true },
      alternates: {
        canonical,
      },
      openGraph: {
        title: post.title,
        description: QUARANTINED_DESCRIPTION,
        type: 'website',
        url: canonical,
        images: [],
      },
      twitter: {
        card: 'summary',
        title: post.title,
        description: QUARANTINED_DESCRIPTION,
        images: [],
      },
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: post.author ? [{ name: post.author }] : undefined,
    robots: { index: policy.index, follow: true },
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: canonical,
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

  const editorialPolicy = getEditorialPolicy(post.editorialState);

  if (!editorialPolicy.index) {
    const relatedPosts = getRelatedPosts(slug, 3);

    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Link
          href="/blog"
          className="mb-4 inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <Breadcrumbs title={post.title} category={post.category} />

        <div className="max-w-3xl">
          <header className="mb-8">
            {post.category ? (
              <span className="mb-4 inline-block rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-400">
                {post.category}
              </span>
            ) : null}
            <h1 className="text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
              {post.title}
            </h1>
          </header>

          <aside
            className="mb-6 rounded-xl border border-amber-400/35 bg-amber-400/10 p-4 text-sm text-amber-100"
            aria-label="Editorial review status"
          >
            This earlier guide body is withheld while its claims, sources, and current tool version
            are reviewed.
          </aside>

          <dl
            className="mb-8 rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 text-sm"
            aria-label="Editorial details"
          >
            <div>
              <dt className="text-[var(--text-tertiary)]">Editorial status</dt>
              <dd className="mt-1 font-medium text-[var(--text-primary)]">
                {post.editorialState === 'archived' ? 'Archived' : 'Needs review'}
              </dd>
            </div>
          </dl>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-violet-400/35 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-200 transition-colors hover:bg-violet-500/20"
          >
            Browse verified prompt guides
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>

          <RelatedPosts posts={relatedPosts} currentSlug={slug} />
        </div>
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(slug, 3);
  const pageUrl = canonicalUrl(`/blog/${slug}`);
  const contentWithoutTopH1 = post.content.replace(/^#\s+.*\r?\n?/, '').trimStart();

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
  const prosCons = { pros: post.pros ?? [], cons: post.cons ?? [] };

  const ctas: Array<{ title: string; href: string; description?: string }> = [
    {
      title: 'Try the Visual Prompt Generator',
      description:
        'Build Midjourney, DALL-E, and Stable Diffusion prompts without memorizing parameters.',
      href: '/',
    },
    {
      title: 'See more AI prompt guides',
      href: '/blog',
    },
  ];

  const articleSchema = editorialPolicy.index
    ? articleJsonLd({
        title: post.title,
        description: post.description,
        pathname: `/blog/${slug}`,
        datePublished: post.date,
        dateModified: post.lastVerified,
        image: post.image,
      })
    : null;

  return (
    <>
      {/* Read Progress Bar */}
      
      {articleSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      ) : null}

      <article className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Breadcrumbs */}
        <Breadcrumbs title={post.title} category={post.category} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Put the page topic first for readers and mobile rendering. */}
            <header className="mb-8">
              {post.category && (
                <span className="mb-4 inline-block rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-400">
                  {post.category}
                </span>
              )}

              <h1 className="mb-4 text-3xl font-bold leading-tight text-[var(--text-primary)] md:text-4xl">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>

              {post.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-xs text-slate-300"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {!editorialPolicy.index ? (
              <aside
                className="mb-6 rounded-xl border border-amber-400/35 bg-amber-400/10 p-4 text-sm text-amber-100"
                aria-label="Editorial review status"
              >
                {post.editorialState === 'archived'
                  ? 'This guide is archived and is kept only for reference.'
                  : 'This guide is being reviewed for accuracy, sources, and current tool versions. It is excluded from search and guide listings until verification is complete.'}
              </aside>
            ) : null}

            <dl
              className="mb-8 grid gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 text-sm sm:grid-cols-3"
              aria-label="Editorial details"
            >
              <div>
                <dt className="text-[var(--text-tertiary)]">Editorial status</dt>
                <dd className="mt-1 font-medium text-[var(--text-primary)]">
                  {post.editorialState === 'verified' ? 'Verified' : post.editorialState === 'archived' ? 'Archived' : 'Needs review'}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--text-tertiary)]">Last verified</dt>
                <dd className="mt-1 font-medium text-[var(--text-primary)]">{post.lastVerified || 'Not yet verified'}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-tertiary)]">Sources</dt>
                <dd className="mt-1 font-medium text-[var(--text-primary)]">{post.sources.length ? `${post.sources.length} listed` : 'Not yet verified'}</dd>
              </div>
            </dl>

            {/* Featured Image */}
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
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

          {editorialPolicy.index && (prosCons.pros.length > 0 || prosCons.cons.length > 0) && (
            <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 id="advantages-and-limitations" className="text-lg font-semibold text-white">
                  Advantages and limitations
                </h2>
                <span className="text-xs text-slate-500">Quick tradeoff check</span>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-emerald-400">Advantages</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {prosCons.pros.slice(0, 4).map((pro) => (
                      <li key={pro} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-red-400">Limitations</p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {prosCons.cons.slice(0, 4).map((con) => (
                      <li key={con} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

            {/* Content */}
            <div className="prose-custom">
              <MarkdownRenderer content={contentWithoutTopH1} />
            </div>

            {/* Dynamic In-Article Ads (based on content length) */}
          {/* CTA block */}
          <CtaButtons items={ctas} />

          {/* End of Content Ad */}
            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-slate-700">
              <div className="flex items-center gap-4">
                <Share2 className="w-5 h-5 text-slate-400" />
                <span className="text-slate-400">Share this article</span>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(pageUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
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

            {/* Related Posts with contextual navigation */}
            <RelatedPosts posts={relatedPosts} currentSlug={slug} />
          </div>

          {/* Sidebar */}
        </div>
      </article>
    </>
  );
}

