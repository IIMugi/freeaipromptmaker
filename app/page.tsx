import type { Metadata } from 'next';
import { HeroSection } from '@/components/Hero/HeroSection';
import { PromptBuilderLazy as PromptBuilder } from '@/components/Generator/PromptBuilderLazy';
import { HowPromptFormattingWorks } from '@/components/Home/HowPromptFormattingWorks';
import { SupportedModels } from '@/components/Home/SupportedModels';
import { VerifiedGuides } from '@/components/Home/VerifiedGuides';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: { absolute: 'Free AI Prompt Generator for Midjourney, Stable Diffusion & Flux' },
  description:
    'Free AI image prompt generator: describe your image, add style, lighting and camera details, and copy a prompt for Midjourney, Stable Diffusion, Flux and more.',
  alternates: { canonical: '/' },
};

export default function Home() {
  const verifiedGuides = getAllPosts({ hubOnly: true }).slice(0, 4);

  return (
    <div className="px-4 pb-20 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-10 pt-6">
        <HeroSection />

        <section id="generator" aria-label="Prompt generator" className="scroll-mt-24">
          <PromptBuilder />
        </section>

        <HowPromptFormattingWorks />
        <SupportedModels />
        <VerifiedGuides posts={verifiedGuides} />
      </div>
    </div>
  );
}
