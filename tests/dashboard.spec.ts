import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load page correctly', async ({ page }) => {
    await expect(page).toHaveTitle('React Vite Starter');
    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();
  });

  test('should display page header with correct title', async ({ page }) => {
    const pageHeader = page.getByRole('heading', { name: 'Dashboard' });
    await expect(pageHeader).toBeVisible();
    await expect(pageHeader).toHaveText('Dashboard');
  });

  test('should display card component with title and description', async ({
    page,
  }) => {
    // Check card title
    const cardTitle = page.getByText('React Vite Starter');
    await expect(cardTitle).toBeVisible();
    await expect(cardTitle).toHaveText('React Vite Starter');

    // Check card description
    const cardDescription = page.getByText(
      'React + Vite + TypeScript template for building apps with shadcn/ui.'
    );
    await expect(cardDescription).toBeVisible();
    await expect(cardDescription).toHaveText(
      'React + Vite + TypeScript template for building apps with shadcn/ui.'
    );
  });

  test('should have correct page structure', async ({ page }) => {
    // Verify the page has the expected structure
    const pageHeader = page.locator('section').first();
    await expect(pageHeader).toBeVisible();

    // Verify card is present after the header
    const cardTitle = page.getByText('React Vite Starter');
    await expect(cardTitle).toBeVisible();
  });

  test('should have DCMS header with navigation', async ({ page }) => {
    // Check for DCMS logo
    await expect(page.getByText('DCMS')).toBeVisible();

    // Check for navigation links
    await expect(
      page.getByRole('link', { name: 'Data Centers' })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Devices' })).toBeVisible();

    // Check for star icon button
    await expect(
      page.getByRole('button', {
        name: 'user-button',
      })
    ).toBeVisible();
  });

  test('should have responsive design elements', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();
    await expect(
      page.getByText(
        'React + Vite + TypeScript template for building apps with shadcn/ui.'
      )
    ).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();
    await expect(
      page.getByText(
        'React + Vite + TypeScript template for building apps with shadcn/ui.'
      )
    ).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(
      page.getByRole('heading', { name: 'Dashboard' })
    ).toBeVisible();
    await expect(
      page.getByText(
        'React + Vite + TypeScript template for building apps with shadcn/ui.'
      )
    ).toBeVisible();
  });

  test('should have correct semantic HTML structure', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Dashboard');

    // Verify the card has proper structure with title
    const cardTitle = page.getByText('React Vite Starter');
    await expect(cardTitle).toBeVisible();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    let hasErrors = false;

    page.on('pageerror', (error) => {
      console.error('JavaScript error:', error.message);
      hasErrors = true;
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(hasErrors).toBeFalsy();
  });
});
