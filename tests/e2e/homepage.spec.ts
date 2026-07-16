import { expect, test } from '@playwright/test';

for (const width of [375, 1280]) {
  test(`homepage is generator-first at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const generator = page.locator('#generator');
    const explanation = page.locator('#how-formatting-works');
    expect(await generator.evaluate((element) => element.getBoundingClientRect().top)).toBeLessThan(
      await explanation.evaluate((element) => element.getBoundingClientRect().top),
    );

    await expect(page.locator('body')).not.toContainText(
      /100,?000|50,?000|4\.9|2,?847|since 2022|universally acknowledged|guaranteed/i,
    );

    const concept = page.getByLabel('Main concept');
    await concept.fill('quiet red fox portrait');
    await expect(page.getByText(/quiet red fox portrait/i).last()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy prompt to clipboard' })).toBeEnabled();
  });
}

test('homepage form controls have accessible names', async ({ page }) => {
  await page.goto('/');
  const unnamed = await page.locator('input:not([type="hidden"]), textarea, select').evaluateAll(
    (controls) => controls.filter((control) => !control.getAttribute('aria-label') && !control.id).length,
  );
  expect(unnamed).toBe(0);
});
