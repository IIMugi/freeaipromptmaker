import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What Free AI Prompt Maker processes locally, what is sent to providers, and how analytics consent works.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
      <h1 className="text-4xl font-semibold text-[var(--text-primary)]">Privacy policy</h1>
      <p className="mt-3 text-sm text-[var(--text-tertiary)]">Last updated: July 16, 2026</p>

      <div className="mt-10 space-y-8 text-[var(--text-secondary)]">
        <PolicySection title="Core prompt formatter">
          Prompt formatting runs locally in your browser. Prompt text and local history are handled
          by client-side code; history is stored in browser localStorage on your device. Clearing the
          site&apos;s storage removes that local history.
        </PolicySection>
        <PolicySection title="Optional image analysis">
          When you select Analyze image, the uploaded image is sent to this site&apos;s server and then
          to Google Gemini for analysis if the feature is configured. Do not upload sensitive images.
          Provider processing is governed by Google&apos;s applicable terms and policies. When the
          provider is unavailable, the site returns an error and does not fabricate a result.
        </PolicySection>
        <PolicySection title="Analytics">
          Google Analytics can load only after explicit consent through the privacy control. Declining
          leaves analytics off. Product events are restricted to short outcome fields such as model,
          copy variant, or failure reason; prompt and image content are not included.
        </PolicySection>
        <PolicySection title="Advertising">
          Advertising is disabled in the readiness build. No advertising script or advertising cookie
          is loaded by the current application.
        </PolicySection>
        <PolicySection title="Hosting and request data">
          Normal web requests may expose technical data such as IP address, user agent, route, and
          timestamp to hosting and network providers. This policy does not claim zero retention for
          infrastructure or third-party providers.
        </PolicySection>
      </div>

      <p className="mt-10 text-[var(--text-secondary)]">
        Questions or correction requests can be submitted through the <Link href="/contact" className="text-[var(--accent-primary)] hover:underline">contact page</Link>.
      </p>
    </article>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
      <p className="mt-3 leading-relaxed">{children}</p>
    </section>
  );
}
