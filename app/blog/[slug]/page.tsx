import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Tag, User, Share2, Check, X } from 'lucide-react';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '@/lib/blog';
import type { BlogPost } from '@/lib/blog';
import { MarkdownRenderer, RelatedPosts, CtaButtons, ReadProgressBar, Breadcrumbs } from '@/components/Blog';
import { getEditorialPolicy } from '@/lib/editorial';
import { articleJsonLd, canonicalUrl } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const PROS_CONS_BY_TOPIC: Record<string, { pros: string[]; cons: string[] }> = {
  midjourney: {
    pros: [
      'Strong style control with parameters and seeds',
      'High aesthetic quality with minimal post-work',
      'Great for concept art and stylized visuals',
    ],
    cons: [
      'Requires iterative prompting to match intent',
      'Less precise control than node-based workflows',
      'Subscription required for regular use',
    ],
  },
  'stable-diffusion': {
    pros: [
      'Deep control with models, LoRAs, and ControlNet',
      'Can run locally for privacy and cost control',
      'Huge community resources and models',
    ],
    cons: [
      'Setup and tuning take time',
      'Quality varies by model and settings',
      'Hardware needs for fast iteration',
    ],
  },
  'dall-e': {
    pros: [
      'Excellent natural language prompt understanding',
      'Reliable text rendering in images',
      'Simple workflow in ChatGPT',
    ],
    cons: [
      'Less granular style control',
      'Safety filters can limit edge cases',
      'Best access requires a paid plan',
    ],
  },
  leonardo: {
    pros: [
      'Strong for character and game asset workflows',
      'Friendly UI with model presets',
      'Free tier for quick tests',
    ],
    cons: [
      'Token limits for heavy usage',
      'Advanced tools are paid',
      'Model choice impacts consistency',
    ],
  },
  flux: {
    pros: [
      'Photorealistic output with clean anatomy',
      'Fast generation on supported platforms',
      'Open weights variants for flexibility',
    ],
    cons: [
      'Ecosystem still maturing',
      'Availability depends on provider',
      'Prompt tuning still required',
    ],
  },
  'prompt-techniques': {
    pros: [
      'Improves consistency across models',
      'Helps debug why outputs fail',
      'Scales from beginner to advanced',
    ],
    cons: [
      'More structure can reduce spontaneity',
      'Model-specific syntax still varies',
      'Requires iteration to internalize',
    ],
  },
  'art-styles': {
    pros: [
      'Fast way to explore visual directions',
      'Style keywords transfer across tools',
      'Easy to build a reusable style library',
    ],
    cons: [
      'Some styles can look generic',
      'Model bias can overpower niche aesthetics',
      'Needs references for consistent series',
    ],
  },
  tutorials: {
    pros: [
      'Step-by-step reduces trial and error',
      'Examples are easy to copy and adapt',
      'Builds a repeatable workflow',
    ],
    cons: [
      'Steps may change with model updates',
      'Time investment to practice',
      'Some tools or features are paywalled',
    ],
  },
  comparisons: {
    pros: [
      'Clarifies tradeoffs between models',
      'Helps match tool to use case',
      'Saves testing time',
    ],
    cons: [
      'Rapid updates can age quickly',
      'Quality differences can be subjective',
      'Pricing and limits shift often',
    ],
  },
  'beginner-guides': {
    pros: [
      'Low-friction entry points',
      'Covers core concepts quickly',
      'Reduces early mistakes',
    ],
    cons: [
      'Simplifies advanced nuance',
      'Still requires hands-on practice',
      'Model differences still matter',
    ],
  },
  video: {
    pros: [
      'Adds motion storytelling fast',
      'Great for short-form concepts',
      'Pairs well with image workflows',
    ],
    cons: [
      'Render times and credit limits',
      'Motion control is less precise',
      'Artifacts are common in long clips',
    ],
  },
  default: {
    pros: [
      'Actionable steps you can apply immediately',
      'Examples reduce trial and error',
      'Works across major image models',
    ],
    cons: [
      'Results vary by model and version',
      'Requires iteration for best quality',
      'Some steps depend on paid tiers',
    ],
  },
};

function guessProsConsCategory(post: BlogPost) {
  const text = `${post.category || ''} ${post.slug} ${post.title} ${post.tags.join(' ')}`.toLowerCase();

  if (text.includes('midjourney')) return 'midjourney';
  if (text.includes('stable diffusion') || text.includes('stable-diffusion') || text.includes('sdxl') || text.includes('controlnet')) {
    return 'stable-diffusion';
  }
  if (text.includes('dall-e') || text.includes('dalle')) return 'dall-e';
  if (text.includes('leonardo')) return 'leonardo';
  if (text.includes('flux')) return 'flux';
  if (text.includes('comparison') || text.includes(' vs ')) return 'comparisons';
  if (text.includes('beginner') || text.includes('first')) return 'beginner-guides';
  if (text.includes('style') || text.includes('painting') || text.includes('pixel') || text.includes('watercolor') || text.includes('anime')) {
    return 'art-styles';
  }
  if (text.includes('prompt') || text.includes('prompting')) return 'prompt-techniques';
  if (text.includes('tutorial') || text.includes('guide') || text.includes('how to')) return 'tutorials';
  if (text.includes('video') || text.includes('motion')) return 'video';

  return null;
}

function getProsCons(post: BlogPost) {
  const pros = Array.isArray(post.pros) ? post.pros.filter((item) => typeof item === 'string') : [];
  const cons = Array.isArray(post.cons) ? post.cons.filter((item) => typeof item === 'string') : [];

  if (pros.length || cons.length) {
    return { pros, cons };
  }

  const categoryKey = guessProsConsCategory(post);
  if (categoryKey && PROS_CONS_BY_TOPIC[categoryKey]) {
    return PROS_CONS_BY_TOPIC[categoryKey];
  }

  return PROS_CONS_BY_TOPIC.default;
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

  const canonical = canonicalUrl(`/blog/${slug}`);
  const policy = getEditorialPolicy(post.editorialState);

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

  const relatedPosts = getRelatedPosts(slug, 3);
  const editorialPolicy = getEditorialPolicy(post.editorialState);
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
  const prosCons = getProsCons(post);

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
      <ReadProgressBar />
      
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

            <dl className="mb-8 grid gap-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-4 text-sm sm:grid-cols-3">
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

              <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
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

