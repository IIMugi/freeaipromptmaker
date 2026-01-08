import Link from 'next/link';
import { PromptBuilder } from '@/components/Generator';
import { PromptGallery } from '@/components/Gallery';
import { getAllPosts } from '@/lib/blog';

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Impact.com Site Verification */}
      <span className="hidden">Impact-Site-Verification: 1fda626d-269f-49fc-8dc6-994ceda192c6</span>

      <section id="generator" className="scroll-mt-24">
        <PromptBuilder />
      </section>

      <section className="max-w-6xl mx-auto mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">How the generator works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Build clear, model-ready prompts in minutes. Start with the idea, refine the look, then copy
            and iterate.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-violet-400 mb-2">Step 1</p>
            <h3 className="text-lg font-semibold text-white mb-2">Describe the subject</h3>
            <p className="text-slate-400 text-sm">
              Add the core concept, scene, and mood. The builder turns it into a clean prompt structure.
            </p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-violet-400 mb-2">Step 2</p>
            <h3 className="text-lg font-semibold text-white mb-2">Shape the style</h3>
            <p className="text-slate-400 text-sm">
              Pick visual styles, lighting, and camera cues to control the look without memorizing syntax.
            </p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <p className="text-xs uppercase tracking-wider text-violet-400 mb-2">Step 3</p>
            <h3 className="text-lg font-semibold text-white mb-2">Copy and refine</h3>
            <p className="text-slate-400 text-sm">
              Copy the final prompt, test it in your model, then iterate with small tweaks for consistency.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-16">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Why creators trust our prompts</h2>
            <p className="text-slate-400 mb-6">
              We focus on clarity, repeatability, and real-world model behavior. Every guide and preset is
              built from prompt testing across Midjourney, Stable Diffusion, and DALL-E.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/content-standards"
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600/20 text-violet-300 rounded-lg border border-violet-500/30 hover:bg-violet-600/30 transition-colors"
              >
                Content standards
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 hover:border-slate-600 transition-colors"
              >
                Browse guides
              </Link>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-base font-semibold text-white mb-2">Tested prompt patterns</h3>
              <p className="text-slate-400 text-sm">
                Every preset is written, tested, and refined to avoid guesswork and reduce trial and error.
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-base font-semibold text-white mb-2">Actionable guides</h3>
              <p className="text-slate-400 text-sm">
                Step-by-step tutorials with practical examples for composition, lighting, and style control.
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-base font-semibold text-white mb-2">Transparent disclosure</h3>
              <p className="text-slate-400 text-sm">
                We clearly label ads and affiliate links so you understand how the site is supported.
              </p>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-base font-semibold text-white mb-2">Creator-first design</h3>
              <p className="text-slate-400 text-sm">
                Fast pages, mobile-ready UI, and zero signup required so you can focus on making art.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Latest prompt guides</h2>
            <p className="text-slate-400">
              Practical tutorials and prompt breakdowns you can apply immediately.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-violet-300 hover:text-violet-200 transition-colors"
          >
            View all guides
          </Link>
        </div>
        {latestPosts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-violet-500/40 transition-colors"
              >
                <p className="text-xs uppercase tracking-wider text-violet-400 mb-3">
                  {post.category || 'AI Prompt Guide'}
                </p>
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                  {post.description}
                </p>
                <p className="text-xs text-slate-500">{post.readTime}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-slate-400 text-sm">
            New guides are publishing soon. Check back for fresh tutorials and prompt breakdowns.
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto mt-16">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <h2 className="text-2xl font-bold text-white mb-3">Transparency and support</h2>
          <p className="text-slate-400 mb-6 max-w-3xl">
            We publish clear policies, explain how content is created, and respond to feedback quickly. If
            something looks off, let us know and we will review it.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/content-standards"
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600/20 text-violet-300 rounded-lg border border-violet-500/30 hover:bg-violet-600/30 transition-colors"
            >
              Content standards
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 hover:border-slate-600 transition-colors"
            >
              Privacy policy
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 hover:border-slate-600 transition-colors"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto my-16">
        <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      </div>

      {/* Community Prompts Gallery */}
      <div className="max-w-6xl mx-auto">
        <PromptGallery />
      </div>
    </div>
  );
}
