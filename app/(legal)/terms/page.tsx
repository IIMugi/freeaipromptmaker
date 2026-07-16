import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms for using Free AI Prompt Maker and its optional image-analysis feature.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-14 sm:py-16">
      <h1 className="text-4xl font-semibold text-[var(--text-primary)]">Terms of use</h1>
      <p className="mt-3 text-sm text-[var(--text-tertiary)]">Last updated: July 16, 2026</p>
      <div className="mt-10 space-y-8 text-[var(--text-secondary)]">
        <Term title="Tool output">
          The core product formats text deterministically. It does not create images. Generated
          results in third-party products vary, and users must review prompts and destination settings.
        </Term>
        <Term title="Third-party services">
          Model names belong to their respective owners. This project is not endorsed by those
          providers. Optional image analysis uses Google Gemini when configured and invoked; provider
          terms may apply.
        </Term>
        <Term title="Acceptable use">
          Do not use the service to violate law, intellectual-property rights, privacy, platform rules,
          or the rights of another person. Do not upload sensitive images to optional analysis.
        </Term>
        <Term title="Availability">
          Features may change or be unavailable. The site reports provider failures but cannot promise
          uninterrupted access or a particular result from another product.
        </Term>
        <Term title="Commercial readiness">
          Advertising is disabled in the readiness build. AdSense approval is not guaranteed.
        </Term>
      </div>
      <p className="mt-10 text-[var(--text-secondary)]">Questions can be submitted through the <Link href="/contact" className="text-[var(--accent-primary)] hover:underline">contact page</Link>.</p>
    </article>
  );
}

function Term({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h2><p className="mt-3 leading-relaxed">{children}</p></section>;
}
