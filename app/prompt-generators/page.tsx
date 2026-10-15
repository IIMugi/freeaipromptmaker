import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { countExamples, promptUseCases } from '@/data/prompt-use-cases';
import { canonicalUrl } from '@/lib/seo';

const title = 'AI Prompt Generators by Use Case: Anime, Pixel Art, Thumbnails';
const description =
  'Free AI prompt generators by use case: YouTube thumbnails, anime, pixel art, game concepts, logos, product and food photography, and more. Copy-paste examples.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: canonicalUrl('/prompt-generators') },
  openGraph: { title, description, url: canonicalUrl('/prompt-generators'), type: 'website' },
};

export default function PromptGeneratorsHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="text-balance text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
        AI prompt generators by use case
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
        Pick what you want to make. Each page has a generator with presets for that kind of image, formatted for
        Midjourney, Stable Diffusion XL, Flux or ChatGPT, plus example prompts you can copy.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promptUseCases.map((useCase) => (
          <Link
            key={useCase.slug}
            href={`/prompt-generator-for/${useCase.slug}`}
            className="group flex flex-col rounded-3xl border border-[var(--border-default)] bg-[var(--surface-base)] p-5 shadow-[var(--shadow-card)] transition-colors hover:border-[var(--accent-primary)]"
          >
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{useCase.h1}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {useCase.examples[0]!.prompts[0]}
            </p>
            <span className="mt-auto flex items-center justify-between pt-4 text-sm font-medium text-[var(--accent-primary)]">
              {`Generator + ${countExamples(useCase)} examples`}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10 leading-relaxed text-[var(--text-secondary)]">
        Something else? The{' '}
        <Link href="/#generator" className="text-[var(--accent-primary)] hover:underline">
          main prompt generator
        </Link>{' '}
        works for any subject, and the{' '}
        <Link href="/negative-prompt-generator" className="text-[var(--accent-primary)] hover:underline">
          negative prompt generator
        </Link>{' '}
        builds the list of things to avoid.
      </p>
    </div>
  );
}
