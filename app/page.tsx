import type { Metadata } from 'next';
import Link from 'next/link';
import { PromptStudio } from '@/components/Builder/PromptStudio';
import { promptUseCases } from '@/data/prompt-use-cases';
import { getAllPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: { absolute: 'Free AI Prompt Generator for Midjourney, Stable Diffusion & Flux' },
  description:
    'Free AI image prompt generator: describe your image, add style, lighting and camera details, and copy a prompt for Midjourney, Stable Diffusion, Flux and more.',
  alternates: { canonical: '/' },
};

const FORMAT_ROWS = [
  {
    format: 'Midjourney',
    written: 'Short keyword phrases, then flags',
    sample: 'red fox in snow, watercolor --ar 4:5 --no text',
    avoid: '--no, single words',
    shape: '--ar flag',
  },
  {
    format: 'Stable Diffusion XL',
    written: 'Comma-separated keywords',
    sample: 'red fox in snow, watercolor',
    avoid: 'Separate negative prompt box',
    shape: 'Image size, e.g. 896 × 1152',
  },
  {
    format: 'Flux',
    written: 'One plain sentence',
    sample: 'A red fox in snow, watercolor.',
    avoid: 'No standard field',
    shape: 'Set in your app',
  },
  {
    format: 'ChatGPT / Gemini',
    written: 'A sentence, shape in words',
    sample: 'A red fox in snow, watercolor. Vertical 4:5 format.',
    avoid: 'No field',
    shape: 'Written in the prompt',
  },
];

export default function Home() {
  const guides = getAllPosts({ hubOnly: true }).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <header className="max-w-3xl pb-8 pt-10 sm:pt-14">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.25rem)] text-ink">Free AI Image Prompt Generator</h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-2 sm:text-xl">
          Describe the picture once. Copy it written the way Midjourney, Stable Diffusion, Flux, ChatGPT or Gemini
          expects. Free, no account, and your prompts never leave your browser.
        </p>
      </header>

      <section id="generator" aria-label="Prompt generator" className="scroll-mt-20">
        <PromptStudio />
      </section>

      <section id="how-formatting-works" aria-labelledby="formats-title" className="mt-24 scroll-mt-20">
        <h2 id="formats-title" className="font-display text-[clamp(1.9rem,4vw,2.75rem)] text-ink">
          Why each model gets a different prompt
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-2">
          The same idea is written four ways. Midjourney reads flags, Stable Diffusion keeps a separate list of things to
          avoid, and Flux, ChatGPT and Gemini read plain sentences.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left text-[0.95rem]">
            <thead>
              <tr className="border-b-2 border-ink text-ink">
                <th scope="col" className="py-2.5 pr-4 font-semibold">Format</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">How it is written</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">Things to avoid</th>
                <th scope="col" className="py-2.5 font-semibold">Aspect ratio</th>
              </tr>
            </thead>
            <tbody>
              {FORMAT_ROWS.map((row) => (
                <tr key={row.format} className="border-b border-line align-top">
                  <th scope="row" className="py-4 pr-4 font-semibold text-ink">{row.format}</th>
                  <td className="py-4 pr-4 text-ink-2">
                    {row.written}
                    <code className="mt-1.5 block font-mono text-sm text-role-style">{row.sample}</code>
                  </td>
                  <td className="py-4 pr-4 text-ink-2">{row.avoid}</td>
                  <td className="py-4 text-ink-2">{row.shape}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-24 grid gap-16 lg:grid-cols-2">
        <section aria-labelledby="use-cases-title">
          <h2 id="use-cases-title" className="font-display text-[clamp(1.75rem,3.4vw,2.4rem)] text-ink">
            Start from a use case
          </h2>
          <p className="mt-3 text-ink-2">Presets and copyable examples for one kind of image.</p>
          <ul className="mt-6 grid grid-cols-1 border-t border-line sm:grid-cols-2 sm:gap-x-8">
            {promptUseCases.map((useCase) => (
              <li key={useCase.slug} className="border-b border-line">
                <Link
                  href={`/prompt-generator-for/${useCase.slug}`}
                  className="flex min-h-12 items-center text-ink hover:text-accent hover:underline hover:underline-offset-4"
                >
                  {useCase.h1.replace(/ Prompt Generator$/, '')}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/prompt-generators" className="mt-5 inline-block text-accent underline underline-offset-4">
            All use cases
          </Link>
        </section>

        <section aria-labelledby="guides-title">
          <h2 id="guides-title" className="font-display text-[clamp(1.75rem,3.4vw,2.4rem)] text-ink">
            Prompt guides
          </h2>
          <p className="mt-3 text-ink-2">Checked against each tool&apos;s own documentation.</p>
          <ul className="mt-6 border-t border-line">
            {guides.map((post) => (
              <li key={post.slug} className="border-b border-line py-4">
                <Link href={`/blog/${post.slug}`} className="font-semibold text-ink hover:text-accent hover:underline hover:underline-offset-4">
                  {post.title}
                </Link>
                <p className="mt-1 text-sm text-ink-3">
                  Updated {formatDate(post.lastVerified ?? post.date)}
                </p>
              </li>
            ))}
          </ul>
          <Link href="/blog" className="mt-5 inline-block text-accent underline underline-offset-4">
            All guides
          </Link>
        </section>
      </div>
    </div>
  );
}
