import { test, expect } from '@playwright/test';

test.describe('Devices Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to devices page from header', async ({ page }) => {
    // Navigate to a different page first
    await page.goto('/sample');

    // Wait for sample page to load
    await expect(
      page.getByRole('heading', { name: 'Sample Page' })
    ).toBeVisible();

    // Click on Devices link in header
    const devicesLink = page.getByRole('link', { name: 'Devices' });
    await expect(devicesLink).toBeVisible();
    await devicesLink.click();

    // Should navigate to devices page
    await expect(page.getByRole('heading', { name: 'Devices' })).toBeVisible();
    await expect(page).toHaveURL('/devices');
  });

  test('should load devices page correctly with mock data', async ({
    page,
  }) => {
    // Navigate directly to devices page
    await page.goto('/devices');

    // Verify the page loads correctly
    await expect(page).toHaveTitle(/React Vite Starter/);

    // Check that we're on the devices page
    await expect(page.getByRole('heading', { name: 'Devices' })).toBeVisible();

    // Verify the main content area exists
    await expect(page.getByRole('main')).toBeVisible();

    // Wait for table to load with mock data
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should display all device data correctly in table', async ({
    page,
  }) => {
    // Navigate to devices page
    await page.goto('/devices');

    // Wait for table to load
    await expect(page.getByRole('table')).toBeVisible();

    // Check table headers
    await expect(page.getByRole('columnheader', { name: 'ID' })).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Model' })
    ).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'OS' })).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Status' })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Data Center' })
    ).toBeVisible();

    // Check some expected device data is present
    await expect(
      page.getByText('iPhone 15 Pro', { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText('Galaxy S24 Ultra', { exact: true })
    ).toBeVisible();
    await expect(page.getByText('Pixel 8 Pro', { exact: true })).toBeVisible();

    // Check OS combinations are displayed
    await expect(
      page.getByText('iOS 17.1.2', { exact: true }).first()
    ).toBeVisible();
    await expect(
      page.getByText('Android 14.0', { exact: true }).first()
    ).toBeVisible();

    // Check status badges are present
    await expect(
      page.getByText('connected', { exact: true }).first()
    ).toBeVisible();
    await expect(
      page.getByText('disconnected', { exact: true }).first()
    ).toBeVisible();

    // Check data center names are displayed
    await expect(
      page.getByText('New York', { exact: true }).first()
    ).toBeVisible();
    await expect(
      page.getByText('Los Angeles', { exact: true }).first()
    ).toBeVisible();
  });

  test('should show Add Device button (visual only)', async ({ page }) => {
    // Navigate to devices page
    await page.goto('/devices');

    // Find and verify the Add Device button
    const addButton = page.getByRole('button', { name: 'Add Device' });
    await expect(addButton).toBeVisible();

    // Verify the button has the correct styling (purple background)
    await expect(addButton).toHaveClass(/bg-\[#625b71\]/);

    // Verify the plus icon is present
    await expect(addButton.locator('svg')).toBeVisible();

    // Set up console listener to capture the console.log
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'log') {
        consoleMessages.push(msg.text());
      }
    });

    // Click the button
    await addButton.click();

    // Verify console.log was called (since button isn't fully implemented)
    expect(consoleMessages).toContain('Add device clicked');
  });

  test('should support column sorting functionality', async ({ page }) => {
    // Navigate to devices page
    await page.goto('/devices');

    // Wait for table to be visible
    await expect(page.getByRole('table')).toBeVisible();

    // Click on Model column header to sort
    const modelHeader = page.getByRole('columnheader', { name: 'Model' });
    await expect(modelHeader).toBeVisible();

    // Click to sort ascending
    await modelHeader.click();

    // Verify sort indicator appears (should show ↑ or similar)
    await expect(modelHeader.locator('span')).toContainText('↑');

    // Click again to sort descending
    await modelHeader.click();

    // Verify sort indicator changes to descending (should show ↓ or similar)
    await expect(modelHeader.locator('span')).toContainText('↓');

    // Try sorting other columns
    const osHeader = page.getByRole('columnheader', { name: 'OS' });
    await osHeader.click();
    await expect(osHeader.locator('span')).toContainText('↑');

    const statusHeader = page.getByRole('columnheader', { name: 'Status' });
    await statusHeader.click();
    await expect(statusHeader.locator('span')).toContainText('↑');
  });

  test('should show active navigation state when on devices page', async ({
    page,
  }) => {
    // Navigate directly to /devices to trigger active state
    await page.goto('/devices');

    // Check that "Devices" appears in the navigation and is active (bold)
    const devicesLink = page.getByRole('link', { name: 'Devices' });
    await expect(devicesLink).toBeVisible();

    // Verify "Devices" has the active styling (should be bold)
    await expect(devicesLink).toHaveClass(/font-bold/);

    // Verify "Data Centers" link is present but not active
    const dataCentersLink = page.getByRole('link', { name: 'Data Centers' });
    await expect(dataCentersLink).toBeVisible();
    await expect(dataCentersLink).not.toHaveClass(/font-bold/);
  });

  test('should handle responsive behavior', async ({ page }) => {
    // Navigate to devices page
    await page.goto('/devices');

    // Test with different viewport sizes
    await page.setViewportSize({ width: 1024, height: 768 });

    // Table should still be visible and functional
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Devices' })).toBeVisible();

    // Button should still be visible
    await expect(
      page.getByRole('button', { name: 'Add Device' })
    ).toBeVisible();

    // Test with smaller viewport
    await page.setViewportSize({ width: 768, height: 600 });

    // Core elements should still be accessible
    await expect(page.getByRole('heading', { name: 'Devices' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Navigate to devices page
    await page.goto('/devices');

    // Check table has proper structure
    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    // Check table headers are properly marked
    await expect(page.getByRole('columnheader', { name: 'ID' })).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Model' })
    ).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'OS' })).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Status' })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Data Center' })
    ).toBeVisible();

    // Check that cells are properly accessible
    const cells = page.getByRole('cell');
    await expect(cells.first()).toBeVisible();

    // Check button is accessible
    const addButton = page.getByRole('button', { name: 'Add Device' });
    await expect(addButton).toBeVisible();

    // Check page has proper main content structure
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Devices' })).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Navigate to devices page with error parameter to trigger error state
    await page.goto('/devices');

    // Intercept the API call and force an error response
    await page.route('**/api/devices', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    // Reload the page to trigger the error
    await page.reload();

    // The page should still load the basic structure
    await expect(page.getByRole('heading', { name: 'Devices' })).toBeVisible();

    // The Add Device button should still be present
    await expect(
      page.getByRole('button', { name: 'Add Device' })
    ).toBeVisible();

    // The table container should be present, even if it shows an error state
    // (depending on how the DataTable component handles errors)
    await expect(page.getByRole('main')).toBeVisible();
  });
});
