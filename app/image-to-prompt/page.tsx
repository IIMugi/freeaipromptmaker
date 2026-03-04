import type { Metadata } from 'next';
import { ImageReverseEngineer } from '@/components/ImageToPrompt/ImageReverseEngineer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeaipromptmaker.com';

export const metadata: Metadata = {
  title: 'Image to Prompt Generator (Reverse Engineer)',
  description:
    'Upload an image and reverse engineer its style DNA into a clean prompt, negative prompt, and remix variations for Midjourney, Flux, DALL-E, and SDXL.',
  keywords: [
    'image to prompt generator',
    'reverse prompt from image',
    'ai image prompt extractor',
    'midjourney image to prompt',
    'flux prompt reverse engineer',
  ],
  alternates: {
    canonical: '/image-to-prompt',
  },
  openGraph: {
    title: 'Image to Prompt Reverse Engineer',
    description:
      'Turn any image into prompt DNA with model-ready prompt + negative + remix variants.',
    url: `${siteUrl}/image-to-prompt`,
    type: 'website',
  },
};

export default function ImageToPromptPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Image to Prompt Reverse Engineer',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    url: `${siteUrl}/image-to-prompt`,
    featureList: [
      'Image upload and style DNA extraction',
      'Prompt + negative prompt generation',
      'One-click remix prompt variations',
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ImageReverseEngineer />
    </>
  );
}
