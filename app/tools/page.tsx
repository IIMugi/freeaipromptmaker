import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/Seo/Breadcrumbs';
import { aiTools } from '@/data/ai-tools';

export const metadata: Metadata = {
  title: 'Image Tool Reference',
  description:
    'Official links and prompt-format notes for Midjourney, FLUX, Stable Diffusion, Adobe Firefly and OpenAI image generation. No rankings or paid placements.',
  alternates: { canonical: '/tools' },
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Breadcrumbs items={[{ name: 'Image tool reference', path: '/tools' }]} visible={false} />
      <header className="max-w-3xl pb-10 pt-10 sm:pt-14">
        <h1 className="font-display text-[clamp(2.4rem,5.5vw,3.75rem)] text-ink">Image tool reference</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2 sm:text-xl">
          Official links and how each tool reads a prompt. No rankings and no paid placements. Plans and limits change
          often, so check the provider&apos;s page before you pay for anything.
        </p>
      </header>

      <ul className="border-t-2 border-ink">
        {aiTools.map((tool) => (
          <li key={tool.id} className="grid gap-x-10 gap-y-3 border-b border-line py-7 md:grid-cols-[14rem_minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <h2 className="font-display text-[1.6rem] text-ink">{tool.name}</h2>
              <p className="text-sm text-ink-3">{tool.provider}</p>
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-8 items-center text-[0.95rem] text-accent underline underline-offset-4"
              >
                Official site
              </a>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">How it reads prompts</h3>
              <p className="mt-1 leading-relaxed text-ink-2">{tool.promptMode}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink">Check before you use it</h3>
              <p className="mt-1 leading-relaxed text-ink-2">{tool.limitation}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-2xl leading-relaxed text-ink-2">
        Ready to write a prompt? The{' '}
        <Link href="/" className="text-accent underline underline-offset-4">
          prompt generator
        </Link>{' '}
        formats it for Midjourney, Stable Diffusion, Flux, ChatGPT and Gemini.
      </p>
    </div>
  );
}
