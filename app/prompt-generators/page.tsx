import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
  getAllModelSlugs,
  modelDisplayNames,
  promptUseCases,
} from '@/data/prompt-use-cases';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeaipromptmaker.com';

export const metadata: Metadata = {
  title: 'AI Prompt Generators by Use Case',
  description:
    'Browse prompt generators by use case and model, including anime, logos, product photography, and cinematic portraits.',
  keywords: [
    'prompt generator by use case',
    'ai prompt generator hub',
    'anime prompt generator',
    'logo prompt generator',
    'product photography prompt generator',
  ],
  alternates: {
    canonical: '/prompt-generators',
  },
  openGraph: {
    title: 'AI Prompt Generators by Use Case',
    description:
      'Explore model-specific prompt generator pages for top creative workflows.',
    url: `${siteUrl}/prompt-generators`,
  },
};

export default function PromptGeneratorsHubPage() {
  const modelChips = getAllModelSlugs().slice(0, 6);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="section-shell rounded-2xl p-6 md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
          <Sparkles className="h-3.5 w-3.5" />
          Prompt Generator Hub
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
          Prompt generators for every visual workflow
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
          Select a use case, then pick a model-specific generator page. Each page includes examples,
          negatives, and model guidance for faster output quality.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promptUseCases.map((useCase) => (
          <article key={useCase.slug} className="section-shell rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-white">{useCase.title}</h2>
            <p className="mt-2 text-sm text-slate-300 line-clamp-3">{useCase.intent}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {useCase.keywords.slice(0, 2).map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-white/12 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-200"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <div className="mt-5 space-y-2">
              <Link
                href={`/prompt-generator-for/${useCase.slug}`}
                className="inline-flex w-full items-center justify-between rounded-xl border border-cyan-300/35 bg-cyan-300/12 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-300/18"
              >
                Open generic generator
                <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="flex flex-wrap gap-1.5">
                {modelChips.map((model) => (
                  <Link
                    key={`${useCase.slug}-${model}`}
                    href={`/${model}/prompt-generator-for/${useCase.slug}`}
                    className="rounded-full border border-white/12 bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-200 hover:bg-white/[0.08]"
                  >
                    {modelDisplayNames[model]}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
