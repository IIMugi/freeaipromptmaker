import type { Metadata } from 'next';
import Link from 'next/link';
import { NegativePromptGenerator } from '@/components/NegativePrompt/NegativePromptGenerator';
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

export default function NegativePromptGeneratorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <p className="text-sm font-medium text-[var(--accent-primary)]">Free, runs in your browser</p>
      <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
        Negative Prompt Generator
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
        Pick your model and what you want to keep out of the image, then copy the negative prompt.
        The lists come from our{' '}
        <Link href="/blog/2025-11-29-stable-diffusion-negative-prompts-guide" className="text-[var(--accent-primary)] hover:underline">
          negative prompts guide
        </Link>{' '}
        and the official model cards, with duplicates removed.
      </p>

      <div className="mt-8">
        <NegativePromptGenerator />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">How to use it</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 leading-relaxed text-[var(--text-secondary)]">
          <li>Choose the model you generate with. The base list changes per model.</li>
          <li>Add only the categories that match a problem you actually see, such as extra fingers or a watermark.</li>
          <li>
            Copy the result into the <strong className="text-[var(--text-primary)]">Negative prompt</strong> field (or, for
            Midjourney, to the end of your prompt).
          </li>
          <li>Generate with a fixed seed, then remove terms that make no difference. Shorter lists are easier to control.</li>
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Which models support negative prompts?</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border-default)]">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="bg-[var(--surface-raised)] text-[var(--text-primary)]">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Model or tool</th>
                <th scope="col" className="px-4 py-3 font-semibold">Negative prompt</th>
                <th scope="col" className="px-4 py-3 font-semibold">What to do</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-default)] text-[var(--text-secondary)]">
              {support.map((row) => (
                <tr key={row.model}>
                  <th scope="row" className="px-4 py-3 font-medium text-[var(--text-primary)]">{row.model}</th>
                  <td className="px-4 py-3">{row.field}</td>
                  <td className="px-4 py-3">{row.tip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Tips</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-[var(--text-secondary)]">
          <li>Do not exclude <code>blurry</code> if you asked for shallow depth of field or motion blur; the two fight.</li>
          <li>Skip the text and watermark list when the image should contain text, such as a poster or a sign.</li>
          <li>Hand terms reduce mistakes but do not reliably fix them. Change the pose, crop closer or inpaint the hand.</li>
          <li>The safe-for-work list lowers the chance of unwanted content but is not a safety filter.</li>
        </ul>
        <p className="mt-6 text-[var(--text-secondary)]">
          More lists and per-model details:{' '}
          <Link href="/blog/2025-11-29-stable-diffusion-negative-prompts-guide" className="text-[var(--accent-primary)] hover:underline">
            Stable Diffusion negative prompts
          </Link>
          ,{' '}
          <Link href="/blog/2026-02-22-master-leonardo-ai-negative-prompts" className="text-[var(--accent-primary)] hover:underline">
            Leonardo negative prompts
          </Link>
          . For the main prompt, use the{' '}
          <Link href="/#generator" className="text-[var(--accent-primary)] hover:underline">
            prompt generator
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
