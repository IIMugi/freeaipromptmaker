'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Search,
  Sparkles,
  Tag,
} from 'lucide-react';
import { AdUnit } from '@/components/Ads/AdUnit';
import type { BlogPostMeta } from '@/lib/blog';

const POSTS_PER_PAGE = 12;

const categoryStyles: Record<string, { gradient: string }> = {
  midjourney: {
    gradient: 'from-sky-500/40 via-cyan-400/25 to-transparent',
  },
  'stable-diffusion': {
    gradient: 'from-emerald-500/35 via-teal-400/25 to-transparent',
  },
  'dall-e': {
    gradient: 'from-rose-500/35 via-orange-400/20 to-transparent',
  },
  tutorials: {
    gradient: 'from-indigo-500/35 via-sky-400/20 to-transparent',
  },
  default: {
    gradient: 'from-cyan-500/35 via-sky-400/20 to-transparent',
  },
};

function toLabel(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function toMinutes(readTime: string) {
  const match = readTime.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getPostStyle(category?: string) {
  return categoryStyles[category?.toLowerCase() || ''] || categoryStyles.default;
}

interface BlogIndexClientProps {
  posts: BlogPostMeta[];
}

export function BlogIndexClient({ posts }: BlogIndexClientProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPage(1);
  };

  const categories = useMemo(() => {
    const map = new Map<string, number>();

    for (const post of posts) {
      if (!post.category) continue;
      map.set(post.category, (map.get(post.category) || 0) + 1);
    }

    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([slug, count]) => ({
        slug,
        label: toLabel(slug),
        count,
      }));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const categoryPass = activeCategory === 'all' || post.category === activeCategory;

      if (!categoryPass) return false;
      if (!loweredQuery) return true;

      const haystack = [
        post.title,
        post.description,
        ...(post.tags || []),
        post.category || '',
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(loweredQuery);
    });
  }, [activeCategory, posts, query]);

  const averageReadMinutes = useMemo(() => {
    if (posts.length === 0) return 0;

    const totalMinutes = posts.reduce((sum, post) => sum + toMinutes(post.readTime), 0);
    return Math.max(1, Math.round(totalMinutes / posts.length));
  }, [posts]);

  const featuredPost = filteredPosts[0];
  const listPosts = filteredPosts.slice(1);
  const totalPages = Math.max(1, Math.ceil(listPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  const paginatedPosts = listPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 md:pt-16">
      <section className="section-shell overflow-hidden p-6 sm:p-8 md:p-10">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute -left-28 bottom-0 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            Prompt Engineering Hub
          </div>

          <div className="space-y-3">
            <h1 className="text-balance text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
              Tactical guides for better prompts and better outputs.
            </h1>
            <p className="max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Find model-specific playbooks, practical workflows, and copy-ready examples for
              Midjourney, Flux, DALL-E, and Stable Diffusion.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-2xl font-semibold text-white">{posts.length}</div>
              <div className="text-xs uppercase tracking-[0.12em] text-slate-300">Published Guides</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-2xl font-semibold text-white">{categories.length}</div>
              <div className="text-xs uppercase tracking-[0.12em] text-slate-300">Core Topics</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-2xl font-semibold text-white">{averageReadMinutes} min</div>
              <div className="text-xs uppercase tracking-[0.12em] text-slate-300">Avg. Read Time</div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <AdUnit
          slot="BLOG_TOP_RESPONSIVE"
          format="auto"
          minHeight={250}
          className="rounded-2xl border border-white/10 bg-slate-900/40"
        />
      </div>

      <section className="section-shell mt-8 p-5 sm:p-6">
        <div className="flex flex-col gap-4">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              placeholder="Search by title, topic, or tag..."
              className="w-full rounded-xl border border-white/10 bg-black/35 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/25"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/25 px-2.5 py-1 text-xs font-medium text-slate-300">
              <Filter className="h-3.5 w-3.5" />
              Filters
            </span>

            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeCategory === 'all'
                  ? 'bg-cyan-400/25 text-cyan-100'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              All ({posts.length})
            </button>

            {categories.map((category) => (
              <button
                type="button"
                key={category.slug}
                onClick={() => handleCategoryChange(category.slug)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeCategory === category.slug
                    ? 'bg-cyan-400/25 text-cyan-100'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400">
            Showing {filteredPosts.length} result{filteredPosts.length === 1 ? '' : 's'}
          </p>
        </div>
      </section>

      {featuredPost ? (
        <section className="mt-8 space-y-6">
          <article className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900/45">
            <div className="grid md:grid-cols-[1.15fr_1fr]">
              <div className="relative min-h-[280px] overflow-hidden md:min-h-[360px]">
                {featuredPost.image ? (
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      getPostStyle(featuredPost.category).gradient
                    }`}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              <div className="space-y-5 p-6 sm:p-7 md:p-8">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-400/12 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.13em] text-cyan-100">
                  Featured
                </span>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="block text-2xl font-semibold leading-snug text-white transition hover:text-cyan-200 sm:text-3xl"
                >
                  {featuredPost.title}
                </Link>

                <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                  {featuredPost.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(featuredPost.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {featuredPost.readTime}
                  </span>
                  {featuredPost.category ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                      <Tag className="h-3.5 w-3.5" />
                      {toLabel(featuredPost.category)}
                    </span>
                  ) : null}
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-2.5 text-sm font-medium text-slate-950 transition hover:brightness-110"
                >
                  Read Full Guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>

          {paginatedPosts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {paginatedPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/45 transition hover:border-cyan-300/45"
                >
                  <div className="relative h-44 overflow-hidden">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${
                          getPostStyle(post.category).gradient
                        }`}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-slate-600">|</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="line-clamp-2 text-lg font-semibold leading-snug text-white transition hover:text-cyan-200"
                    >
                      {post.title}
                    </Link>

                    <p className="mt-2 line-clamp-3 text-sm text-slate-300">{post.description}</p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-200 transition hover:gap-2"
                    >
                      Read guide
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ) : (
        <section className="section-shell mt-8 p-8 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="mt-3 text-xl font-semibold text-white">No matching guides</h2>
          <p className="mt-2 text-sm text-slate-300">
            Try clearing filters or using broader keywords.
          </p>
        </section>
      )}

      {listPosts.length > POSTS_PER_PAGE ? (
        <section className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage <= 1}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            Page {safePage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage >= totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </section>
      ) : null}

      <section className="section-shell mt-10 p-8 text-center sm:p-10">
        <h2 className="text-2xl font-semibold text-white sm:text-3xl">
          Want better images from the same prompt?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
          Build cleaner prompts with model-aware controls, then test your output quality in fewer
          iterations.
        </p>
        <Link
          href="/#generator"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
        >
          Open Prompt Generator
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
