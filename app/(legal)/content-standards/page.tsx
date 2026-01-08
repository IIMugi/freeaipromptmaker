import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Content Standards',
  description:
    'Learn how Free AI Prompt Maker creates, reviews, and updates prompt guides and tutorials.',
};

export default function ContentStandardsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Content Standards</h1>
      <p className="text-slate-400 mb-10">Last updated: December 22, 2025</p>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">Purpose</h2>
          <p className="text-slate-300 leading-relaxed">
            Free AI Prompt Maker publishes practical prompt guides and visual tools for Midjourney,
            Stable Diffusion, and DALL-E. Our goal is to help creators generate better images with
            clear, repeatable instructions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">How we create guides</h2>
          <ul className="text-slate-300 list-disc pl-6 space-y-2">
            <li>
              <strong>Research:</strong> We review model updates, official docs, and community best
              practices.
            </li>
            <li>
              <strong>Prompt testing:</strong> Every guide is backed by real prompt runs to confirm
              that the instructions work as written.
            </li>
            <li>
              <strong>Editing:</strong> We rewrite for clarity and remove vague or repetitive advice.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">AI assistance disclosure</h2>
          <p className="text-slate-300 leading-relaxed">
            We may use AI tools to help draft outlines or summarize ideas, but every article is reviewed
            and refined by a human editor before publishing. We never publish unreviewed AI output.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">Quality checklist</h2>
          <ul className="text-slate-300 list-disc pl-6 space-y-2">
            <li>Clear, actionable steps with examples.</li>
            <li>Accurate model parameters and up-to-date terminology.</li>
            <li>Original writing with no copied or scraped material.</li>
            <li>Balanced recommendations and honest limitations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">Advertising and affiliates</h2>
          <p className="text-slate-300 leading-relaxed">
            The site is supported by ads and occasional affiliate links. These never influence our
            editorial content. Sponsored or affiliate links are disclosed on the page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">Corrections</h2>
          <p className="text-slate-300 leading-relaxed">
            If you notice an error or outdated advice, please reach out so we can update the guide.
            We aim to respond within 48 hours.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">Contact</h2>
          <p className="text-slate-300 leading-relaxed">
            Email us at{' '}
            <a
              href="mailto:hello@freeaipromptmaker.com"
              className="text-violet-400 hover:text-violet-300"
            >
              hello@freeaipromptmaker.com
            </a>{' '}
            or visit the{' '}
            <Link href="/contact" className="text-violet-400 hover:text-violet-300">
              contact page
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
