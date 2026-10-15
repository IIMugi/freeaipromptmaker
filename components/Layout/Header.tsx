'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BrandMark } from '@/components/Layout/BrandMark';
import { ThemeSwitch } from '@/components/Layout/ThemeSwitch';

export const NAV_LINKS = [
  { href: '/', label: 'Prompt generator' },
  { href: '/negative-prompt-generator', label: 'Negative prompts' },
  { href: '/prompt-generators', label: 'By use case' },
  { href: '/blog', label: 'Guides' },
];

export function Header() {
  const pathname = usePathname();
  const [openMenuPath, setOpenMenuPath] = useState<string | null>(null);
  const isMenuOpen = openMenuPath === pathname;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenuPath(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const isActive = (href: string) =>
    pathname === href ||
    (href === '/prompt-generators' && pathname.startsWith('/prompt-generator-for')) ||
    (href !== '/' && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 rounded-control"
          aria-label="Free AI Prompt Maker home"
        >
          <BrandMark className="h-7 w-7 flex-none" />
          <span className="truncate text-[1.05rem] font-bold tracking-tight text-ink [font-stretch:85%]">
            Free AI Prompt Maker
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden h-full items-stretch gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={cn(
                'flex items-center border-b-2 px-3 text-[0.95rem] font-medium transition-colors',
                isActive(link.href) ? 'border-accent text-ink' : 'border-transparent text-ink-2 hover:text-ink',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-none items-center gap-2">
          <ThemeSwitch className="hidden sm:inline-flex" />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-control border border-line text-ink lg:hidden"
            onClick={() => setOpenMenuPath(isMenuOpen ? null : pathname)}
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="site-mobile-navigation"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          id="site-mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-line bg-surface px-4 pb-4 pt-2 lg:hidden"
        >
          <ul className="mx-auto max-w-7xl">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpenMenuPath(null)}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={cn(
                    'flex min-h-12 items-center border-b border-line text-base font-medium',
                    isActive(link.href) ? 'text-accent' : 'text-ink',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-3 sm:hidden">
            <span className="text-sm text-ink-2">Theme</span>
            <ThemeSwitch />
          </div>
        </nav>
      ) : null}
    </header>
  );
}
