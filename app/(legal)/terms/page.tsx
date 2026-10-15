import type { Metadata } from 'next';
import Link from 'next/link';
import { TextPage } from '@/components/Layout/TextPage';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'Terms for using Free AI Prompt Maker, a free tool that formats image prompts locally, including acceptable use and the optional image-analysis feature.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <TextPage title="Terms of use" path="/terms" updated="2026-07-16">
      <h2>Tool output</h2>
      <p>
        The tools format text in your browser. They do not create images. Results in other products vary, so review the
        prompt and the settings of the tool you paste it into.
      </p>
      <h2>Third-party services</h2>
      <p>
        Model names belong to their owners. This project is not endorsed by those providers. Optional image analysis
        uses Google Gemini when it is configured and you start it; the provider&apos;s terms may apply.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not use the service to break the law, infringe intellectual property or privacy, break platform rules or harm
        another person. Do not upload sensitive images to image analysis.
      </p>
      <h2>Availability</h2>
      <p>
        Features may change or be unavailable. The site cannot promise uninterrupted access or a particular result from
        another product.
      </p>
      <h2>Advertising</h2>
      <p>
        The site currently shows no advertising. If that changes, these terms and the privacy policy will be updated
        first.
      </p>
      <p>
        Questions can be sent through the <Link href="/contact">contact page</Link>.
      </p>
    </TextPage>
  );
}
