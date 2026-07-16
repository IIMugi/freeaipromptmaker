import type { Metadata } from 'next';
import Link from 'next/link';
import { HeroSection } from '@/components/Hero/HeroSection';
import { PromptBuilderLazy as PromptBuilder } from '@/components/Generator/PromptBuilderLazy';
import { HowPromptFormattingWorks } from '@/components/Home/HowPromptFormattingWorks';
import { SupportedModels } from '@/components/Home/SupportedModels';
import { VerifiedGuides } from '@/components/Home/VerifiedGuides';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Free AI Prompt Maker',
  description:
    'Format structured image prompts locally, copy model-aware variants, and keep a private browser history.',
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

        <section className="rounded-3xl border border-[var(--border-default)] bg-[var(--surface-raised)] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Trust boundaries</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Prompt formatting runs locally. Optional analytics requires consent. Image analysis is a
            separate provider-backed feature and clearly reports when unavailable. Advertising is
            disabled in this readiness build.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-medium">
            <Link href="/privacy" className="text-[var(--accent-primary)] hover:underline">Privacy</Link>
            <Link href="/content-standards" className="text-[var(--accent-primary)] hover:underline">Content standards</Link>
            <Link href="/contact" className="text-[var(--accent-primary)] hover:underline">Contact</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
