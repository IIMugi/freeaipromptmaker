import type { Metadata } from 'next';
import { BlogIndexClient } from '@/components/Blog/BlogIndexClient';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'AI Prompt Blog - Prompt Engineering Guides & Tutorials',
  description:
    'Browse practical prompt engineering guides, model-specific tutorials, and AI art workflows for Midjourney, Flux, DALL-E, and Stable Diffusion.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Free AI Prompt Maker Blog - Practical Prompt Engineering Guides',
    description:
      'Production-ready tutorials and tactics for better prompts across top AI image models.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return <BlogIndexClient posts={posts} />;
}
