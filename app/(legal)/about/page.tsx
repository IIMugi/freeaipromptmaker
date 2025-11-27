import type { Metadata } from 'next';
import { Sparkles, Target, Users, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Free AI Prompt Maker - the 100% free visual prompt generator for Midjourney, DALL-E, and Stable Diffusion.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">About Free AI Prompt Maker</h1>
        <p className="text-xl text-slate-400">
          Making AI art accessible to everyone
        </p>
      </div>

      <div className="prose prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-violet-500" />
            Our Mission
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Free AI Prompt Maker was created with a simple goal: to eliminate the
            complexity of writing AI art prompts. We believe that creativity
            shouldn&apos;t be limited by technical knowledge. Whether you&apos;re a
            professional artist or just getting started with AI image generation,
            our visual prompt builder helps you create stunning results without
            memorizing complex parameters.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-500" />
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Visual Prompt Builder
              </h3>
              <p className="text-slate-400 text-sm">
                Click-based interface for creating complex prompts without typing
                long parameter strings.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Multi-Model Support
              </h3>
              <p className="text-slate-400 text-sm">
                Generate prompts optimized for Midjourney, Stable Diffusion SDXL,
                and DALL-E 3.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Style Library
              </h3>
              <p className="text-slate-400 text-sm">
                Curated collection of art styles, lighting options, and camera
                settings.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-2">
                Educational Blog
              </h3>
              <p className="text-slate-400 text-sm">
                Tips, tutorials, and prompt inspiration to improve your AI art
                skills.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-violet-500" />
            Who We&apos;re For
          </h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Beginners</strong> who want to create AI art without the
                learning curve
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Hobbyists</strong> looking for inspiration and new style
                combinations
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Professionals</strong> who want to speed up their prompt
                workflow
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Content creators</strong> generating assets for their
                projects
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Free Forever
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Free AI Prompt Maker is completely free to use. We sustain our service
            through minimal, non-intrusive advertising. Your creativity should
            never be behind a paywall.
          </p>
        </section>
      </div>
    </div>
  );
}

