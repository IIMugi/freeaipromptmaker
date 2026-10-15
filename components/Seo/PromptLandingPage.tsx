import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ExamplePrompt, UseCaseBuilder } from '@/components/UseCase/UseCaseBuilder';
import { countExamples, getRelatedPromptUseCases, getUseCaseTopic, type PromptUseCase } from '@/data/prompt-use-cases';
import { getPostBySlug } from '@/lib/blog';

interface PromptLandingPageProps {
  useCase: PromptUseCase;
}

const link = 'text-[var(--accent-primary)] hover:underline';

export function PromptLandingPage({ useCase }: PromptLandingPageProps) {
  const relatedUseCases = getRelatedPromptUseCases(useCase.slug, 4);
  const guides = useCase.guides.flatMap((slug) => {
    const post = getPostBySlug(slug);
    return post ? [{ slug, title: post.title }] : [];
  });
  const total = countExamples(useCase);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-tertiary)]">
        <Link href="/prompt-generators" className="hover:text-[var(--text-primary)]">
          Prompt generators
        </Link>
        <span aria-hidden> / </span>
        <span>{useCase.name}</span>
      </nav>
      <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
        {useCase.h1}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">{useCase.lead}</p>

      <div className="mt-8">
        <UseCaseBuilder config={useCase.builder} />
      </div>

      <section className="mt-14" aria-labelledby="examples">
        <h2 id="examples" className="text-2xl font-semibold text-[var(--text-primary)]">
          {`${total} ${getUseCaseTopic(useCase)} prompts to copy`}
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--text-secondary)]">
          Written in keyword style, so they work in Midjourney, Stable Diffusion and Flux as they are. For ChatGPT or
          Gemini you can paste them as well, or rebuild one in the generator above with the ChatGPT / Gemini format.
        </p>
        {useCase.examples.map((group) => (
          <div key={group.heading} className="mt-8">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{group.heading}</h3>
            <ul className="mt-3 space-y-2.5">
              {group.prompts.map((prompt) => (
                <ExamplePrompt key={prompt} text={prompt} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-14" aria-labelledby="tips">
        <h2 id="tips" className="text-2xl font-semibold text-[var(--text-primary)]">Tips</h2>
        <ul className="mt-4 list-disc space-y-2.5 pl-5 leading-relaxed text-[var(--text-secondary)]">
          {useCase.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
        <p className="mt-6 leading-relaxed text-[var(--text-secondary)]">
          Need a longer negative prompt? Use the{' '}
          <Link href="/negative-prompt-generator" className={link}>
            negative prompt generator
          </Link>
          . For any other subject, the{' '}
          <Link href="/#generator" className={link}>
            main prompt generator
          </Link>{' '}
          has more styles and settings.
        </p>
      </section>

      {guides.length > 0 && (
        <section className="mt-14" aria-labelledby="guides">
          <h2 id="guides" className="text-2xl font-semibold text-[var(--text-primary)]">Related guides</h2>
          <ul className="mt-4 space-y-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <Link href={`/blog/${guide.slug}`} className={link}>
                  {guide.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-14" aria-labelledby="related">
        <h2 id="related" className="text-2xl font-semibold text-[var(--text-primary)]">More prompt generators</h2>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {relatedUseCases.map((item) => (
            <Link
              key={item.slug}
              href={`/prompt-generator-for/${item.slug}`}
              className="flex items-center justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
            >
              {item.h1}
              <ArrowRight className="h-4 w-4 text-[var(--text-tertiary)]" aria-hidden />
            </Link>
          ))}
          <Link
            href="/prompt-generators"
            className="flex items-center justify-between rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-primary)]"
          >
            All prompt generators
            <ArrowRight className="h-4 w-4 text-[var(--text-tertiary)]" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
