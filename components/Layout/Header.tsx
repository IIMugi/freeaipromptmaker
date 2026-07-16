'use client';

import Link from 'next/link';
import { Menu, Moon, Sparkles, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';

const navLinks = [
  { href: '/', label: 'Generator' },
  { href: '/prompt-generators', label: 'Prompt Hub' },
  { href: '/image-to-prompt', label: 'Image Analysis' },
  { href: '/tools', label: 'Tools' },
  { href: '/blog', label: 'Guides' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  const isMenuOpen = openMenuPath === pathname;
  const { resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenuPath(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--border-default)] bg-[var(--glass-bg-dense)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="Free AI Prompt Maker home">
          <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-[var(--accent-primary-strong)] bg-[var(--accent-primary-soft)]">
            <Sparkles className="h-4 w-4 text-[var(--accent-primary)]" aria-hidden="true" />
          </span>
          <span className="truncate text-base font-semibold tracking-tight text-[var(--text-primary)]">
            Free AI Prompt Maker
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive(link.href)
                  ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-none items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-secondary)] lg:hidden"
            onClick={() => setOpenMenuPath(isMenuOpen ? null : pathname)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="site-mobile-navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          id="site-mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-[var(--border-default)] bg-[var(--surface-base)] px-4 py-3 lg:hidden"
        >
          <div className="mx-auto grid max-w-7xl gap-1 sm:grid-cols-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpenMenuPath(null)}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'rounded-lg px-3 py-3 text-sm font-medium',
                  isActive(link.href)
                    ? 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
