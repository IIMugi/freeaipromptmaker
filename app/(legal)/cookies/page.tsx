import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy for Free AI Prompt Maker - Learn about our use of cookies.',
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-8">Cookie Policy</h1>
      <p className="text-slate-400 mb-8">Last updated: November 27, 2025</p>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            What Are Cookies?
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Cookies are small text files stored on your device when you visit a
            website. They help websites remember information about your visit,
            making your next visit easier and more useful.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            How We Use Cookies
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Free AI Prompt Maker uses cookies and similar technologies for:
          </p>

          <h3 className="text-xl font-medium text-white mb-2 mt-4">
            Essential Cookies
          </h3>
          <p className="text-slate-300 leading-relaxed">
            These cookies are necessary for the website to function properly.
            They enable basic features like page navigation and access to secure
            areas.
          </p>

          <h3 className="text-xl font-medium text-white mb-2 mt-4">
            Analytics Cookies
          </h3>
          <p className="text-slate-300 leading-relaxed">
            We use analytics cookies to understand how visitors interact with our
            website. This helps us improve our service. We use:
          </p>
          <ul className="text-slate-300 list-disc pl-6 space-y-2 mt-2">
            <li>Google Analytics - for traffic analysis</li>
            <li>Vercel Analytics - for performance monitoring</li>
          </ul>

          <h3 className="text-xl font-medium text-white mb-2 mt-4">
            Advertising Cookies
          </h3>
          <p className="text-slate-300 leading-relaxed">
            We display advertisements through Google AdSense. Google may use
            cookies to show you relevant ads based on your interests and browsing
            history. You can learn more about Google&apos;s advertising policies at{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300"
            >
              Google&apos;s Advertising Policies
            </a>
            .
          </p>

          <h3 className="text-xl font-medium text-white mb-2 mt-4">
            Local Storage
          </h3>
          <p className="text-slate-300 leading-relaxed">
            We use browser localStorage to save your prompt history locally on
            your device. This data never leaves your browser and is not sent to
            our servers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Managing Cookies
          </h2>
          <p className="text-slate-300 leading-relaxed">
            You can control and manage cookies in several ways:
          </p>
          <ul className="text-slate-300 list-disc pl-6 space-y-2 mt-2">
            <li>
              <strong>Browser Settings:</strong> Most browsers allow you to
              refuse or accept cookies through their settings menu.
            </li>
            <li>
              <strong>Google Ad Settings:</strong> You can opt out of
              personalized advertising at{' '}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300"
              >
                Google Ad Settings
              </a>
              .
            </li>
            <li>
              <strong>Clear Local Storage:</strong> You can clear your prompt
              history by clearing your browser&apos;s local storage data.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Third-Party Cookies
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Some cookies are placed by third-party services that appear on our
            pages. We do not control these cookies. The third parties include:
          </p>
          <ul className="text-slate-300 list-disc pl-6 space-y-2 mt-2">
            <li>Google (Analytics and AdSense)</li>
            <li>Vercel (Hosting and Analytics)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Updates to This Policy
          </h2>
          <p className="text-slate-300 leading-relaxed">
            We may update this Cookie Policy from time to time. Any changes will
            be posted on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
          <p className="text-slate-300 leading-relaxed">
            If you have questions about our use of cookies, please contact us at{' '}
            <a
              href="mailto:privacy@freeaipromptmaker.com"
              className="text-violet-400 hover:text-violet-300"
            >
              privacy@freeaipromptmaker.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

