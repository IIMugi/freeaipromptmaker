import { expect, test } from '@playwright/test';

for (const width of [375, 768, 820, 1280]) {
  test(`navigation fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('theme preference persists and navigation is keyboard dismissible', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: /switch to dark mode|switch to light mode/i }).click();
  const theme = await page.locator('html').getAttribute('data-theme');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme || 'dark');

  await page.getByRole('button', { name: /open navigation menu/i }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(0);
});
