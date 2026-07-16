import type { Metadata } from 'next';
import { ImageReverseEngineer } from '@/components/ImageToPrompt/ImageReverseEngineer';
import { canonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Image to Prompt Analysis',
  description:
    'Request prompt suggestions from a supported image when vision analysis is configured. The tool fails closed when analysis is unavailable.',
  alternates: { canonical: canonicalUrl('/image-to-prompt') },
  openGraph: {
    title: 'Image to Prompt Analysis',
    description: 'Optional vision analysis for supported PNG, JPEG, and WEBP images.',
    url: canonicalUrl('/image-to-prompt'),
    type: 'website',
  },
};

export default function ImageToPromptPage() {
  return <ImageReverseEngineer />;
}
