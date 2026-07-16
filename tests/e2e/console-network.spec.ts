import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/blog',
  '/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
  '/blog/2025-11-27-midjourney-v6-complete-prompt-guide',
  '/image-to-prompt',
  '/about',
  '/privacy',
  '/tools',
];

for (const route of routes) {
  test(`${route} has no unexpected console, page, or first-party network errors`, async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(`console: ${message.text()}`);
    });
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    page.on('response', (response) => {
      const url = new URL(response.url());
      if (url.origin === 'http://127.0.0.1:3200' && response.status() >= 400) {
        errors.push(`network: ${response.status()} ${url.pathname}`);
      }
    });

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
}

test('readiness build makes no Google advertising or measurement requests', async ({ page }) => {
  const googleRequests: string[] = [];
  page.on('request', (request) => {
    const hostname = new URL(request.url()).hostname;
    if (/doubleclick|googlesyndication|google-analytics|googletagmanager/.test(hostname)) {
      googleRequests.push(request.url());
    }
  });

  await page.goto('/');
  await page.getByRole('button', { name: /decline analytics/i }).click();
  await page.reload();
  expect(googleRequests).toEqual([]);
  await expect(page.locator('[data-ad-client], ins.adsbygoogle')).toHaveCount(0);
});

test('redirect and removal routes return their intended statuses', async ({ request }) => {
  const redirect = await request.get('/flux-pro', { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe('/prompt-generators');

  const merged = await request.get('/blog/2025-11-27-stable-diffusion-negative-prompts-guide', {
    maxRedirects: 0,
  });
  expect(merged.status()).toBe(308);
  expect(merged.headers().location).toBe(
    '/blog/2025-11-29-stable-diffusion-negative-prompts-guide',
  );

  const gone = await request.get(
    '/blog/2026-02-05-ai-art-reference-guide-inspiration-prompts/keyword',
  );
  expect(gone.status()).toBe(410);
});
