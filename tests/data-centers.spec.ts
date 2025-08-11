import { test, expect } from '@playwright/test';

test.describe('Data Centers Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load Data Centers page as default route', async ({ page }) => {
    // Verify the page loads correctly
    await expect(page).toHaveTitle(/React Vite Starter/);

    // Check that we're on the data centers page by looking for the page title
    await expect(
      page.getByRole('heading', { name: 'Data Centers' })
    ).toBeVisible();

    // Verify the main content area exists
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should show Data Centers as active in navigation when on /data-centers', async ({
    page,
  }) => {
    // Navigate directly to /data-centers to trigger active state
    await page.goto('/data-centers');

    // Check that "Data Centers" appears in the navigation and is active (bold)
    const dataCentersLink = page.getByRole('link', { name: 'Data Centers' });
    await expect(dataCentersLink).toBeVisible();

    // Verify "Data Centers" has the active styling (should be bold)
    await expect(dataCentersLink).toHaveClass(/font-bold/);

    // Verify "Devices" link is present but not active
    const devicesLink = page.getByRole('link', { name: 'Devices' });
    await expect(devicesLink).toBeVisible();
    await expect(devicesLink).not.toHaveClass(/font-bold/);
  });

  test('should navigate to Data Centers page when clicking logo/DCMS text', async ({
    page,
  }) => {
    // Navigate to a different route first
    await page.goto('/sample');

    // Wait for page to load
    await expect(
      page.getByRole('heading', { name: 'Sample Page' })
    ).toBeVisible();

    // Click on the logo area (the outer link that wraps the AppLogo)
    const logoLink = page.locator('header').getByRole('link').first();
    await expect(logoLink).toBeVisible();
    await logoLink.click();

    // Should navigate back to data centers page
    await expect(
      page.getByRole('heading', { name: 'Data Centers' })
    ).toBeVisible();
    await expect(page).toHaveURL('/data-centers');
  });

  test('should display all mock data correctly in table', async ({ page }) => {
    // Wait for table to load
    await expect(page.getByRole('table')).toBeVisible();

    // Check table headers
    await expect(
      page.getByRole('columnheader', { name: 'Location' })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Type' })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'IP Range' })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Description' })
    ).toBeVisible();

    // Check all expected data rows are present
    const expectedData = [
      {
        location: 'New York',
        type: 'On-Premise',
        ip: '192.168.1.0/24',
        description: 'Main data center',
      },
      {
        location: 'Los Angeles',
        type: 'Cloud',
        ip: '10.0.0.0/16',
        description: 'Cloud data center',
      },
      {
        location: 'Chicago',
        type: 'On-Premise',
        ip: '172.16.0.0/20',
        description: 'Secondary data center',
      },
      {
        location: 'London',
        type: 'Cloud',
        ip: '10.1.0.0/16',
        description: 'International cloud data center',
      },
      {
        location: 'Tokyo',
        type: 'On-Premise',
        ip: '192.168.2.0/24',
        description: 'Asia data center',
      },
    ];

    // Check each row of data exists in the table
    for (const data of expectedData) {
      await expect(
        page.getByText(data.location, { exact: true })
      ).toBeVisible();
      await expect(page.getByText(data.ip, { exact: true })).toBeVisible();
      await expect(
        page.getByText(data.description, { exact: true })
      ).toBeVisible();
    }

    // Check that the types exist (without requiring exact count)
    await expect(
      page.getByText('On-Premise', { exact: true }).first()
    ).toBeVisible();
    await expect(
      page.getByText('Cloud', { exact: true }).first()
    ).toBeVisible();
  });

  test('should show Add Data Center button and handle click', async ({
    page,
  }) => {
    // Find and verify the Add Data Center button
    const addButton = page.getByRole('button', { name: 'Add Data Center' });
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
    expect(consoleMessages).toContain('Add data center clicked');
  });

  test('should support column sorting functionality', async ({ page }) => {
    // Wait for table to be visible
    await expect(page.getByRole('table')).toBeVisible();

    // Click on Location column header to sort
    const locationHeader = page.getByRole('columnheader', { name: 'Location' });
    await expect(locationHeader).toBeVisible();

    // Click to sort ascending
    await locationHeader.click();

    // Verify sort indicator appears (should show ↑ or similar)
    await expect(locationHeader.locator('span')).toContainText('↑');

    // Click again to sort descending
    await locationHeader.click();

    // Verify sort indicator changes to descending (should show ↓ or similar)
    await expect(locationHeader.locator('span')).toContainText('↓');

    // Try sorting other columns
    const typeHeader = page.getByRole('columnheader', { name: 'Type' });
    await typeHeader.click();
    await expect(typeHeader.locator('span')).toContainText('↑');
  });

  test('should have proper page layout and styling', async ({ page }) => {
    // Check main container has proper padding and max-width
    const main = page.getByRole('main');
    await expect(main).toHaveClass(/px-40/);
    await expect(main).toHaveClass(/py-5/);

    // Check page title styling
    const title = page.getByRole('heading', { name: 'Data Centers' });
    await expect(title).toHaveClass(/text-\[32px\]/);
    await expect(title).toHaveClass(/font-bold/);

    // Check table container styling
    const tableContainer = page.locator('.bg-\\[\\#f7fafc\\]').first();
    await expect(tableContainer).toBeVisible();
    await expect(tableContainer).toHaveClass(/rounded-lg/);
    await expect(tableContainer).toHaveClass(/border-\[#cfd1e8\]/);
  });

  test('should handle responsive behavior', async ({ page }) => {
    // Test with different viewport sizes
    await page.setViewportSize({ width: 1024, height: 768 });

    // Table should still be visible and functional
    await expect(page.getByRole('table')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Data Centers' })
    ).toBeVisible();

    // Button should still be visible
    await expect(
      page.getByRole('button', { name: 'Add Data Center' })
    ).toBeVisible();
  });

  test('should load within performance thresholds', async ({ page }) => {
    const startTime = Date.now();

    // Navigate to the page
    await page.goto('/');

    // Wait for the critical content to be visible
    await expect(
      page.getByRole('heading', { name: 'Data Centers' })
    ).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();

    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds (generous for E2E testing)
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check table has proper structure
    const table = page.getByRole('table');
    await expect(table).toBeVisible();

    // Check table headers are properly marked
    await expect(
      page.getByRole('columnheader', { name: 'Location' })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Type' })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'IP Range' })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Description' })
    ).toBeVisible();

    // Check that cells are properly accessible
    const cells = page.getByRole('cell');
    await expect(cells.first()).toBeVisible();

    // Check button is accessible
    const addButton = page.getByRole('button', { name: 'Add Data Center' });
    await expect(addButton).toBeVisible();
  });
});
