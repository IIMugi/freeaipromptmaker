import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/Layout/TextPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'How Free AI Prompt Maker works: an open-source browser tool that formats image prompts locally, what it does not claim, and where to inspect the source.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <TextPage
      title="About"
      path="/about"
      lead="Free AI Prompt Maker is a free, open-source set of prompt tools and guides for people who make images with Midjourney, Stable Diffusion, Flux, ChatGPT and Gemini."
    >
      <h2>What the tools do</h2>
      <p>
        You describe an image, pick a style, light and camera, and the generator writes the prompt in the form each
        model expects: flags for Midjourney, a separate negative prompt for Stable Diffusion, plain sentences for Flux,
        ChatGPT and Gemini. Everything runs in your browser. The site does not create images and does not see your
        prompts.
      </p>
      <h2>Who writes the guides</h2>
      <p>
        The guides are written and maintained by Eren Koray. Each one is checked against the tool&apos;s own documentation,
        lists its sources at the end and shows the date it was last checked. How that works is described in the{' '}
        <Link href="/content-standards">content standards</Link>.
      </p>
      <h2>Open source</h2>
      <p>
        The code is public on{' '}
        <a href={SITE.social.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        . Corrections and bug reports are welcome at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or through the{' '}
        <Link href="/contact">contact page</Link>.
      </p>
    </TextPage>
  );
}
