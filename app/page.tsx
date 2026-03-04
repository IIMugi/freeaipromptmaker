import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, Clock3, Layers3, Sparkles, Wand2, Image as ImageIcon } from 'lucide-react';
import { HeroSection } from '@/components/Hero/HeroSection';
import { getAllPosts } from '@/lib/blog';
import { SectionShell, Badge, LinkCard } from '@/components/UI';
import { PromptBuilderLazy as PromptBuilder } from '@/components/Generator/PromptBuilderLazy';
import { PromptGalleryLazy as PromptGallery } from '@/components/Gallery/PromptGalleryLazy';
import { HomeFoundationalGuide } from '@/components/Seo/HomeFoundationalGuide';

export const metadata: Metadata = {
  title: 'Midjourney v7 Prompt Helper & Flux Pro Prompt Builder',
  description:
    'Create optimized prompts for Midjourney v7, Flux Pro, DALL-E 3, and Stable Diffusion XL. Use visual controls, real-time prompt drafts, and one-click copy variants.',
  keywords: [
    'midjourney v7 prompt helper',
    'flux pro prompt builder',
    'stable diffusion negative prompt generator',
    'cinematic prompt generator',
    'chatgpt image prompt generator',
  ],
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  const latestPosts = getAllPosts().slice(0, 4);

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-20">
      <span className="hidden">Impact-Site-Verification: 1fda626d-269f-49fc-8dc6-994ceda192c6</span>

      <section aria-label="Hero Introduction" className="mx-auto max-w-7xl pt-6">
        <HeroSection />
      </section>

      <section id="generator" aria-label="Prompt Generator" className="mx-auto max-w-7xl pt-10 scroll-mt-28 reveal-on-scroll">
        <PromptBuilder />
      </section>

      <section aria-label="Foundational Guide" className="mx-auto max-w-7xl mt-12 reveal-on-scroll">
        <HomeFoundationalGuide />
      </section>

      {/* Bento Grid layout for Features & Trust */}
      <section aria-label="Features and Policies" className="mx-auto max-w-7xl mt-12 bento-grid reveal-on-scroll stagger-children">

        {/* Bento Cell 1: Image to Prompt (Wide) */}
        <SectionShell className="bento-wide flex flex-col justify-between p-6 md:p-8 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
            <ImageIcon className="w-64 h-64 text-[var(--accent-primary)]" />
          </div>
          <div className="relative z-10">
            <Badge variant="cyan" size="sm" className="mb-4">New feature</Badge>
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
              Image-to-Prompt Reverse Engineer
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              Upload any image and instantly extract style DNA, prompt, negative prompt, and remix variants for major AI models.
            </p>
          </div>
          <div className="relative z-10 mt-8">
            <Link
              href="/image-to-prompt"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent-primary-strong)] bg-[var(--accent-primary-soft)] px-5 py-3 text-sm font-medium text-[var(--accent-primary)] transition-all hover:bg-[var(--accent-primary-strong)] active:scale-95"
            >
              Launch Reverse Engineer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </SectionShell>

        {/* Bento Cell 2: Trust & Transparency (Tall) */}
        <SectionShell className="bento-tall flex flex-col justify-between p-6 md:p-8">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Trust & Transparency</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              Policies are public, disclosures are explicit, and prompt guidance is continuously updated.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <LinkCard href="/content-standards">Content standards</LinkCard>
            <LinkCard href="/privacy">Privacy policy</LinkCard>
            <LinkCard href="/contact">Contact</LinkCard>
          </div>
        </SectionShell>

        {/* Bento Cell 3: How it works (Wide) */}
        <SectionShell className="bento-wide p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)] md:text-3xl">
            How prompt engineers work
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-secondary)]">
            Define intent, lock style constraints, tune composition, then iterate with tight deltas.
            The generator mirrors this professional workflow.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FeatureTile
              icon={<Wand2 className="h-4 w-4" />}
              title="Style locking"
              text="Keep prompts consistent while exploring fast variations."
            />
            <FeatureTile
              icon={<Layers3 className="h-4 w-4" />}
              title="Model-aware syntax"
              text="Translate syntax by model without rewriting the full prompt."
            />
            <FeatureTile
              icon={<Clock3 className="h-4 w-4" />}
              title="Fast iteration loops"
              text="Copy variants and history shorten the path to quality."
            />
          </div>
        </SectionShell>
      </section>

      <section aria-label="Prompt Guides" className="mx-auto max-w-7xl mt-16 glass-2 border-[0.5px] border-[var(--border-strong)] rounded-[2.5rem] p-8 md:p-12 reveal-on-scroll relative overflow-hidden shadow-[var(--shadow-card)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--accent-violet-soft)] to-[var(--accent-primary-soft)] blur-[100px] rounded-full pointer-events-none opacity-40 mix-blend-screen" />

        <div className="relative z-10 mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="violet" size="sm" icon={<Sparkles className="h-3.5 w-3.5" />} className="mb-4">
              Prompt Playbooks
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-4xl">
              Midjourney v7, Flux Pro & SDXL Guides
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--text-secondary)] text-lg">
              Applied tactics for camera control, style consistency, filters, and model-specific mechanics.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/prompt-generators" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors">
              Browse presets
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="hidden text-[var(--text-tertiary)] sm:inline">•</span>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors">
              View all guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {latestPosts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col justify-between rounded-[1.5rem] border-[0.5px] border-[var(--border-default)] bg-black/40 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[var(--accent-violet)] hover:shadow-[0_0_30px_-5px_rgba(189,0,255,0.25)] backdrop-blur-md"
              >
                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary)]">
                    {post.category || 'AI Prompt Guide'}
                  </p>
                  <h3 className="mb-2 text-base font-bold leading-tight text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-3">
                    {post.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--border-default)] pt-4">
                  <span className="text-xs font-medium text-[var(--text-tertiary)]">{post.readTime}</span>
                  <ArrowRight className="h-4 w-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-base)] p-8 text-center text-sm text-[var(--text-secondary)]">
            New guides are publishing soon. Check back for fresh tutorials and prompt breakdowns.
          </div>
        )}
      </section>

      <section aria-label="Community Prompts" className="mx-auto max-w-7xl mt-12 reveal-on-scroll">
        <PromptGallery />
      </section>

      {/* E-E-A-T Trust Signal — Author Expertise */}
      <section aria-label="About the Team" className="mx-auto max-w-7xl mt-16 reveal-on-scroll">
        <SectionShell className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-cyan-500/20">
              PM
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
                Built by Prompt Engineers
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                Every feature, guide, and preset in Free AI Prompt Maker is tested and maintained by
                experienced prompt engineers with hands-on expertise across 12+ AI models since 2022.
                We publish 48+ in-depth guides updated quarterly to stay current with the latest model capabilities.
              </p>
            </div>
            <Link
              href="/about"
              className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors"
            >
              Learn more
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </SectionShell>
      </section>
    </div>
  );
}

function FeatureTile({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="group flex flex-col rounded-[1.5rem] border-[0.5px] border-[var(--border-default)] bg-black/30 p-6 transition-all duration-300 hover:border-[var(--accent-primary-strong)] hover:bg-black/50 hover:-translate-y-1 shadow-inner backdrop-blur-sm hover:shadow-[0_0_20px_-5px_rgba(0,240,255,0.2)]">
      <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-primary-soft)] to-transparent text-[var(--accent-primary)] border-[0.5px] border-[var(--accent-primary-soft)] shadow-[0_0_15px_-3px_var(--accent-primary-soft)] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <h3 className="mb-2 text-base font-bold text-[var(--text-primary)] tracking-wide">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{text}</p>
    </div>
  );
}
