import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/Layout/TextPage';

export const metadata: Metadata = {
  title: 'Content Standards',
  description:
    'The editorial states and checks behind Free AI Prompt Maker guides: verified, needs review, or archived, and how older automated content is handled.',
  alternates: { canonical: '/content-standards' },
};

const requirements = [
  'Claims are checked against primary documentation or a clearly identified source.',
  'Model and interface versions are stated when they materially affect the instructions.',
  'Examples do not invent first-person testing, credentials, results, ratings, or audience data.',
  'The page records a verification date and sources before it can enter guide hubs or the sitemap.',
];

export default function ContentStandardsPage() {
  return (
    <TextPage
      title="Content standards"
      path="/content-standards"
      updated="2026-10-16"
      lead="Every guide has one state: verified, needs review or archived. Only verified guides are published, listed and in the sitemap."
    >
      <h2>What a verified guide needs</h2>
      <ul>
        {requirements.map((requirement) => (
          <li key={requirement}>{requirement}</li>
        ))}
      </ul>
      <h2>Older automated guides</h2>
      <p>
        An earlier version of the site published automatically generated guides. In October 2026 they were reviewed: the
        useful ones were rewritten and checked, and the rest were removed. A removed address either redirects to the
        guide that now covers the topic or reports that the page is gone. Nothing is published automatically.
      </p>
      <h2>Advertising and affiliate links</h2>
      <p>
        The site currently shows no advertising, and the tool directory contains no affiliate links. Guides are not paid
        placements.
      </p>
      <p>
        Found a factual issue? Use the <Link href="/contact">contact page</Link>.
      </p>
    </TextPage>
  );
}
