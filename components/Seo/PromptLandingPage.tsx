import Link from 'next/link';
import { ExamplePrompt, UseCaseBuilder } from '@/components/UseCase/UseCaseBuilder';
import { Breadcrumbs } from '@/components/Seo/Breadcrumbs';
import { countExamples, getRelatedPromptUseCases, getUseCaseTopic, type PromptUseCase } from '@/data/prompt-use-cases';
import { getPostBySlug } from '@/lib/blog';

interface PromptLandingPageProps {
  useCase: PromptUseCase;
}

const link = 'text-accent underline underline-offset-4 hover:decoration-2';
const sectionTitle = 'font-display text-[clamp(1.75rem,3.4vw,2.4rem)] text-ink';

export function PromptLandingPage({ useCase }: PromptLandingPageProps) {
  const relatedUseCases = getRelatedPromptUseCases(useCase.slug, 4);
  const guides = useCase.guides.flatMap((slug) => {
    const post = getPostBySlug(slug);
    return post ? [{ slug, title: post.title }] : [];
  });
  const total = countExamples(useCase);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <header className="max-w-3xl pb-8 pt-8 sm:pt-12">
        <Breadcrumbs
          items={[
            { name: 'Prompt generators', path: '/prompt-generators' },
            { name: useCase.name, path: `/prompt-generator-for/${useCase.slug}` },
          ]}
        />
        <h1 className="mt-6 font-display text-[clamp(2.3rem,5.5vw,3.9rem)] text-ink">{useCase.h1}</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2 sm:text-xl">{useCase.lead}</p>
      </header>

      <UseCaseBuilder config={useCase.builder} />

      <div className="mt-24 grid gap-x-16 gap-y-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <section aria-labelledby="examples">
          <h2 id="examples" className={sectionTitle}>
            {`${total} ${getUseCaseTopic(useCase)} prompts to copy`}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-2">
            Written in keyword style, so they work in Midjourney, Stable Diffusion and Flux as they are. For ChatGPT or
            Gemini you can paste them as well, or rebuild one in the generator above with the ChatGPT / Gemini format.
          </p>
          {useCase.examples.map((group) => (
            <div key={group.heading} className="mt-10">
              <h3 className="text-lg font-semibold text-ink">{group.heading}</h3>
              <ul className="mt-2 border-t border-line">
                {group.prompts.map((prompt) => (
                  <ExamplePrompt key={prompt} text={prompt} />
                ))}
              </ul>
            </div>
          ))}
        </section>

        <div className="space-y-14">
          <section aria-labelledby="tips">
            <h2 id="tips" className={sectionTitle}>
              Tips
            </h2>
            <ul className="prose-text mt-4">
              {useCase.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <p className="mt-4 leading-relaxed text-ink-2">
              Need a longer negative prompt? Use the{' '}
              <Link href="/negative-prompt-generator" className={link}>
                negative prompt generator
              </Link>
              . For any other subject, the{' '}
              <Link href="/" className={link}>
                main prompt generator
              </Link>{' '}
              has more styles and settings.
            </p>
          </section>

          {guides.length > 0 && (
            <section aria-labelledby="guides">
              <h2 id="guides" className="text-lg font-semibold text-ink">
                Related guides
              </h2>
              <ul className="mt-3 border-t border-line">
                {guides.map((guide) => (
                  <li key={guide.slug} className="border-b border-line py-3">
                    <Link href={`/blog/${guide.slug}`} className="text-ink hover:text-accent hover:underline hover:underline-offset-4">
                      {guide.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="related">
            <h2 id="related" className="text-lg font-semibold text-ink">
              More prompt generators
            </h2>
            <ul className="mt-3 border-t border-line">
              {relatedUseCases.map((item) => (
                <li key={item.slug} className="border-b border-line">
                  <Link
                    href={`/prompt-generator-for/${item.slug}`}
                    className="flex min-h-12 items-center text-ink hover:text-accent hover:underline hover:underline-offset-4"
                  >
                    {item.h1}
                  </Link>
                </li>
              ))}
              <li className="border-b border-line">
                <Link href="/prompt-generators" className="flex min-h-12 items-center text-accent underline underline-offset-4">
                  All prompt generators
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
