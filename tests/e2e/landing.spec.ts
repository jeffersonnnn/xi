import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test('renders the football pitch with 11 slot positions', async ({ page }) => {
    await page.goto('/');

    const pitch = page.locator('svg');
    await expect(pitch).toBeVisible();

    // Check for grass stripe pattern
    const grassPattern = page.locator('#grass');
    await expect(grassPattern).toBeAttached();

    // Check for white line markings (centre circle)
    const circle = pitch.locator('circle');
    expect(await circle.count()).toBeGreaterThan(0);
  });

  test('shows the next update clock', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Next update')).toBeVisible();
  });

  test('shows connect wallet CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Vote Your XI')).toBeVisible();
  });

  test('shows the People\'s XI heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText("The People's")).toBeVisible();
  });

  test('shows kickoff countdown', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Kickoff in')).toBeVisible();
  });
});
