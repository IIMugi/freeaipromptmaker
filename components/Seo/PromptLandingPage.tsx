import Link from 'next/link';
import type { AIModel } from '@/lib/prompt-builder';
import {
  getAllModelSlugs,
  getRelatedPromptUseCases,
  modelDisplayNames,
  modelUseCaseHints,
  type PromptUseCase,
} from '@/data/prompt-use-cases';

interface PromptLandingPageProps {
  useCase: PromptUseCase;
  model?: AIModel;
}

export function PromptLandingPage({ useCase, model }: PromptLandingPageProps) {
  const modelName = model ? modelDisplayNames[model] : null;
  const relatedUseCases = getRelatedPromptUseCases(useCase.slug, 4);
  const modelChips = getAllModelSlugs().slice(0, 6);

  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <div className="section-shell rounded-2xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">
          {modelName ? `${modelName} Prompt Generator` : 'AI Prompt Generator'}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
          {modelName
            ? `${modelName} Prompt Generator for ${useCase.title}`
            : `Prompt Generator for ${useCase.title}`}
        </h1>
        <p className="mt-4 text-slate-300">{useCase.intent}</p>
        <p className="mt-2 text-sm text-slate-400">{useCase.intro}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {useCase.keywords.slice(0, 4).map((keyword) => (
            <span key={keyword} className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs text-slate-200">
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <section className="mt-8 section-shell rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white">Prompt examples</h2>
        <p className="mt-2 text-sm text-slate-300">
          Copy, adapt, and iterate. These are optimized as base directions for {useCase.title.toLowerCase()} workflows.
        </p>
        <div className="mt-5 space-y-3">
          {useCase.samplePrompts.map((prompt) => (
            <div key={prompt} className="rounded-xl border border-white/12 bg-[#12223d]/70 p-4">
              <code className="text-sm text-slate-100 whitespace-pre-wrap">{prompt}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="section-shell rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white">Negative prompt checklist</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {useCase.negatives.map((item) => (
              <li key={item} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="section-shell rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white">Model guidance</h2>
          <p className="mt-3 text-sm text-slate-300">
            {model ? modelUseCaseHints[model] : 'Choose a model based on speed, quality, and control requirements.'}
          </p>
          <div className="mt-5 space-y-2">
            <Link
              href="/#generator"
              className="inline-flex items-center justify-between w-full rounded-xl border border-cyan-300/35 bg-cyan-300/12 px-4 py-3 text-sm text-cyan-100 hover:bg-cyan-300/18"
            >
              Open Prompt Generator
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-between w-full rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-slate-100 hover:bg-white/10"
            >
              Read prompt guides
            </Link>
          </div>

          <div className="mt-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Switch model</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {modelChips.map((chipModel) => {
                const href = `/${chipModel}/prompt-generator-for/${useCase.slug}`;
                const active = chipModel === model;
                return (
                  <Link
                    key={chipModel}
                    href={href}
                    className={
                      active
                        ? 'rounded-full border border-cyan-300/40 bg-cyan-300/12 px-3 py-1 text-xs text-cyan-100'
                        : 'rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 text-xs text-slate-200 hover:bg-white/[0.08]'
                    }
                  >
                    {modelDisplayNames[chipModel]}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Best Models Comparison — unique per use case */}
      <section className="mt-8 section-shell rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white">
          Best AI models for {useCase.title.toLowerCase()}
        </h2>
        <p className="mt-2 text-sm text-slate-300 mb-5">
          Not all models handle {useCase.title.toLowerCase()} equally. Here are our tested recommendations based on output quality, control, and workflow fit.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {useCase.bestModels.map((entry, i) => (
            <div key={entry.name} className="rounded-xl border border-white/12 bg-[#12223d]/50 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300/12 text-xs font-bold text-cyan-200 border border-cyan-300/25">
                  {i + 1}
                </span>
                <h3 className="text-sm font-semibold text-white">{entry.name}</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{entry.reason}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pro Tips — unique actionable advice per use case */}
      <section className="mt-8 section-shell rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white">
          Pro tips for {useCase.title.toLowerCase()} prompts
        </h2>
        <div className="mt-5 space-y-3">
          {useCase.proTips.map((tip, i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className="flex-shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300/10 text-[11px] font-bold text-cyan-200 border border-cyan-300/20 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Expert Guide — 500+ words of unique, in-depth content */}
      <section className="mt-8 section-shell rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white">
          The complete guide to {useCase.title.toLowerCase()} prompt engineering
        </h2>

        <div className="mt-5 prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-white prose-em:text-cyan-200/90 prose-code:text-cyan-200 prose-code:bg-cyan-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm">
          {useCase.expertGuide.split('\n\n').map((paragraph, i) => (
            <p key={i} dangerouslySetInnerHTML={{
              __html: paragraph
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
            }} />
          ))}
        </div>
      </section>

      {/* Related Prompt Generators */}
      <section className="mt-8 section-shell rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold text-white">Related prompt generators</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {relatedUseCases.map((item) => {
            const href = model
              ? `/${model}/prompt-generator-for/${item.slug}`
              : `/prompt-generator-for/${item.slug}`;
            return (
              <Link
                key={item.slug}
                href={href}
                className="rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-slate-100 hover:border-cyan-300/40 hover:bg-cyan-300/8"
              >
                {modelName ? `${modelName} for ${item.title}` : `Prompt Generator for ${item.title}`}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
