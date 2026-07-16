import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from '@/components/ThemeProvider';

function ThemeProbe() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <button type="button" onClick={() => setTheme('dark')}>
      {theme}:{resolvedTheme}
    </button>
  );
}

describe('theme provider', () => {
  beforeEach(() => localStorage.clear());

  it('defaults to the system preference', () => {
    render(<ThemeProvider><ThemeProbe /></ThemeProvider>);
    expect(screen.getByRole('button')).toHaveTextContent('system:light');
  });

  it('persists an explicit preference', () => {
    render(<ThemeProvider><ThemeProbe /></ThemeProvider>);
    screen.getByRole('button').click();
    expect(localStorage.getItem('theme-preference')).toBe('dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });
});
