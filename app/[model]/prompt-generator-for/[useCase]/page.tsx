import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PromptLandingPage } from '@/components/Seo/PromptLandingPage';
import {
  getAllModelSlugs,
  getAllPromptUseCaseSlugs,
  getPromptUseCase,
  modelDisplayNames,
} from '@/data/prompt-use-cases';
import type { AIModel } from '@/lib/prompt-builder';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeaipromptmaker.com';

interface PageProps {
  params: Promise<{ model: string; useCase: string }>;
}

function isValidModel(model: string): model is AIModel {
  return getAllModelSlugs().includes(model as AIModel);
}

export async function generateStaticParams() {
  const models = getAllModelSlugs();
  const useCases = getAllPromptUseCaseSlugs();
  return models.flatMap((model) => useCases.map((useCase) => ({ model, useCase })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { model, useCase } = await params;
  const entry = getPromptUseCase(useCase);
  if (!entry || !isValidModel(model)) {
    return { title: 'Prompt Generator Page Not Found' };
  }

  const modelName = modelDisplayNames[model];
  const canonical = `${siteUrl}/${model}/prompt-generator-for/${entry.slug}`;

  return {
    title: `${modelName} Prompt Generator for ${entry.title}`,
    description: `Generate ${modelName} prompts for ${entry.title.toLowerCase()} workflows with ready examples, negatives, and model-specific guidance.`,
    keywords: [...entry.keywords, `${modelName.toLowerCase()} prompt generator`],
    alternates: { canonical },
    // Prevent indexing of model-specific pages to avoid thin/duplicate content
    // These pages share nearly identical content with only the model name swapped
    robots: { index: false, follow: true },
    openGraph: {
      title: `${modelName} Prompt Generator for ${entry.title}`,
      description: entry.intent,
      url: canonical,
      type: 'article',
    },
  };
}

export default async function ModelPromptUseCasePage({ params }: PageProps) {
  const { model, useCase } = await params;
  const entry = getPromptUseCase(useCase);
  if (!entry || !isValidModel(model)) notFound();

  return <PromptLandingPage useCase={entry} model={model} />;
}
