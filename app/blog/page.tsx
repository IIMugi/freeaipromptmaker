import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Seo/Breadcrumbs';
import { FlagText } from '@/components/Blog/FlagText';
import { POSTS_PER_PAGE, categoryLabel, getAllPosts, type BlogPostMeta } from '@/lib/blog';
import { formatDate } from '@/lib/utils';

const description =
  'Copy-paste prompt guides for Midjourney, Stable Diffusion, Flux and Leonardo AI, checked against each tool’s own documentation and dated when last verified.';

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { page } = await searchParams;
  const pageNumber = page && /^[1-9]\d*$/.test(page) ? Number(page) : 1;
  const canonical = pageNumber > 1 ? `/blog?page=${pageNumber}` : '/blog';
  return {
    title: pageNumber > 1 ? `AI Prompt Guides, Page ${pageNumber}` : 'AI Prompt Blog - Prompt Engineering Guides',
    description,
    alternates: { canonical },
    openGraph: {
      title: 'AI Prompt Guides - Free AI Prompt Maker',
      description: 'Copy-paste prompt guides checked against each tool’s own documentation.',
    },
  };
}

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

function groupByCategory(posts: BlogPostMeta[]) {
  const groups = new Map<string, BlogPostMeta[]>();
  for (const post of posts) {
    const key = categoryLabel(post.category);
    groups.set(key, [...(groups.get(key) ?? []), post]);
  }
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const posts = getAllPosts({ hubOnly: true });
  const pageCount = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const page = pageParam === undefined ? 1 : /^[1-9]\d*$/.test(pageParam) ? Number(pageParam) : NaN;
  if (!Number.isInteger(page) || page > pageCount) notFound();

  const pagePosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const latest = page === 1 ? pagePosts.slice(0, 3) : [];
  const groups = groupByCategory(page === 1 ? pagePosts.slice(3) : pagePosts);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Breadcrumbs items={[{ name: 'Guides', path: '/blog' }]} visible={false} />
      <header className="max-w-3xl pb-10 pt-10 sm:pt-14">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.25rem)] text-ink">Prompt guides</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2 sm:text-xl">
          Copy-paste prompts and settings for Midjourney, Stable Diffusion, Flux and Leonardo. Each guide is checked
          against the tool&apos;s own documentation and shows when it was last checked.
        </p>
      </header>

      {latest.length ? (
        <section aria-labelledby="latest-title" className="border-t-2 border-ink pt-5">
          <h2 id="latest-title" className="text-lg font-semibold text-ink">
            Recently updated
          </h2>
          <ul className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {latest.map((post) => (
              <li key={post.slug}>
                <p className="text-sm text-role-style">{categoryLabel(post.category)}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-1.5 block font-display text-[1.6rem] text-ink hover:text-accent hover:underline hover:decoration-2 hover:underline-offset-4"
                >
                  <FlagText text={post.title} />
                </Link>
                <p className="mt-2 leading-relaxed text-ink-2">
                  <FlagText text={post.description} />
                </p>
                <p className="mt-2 text-sm text-ink-3">
                  Updated {formatDate(post.lastVerified ?? post.date)}, {post.readTime}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-16 grid gap-x-12 gap-y-14 lg:grid-cols-2">
        {groups.map(([label, items]) => (
          <section key={label} aria-label={label}>
            <h2 className="font-display text-[1.9rem] text-ink">{label}</h2>
            <ul className="mt-4 border-t border-line">
              {items.map((post) => (
                <li key={post.slug} className="border-b border-line py-4">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-semibold text-ink hover:text-accent hover:underline hover:underline-offset-4"
                  >
                    <FlagText text={post.title} />
                  </Link>
                  <p className="mt-1 line-clamp-2 text-[0.95rem] text-ink-2">
                    <FlagText text={post.description} />
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {pageCount > 1 ? (
        <nav aria-label="Guide pages" className="mt-14 flex flex-wrap gap-2">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
            <Link
              key={number}
              href={number === 1 ? '/blog' : `/blog?page=${number}`}
              aria-current={number === page ? 'page' : undefined}
              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-control border px-3 ${
                number === page ? 'border-accent bg-accent-wash text-ink' : 'border-line text-ink-2 hover:text-ink'
              }`}
            >
              {number}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
