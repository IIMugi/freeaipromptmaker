import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const reviewSlug = '/blog/2025-11-29-stable-diffusion-negative-prompts-guide';

test('needs-review guide is transparent, noindexed, and ad-free', async ({ page }) => {
  await page.goto(reviewSlug);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/i);
  await expect(page.getByLabel('Editorial review status')).toBeVisible();
  await expect(page.getByText('Needs review', { exact: true })).toBeVisible();
  await expect(page.getByText('Not yet verified', { exact: true }).first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/ad placeholder|advertisement/i);
});

test('article and trust pages have no critical accessibility violations in light theme', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('theme-preference', 'light'));
  for (const path of [reviewSlug, '/about', '/privacy', '/tools']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((violation) => violation.impact === 'critical')).toEqual([]);
  }
});

test('unknown routes return a useful 404 document', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: /open the generator/i })).toBeVisible();
});
