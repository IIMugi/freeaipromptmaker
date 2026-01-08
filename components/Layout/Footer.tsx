import Link from 'next/link';
import { Sparkles, Github, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/content-standards', label: 'Content Standards' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/contact', label: 'Contact' },
    { href: '/cookies', label: 'Cookie Policy' },
  ];

  const resourceLinks = [
    { href: '/blog', label: 'Blog' },
    { href: '/#generator', label: 'Prompt Generator' },
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-violet-500" />
              <span className="font-bold text-white text-lg">
                Free<span className="text-violet-500">AI</span>PromptMaker
              </span>
            </Link>
            <p className="text-slate-300 text-sm max-w-md">
              Free AI prompt generator - create stunning prompts visually for 
              Midjourney, DALL-E 3, and Stable Diffusion. No memorization needed!
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://twitter.com/FreeAIPromptMkr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-violet-400 transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://github.com/IIMugi/freeaipromptmaker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-violet-400 transition-colors"
                aria-label="View our GitHub repository"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-400 text-sm text-center">
            Copyright {currentYear} Free AI Prompt Maker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

