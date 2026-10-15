import Link from 'next/link';
import { SITE } from '@/lib/site';
import { BrandMark } from '@/components/Layout/BrandMark';
import { PrivacySettingsButton } from '@/components/Consent/CookieConsent';

const toolLinks = [
  { href: '/', label: 'Prompt generator' },
  { href: '/negative-prompt-generator', label: 'Negative prompt generator' },
  { href: '/prompt-generators', label: 'Prompt generators by use case' },
  { href: '/blog', label: 'Prompt guides' },
  { href: '/tools', label: 'AI image tool directory' },
];

const siteLinks = [
  { href: '/about', label: 'About' },
  { href: '/content-standards', label: 'Content standards' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/cookies', label: 'Cookies' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-control">
            <BrandMark className="h-7 w-7" />
            <span className="font-bold text-ink [font-stretch:85%]">{SITE.name}</span>
          </Link>
          <p className="mt-4 max-w-sm text-[0.95rem] text-ink-2">
            Free prompt tools and guides for Midjourney, Stable Diffusion, Flux, ChatGPT and Gemini. Your prompts are
            built in your browser and never sent to us.
          </p>
        </div>

        <FooterLinks title="Tools" links={toolLinks} />
        <FooterLinks title="Site" links={siteLinks} />
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-ink-3 sm:px-6">
          <span>
            © {new Date().getFullYear()} {SITE.name}
          </span>
          <PrivacySettingsButton className="inline-flex min-h-6 items-center underline-offset-4 hover:text-ink hover:underline" />
          <a
            href={SITE.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-6 items-center underline-offset-4 hover:text-ink hover:underline"
          >
            Source code on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <nav aria-label={`${title} links`}>
      <h2 className="text-[0.95rem] font-semibold text-ink">{title}</h2>
      <ul className="mt-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-9 items-center text-[0.95rem] text-ink-2 underline-offset-4 hover:text-ink hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
