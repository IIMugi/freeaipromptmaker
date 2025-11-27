import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Free AI Prompt Maker - Learn how we handle your data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
      <p className="text-slate-400 mb-8">Last updated: November 27, 2025</p>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
          <p className="text-slate-300 leading-relaxed">
            Free AI Prompt Maker (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is
            committed to protecting your personal data. This privacy policy explains
            how we collect, use, and safeguard your information when you use our
            website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Information We Collect
          </h2>
          <h3 className="text-xl font-medium text-white mb-2">
            Information You Provide
          </h3>
          <ul className="text-slate-300 list-disc pl-6 space-y-2">
            <li>Prompts you create using our generator (stored locally in your browser)</li>
            <li>Contact information if you reach out to us</li>
          </ul>

          <h3 className="text-xl font-medium text-white mb-2 mt-4">
            Automatically Collected Information
          </h3>
          <ul className="text-slate-300 list-disc pl-6 space-y-2">
            <li>Device and browser information</li>
            <li>IP address (anonymized)</li>
            <li>Usage data and analytics</li>
            <li>Cookies and similar technologies</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            How We Use Your Information
          </h2>
          <ul className="text-slate-300 list-disc pl-6 space-y-2">
            <li>To provide and improve our services</li>
            <li>To analyze usage patterns and optimize performance</li>
            <li>To display relevant advertisements through Google AdSense</li>
            <li>To respond to your inquiries</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Third-Party Services
          </h2>
          <p className="text-slate-300 leading-relaxed">
            We use the following third-party services:
          </p>
          <ul className="text-slate-300 list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Google AdSense:</strong> For displaying advertisements. Google
              may use cookies to serve ads based on your prior visits.
            </li>
            <li>
              <strong>Google Analytics:</strong> For understanding how visitors use
              our site.
            </li>
            <li>
              <strong>Vercel:</strong> For hosting and analytics.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Data Storage</h2>
          <p className="text-slate-300 leading-relaxed">
            Your prompt history is stored locally in your browser using
            localStorage. We do not store your prompts on our servers. You can
            clear this data at any time through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
          <p className="text-slate-300 leading-relaxed">
            Depending on your location, you may have the right to:
          </p>
          <ul className="text-slate-300 list-disc pl-6 space-y-2 mt-2">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Children&apos;s Privacy
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Our service is not intended for children under 13. We do not knowingly
            collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
          <p className="text-slate-300 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at{' '}
            <a
              href="mailto:privacy@promptmaster.ai"
              className="text-violet-400 hover:text-violet-300"
            >
              privacy@promptmaster.ai
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

