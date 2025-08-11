import { test, expect } from '@playwright/test';

test.describe('Debug DataCenters Page', () => {
  test('should debug page content', async ({ page }) => {
    await page.goto('/');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Log the page title
    const title = await page.title();
    console.log('Page title:', title);

    // Log the page content
    const bodyContent = await page.locator('body').textContent();
    console.log('Body content:', bodyContent);

    // Check what's actually in the DOM
    const h1Elements = await page.locator('h1').count();
    console.log('H1 count:', h1Elements);

    if (h1Elements > 0) {
      const h1Text = await page.locator('h1').first().textContent();
      console.log('First H1 text:', h1Text);
    }

    // Check for any headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    console.log('All headings count:', headings.length);

    for (const heading of headings) {
      const text = await heading.textContent();
      const tagName = await heading.evaluate((el) => el.tagName);
      console.log(`${tagName}: ${text}`);
    }

    // Take screenshot
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });

    // Simple assertion to pass the test
    expect(true).toBe(true);
  });
});
