# Vitest and React Testing Library Setup Plan

## Overview

Add comprehensive testing support to the React + TypeScript + Vite starter project using Vitest and React Testing Library.

## 1. Install Core Dependencies

### Primary Testing Dependencies

- **vitest**: Next-generation testing framework powered by Vite
- **@testing-library/react**: Simple and complete React DOM testing utilities
- **@testing-library/jest-dom**: Custom matchers for DOM state testing (works with Vitest)
- **@testing-library/user-event**: Simulate realistic user interactions
- **jsdom**: DOM environment for testing React components

### Command

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## 2. Configuration Setup

### vitest.config.ts

Create dedicated test configuration that merges with existing Vite config:

```ts
/// <reference types="vitest/config" />
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      globals: true,
      css: true,
    },
  })
);
```

### Test Setup File

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom';
```

### TypeScript Configuration

Update `tsconfig.json` to include Vitest types:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

## 3. Package.json Scripts

Add test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## 4. Project Integration

### Update CLAUDE.md

Add testing section to project documentation:

```markdown
## Testing Commands

- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Run tests with coverage report
```

### Directory Structure

Create testing directory structure:

```
src/
├── test/
│   └── setup.ts
├── components/
│   └── __tests__/
│       └── app-header.test.tsx
└── pages/
    └── __tests__/
        └── dashboard.test.tsx
```

## 5. Example Test Implementation

### Component Test Example

Create `src/components/__tests__/app-header.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppHeader } from '../app-header';

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <ThemeProvider>{ui}</ThemeProvider>
    </BrowserRouter>
  );
}

test('renders app header with navigation', () => {
  renderWithProviders(<AppHeader />);

  expect(screen.getByRole('banner')).toBeInTheDocument();
  // Add more specific assertions based on your AppHeader component
});
```

## 6. Benefits

### Perfect Vite Integration

- Reuses existing Vite configuration and plugins
- Same fast HMR experience for tests
- No additional build tooling required

### Modern Testing Patterns

- Latest React Testing Library best practices
- TypeScript support out of the box
- User-centric testing approach

### Developer Experience

- Interactive UI mode for test debugging
- Built-in coverage reporting
- Watch mode with intelligent re-running

### Architecture Compatibility

- Works seamlessly with React 19
- Supports your existing routing setup (React Router v7)
- Compatible with shadcn/ui components
- Integrates with your theme system

## 7. Implementation Notes

### Why @testing-library/jest-dom Works with Vitest

Despite the "jest" name, this library extends the standard `expect` API that Vitest also uses. The custom matchers (`.toBeInTheDocument()`, `.toHaveTextContent()`, etc.) work seamlessly with Vitest's assertion system.

### Environment Configuration

- `jsdom`: Provides browser-like environment for React component testing
- `globals: true`: Makes test functions (test, expect, vi) available globally
- `css: true`: Processes CSS imports in test files

### Coverage Setup

For coverage reporting, install additional dependency:

```bash
npm install --save-dev @vitest/coverage-v8
```

## 8. Validation Steps

1. Install dependencies
2. Create configuration files
3. Add test scripts to package.json
4. Create example test
5. Run `npm test` to verify setup
6. Run `npm run test:coverage` to verify coverage works

## Next Steps After Implementation

1. Add tests for existing components (AppHeader, AppSidebar, etc.)
2. Test routing functionality with React Router v7
3. Test theme switching functionality
4. Add integration tests for key user workflows
5. Set up CI/CD pipeline to run tests automatically
