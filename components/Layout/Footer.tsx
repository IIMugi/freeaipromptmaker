'use client';

import Link from 'next/link';
import { Sparkles, Github, Twitter, Mail } from 'lucide-react';

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
    { href: '/prompt-generators', label: 'Prompt Hub' },
    { href: '/image-to-prompt', label: 'Image to Prompt' },
    { href: '/tools', label: 'Tool Directory' },
  ];

  return (
    <footer className="mt-32 relative overflow-hidden bg-[var(--surface-ground)] pb-12">
      {/* 2026 Core Aesthetic Top Border Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-40 shadow-[0_0_20px_rgba(0,240,255,0.5)]" />
      <div className="absolute top-0 inset-x-0 h-[300px] bg-gradient-to-b from-[var(--accent-primary-soft)] to-transparent opacity-20 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand & Intro */}
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2 group">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--accent-primary-strong)] bg-[var(--accent-primary-soft)] transition-transform duration-200 group-hover:scale-105">
                <Sparkles className="h-4 w-4 text-[var(--accent-primary)]" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
                Free<span className="brand-gradient">AIPromptMaker</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">
              Build model-ready prompts with visual controls, tested patterns, and practical guides for Midjourney, DALL-E, Flux, and SDXL.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://twitter.com/FreeAIPromptMkr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary-strong)] hover:text-[var(--text-primary)]"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="https://github.com/IIMugi/freeaipromptmaker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary-strong)] hover:text-[var(--text-primary)]"
                aria-label="View our GitHub repository"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Resources */}
          <nav aria-label="Resources Links">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:underline hover:decoration-[var(--accent-primary-soft)] hover:underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal Links">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] hover:underline hover:decoration-[var(--accent-primary-soft)] hover:underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter (New) */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)]">Stay Updated</h3>
            <p className="mb-4 text-sm text-[var(--text-secondary)]">
              Get the latest prompt techniques and AI model updates in your inbox.
            </p>
            <form className="flex flex-col gap-2 relative" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-sunken)] py-2.5 pl-10 pr-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none transition-colors focus:border-[var(--accent-primary-strong)] focus:ring-1 focus:ring-[var(--accent-primary-strong)]"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-violet)] px-4 py-2.5 text-sm font-bold text-black shadow-[var(--shadow-glow)] transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Join Newsletter
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-default)] pt-8 md:flex-row">
          <p className="text-sm text-[var(--text-tertiary)]">
            © {currentYear} Free AI Prompt Maker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
