import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PromptLandingPage } from '@/components/Seo/PromptLandingPage';
import { getAllPromptUseCaseSlugs, getPromptUseCase, getUseCaseTitle } from '@/data/prompt-use-cases';
import { canonicalUrl } from '@/lib/seo';

interface PageProps {
  params: Promise<{ useCase: string }>;
}

export const dynamicParams = false;

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
  const title = getUseCaseTitle(entry);

  return {
    title: { absolute: title },
    description: entry.description,
    alternates: { canonical },
    openGraph: {
      title,
      description: entry.description,
      url: canonical,
      type: 'website',
    },
  };
}

export default async function PromptUseCasePage({ params }: PageProps) {
  const { useCase } = await params;
  const entry = getPromptUseCase(useCase);
  if (!entry) notFound();

  return <PromptLandingPage useCase={entry} />;
}
