import { expect, test } from '@playwright/test';

const removedSlug = '/blog/2026-05-19-sell-ai-art-monetization-guide';
const mergedSlug = '/blog/2026-01-31-master-midjourney-chaos-weird';
const verifiedSlug = '/blog/2025-11-29-stable-diffusion-negative-prompts-guide';

test('removed guides answer 410 and merged guides redirect in one hop', async ({ request }) => {
  const removed = await request.get(removedSlug, { maxRedirects: 0 });
  expect(removed.status()).toBe(410);
  expect(removed.headers()['x-robots-tag']).toBe('noindex');

  const merged = await request.get(mergedSlug, { maxRedirects: 0 });
  expect(merged.status()).toBe(308);
  expect(merged.headers().location).toMatch(/\/blog\/2025-11-27-midjourney-v6-complete-prompt-guide$/);
});

test('verified guide hub uses bounded factual copy', async ({ page }) => {
  await page.goto('/blog');
  await expect(page.locator('body')).not.toContainText(
    /production-ready|better images|output quality|fewer iterations/i
  );
});

test('verified guide is indexable and identifies its evidence', async ({ page }) => {
  await page.goto(verifiedSlug);
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/i);
  await expect(page.getByText(/Checked against the sources listed at the end/)).toBeVisible();
  await expect(page.locator('header time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
  await expect(page.getByRole('heading', { name: 'Primary sources' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Stability AI Developer Platform/i })).toBeVisible();
});

test('unknown routes return a useful 404 document', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'This page does not exist' })).toBeVisible();
  await expect(page.getByRole('main').getByRole('link', { name: 'Prompt generator', exact: true })).toBeVisible();
});
