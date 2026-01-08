import type { Metadata } from 'next';
import { Mail, MessageSquare, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Free AI Prompt Maker team.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
        <p className="text-xl text-slate-400">
          Have questions? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-violet-600/20 rounded-lg">
                <Mail className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                <p className="text-slate-400 text-sm mb-2">
                  Best for detailed inquiries
                </p>
                <a
                  href="mailto:hello@freeaipromptmaker.com"
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  hello@freeaipromptmaker.com
                </a>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-violet-600/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Social Media
                </h3>
                <p className="text-slate-400 text-sm mb-2">
                  Follow us for updates
                </p>
                <a
                  href="https://twitter.com/FreeAIPromptMkr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  @FreeAIPromptMkr
                </a>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-violet-600/20 rounded-lg">
                <Clock className="w-6 h-6 text-violet-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Response Time
                </h3>
                <p className="text-slate-400 text-sm">
                  We typically respond within 24-48 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="font-medium text-white mb-2">
                Is Free AI Prompt Maker free to use?
              </h3>
              <p className="text-slate-400 text-sm">
                Yes! Our prompt generator is completely free. We sustain the
                service through non-intrusive advertising.
              </p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="font-medium text-white mb-2">
                Do you store my prompts?
              </h3>
              <p className="text-slate-400 text-sm">
                Your prompt history is stored locally in your browser. We don&apos;t
                have access to your prompts.
              </p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="font-medium text-white mb-2">
                Can I request new features?
              </h3>
              <p className="text-slate-400 text-sm">
                Absolutely! Send us an email with your suggestions. We love
                hearing from our users.
              </p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="font-medium text-white mb-2">
                Found a bug?
              </h3>
              <p className="text-slate-400 text-sm">
                Please report it via email with steps to reproduce. We&apos;ll fix it
                as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

