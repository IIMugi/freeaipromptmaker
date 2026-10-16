import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/Layout/TextPage';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'What Free AI Prompt Maker processes in your browser, what is sent to providers when you analyze an image, and how optional analytics consent works.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <TextPage title="Privacy policy" path="/privacy" updated="2026-10-16">
      <h2>Prompt tools</h2>
      <p>
        Prompts are built in your browser. Prompt text is not sent to our server. The prompts you copy are kept in your
        browser&apos;s local storage on your device so you can restore them; clearing this site&apos;s data removes them.
        A share link you copy contains the prompt and settings in the address, so anyone you send it to can read them.
      </p>
      <h2>Optional image analysis</h2>
      <p>
        When you choose Analyze image, the uploaded image is sent to this site&apos;s server and then to Google Gemini for
        analysis, if the feature is configured. Do not upload sensitive images. Google&apos;s terms and policies apply to
        that processing. If the provider is unavailable, the site returns an error instead of a made-up result.
      </p>
      <h2>Analytics</h2>
      <p>
        Google Analytics loads only after you choose Allow analytics. Declining leaves analytics off. Product events
        only carry short fields such as the model, the copy type or a failure reason, never prompt or image content.
      </p>
      <h2>Advertising</h2>
      <p>The site currently shows no advertising. No advertising script or advertising cookie is loaded.</p>
      <h2>Hosting and request data</h2>
      <p>
        Normal web requests expose technical data such as IP address, browser, page and time to the hosting and network
        providers that serve the site. This policy does not claim that those providers keep nothing.
      </p>
      <p>
        Privacy questions and correction requests can be sent to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. Other
        ways to reach us are on the <Link href="/contact">contact page</Link>.
      </p>
    </TextPage>
  );
}
