import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import GithubSlugger from 'github-slugger';
import { MarkdownRenderer } from '@/components/Blog/MarkdownRenderer';
import { Breadcrumbs } from '@/components/Seo/Breadcrumbs';
import { FlagText } from '@/components/Layout/FlagText';
import { categoryLabel, getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog';
import { articleJsonLd, canonicalUrl, serializeJsonLd } from '@/lib/seo';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Only verified guides get a page. Everything else is a 404 (removed guides are 301/410 in proxy.ts).
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPosts({ hubOnly: true }).map((post) => ({ slug: post.slug }));
}

function getPublishedPost(slug: string) {
  const post = getPostBySlug(slug);
  return post && post.editorialState === 'verified' ? post : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) return { title: 'Post Not Found' };

  const canonical = canonicalUrl(`/blog/${slug}`);
  return {
    // Post titles skip the " | Free AI Prompt Maker" template suffix to stay under ~65 characters in search results.
    title: { absolute: post.title },
    description: post.description,
    keywords: post.tags,
    authors: post.author ? [{ name: post.author }] : undefined,
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: canonical,
      publishedTime: post.date,
      modifiedTime: post.lastVerified,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

function tableOfContents(markdown: string) {
  const slugger = new GithubSlugger();
  const items: Array<{ id: string; title: string }> = [];
  let inCode = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inCode = !inCode;
    if (inCode) continue;
    const heading = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!heading) continue;
    const text = heading[2]!.replace(/[*_`]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
    const id = slugger.slug(text);
    if (heading[1] === '##') items.push({ id, title: text });
  }
  return items;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) notFound();

  const content = post.content.replace(/^#\s+.*\r?\n?/, '').trimStart();
  const toc = tableOfContents(content);
  const related = getRelatedPosts(slug, 4);
  const updated = post.lastVerified ?? post.date;
  const articleSchema = articleJsonLd({
    title: post.title,
    description: post.description,
    pathname: `/blog/${slug}`,
    datePublished: post.date,
    dateModified: post.lastVerified,
    author: post.author || undefined,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />

      <article className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="max-w-3xl pb-8 pt-8 sm:pt-12">
          <Breadcrumbs
            items={[
              { name: 'Guides', path: '/blog' },
              { name: post.title, path: `/blog/${slug}` },
            ]}
          />
          <p className="mt-6 text-[0.95rem] font-medium text-role-style">{categoryLabel(post.category)}</p>
          <h1 className="mt-2 font-display text-[clamp(2.2rem,5vw,3.6rem)] text-ink">
            <FlagText text={post.title} />
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-2 sm:text-xl">
            <FlagText text={post.description} />
          </p>
          <p className="mt-5 text-[0.95rem] text-ink-3">
            By <span className="text-ink-2">{post.author || 'Free AI Prompt Maker'}</span>. Checked against the
            sources listed at the end on <time dateTime={updated}>{formatDate(updated)}</time>. {post.readTime}.
          </p>
        </header>

        <div className="grid gap-x-16 border-t border-line pt-8 xl:grid-cols-[minmax(0,46rem)_minmax(0,1fr)]">
          <div className="min-w-0">
            {toc.length >= 3 ? (
              <details className="mb-8 border-b border-line pb-4 xl:hidden">
                <summary className="flex min-h-10 cursor-pointer items-center font-semibold text-ink">On this page</summary>
                <TocList items={toc} />
              </details>
            ) : null}

            <div className="prose-custom">
              <MarkdownRenderer content={content} />
            </div>

            <section aria-labelledby="try-title" className="mt-14 border-t-2 border-ink pt-6">
              <h2 id="try-title" className="font-display text-[1.9rem] text-ink">
                Build your own prompt
              </h2>
              <p className="mt-2 max-w-xl text-ink-2">
                Describe your image and copy it formatted for Midjourney, Stable Diffusion, Flux, ChatGPT or Gemini.
              </p>
              <Link
                href="/"
                className="mt-5 inline-flex min-h-11 items-center rounded-control bg-accent px-5 font-semibold text-on-accent hover:bg-accent-hover"
              >
                Open the prompt generator
              </Link>
            </section>

            {related.length ? (
              <section aria-labelledby="related-title" className="mt-14">
                <h2 id="related-title" className="text-lg font-semibold text-ink">
                  More guides
                </h2>
                <ul className="mt-3 border-t border-line">
                  {related.map((item) => (
                    <li key={item.slug} className="border-b border-line py-3.5">
                      <Link
                        href={`/blog/${item.slug}`}
                        className="font-semibold text-ink hover:text-accent hover:underline hover:underline-offset-4"
                      >
                        {item.title}
                      </Link>
                      <p className="mt-0.5 text-sm text-ink-3">{categoryLabel(item.category)}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          {toc.length >= 3 ? (
            <aside className="hidden xl:block" aria-labelledby="toc-title">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto border-l border-line pl-6">
                <h2 id="toc-title" className="font-semibold text-ink">
                  On this page
                </h2>
                <TocList items={toc} />
              </div>
            </aside>
          ) : null}
        </div>
      </article>
    </>
  );
}

function TocList({ items }: { items: Array<{ id: string; title: string }> }) {
  return (
    <ol className="mt-3 space-y-1">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className="block py-1 text-[0.95rem] leading-snug text-ink-2 hover:text-accent hover:underline hover:underline-offset-4"
          >
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  );
}
