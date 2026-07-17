import { expect, test } from '@playwright/test';

const contentRoutes = [
  '/',
  '/image-to-prompt',
  '/blog',
  '/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
  '/blog/2025-11-28-dall-e-3-photorealism-prompt-guide',
  '/prompt-generators',
  '/prompt-generator-for/youtube-thumbnails',
  '/about',
  '/contact',
  '/privacy',
  '/cookies',
  '/terms',
  '/content-standards',
  '/tools',
];

for (const width of [375, 768, 820, 1280]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${theme} publisher matrix fits at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.addInitScript(
        ({ selectedTheme }) => {
          localStorage.setItem('theme-preference', selectedTheme);
          localStorage.setItem('site-consent-v2', 'declined');
        },
        { selectedTheme: theme },
      );

      for (const route of contentRoutes) {
        const response = await page.goto(route);
        expect(response?.status(), route).toBe(200);
        await expect(page.locator('html'), route).toHaveAttribute('data-theme', theme);
        await expect(page.getByRole('main'), route).toHaveCount(1);
        await expect(page.getByRole('heading', { level: 1 }), route).toHaveCount(1);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, route).toBeLessThanOrEqual(1);
      }
    });
  }
}

test('keyboard focus is visible and mobile navigation returns to its trigger', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.addInitScript(() => localStorage.setItem('site-consent-v2', 'declined'));
  await page.goto('/');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: /skip to main content/i });
  await expect(skipLink).toBeFocused();
  expect(await skipLink.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');

  const menuButton = page.getByRole('button', { name: /open navigation menu/i });
  await menuButton.focus();
  await menuButton.press('Enter');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0);
  await expect(menuButton).toBeFocused();
});

test('reduced-motion preference collapses animation and transition durations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('site-consent-v2', 'declined'));
  await page.goto('/');

  const timings = await page.evaluate(() => {
    const element = document.createElement('div');
    element.className = 'section-shell animate-fade-in';
    document.body.append(element);
    const style = getComputedStyle(element);
    const result = { animation: style.animationDuration, transition: style.transitionDuration };
    element.remove();
    return result;
  });
  expect(Number.parseFloat(timings.animation)).toBeLessThanOrEqual(0.00001);
  expect(Number.parseFloat(timings.transition)).toBeLessThanOrEqual(0.00001);
});

test('privacy controls support allow, reopen, and withdraw states', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /allow analytics/i }).click();
  await expect(page.getByRole('button', { name: /privacy settings/i })).toBeVisible();
  await page.getByRole('button', { name: /privacy settings/i }).click();
  await expect(page.getByRole('region', { name: /analytics privacy settings/i })).toBeVisible();
  await page.getByRole('button', { name: /decline analytics/i }).click();
  expect(await page.evaluate(() => localStorage.getItem('site-consent-v2'))).toBe('declined');
});

test('status routes retain their explicit response and destination behavior', async ({ request }) => {
  const redirect = await request.get('/flux-pro?source=matrix', { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe('/prompt-generators?source=matrix');

  const gone = await request.get('/blog/2026-02-05-ai-art-reference-guide-inspiration-prompts/keyword');
  expect(gone.status()).toBe(410);

  const missing = await request.get('/matrix-missing-route');
  expect(missing.status()).toBe(404);
});
