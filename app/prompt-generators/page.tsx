import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { promptUseCases } from '@/data/prompt-use-cases';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeaipromptmaker.com';

export const metadata: Metadata = {
  title: 'AI Prompt Generators by Use Case',
  description:
    'Free AI prompt generators by use case: anime, logos, product photography, YouTube thumbnails, pixel art, game concepts, cinematic portraits and more.',
  alternates: {
    canonical: '/prompt-generators',
  },
  openGraph: {
    title: 'AI Prompt Generators by Use Case',
    description:
      'Free AI prompt generators for common image types, with example prompts.',
    url: `${siteUrl}/prompt-generators`,
  },
};

export default function PromptGeneratorsHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="section-shell rounded-2xl p-6 md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
          <Sparkles className="h-3.5 w-3.5" />
          Prompt Generator Hub
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
          Prompt generators for every visual workflow
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
          Pick what you want to make. Each page has example prompts and the terms that matter for
          that kind of image.
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promptUseCases.map((useCase) => (
          <article key={useCase.slug} className="section-shell rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-white">{useCase.title}</h2>
            <p className="mt-2 text-sm text-slate-300 line-clamp-3">{useCase.intent}</p>
            <div className="mt-5 space-y-2">
              <Link
                href={`/prompt-generator-for/${useCase.slug}`}
                className="inline-flex w-full items-center justify-between rounded-xl border border-cyan-300/35 bg-cyan-300/12 px-3 py-2 text-sm text-cyan-100 hover:bg-cyan-300/18"
              >
                Open the generator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
