import { test, expect } from '@playwright/test';

test.describe('Vote flow', () => {
  test('vote page shows connect wallet prompt when not connected', async ({ page }) => {
    await page.goto('/vote');
    await expect(page.getByText('Vote Your XI')).toBeVisible();
    await expect(page.getByText('Connect your Solana wallet')).toBeVisible();
  });
});
