import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Free AI Prompt Maker.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
      <p className="text-slate-400 mb-8">Last updated: November 27, 2025</p>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-slate-300 leading-relaxed">
            By accessing and using Free AI Prompt Maker, you accept and agree to be
            bound by these Terms of Service. If you do not agree to these terms,
            please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            2. Description of Service
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Free AI Prompt Maker provides a free visual prompt generator for AI image
            generation tools. Our service includes prompt building tools,
            educational content, and related resources.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            3. User Responsibilities
          </h2>
          <p className="text-slate-300 leading-relaxed">You agree to:</p>
          <ul className="text-slate-300 list-disc pl-6 space-y-2 mt-2">
            <li>Use the service only for lawful purposes</li>
            <li>Not create prompts intended to generate illegal or harmful content</li>
            <li>Not attempt to disrupt or damage the service</li>
            <li>Not use automated systems to access the service without permission</li>
            <li>Respect intellectual property rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            4. Intellectual Property
          </h2>
          <p className="text-slate-300 leading-relaxed">
            The prompts you create using our service are yours. However, the
            service itself, including the website design, code, and content, is
            owned by Free AI Prompt Maker and protected by copyright laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            5. Third-Party AI Services
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Free AI Prompt Maker generates prompts for use with third-party AI services
            (Midjourney, Stable Diffusion, DALL-E). We are not affiliated with
            these services, and their use is subject to their respective terms of
            service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            6. Disclaimer of Warranties
          </h2>
          <p className="text-slate-300 leading-relaxed">
            The service is provided &quot;as is&quot; without warranties of any kind. We do
            not guarantee that prompts generated will produce specific results in
            any AI tool.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            7. Limitation of Liability
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Free AI Prompt Maker shall not be liable for any indirect, incidental,
            special, or consequential damages arising from your use of the
            service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            8. Advertising
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Our service is supported by advertising. By using our service, you
            agree to the display of advertisements, including those served by
            Google AdSense.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            9. Changes to Terms
          </h2>
          <p className="text-slate-300 leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use
            of the service after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            10. Contact Information
          </h2>
          <p className="text-slate-300 leading-relaxed">
            For questions about these Terms of Service, contact us at{' '}
            <a
              href="mailto:legal@freeaipromptmaker.com"
              className="text-violet-400 hover:text-violet-300"
            >
              legal@freeaipromptmaker.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

