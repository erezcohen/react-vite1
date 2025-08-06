import { test, expect } from '@playwright/test';

test.describe('DCMS Header Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display DCMS branding correctly', async ({ page }) => {
    // Check for DCMS logo text
    await expect(page.getByText('DCMS')).toBeVisible();

    // Verify DCMS text has correct styling
    const dcmsText = page.getByText('DCMS');
    await expect(dcmsText).toHaveCSS('font-weight', '700'); // bold
  });

  test('should display navigation links with correct text', async ({
    page,
  }) => {
    // Check for Data Centers link
    const dataCentersLink = page.getByRole('link', { name: 'Data Centers' });
    await expect(dataCentersLink).toBeVisible();
    await expect(dataCentersLink).toHaveAttribute('href', '/data-centers');

    // Check for Devices link
    const devicesLink = page.getByRole('link', { name: 'Devices' });
    await expect(devicesLink).toBeVisible();
    await expect(devicesLink).toHaveAttribute('href', '/devices');
  });

  test('should display star icon button', async ({ page }) => {
    const starButton = page.getByRole('button', {
      name: 'user-button',
    });

    await expect(starButton).toBeVisible();

    // Verify the button contains a star icon (SVG)
    const starIcon = starButton.locator('svg');
    await expect(starIcon).toBeVisible();
  });

  test('should have correct header layout and spacing', async ({ page }) => {
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();

    // Verify header has correct border styling
    await expect(header).toHaveCSS('border-bottom-width', '1px');

    // Verify the layout contains all expected elements
    await expect(header.getByText('DCMS')).toBeVisible();
    await expect(header.getByRole('navigation')).toBeVisible();
    await expect(header.getByRole('button')).toBeVisible();
  });

  test('should handle navigation link interactions', async ({ page }) => {
    // Click on Data Centers link (will show 404 since route doesn't exist yet)
    await page.getByRole('link', { name: 'Data Centers' }).click();
    await expect(page).toHaveURL('/data-centers');

    // Go back and click on Devices link
    await page.goBack();
    await page.getByRole('link', { name: 'Devices' }).click();
    await expect(page).toHaveURL('/devices');
  });

  test('should handle star button clicks', async ({ page }) => {
    const starButton = page.getByRole('button', {
      name: 'user-button',
    });

    // Click the star button (should not navigate anywhere)
    await starButton.click();

    // Verify we're still on the same page
    await expect(page).toHaveURL('/');
  });

  test('should be responsive across different screen sizes', async ({
    page,
  }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.getByText('DCMS')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Data Centers' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Devices' })).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByText('DCMS')).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Data Centers' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Devices' })).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText('DCMS')).toBeVisible();
    // Navigation links should still be visible in mobile (no hamburger menu in this design)
    await expect(
      page.getByRole('link', { name: 'Data Centers' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Devices' })).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check that the star button has proper ARIA label
    const starButton = page.getByRole('button', {
      name: 'user-button',
    });
    await expect(starButton).toHaveAttribute('aria-label', 'user-button');

    // Check that navigation links are properly accessible
    await expect(
      page.getByRole('link', { name: 'Data Centers' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Devices' })).toBeVisible();

    // Check that header has proper banner role
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('should load without console errors', async ({ page }) => {
    const messages: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        messages.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should have no console errors
    expect(messages).toHaveLength(0);
  });
});
