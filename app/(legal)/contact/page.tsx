import type { Metadata } from 'next';
import { TextPage } from '@/components/Layout/TextPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Free AI Prompt Maker by email or GitHub issues to report a factual, privacy, accessibility or software problem, with tips for useful corrections.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <TextPage
      title="Contact and corrections"
      path="/contact"
      lead="Report a factual error, a privacy question, an accessibility problem or a bug by email or through the project's public GitHub issues."
    >
      <h2>Email</h2>
      <p>
        Write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Privacy requests and anything you would rather not
        post in public belong here.
      </p>
      <h2>GitHub issues</h2>
      <p>
        Bugs and corrections can also be reported in public on{' '}
        <a href={`${SITE.social.github}/issues`} target="_blank" rel="noopener noreferrer">
          GitHub issues
        </a>
        .
      </p>
      <h2>Before you write</h2>
      <ul>
        <li>Do not include private prompts, uploaded images, API keys or personal information you do not need to share.</li>
        <li>Include the page address and a short description of the problem.</li>
        <li>For a factual correction, link the primary source that supports the change.</li>
      </ul>
    </TextPage>
  );
}
