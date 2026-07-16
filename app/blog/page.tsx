import type { Metadata } from 'next';
import { BlogIndexClient } from '@/components/Blog/BlogIndexClient';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'AI Prompt Blog - Prompt Engineering Guides & Tutorials',
  description:
    'Source-checked prompt and tool references with explicit version and limitation notes.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Free AI Prompt Maker Blog - Practical Prompt Engineering Guides',
    description:
      'Source-checked prompt and tool references with explicit version and limitation notes.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts({ hubOnly: true });

  return <BlogIndexClient posts={posts} />;
}
