'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { BlogPostMeta } from '@/lib/blog';

interface RelatedPostsProps {
  posts: BlogPostMeta[];
  currentSlug: string;
}

/**
 * Related Posts Section
 * SEO: İç linkler, dwell time artırma, crawlability
 */
export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const filteredPosts = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-8 border-t border-slate-800">
      <h2 className="text-2xl font-bold text-white mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group glass-card rounded-xl overflow-hidden hover:scale-[1.02] transition-transform"
          >
            {/* Cover Image */}
            <div className="relative w-full h-40 bg-slate-800">
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-violet-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2">{post.readTime}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA to blog page */}
      <div className="mt-6 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
        >
          View all articles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

