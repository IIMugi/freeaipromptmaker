import Link from 'next/link';
import { Github, Sparkles } from 'lucide-react';
import { SITE } from '@/lib/site';

const productLinks = [
  { href: '/#generator', label: 'Prompt generator' },
  { href: '/prompt-generators', label: 'Prompt hub' },
  { href: '/image-to-prompt', label: 'Image analysis' },
  { href: '/tools', label: 'Tool directory' },
  { href: '/blog', label: 'Verified guides' },
];

const trustLinks = [
  { href: '/about', label: 'About' },
  { href: '/content-standards', label: 'Content standards' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/cookies', label: 'Cookies' },
  { href: '/terms', label: 'Terms' },
  { href: '/contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border-default)] bg-[var(--surface-ground)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--accent-primary-strong)] bg-[var(--accent-primary-soft)]">
              <Sparkles className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden="true" />
            </span>
            <span className="font-semibold text-[var(--text-primary)]">{SITE.name}</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            Build and copy structured prompts locally. Optional image analysis is clearly separated
            and fails closed when its provider is unavailable.
          </p>
          <a
            href={SITE.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--surface-raised)] px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            Source repository
          </a>
        </div>

        <FooterLinks title="Product" links={productLinks} />
        <FooterLinks title="Trust & legal" links={trustLinks} />
      </div>

      <div className="border-t border-[var(--border-default)]">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-[var(--text-tertiary)] sm:px-6">
          © {new Date().getFullYear()} {SITE.name}
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <nav aria-label={`${title} links`}>
      <h2 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:underline">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
