import { expect, test } from '@playwright/test';

test('homepage exposes one main landmark and generator heading', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: /prompt/i }).first()).toBeVisible();
});
