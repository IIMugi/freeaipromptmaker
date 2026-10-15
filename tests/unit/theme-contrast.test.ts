import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Reads the colour tokens from app/globals.css and checks WCAG contrast on every surface they sit on.
// axe cannot see these combinations reliably, so the pairs are checked here on flat colours.

const css = readFileSync(join(process.cwd(), 'app/globals.css'), 'utf8');

function tokens(selector: string) {
  const start = css.indexOf(selector);
  const block = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start));
  return Object.fromEntries([...block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1]!, m[2]!]));
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const themes = {
  light: tokens(':root,\n[data-theme="light"]'),
  dark: tokens('[data-theme="dark"]'),
};

const TEXT = ['ink', 'ink-2', 'ink-3', 'accent', 'role-subject', 'role-style', 'role-light', 'role-param', 'role-negative', 'ok', 'warn', 'danger'];
const SURFACES = ['paper', 'surface', 'sunken'];

describe.each(Object.entries(themes))('%s theme', (_, theme) => {
  it('defines every token', () => {
    for (const name of [...TEXT, ...SURFACES, 'line-strong', 'on-accent', 'accent-wash', 'focus', 'danger-wash', 'warn-wash']) {
      expect(theme[name], name).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it.each(TEXT)('%s text is at least 4.5:1 on every surface', (name) => {
    for (const surface of SURFACES) {
      expect(contrast(theme[name]!, theme[surface]!), `${name} on ${surface}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('keeps ink readable on selected, warning and error backgrounds', () => {
    for (const wash of ['accent-wash', 'danger-wash', 'warn-wash']) {
      expect(contrast(theme.ink!, theme[wash]!), wash).toBeGreaterThanOrEqual(4.5);
      expect(contrast(theme['ink-2']!, theme[wash]!), `ink-2 on ${wash}`).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast(theme['role-style']!, theme['accent-wash']!), 'role-style on accent-wash').toBeGreaterThanOrEqual(4.5);
  });

  it('gives buttons on the accent colour readable text', () => {
    expect(contrast(theme['on-accent']!, theme.accent!)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme['on-accent']!, theme['accent-hover']!)).toBeGreaterThanOrEqual(4.5);
  });

  it('draws input borders and the focus ring at 3:1 or more', () => {
    for (const surface of SURFACES) {
      expect(contrast(theme['line-strong']!, theme[surface]!), `line-strong on ${surface}`).toBeGreaterThanOrEqual(3);
      expect(contrast(theme.focus!, theme[surface]!), `focus on ${surface}`).toBeGreaterThanOrEqual(3);
      expect(contrast(theme.accent!, theme[surface]!), `accent border on ${surface}`).toBeGreaterThanOrEqual(3);
    }
  });
});
