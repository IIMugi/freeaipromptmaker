import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - AI Art Tips & Prompt Guides',
  description:
    'Expert tips, tutorials, and comprehensive guides for creating stunning AI art with Midjourney, Stable Diffusion, and DALL-E.',
  openGraph: {
    title: 'Free AI Prompt Maker Blog - AI Art Tips & Guides',
    description: 'Expert tutorials for Midjourney, Stable Diffusion, and DALL-E',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Blog</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Expert tips, tutorials, and inspiration for creating stunning AI art
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid gap-8">
          {/* Featured Post (first one) */}
          {posts[0] && (
            <article className="group bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-2xl border border-slate-700 hover:border-violet-500/50 transition-all duration-300 overflow-hidden">
              {posts[0].image && (
                <div className="relative w-full h-64 md:h-80 overflow-hidden">
                  <Image
                    src={posts[0].image}
                    alt={posts[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                </div>
              )}
              <Link href={`/blog/${posts[0].slug}`} className="block p-8">
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(posts[0].date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {posts[0].readTime}
                  </span>
                  {posts[0].category && (
                    <span className="px-2 py-1 bg-violet-500/20 text-violet-400 rounded-full text-xs">
                      {posts[0].category}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors">
                  {posts[0].title}
                </h2>

                <p className="text-slate-400 mb-6 text-lg leading-relaxed">
                  {posts[0].description}
                </p>

                {posts[0].tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {posts[0].tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 text-slate-300 rounded text-xs"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <span className="inline-flex items-center gap-2 text-violet-400 font-medium group-hover:gap-3 transition-all">
                  Read article <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            </article>
          )}

          {/* Rest of the posts */}
          <div className="grid md:grid-cols-2 gap-6">
            {posts.slice(1).map((post) => (
              <article
                key={post.slug}
                className="group bg-slate-800 rounded-xl border border-slate-700 hover:border-violet-500/50 transition-all duration-300 overflow-hidden"
              >
                {post.image && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                  </div>
                )}
                <Link href={`/blog/${post.slug}`} className="block p-6">
                  <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {post.description}
                  </p>

                  <span className="inline-flex items-center gap-1 text-violet-400 text-sm font-medium group-hover:gap-2 transition-all">
                    Read more <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16">
          <div className="inline-block bg-slate-800 px-8 py-6 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-lg">
              No posts yet. Check back soon!
            </p>
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-2xl p-8 border border-violet-500/30">
          <h3 className="text-2xl font-bold text-white mb-2">
            Stay Updated
          </h3>
          <p className="text-slate-400 mb-4">
            New AI art tips and tutorials every week
          </p>
          <p className="text-slate-500 text-sm">
            Follow us on social media for the latest updates
          </p>
        </div>
      </div>
    </div>
  );
}
