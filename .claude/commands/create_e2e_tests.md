# Writing Playwright E2E Tests

You are an expert QA developer with extensive experience in end-to-end testing using Playwright. Your expertise includes writing robust, maintainable tests that follow industry best practices and can withstand application changes.

## Command Usage

This command helps you create comprehensive Playwright E2E tests. You can optionally specify:

- `--page` or `-p`: The specific page/feature to test (e.g., "login", "dashboard", "checkout")
- `--component` or `-c`: Specific component to focus on (e.g., "navigation", "form", "modal")
- `--user-flow` or `-f`: User flow to test (e.g., "user registration", "purchase flow", "settings update")

**Examples:**

- `create_e2e_tests --page login`
- `create_e2e_tests --component navigation --page dashboard`
- `create_e2e_tests --user-flow "complete purchase"`

## Best Practices

Follow these best practices when creating Playwright tests:

1. **Test Structure**: Place test files in the `tests/` directory with `.spec.ts` extension
2. **Use Resilient Locators**: Prefer user-facing attributes over CSS selectors
   - Use `page.getByRole()`, `page.getByText()`, `page.getByTestId()`
   - Avoid brittle selectors like CSS classes or XPath
3. **Test Isolation**: Each test should be independent with its own setup/teardown
   - Use `test.beforeEach()` for common setup like navigation or login
   - Avoid dependencies between tests
4. **Web-First Assertions**: Use Playwright's auto-waiting assertions
   - `await expect(locator).toBeVisible()` instead of manual waits
   - Leverage built-in retry mechanisms
5. **Mock External Dependencies**: Use `page.route()` to mock API calls and third-party services
6. **Page Object Model**: For complex applications, consider using page objects to organize locators and actions
7. **Debug Tools**: Use the provided debug commands for troubleshooting:
   - `npm run test:e2e:debug` for step-by-step debugging
   - `npm run test:e2e:ui` for interactive test runner
   - `npm run test:e2e:report` to view detailed test reports

## Test Examples by Context

### Generic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should perform user action', async ({ page }) => {
    // Use resilient locators
    await page.getByRole('button', { name: 'Submit' }).click();

    // Web-first assertions
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Page-Specific Test Template

When using `--page [pagename]`, structure tests around that specific page:

```typescript
import { test, expect } from '@playwright/test';

test.describe('[Page Name] Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/[page-route]');
  });

  test('should load page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/[Expected Title]/);
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should handle [specific page functionality]', async ({ page }) => {
    // Test page-specific interactions
  });
});
```

### Component-Focused Test Template

When using `--component [componentname]`, focus on component interactions:

```typescript
import { test, expect } from '@playwright/test';

test.describe('[Component Name] Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/page-with-component');
  });

  test('should render component correctly', async ({ page }) => {
    const component = page.getByTestId('[component-testid]');
    await expect(component).toBeVisible();
  });

  test('should handle component interactions', async ({ page }) => {
    // Test component-specific behavior
  });
});
```

### User Flow Test Template

When using `--user-flow "[flow description]"`, create comprehensive user journey tests:

```typescript
import { test, expect } from '@playwright/test';

test.describe('[User Flow Description]', () => {
  test('should complete full user flow', async ({ page }) => {
    // Step 1: Initial navigation
    await page.goto('/starting-point');

    // Step 2: User interactions
    await page.getByRole('button', { name: 'Start Flow' }).click();

    // Step 3: Form filling or data entry
    await page.getByLabel('Input Field').fill('test data');

    // Step 4: Submission or completion
    await page.getByRole('button', { name: 'Complete' }).click();

    // Step 5: Verify final state
    await expect(page.getByText('Flow Completed')).toBeVisible();
  });
});
```

## Additional Considerations

When creating tests based on the provided arguments:

- **Page Tests**: Focus on page load performance, navigation, and page-specific functionality
- **Component Tests**: Test component states, props handling, and user interactions
- **User Flow Tests**: Create comprehensive end-to-end scenarios that mirror real user behavior
- Always include error handling and edge cases in your test scenarios
- Provide clear failure messages and debugging info
- Use meaningful test descriptions that explain the user perspective
