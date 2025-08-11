import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to Data Centers when clicking logo/DCMS text', async ({
    page,
  }) => {
    // Start on a different page
    await page.goto('/sample');

    // Verify we're on the sample page
    await expect(
      page.getByRole('heading', { name: 'Sample Page' })
    ).toBeVisible();

    // Click on the logo area (the outer link that wraps the AppLogo)
    const logoLink = page.locator('header').getByRole('link').first();
    await expect(logoLink).toBeVisible();
    await logoLink.click();

    // Should navigate to data centers page
    await expect(
      page.getByRole('heading', { name: 'Data Centers' })
    ).toBeVisible();
    await expect(page).toHaveURL('/data-centers');
  });

  test('should show correct active states in navigation', async ({ page }) => {
    // Go to data centers page using explicit route to trigger active state
    await page.goto('/data-centers');

    // Data Centers should be active (bold)
    const dataCentersLink = page.getByRole('link', { name: 'Data Centers' });
    await expect(dataCentersLink).toBeVisible();
    await expect(dataCentersLink).toHaveClass(/font-bold/);

    // Devices should not be active
    const devicesLink = page.getByRole('link', { name: 'Devices' });
    await expect(devicesLink).toBeVisible();
    await expect(devicesLink).not.toHaveClass(/font-bold/);
  });

  test('should maintain navigation consistency across routes', async ({
    page,
  }) => {
    // Test navigation from different starting points
    const routes = ['/', '/dashboard', '/sample'];

    for (const route of routes) {
      await page.goto(route);

      // Logo should always be visible and clickable
      const logoLink = page.locator('header').getByRole('link').first();
      await expect(logoLink).toBeVisible();

      // Navigation menu should always be visible
      await expect(
        page.getByRole('link', { name: 'Data Centers' })
      ).toBeVisible();
      await expect(page.getByRole('link', { name: 'Devices' })).toBeVisible();

      // Click logo should always go to data centers
      await logoLink.click();
      await expect(
        page.getByRole('heading', { name: 'Data Centers' })
      ).toBeVisible();
    }
  });

  test('should support direct URL access to data centers', async ({ page }) => {
    // Test direct navigation to /data-centers
    await page.goto('/data-centers');

    // Should show the data centers page
    await expect(
      page.getByRole('heading', { name: 'Data Centers' })
    ).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();

    // Navigation should show Data Centers as active
    const dataCentersLink = page.getByRole('link', { name: 'Data Centers' });
    await expect(dataCentersLink).toHaveClass(/font-bold/);
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Start at data centers
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Data Centers' })
    ).toBeVisible();

    // Navigate to sample page
    await page.goto('/sample');
    await expect(
      page.getByRole('heading', { name: 'Sample Page' })
    ).toBeVisible();

    // Use browser back
    await page.goBack();
    await expect(
      page.getByRole('heading', { name: 'Data Centers' })
    ).toBeVisible();

    // Use browser forward
    await page.goForward();
    await expect(
      page.getByRole('heading', { name: 'Sample Page' })
    ).toBeVisible();
  });
});
