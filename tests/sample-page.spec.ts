import { test, expect } from '@playwright/test';

test.describe('Sample Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sample');
  });

  test('should load page correctly', async ({ page }) => {
    await expect(page).toHaveTitle('React Vite Starter');
    await expect(
      page.getByRole('heading', { name: 'Sample Page' })
    ).toBeVisible();
  });

  test('should display page header with correct title', async ({ page }) => {
    const pageHeader = page.getByRole('heading', { name: 'Sample Page' });
    await expect(pageHeader).toBeVisible();
    await expect(pageHeader).toHaveText('Sample Page');
  });

  test('should display card component with title and description', async ({
    page,
  }) => {
    // Check card title
    const cardTitle = page.getByText('Card Title');
    await expect(cardTitle).toBeVisible();
    await expect(cardTitle).toHaveText('Card Title');

    // Check card description
    const cardDescription = page.getByText('Card description.');
    await expect(cardDescription).toBeVisible();
    await expect(cardDescription).toHaveText('Card description.');
  });

  test('should have correct page structure', async ({ page }) => {
    // Verify the page has the expected structure
    const pageHeader = page.locator('section').first();
    await expect(pageHeader).toBeVisible();

    // Verify card is present after the header
    const cardTitle = page.getByText('Card Title');
    await expect(cardTitle).toBeVisible();
  });

  test('should be accessible via navigation', async ({ page }) => {
    // Start from home page
    await page.goto('/');

    // Click on the Sample Page navigation link in the header
    await page.getByRole('link', { name: 'Sample Page' }).click();

    // Verify we're on the correct page
    await expect(
      page.getByRole('heading', { name: 'Sample Page' })
    ).toBeVisible();
  });

  test('should have responsive design elements', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(
      page.getByRole('heading', { name: 'Sample Page' })
    ).toBeVisible();
    await expect(page.getByText('Card description.')).toBeVisible();

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(
      page.getByRole('heading', { name: 'Sample Page' })
    ).toBeVisible();
    await expect(page.getByText('Card description.')).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(
      page.getByRole('heading', { name: 'Sample Page' })
    ).toBeVisible();
    await expect(page.getByText('Card description.')).toBeVisible();
  });

  test('should have correct semantic HTML structure', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Sample Page');

    // Verify the card has proper structure with title
    const cardTitle = page.getByText('Card Title');
    await expect(cardTitle).toBeVisible();
  });

  test('should load without JavaScript errors', async ({ page }) => {
    let hasErrors = false;

    page.on('pageerror', (error) => {
      console.error('JavaScript error:', error.message);
      hasErrors = true;
    });

    await page.goto('/sample');
    await page.waitForLoadState('networkidle');

    expect(hasErrors).toBeFalsy();
  });
});
