import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PromptLandingPage } from '@/components/Seo/PromptLandingPage';
import { getAllPromptUseCaseSlugs, getPromptUseCase } from '@/data/prompt-use-cases';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeaipromptmaker.com';

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

  const canonical = `${siteUrl}/prompt-generator-for/${entry.slug}`;

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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the best prompt structure for ${entry.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Start with clear subject and context, add style and camera cues, then refine with negatives for ${entry.title.toLowerCase()}.`,
        },
      },
      {
        '@type': 'Question',
        name: `Which model should I use for ${entry.title} prompts?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Choose based on your goal: speed, realism, style control, or text rendering requirements.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PromptLandingPage useCase={entry} />
    </>
  );
}
