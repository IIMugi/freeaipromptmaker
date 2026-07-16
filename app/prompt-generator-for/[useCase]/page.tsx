import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PromptLandingPage } from '@/components/Seo/PromptLandingPage';
import { getAllPromptUseCaseSlugs, getPromptUseCase } from '@/data/prompt-use-cases';
import { canonicalUrl } from '@/lib/seo';

interface PageProps {
  params: Promise<{ useCase: string }>;
}

export async function generateStaticParams() {
  return getAllPromptUseCaseSlugs().map((useCase) => ({ useCase }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { useCase } = await params;
  const entry = getPromptUseCase(useCase);

  if (!entry) {
    return { title: 'Prompt Use Case Not Found' };
  }

  const canonical = canonicalUrl(`/prompt-generator-for/${entry.slug}`);

  return {
    title: `Prompt Generator for ${entry.title}`,
    description: `${entry.intent} Build ready-to-use prompts, negatives, and model guidance for ${entry.title.toLowerCase()} workflows.`,
    keywords: entry.keywords,
    alternates: { canonical },
    openGraph: {
      title: `Prompt Generator for ${entry.title}`,
      description: entry.intent,
      url: canonical,
      type: 'article',
    },
  };
}

export default async function PromptUseCasePage({ params }: PageProps) {
  const { useCase } = await params;
  const entry = getPromptUseCase(useCase);
  if (!entry) notFound();

  return <PromptLandingPage useCase={entry} />;
}
