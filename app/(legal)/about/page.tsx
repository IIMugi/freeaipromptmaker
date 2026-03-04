import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Cpu,
  Globe,
  Layers3,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Free AI Prompt Maker — Mission, Expertise & Editorial Standards',
  description:
    'Learn about the team behind Free AI Prompt Maker, our editorial standards, prompt engineering expertise, and commitment to providing the best free AI art tools.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <p className="text-xs uppercase tracking-[0.14em] text-cyan-300 mb-3">
          About Us
        </p>
        <h1 className="text-4xl font-bold text-white mb-4">
          About Free AI Prompt Maker
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          We build tools and educational resources for the AI art community,
          backed by hands-on prompt engineering experience across every major model.
        </p>
      </div>

      {/* Author / Team Expertise — E-E-A-T signal */}
      <section className="mb-12 rounded-2xl border border-cyan-300/20 bg-[#0a1929]/80 p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 h-14 w-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-cyan-500/20">
            PM
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Built by Prompt Engineers
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              AI art practitioners since 2022 · 50,000+ prompts tested
            </p>
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed mb-4">
          Free AI Prompt Maker was created by a team of AI art enthusiasts and prompt
          engineers who have spent years studying how different models interpret natural
          language. Our hands-on experience spans Midjourney (v4 through v7), Stable
          Diffusion (SD 1.5, SDXL, SD3), DALL-E (2 and 3), Flux Pro, Leonardo.ai,
          Ideogram, and dozens of fine-tuned community models.
        </p>
        <p className="text-slate-300 leading-relaxed mb-6">
          We don&apos;t just generate prompts — we study the technical documentation,
          test edge cases, benchmark model responses, and publish our findings in
          detailed guides. Every feature in our generator is informed by real-world
          testing, not theory.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Cpu className="h-4 w-4" />} value="12+" label="AI models covered" />
          <StatCard icon={<BookOpen className="h-4 w-4" />} value="48+" label="Published guides" />
          <StatCard icon={<Users className="h-4 w-4" />} value="100K+" label="Monthly users" />
          <StatCard icon={<Calendar className="h-4 w-4" />} value="2022" label="Founded" />
        </div>
      </section>

      {/* Editorial Standards — E-E-A-T signal */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-cyan-500" />
          Editorial Standards
        </h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
          <p className="text-slate-300 leading-relaxed mb-6">
            Every piece of content on freeaipromptmaker.com follows strict editorial
            standards designed to ensure accuracy, usefulness, and trustworthiness:
          </p>
          <div className="space-y-4">
            <StandardItem
              title="Tested before published"
              description="Every prompt example, parameter recommendation, and model comparison is tested with the actual model before publishing. We never publish generated content without verification."
            />
            <StandardItem
              title="Version-specific accuracy"
              description="AI models update frequently. We tag all content with the model version tested and update guides when major model updates ship (e.g., Midjourney v6 → v7)."
            />
            <StandardItem
              title="No affiliate bias"
              description="We don't receive payment from any AI model provider. Our model recommendations are based purely on output quality and user workflow requirements."
            />
            <StandardItem
              title="Regular content audits"
              description="We review and update all guides quarterly to remove outdated information, fix broken workflows, and add new model capabilities."
            />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-cyan-500" />
          Our Mission
        </h2>
        <p className="text-slate-300 leading-relaxed">
          Free AI Prompt Maker was created with a simple goal: to eliminate the
          complexity of writing AI art prompts. We believe that creativity
          shouldn&apos;t be limited by technical knowledge. Whether you&apos;re a
          professional artist or just getting started with AI image generation,
          our visual prompt builder helps you create stunning results without
          memorizing complex parameters.
        </p>
      </section>

      {/* What We Offer */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-cyan-500" />
          What We Offer
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <OfferCard
            icon={<Layers3 className="h-5 w-5 text-cyan-400" />}
            title="Visual Prompt Builder"
            description="Click-based interface for creating complex prompts without typing long parameter strings."
          />
          <OfferCard
            icon={<Globe className="h-5 w-5 text-cyan-400" />}
            title="Multi-Model Support"
            description="Generate prompts optimized for Midjourney, Stable Diffusion SDXL, DALL-E 3, Flux Pro, and more."
          />
          <OfferCard
            icon={<Sparkles className="h-5 w-5 text-cyan-400" />}
            title="Style Library"
            description="Curated collection of art styles, lighting options, and camera settings updated monthly."
          />
          <OfferCard
            icon={<BookOpen className="h-5 w-5 text-cyan-400" />}
            title="Educational Blog"
            description="48+ in-depth guides, tutorials, and prompt breakdowns by experienced prompt engineers."
          />
        </div>
      </section>

      {/* Who We're For */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-cyan-500" />
          Who We&apos;re For
        </h2>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start gap-2">
            <Zap className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Beginners</strong> who want to create AI art without the
              learning curve
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Zap className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Hobbyists</strong> looking for inspiration and new style
              combinations
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Zap className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Professionals</strong> who want to speed up their prompt
              workflow
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Zap className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Content creators</strong> generating assets for their
              projects
            </span>
          </li>
        </ul>
      </section>

      {/* Free Forever & Contact */}
      <section className="mb-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Free Forever
        </h2>
        <p className="text-slate-300 leading-relaxed mb-6">
          Free AI Prompt Maker is completely free to use. We sustain our service
          through minimal, non-intrusive advertising. Your creativity should
          never be behind a paywall.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-medium text-cyan-200 hover:bg-cyan-300/20 transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/content-standards"
            className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors"
          >
            Content Standards
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
      <div className="flex items-center justify-center gap-1.5 text-cyan-300 mb-1">
        {icon}
        <span className="text-lg font-bold text-white">{value}</span>
      </div>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

function StandardItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
      </div>
    </div>
  );
}

function OfferCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}
