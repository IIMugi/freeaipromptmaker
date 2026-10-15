import Link from 'next/link';
import { getRelatedPromptUseCases, type PromptUseCase } from '@/data/prompt-use-cases';

interface PromptLandingPageProps {
  useCase: PromptUseCase;
}

const iterationRows = [
  ['1', 'Subject and action', 'Count, pose, placement, and unwanted additions'],
  ['2', 'Composition and camera terms', 'Framing, crop, viewpoint, and focal emphasis'],
  ['3', 'Lighting and color terms', 'Direction, contrast, palette, and visibility'],
  ['4', 'Model-specific controls', 'Seed, aspect ratio, strength, and interface settings used'],
] as const;

export function PromptLandingPage({ useCase }: PromptLandingPageProps) {
  const relatedUseCases = getRelatedPromptUseCases(useCase.slug, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <div className="section-shell rounded-2xl p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">AI Prompt Generator</p>
        <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
          {`Prompt Generator for ${useCase.title}`}
        </h1>
        <p className="mt-4 text-slate-300">{useCase.intent}</p>
        <p className="mt-2 text-sm text-slate-400">{useCase.intro}</p>

      </div>

      <section className="mt-8 section-shell rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white">Prompt examples</h2>
        <p className="mt-2 text-sm text-slate-300">
          These locally authored, text-only starting points were not independently tested against image outputs.
          Change one variable at a time and record what the current model and interface produce.
        </p>
        <div className="mt-5 space-y-3">
          {useCase.samplePrompts.map((prompt) => (
            <div key={prompt} className="rounded-xl border border-white/12 bg-[#12223d]/70 p-4">
              <code className="whitespace-pre-wrap text-sm text-slate-100">{prompt}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="section-shell rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white">Terms to test, if supported</h2>
          <p className="mt-2 text-sm text-slate-300">
            Negative-prompt support varies by model and interface. Treat these terms as hypotheses, not guarantees.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {useCase.negatives.map((item) => (
              <li key={item} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="section-shell rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white">Model and interface notes</h2>
          <p className="mt-3 text-sm text-slate-300">
            This page does not rank models. Check each provider’s current interface or documentation for
            supported parameters.
          </p>
          <div className="mt-5 space-y-2">
            <Link
              href="/#generator"
              className="inline-flex w-full items-center justify-between rounded-xl border border-cyan-300/35 bg-cyan-300/12 px-4 py-3 text-sm text-cyan-100 hover:bg-cyan-300/18"
            >
              Open Prompt Generator
            </Link>
            <Link
              href="/blog"
              className="inline-flex w-full items-center justify-between rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-slate-100 hover:bg-white/10"
            >
              Read prompt guides
            </Link>
          </div>

        </div>
      </section>

      <section className="mt-8 section-shell rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-semibold text-white">Iteration worksheet</h2>
        <p className="mt-2 text-sm text-slate-300">
          Save the prompt, settings, and output together. Compare one controlled change per step.
        </p>
        <div className="mt-5 overflow-x-auto" role="region" aria-label="Prompt iteration worksheet" tabIndex={0}>
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/15 text-slate-100">
                <th className="px-3 py-3 font-semibold" scope="col">Step</th>
                <th className="px-3 py-3 font-semibold" scope="col">Change one variable</th>
                <th className="px-3 py-3 font-semibold" scope="col">Record</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {iterationRows.map(([step, change, record]) => (
                <tr key={step} className="border-b border-white/10 last:border-0">
                  <th className="px-3 py-3 font-medium text-cyan-100" scope="row">{step}</th>
                  <td className="px-3 py-3">{change}</td>
                  <td className="px-3 py-3">{record}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-8 section-shell rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold text-white">Manual review checklist</h2>
        <ul className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
          {[
            'Count and placement of subjects',
            'Text legibility and spelling',
            'Anatomy, geometry, and edge artifacts',
            'Rights, trademarks, and brand requirements',
          ].map((item) => (
            <li key={item} className="rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3">{item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 section-shell rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-semibold text-white">Related prompt generators</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {relatedUseCases.map((item) => (
            <Link
              key={item.slug}
              href={`/prompt-generator-for/${item.slug}`}
              className="rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-slate-100 hover:border-cyan-300/40 hover:bg-cyan-300/8"
            >
              {`Prompt Generator for ${item.title}`}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
