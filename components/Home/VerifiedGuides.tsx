import Link from 'next/link';
import type { BlogPostMeta } from '@/lib/blog';

export function VerifiedGuides({ posts }: { posts: BlogPostMeta[] }) {
  return (
    <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--accent-primary)]">Editorial review</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">Verified guides</h2>
        </div>
        <Link href="/content-standards" className="text-sm font-medium text-[var(--accent-primary)] hover:underline">
          Read the content standards
        </Link>
      </div>

      {posts.length ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-2xl border border-[var(--border-default)] p-5 hover:bg-[var(--surface-raised)]">
              <h3 className="font-semibold text-[var(--text-primary)]">{post.title}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{post.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-5 text-sm leading-relaxed text-[var(--text-secondary)]">
          Existing guides are under source and version review. None are promoted here until that
          review is complete.
        </p>
      )}
    </section>
  );
}
