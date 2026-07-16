import { expect, test } from '@playwright/test';

const reviewSlug = '/blog/2025-11-28-dall-e-3-photorealism-prompt-guide';
const verifiedSlug = '/blog/2025-11-29-stable-diffusion-negative-prompts-guide';

test('needs-review guide withholds its legacy article body and furniture', async ({ page }) => {
  await page.goto(reviewSlug);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/i);
  await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
  await expect(page.locator('meta[name="author"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:type"][content="article"]')).toHaveCount(0);
  await expect(page.locator('meta[property^="article:"]')).toHaveCount(0);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'The Ultimate DALL-E 3 Photorealism Prompt Guide: Lenses, Lighting & Camera Angles',
    })
  ).toBeVisible();
  const editorialDetails = page.getByLabel('Editorial details');
  await expect(editorialDetails).toBeVisible();
  await expect(editorialDetails.locator('dt')).toHaveCount(1);
  await expect(editorialDetails.getByText('Editorial status', { exact: true })).toBeVisible();
  await expect(page.getByText('Needs review', { exact: true })).toBeVisible();
  await expect(editorialDetails).not.toContainText(/Last verified|Sources|Not yet verified/i);
  await expect(page.getByLabel('Editorial review status')).toHaveText(
    'This earlier guide body is withheld while its claims, sources, and current tool version are reviewed.'
  );

  const legacyBodySentinel = "Scrolling through my feed, I stop on an image that just floors me.";
  await expect(page.locator('body')).not.toContainText(legacyBodySentinel);
  expect(await page.content()).not.toContain(legacyBodySentinel);
  await expect(page.getByRole('img', { name: /Ultimate DALL-E 3 Photorealism/i })).toHaveCount(0);
  await expect(page.getByText('On this page', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Key takeaways', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Share this article', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Ready to create your own prompts?', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Try the Visual Prompt Generator', { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole('heading', { name: 'Advantages and limitations', exact: true })
  ).toHaveCount(0);

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(schemas.some((schema) => /"@type"\s*:\s*"Article"/.test(schema))).toBe(false);
  await expect(page.locator('body')).not.toContainText(/ad placeholder|advertisement/i);
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
