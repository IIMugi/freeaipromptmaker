import type { Metadata } from 'next';
import { TextPage } from '@/components/Layout/TextPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Report a factual, privacy, accessibility, or software issue for Free AI Prompt Maker via the public GitHub repository, with tips for useful corrections.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <TextPage
      title="Contact and corrections"
      path="/contact"
      lead="Report a factual error, a privacy question, an accessibility problem or a bug through the project's public GitHub issues."
    >
      <h2>Before you open an issue</h2>
      <ul>
        <li>Do not include private prompts, uploaded images, API keys or personal information.</li>
        <li>Include the page address and a short description of the problem.</li>
        <li>For a factual correction, link the primary source that supports the change.</li>
      </ul>
      <p>
        <a href={`${SITE.social.github}/issues`} target="_blank" rel="noopener noreferrer">
          Open GitHub issues
        </a>
      </p>
    </TextPage>
  );
}
