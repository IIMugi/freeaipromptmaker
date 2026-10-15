import type { Metadata } from 'next';
import { ImageReverseEngineer } from '@/components/ImageToPrompt/ImageReverseEngineer';
import { canonicalUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Image to Prompt Analysis',
  description:
    'Upload an image and get prompt suggestions describing it. Image analysis is currently unavailable on this site.',
  robots: { index: false, follow: true },
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
