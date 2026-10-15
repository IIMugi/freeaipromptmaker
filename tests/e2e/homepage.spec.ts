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

    const concept = page.getByLabel('What should the image show?');
    await expect(concept).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Copy prompt' }).first()).toBeDisabled();
    await concept.fill('quiet red fox portrait');
    await expect(page.locator('.proof').first()).toContainText('quiet red fox portrait --ar 1:1');
    await expect(page.getByRole('button', { name: 'Copy prompt' }).first()).toBeEnabled();
  });
}

test('every format gives a different prompt and share links restore the settings', async ({ page }) => {
  await page.goto('/?q=red+fox+in+snow&m=sdxl&s=watercolor&ar=4:5&neg=blurry');
  const proof = page.locator('.proof');
  await expect(proof.first()).toHaveText('red fox in snow, watercolor painting, soft bleeding edges, paper texture');
  await expect(proof.nth(1)).toHaveText('blurry');
  await expect(page.getByText('Size: 896 × 1152')).toBeVisible();

  await page.locator('label').filter({ has: page.getByRole('radio', { name: 'Flux' }) }).click();
  await expect(proof.first()).toHaveText('Red fox in snow, watercolor painting, soft bleeding edges, paper texture.');
  await expect(page.getByText(/has no negative prompt/)).toBeVisible();

  await page.locator('label').filter({ has: page.getByRole('radio', { name: 'Midjourney' }) }).click();
  await expect(proof.first()).toHaveText(
    'red fox in snow, watercolor painting, soft bleeding edges, paper texture --ar 4:5 --no blurry',
  );
});

test('a copied prompt can be restored with every setting', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');
  await page.getByLabel('What should the image show?').fill('a lighthouse at night');
  await page.getByRole('button', { name: 'Oil painting', exact: true }).click();
  await page.getByRole('button', { name: 'Copy prompt' }).first().click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'a lighthouse at night, oil painting, visible brushstrokes --ar 1:1',
  );

  await page.reload();
  await page.getByRole('button', { name: /^Restore: a lighthouse at night/ }).first().click();
  await expect(page.getByLabel('What should the image show?')).toHaveValue('a lighthouse at night');
  await expect(page.getByRole('button', { name: 'Oil painting', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.proof').first()).toHaveText('a lighthouse at night, oil painting, visible brushstrokes --ar 1:1');
});

test('homepage form controls have accessible names', async ({ page }) => {
  await page.goto('/');
  const unnamed = await page.locator('input:not([type="hidden"]), textarea, select').evaluateAll(
    (controls) =>
      controls.filter(
        (control) =>
          !control.getAttribute('aria-label') &&
          !control.getAttribute('aria-labelledby') &&
          !(control as HTMLInputElement).labels?.length,
      ).length,
  );
  expect(unnamed).toBe(0);
});
