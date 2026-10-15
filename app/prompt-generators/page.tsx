import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Seo/Breadcrumbs';
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Breadcrumbs items={[{ name: 'Prompt generators', path: '/prompt-generators' }]} visible={false} />
      <header className="max-w-3xl pb-10 pt-10 sm:pt-14">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.25rem)] text-ink">AI prompt generators by use case</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2 sm:text-xl">
          Pick what you want to make. Each page has a generator with presets for that kind of image, formatted for
          Midjourney, Stable Diffusion XL, Flux or ChatGPT, plus example prompts you can copy.
        </p>
      </header>

      <ul className="grid border-t-2 border-ink md:grid-cols-2 md:gap-x-12 xl:grid-cols-3">
        {promptUseCases.map((useCase) => (
          <li key={useCase.slug} className="border-b border-line py-6">
            <Link
              href={`/prompt-generator-for/${useCase.slug}`}
              className="font-display text-[1.6rem] text-ink hover:text-accent hover:underline hover:decoration-2 hover:underline-offset-4"
            >
              {useCase.h1}
            </Link>
            <p className="mt-2 line-clamp-2 font-mono text-sm leading-relaxed text-ink-2">
              {useCase.examples[0]!.prompts[0]}
            </p>
            <p className="mt-2 text-sm text-ink-3">{`Generator + ${countExamples(useCase)} examples`}</p>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-2xl leading-relaxed text-ink-2">
        Something else? The{' '}
        <Link href="/" className="text-accent underline underline-offset-4">
          main prompt generator
        </Link>{' '}
        works for any subject, and the{' '}
        <Link href="/negative-prompt-generator" className="text-accent underline underline-offset-4">
          negative prompt generator
        </Link>{' '}
        builds the list of things to avoid.
      </p>
    </div>
  );
}
