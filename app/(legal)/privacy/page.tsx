import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Comprehensive Privacy Policy for Free AI Prompt Maker ensuring Zero-Retention, GDPR/CCPA compliance, and Global Privacy Control (GPC) support.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
      <p className="text-slate-400 mb-8">Last updated: February 26, 2026</p>

      <div className="prose prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction & Commitment to Privacy</h2>
          <p className="text-slate-300 leading-relaxed">
            Free AI Prompt Maker (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates as a privacy-first utility platform. As an artificial intelligence-focused service, we recognize the paramount importance of data sovereignty and user privacy under global legislative frameworks, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). This consolidated Privacy Policy delineates our transparent, zero-compromise approach to your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">2. Zero-Retention Policy for AI Inputs</h2>
          <p className="text-slate-300 leading-relaxed">
            Our core operational mandate is strict data minimization. <strong>We adhere to a definitive Zero-Retention Policy regarding user inputs.</strong>
          </p>
          <ul className="text-slate-300 list-disc pl-6 space-y-2 mt-4">
            <li><strong>No Storage:</strong> The text, parameters, images, and variables you input into our prompt generators are processed strictly in real-time through your local browser session or transient memory buffers. We do not store, log, snapshot, or archive your prompts on our servers.</li>
            <li><strong>No AI Training:</strong> We explicitly guarantee that none of your inputs, generated outputs, or behavioral interactions within the tool are used to train, fine-tune, or calibrate any proprietary or third-party Large Language Models (LLMs) or image synthesis architectures. Your creative work remains entirely your own.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">3. Information Collection & Processing</h2>
          <p className="text-slate-300 leading-relaxed">
            While your prompt inputs are never stored, we do collate minimal, anonymized metadata to ensure the functional delivery of our website:
          </p>
          <h3 className="text-xl font-medium text-white mb-2 mt-4">Automated Telemetry</h3>
          <ul className="text-slate-300 list-disc pl-6 space-y-2">
            <li>Aggregated, non-identifiable usage statistics (e.g., page views, error crash reports).</li>
            <li>Truncated/anonymized IP addresses for regional load balancing and security threat mitigation.</li>
            <li>Device profiles (browser version, OS) to optimize the user interface.</li>
          </ul>
          <h3 className="text-xl font-medium text-white mb-2 mt-4">Information You Provide Voluntarily</h3>
          <ul className="text-slate-300 list-disc pl-6 space-y-2">
            <li>If you contact our support or legal team, we retain the correspondence solely to address your inquiry, subsequently deleting it pursuant to our data retention schedules.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">4. Global Privacy Control (GPC) & User Consent</h2>
          <p className="text-slate-300 leading-relaxed">
            We are committed to putting control back in the hands of the user. Our infrastructure is engineered to natively recognize and respect the <strong>Global Privacy Control (GPC)</strong> signal emitted by supported browsers and extensions.
          </p>
          <p className="text-slate-300 leading-relaxed mt-2">
            If your browser broadcasts a GPC signal, our system automatically interprets this as a definitive opt-out request corresponding to the sale or sharing of personal information, instantly overriding any localized cookie preferences in favor of maximum privacy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">5. Cookie Categorization & Usage</h2>
          <p className="text-slate-300 leading-relaxed">
            Our platform utilizes cookies—small text files deposited onto your device—to govern session states, remember preferences, and facilitate analytics/advertisements. To maintain compliance, we segment these into strict categories:
          </p>
          <ul className="text-slate-300 list-disc pl-6 space-y-4 mt-4">
            <li>
              <strong>Essential Cookies (Strictly Necessary):</strong> These are indispensable for the operation of the website. They manage security tokens, network routing, and your explicit consent preferences. Because the site cannot function securely without them, they cannot be disabled in our systems.
            </li>
            <li>
              <strong>Analytics & Performance Cookies:</strong> These optional payload trackers aggregate anonymous data regarding traffic sources and page interactions via tools like Google Analytics. They help us understand performance bottlenecks but are not deployed without your explicit acceptance.
            </li>
            <li>
              <strong>Advertising Cookies:</strong> Deployed via third-party syndication networks (such as Google AdSense), these cookies track cross-site behavior to serve targeted, relevant advertisements. We require affirmative consent before initializing any advertising cookie scripts, which you may revoke at any time via our Consent Management Platform (CMP).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">6. Third-Party Service Providers</h2>
          <p className="text-slate-300 leading-relaxed">
            We partner with verified external entities to host infrastructure and deliver advertisements. These partners process data governed by their own stringent privacy policies:
          </p>
          <ul className="text-slate-300 list-disc pl-6 space-y-2 mt-2">
            <li><strong>Vercel Inc.:</strong> For secure, edge-network hosting and foundational traffic analytics.</li>
            <li><strong>Google LLC (AdSense & Analytics):</strong> For programmatic advertisement fulfillment and anonymous usage metrics.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">7. Your Statutory Rights (GDPR & CCPA)</h2>
          <p className="text-slate-300 leading-relaxed">
            Regardless of your geographic jurisdiction, we extend the following rights to all users:
          </p>
          <ul className="text-slate-300 list-disc pl-6 space-y-2 mt-2">
            <li><strong>Right to Access & Portability:</strong> Obtain a record of any identifiable data we process.</li>
            <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request the total deletion of any correspondence or non-essential records.</li>
            <li><strong>Right to Rectification:</strong> Formally correct any inaccurate personal data.</li>
            <li><strong>Right to Non-Discrimination:</strong> Receive equal service speed and quality if you exercise your privacy rights, including opting out of advertising cookies.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">8. Children&apos;s Data Protection</h2>
          <p className="text-slate-300 leading-relaxed">
            Our architectural tools are designed for professional and adult consumer use. We do not intentionally or knowingly solicit, collect, or store personal information from individuals under the age of 16. If we detect such data, it is subjected to immediate cryptographic erasure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">9. Contact the Legal Team</h2>
          <p className="text-slate-300 leading-relaxed">
            For data subject access requests, formal inquiries regarding our Zero-Retention architecture, or general privacy concerns, please contact our Data Protection Officer at:
          </p>
          <p className="mt-4">
            <a
              href="mailto:legal@freeaipromptmaker.com"
              className="text-cyan-400 font-medium hover:text-cyan-300 underline underline-offset-4"
            >
              legal@freeaipromptmaker.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
