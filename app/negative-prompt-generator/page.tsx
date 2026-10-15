import type { Metadata } from 'next';
import Link from 'next/link';
import { NegativePromptGenerator } from '@/components/NegativePrompt/NegativePromptGenerator';
import { Breadcrumbs } from '@/components/Seo/Breadcrumbs';
import { canonicalUrl } from '@/lib/seo';

const title = 'Negative Prompt Generator for SDXL, SD 1.5, Pony & Midjourney';
const description =
  'Free negative prompt generator: pick your model and what to avoid, then copy a negative prompt for SDXL, SD 1.5, Illustrious, Pony, Leonardo or Midjourney.';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: canonicalUrl('/negative-prompt-generator') },
  openGraph: { title, description, url: canonicalUrl('/negative-prompt-generator'), type: 'website' },
};

const support = [
  { model: 'SD 1.5, SDXL', field: 'Yes, a separate field', tip: 'Start short; add terms only for problems you see' },
  { model: 'Illustrious XL', field: 'Yes', tip: 'Start from the model card list' },
  { model: 'Pony Diffusion V6 XL', field: 'Supported, usually not needed', tip: 'Put the score_9 … score_4_up string in the positive prompt' },
  { model: 'Leonardo', field: 'Some models only', tip: 'Phoenix, Ideogram 3.0 and older presets; toggle it under Advanced Settings' },
  { model: 'Midjourney', field: '--no parameter', tip: 'Each word after --no is read separately' },
  { model: 'FLUX.1', field: 'No standard field', tip: 'Describe what you want instead of what to avoid' },
];

const link = 'text-accent underline underline-offset-4 hover:decoration-2';
const sectionTitle = 'font-display text-[clamp(1.75rem,3.4vw,2.4rem)] text-ink';

export default function NegativePromptGeneratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <Breadcrumbs items={[{ name: 'Negative prompt generator', path: '/negative-prompt-generator' }]} visible={false} />
      <header className="max-w-3xl pb-8 pt-10 sm:pt-14">
        <h1 className="font-display text-[clamp(2.5rem,6vw,4.25rem)] text-ink">Negative Prompt Generator</h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-2 sm:text-xl">
          Pick your model and what you want to keep out of the image, then copy the negative prompt. The lists come from
          our{' '}
          <Link href="/blog/2025-11-29-stable-diffusion-negative-prompts-guide" className={link}>
            negative prompts guide
          </Link>{' '}
          and the official model cards, with duplicates removed.
        </p>
      </header>

      <NegativePromptGenerator />

      <div className="mt-24 grid gap-x-16 gap-y-16 lg:grid-cols-2">
        <section aria-labelledby="how-title">
          <h2 id="how-title" className={sectionTitle}>
            How to use it
          </h2>
          <ol className="prose-text mt-4">
            <li>Choose the model you generate with. The base list changes per model.</li>
            <li>Add only the categories that match a problem you actually see, such as extra fingers or a watermark.</li>
            <li>
              Copy the result into the <strong>Negative prompt</strong> field (or, for Midjourney, to the end of your
              prompt).
            </li>
            <li>Generate with a fixed seed, then remove terms that make no difference. Shorter lists are easier to control.</li>
          </ol>
        </section>

        <section aria-labelledby="tips-title">
          <h2 id="tips-title" className={sectionTitle}>
            Tips
          </h2>
          <ul className="prose-text mt-4">
            <li>Do not exclude <code className="font-mono text-ink">blurry</code> if you asked for shallow depth of field or motion blur; the two fight.</li>
            <li>Skip the text and watermark list when the image should contain text, such as a poster or a sign.</li>
            <li>Hand terms reduce mistakes but do not reliably fix them. Change the pose, crop closer or inpaint the hand.</li>
            <li>The safe-for-work list lowers the chance of unwanted content but is not a safety filter.</li>
          </ul>
        </section>
      </div>

      <section aria-labelledby="support-title" className="mt-20">
        <h2 id="support-title" className={sectionTitle}>
          Which models support negative prompts?
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-[0.95rem]">
            <thead>
              <tr className="border-b-2 border-ink text-ink">
                <th scope="col" className="py-2.5 pr-4 font-semibold">Model or tool</th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">Negative prompt</th>
                <th scope="col" className="py-2.5 font-semibold">What to do</th>
              </tr>
            </thead>
            <tbody>
              {support.map((row) => (
                <tr key={row.model} className="border-b border-line align-top">
                  <th scope="row" className="py-3.5 pr-4 font-semibold text-ink">{row.model}</th>
                  <td className="py-3.5 pr-4 text-ink-2">{row.field}</td>
                  <td className="py-3.5 text-ink-2">{row.tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-8 max-w-2xl leading-relaxed text-ink-2">
          More lists and per-model details:{' '}
          <Link href="/blog/2025-11-29-stable-diffusion-negative-prompts-guide" className={link}>
            Stable Diffusion negative prompts
          </Link>
          ,{' '}
          <Link href="/blog/2026-02-22-master-leonardo-ai-negative-prompts" className={link}>
            Leonardo negative prompts
          </Link>
          . For the main prompt, use the{' '}
          <Link href="/" className={link}>
            prompt generator
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
