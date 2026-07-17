import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/blog',
  '/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
  '/blog/2025-11-27-midjourney-v6-complete-prompt-guide',
  '/image-to-prompt',
  '/about',
  '/privacy',
  '/content-standards',
  '/tools',
  '/prompt-generators',
  '/prompt-generator-for/youtube-thumbnails',
];

for (const route of routes) {
  test(`${route} has no automated WCAG A/AA violations`, async ({ page }) => {
    for (const theme of ['light', 'dark']) {
      await page.addInitScript((value) => localStorage.setItem('theme-preference', value), theme);
      await page.goto(route);
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(
        result.violations.map((violation) => ({
          id: violation.id,
          nodes: violation.nodes.map((node) => ({
            target: node.target,
            checks: node.any.map((check) => check.data),
          })),
          theme,
        })),
      ).toEqual([]);
    }
  });
}

test('skip link reaches the main content with the keyboard', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: /skip to main content/i });
  await expect(skipLink).toBeFocused();
  await skipLink.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});

for (const route of ['/prompt-generators', '/prompt-generator-for/youtube-thumbnails']) {
  test(route + ' exposes exactly one main landmark', async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole('main')).toHaveCount(1);
  });
}
