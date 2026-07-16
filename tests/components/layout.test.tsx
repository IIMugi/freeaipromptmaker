import fs from 'node:fs';
import path from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

describe('global layout', () => {
  it('has a labeled, controllable compact navigation', () => {
    render(<ThemeProvider><Header /></ThemeProvider>);
    const menu = screen.getByRole('button', { name: /open navigation menu/i });
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(menu).toHaveAttribute('aria-controls', 'site-mobile-navigation');
    fireEvent.click(menu);
    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });

  it('has no non-functional newsletter or unsupported social profile', () => {
    render(<Footer />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.queryByText(/newsletter|twitter/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /source repository/i })).toBeInTheDocument();
  });

  it('defines a skip link and one main landmark in the root shell', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'app/layout.tsx'), 'utf8');
    expect(source).toMatch(/Skip to main content/);
    expect(source.match(/<main/g)).toHaveLength(1);
    expect(source).toMatch(/id="main-content"/);
  });
});
