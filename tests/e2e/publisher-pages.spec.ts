import { expect, test } from '@playwright/test';

const reviewSlug = '/blog/2025-11-27-midjourney-v6-complete-prompt-guide';
const verifiedSlug = '/blog/2025-11-29-stable-diffusion-negative-prompts-guide';

test('needs-review guide is transparent, noindexed, and ad-free', async ({ page }) => {
  await page.goto(reviewSlug);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/i);
  await expect(page.getByLabel('Editorial details')).toBeVisible();
  await expect(page.getByText('Needs review', { exact: true })).toBeVisible();
  await expect(page.getByText('Not yet verified', { exact: true }).first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/ad placeholder|advertisement/i);
});

test('verified guide is indexable and identifies its evidence', async ({ page }) => {
  await page.goto(verifiedSlug);
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/i);
  await expect(page.getByLabel('Editorial details')).toBeVisible();
  await expect(page.getByText('Verified', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Editorial details')).toContainText('2026-07-16');
  await expect(page.getByRole('link', { name: /Stability AI Developer Platform/i })).toBeVisible();
});

test('unknown routes return a useful 404 document', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: /open the generator/i })).toBeVisible();
});
