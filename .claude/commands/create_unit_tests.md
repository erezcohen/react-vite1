# Writing Unit Tests with Vitest and React Testing Library

You are an expert frontend developer with extensive experience in unit testing React components using Vitest and React Testing Library. Your expertise includes writing maintainable, reliable tests that follow industry best practices and focus on user behavior rather than implementation details.

## Command Usage

This command helps you create comprehensive unit tests for React components. You can optionally specify:

- `--component` or `-c`: The specific component to test (e.g., "Button", "Header", "UserProfile")
- `--page` or `-p`: The page component to test (e.g., "Dashboard", "Login", "Settings")
- `--hook` or `-h`: Custom React hook to test (e.g., "useAuth", "useTheme", "useLocalStorage")
- `--util` or `-u`: Utility function to test (e.g., "formatDate", "validateEmail", "calculateTotal")

**Examples:**

- `create_unit_tests --component Button`
- `create_unit_tests --page Dashboard`
- `create_unit_tests --hook useAuth`
- `create_unit_tests --util formatCurrency`

## Best Practices

Follow these best practices when creating unit tests with Vitest and React Testing Library:

### 1. Test Organization

- Place test files in `__tests__/` directories next to the source files
- Use `.test.ts` or `.test.tsx` extension for test files
- Group related tests using `describe()` blocks
- Use descriptive test names that explain user behavior

### 2. Import Structure

```typescript
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ComponentName } from '../ComponentName';
```

### 3. Test Utilities

Always use the custom test utilities from `@/test/test-utils` which includes:

- Router provider for components that use navigation
- Other global providers your app requires

### 4. Query Priority

Use React Testing Library queries in this order of preference:

1. `getByRole()` - Most accessible and user-focused
2. `getByLabelText()` - Good for form elements
3. `getByText()` - For content verification
4. `getByTestId()` - Last resort for complex components

### 5. User Interactions

Use `@testing-library/user-event` for user interactions as it more closely simulates real user behavior:

```typescript
const user = userEvent.setup();
await user.click(screen.getByRole('button', { name: 'Submit' }));
await user.type(screen.getByLabelText('Email'), 'test@example.com');
```

### 6. Async Testing

Use `waitFor()` for async operations and avoid using `act()` directly:

```typescript
await waitFor(() => {
  expect(screen.getByText('Success message')).toBeInTheDocument();
});
```

## Test Templates by Type

### Component Test Template

```typescript
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  const defaultProps = {
    // Add required props here
  };

  it('renders correctly', () => {
    render(<ComponentName {...defaultProps} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<ComponentName {...defaultProps} onClick={mockOnClick} />);

    await user.click(screen.getByRole('button'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('displays correct content', () => {
    const testContent = 'Test Content';

    render(<ComponentName {...defaultProps} content={testContent} />);

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('handles error states', () => {
    render(<ComponentName {...defaultProps} error="Error message" />);

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
```

### Page Component Test Template

```typescript
import { render, screen } from '@/test/test-utils';
import { vi } from 'vitest';
import { PageName } from '../PageName';

// Mock external dependencies
vi.mock('@/hooks/useData', () => ({
  useData: vi.fn(() => ({
    data: null,
    loading: false,
    error: null,
  })),
}));

describe('PageName Page', () => {
  it('renders page content', () => {
    render(<PageName />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText('Page Title')).toBeInTheDocument();
  });

  it('handles loading state', () => {
    vi.mocked(useData).mockReturnValue({
      data: null,
      loading: true,
      error: null,
    });

    render(<PageName />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles error state', () => {
    vi.mocked(useData).mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to load data',
    });

    render(<PageName />);

    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  it('displays data when loaded', () => {
    const mockData = { id: 1, name: 'Test Item' };

    vi.mocked(useData).mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
    });

    render(<PageName />);

    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });
});
```

### Custom Hook Test Template

```typescript
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useCustomHook } from '../useCustomHook';

describe('useCustomHook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useCustomHook());

    expect(result.current.value).toBe(initialValue);
    expect(result.current.loading).toBe(false);
  });

  it('updates state correctly', () => {
    const { result } = renderHook(() => useCustomHook());

    act(() => {
      result.current.setValue('new value');
    });

    expect(result.current.value).toBe('new value');
  });

  it('handles async operations', async () => {
    const { result } = renderHook(() => useCustomHook());

    act(() => {
      result.current.fetchData();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
```

### Utility Function Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { utilityFunction } from '../utilityFunction';

describe('utilityFunction', () => {
  it('handles valid input', () => {
    const result = utilityFunction('valid input');

    expect(result).toBe('expected output');
  });

  it('handles edge cases', () => {
    expect(utilityFunction('')).toBe('default value');
    expect(utilityFunction(null)).toBe('default value');
    expect(utilityFunction(undefined)).toBe('default value');
  });

  it('throws error for invalid input', () => {
    expect(() => utilityFunction('invalid')).toThrow('Error message');
  });

  it('handles complex scenarios', () => {
    const complexInput = { prop1: 'value1', prop2: 'value2' };
    const result = utilityFunction(complexInput);

    expect(result).toEqual({
      processedProp1: 'value1',
      processedProp2: 'value2',
    });
  });
});
```

## Mocking Strategies

### 1. API Calls and External Services

```typescript
vi.mock('@/services/api', () => ({
  fetchData: vi.fn(),
  postData: vi.fn(),
}));
```

### 2. Browser APIs

```typescript
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  writable: true,
});
```

### 3. Router Navigation

```typescript
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockNavigate,
}));
```

## Testing Specific Scenarios

### Form Components

```typescript
it('validates form input', async () => {
  const user = userEvent.setup();

  render(<ContactForm />);

  const emailInput = screen.getByLabelText('Email');
  const submitButton = screen.getByRole('button', { name: 'Submit' });

  await user.type(emailInput, 'invalid-email');
  await user.click(submitButton);

  expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
});
```

### Theme-Aware Components

```typescript
it('applies correct theme styles', () => {
  render(<ThemedComponent />, {
    wrapper: ({ children }) => (
      <ThemeProvider theme="dark">{children}</ThemeProvider>
    ),
  });

  expect(screen.getByTestId('themed-element')).toHaveClass('dark-theme');
});
```

### Accessibility Testing

```typescript
it('has proper accessibility attributes', () => {
  render(<AccessibleComponent />);

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-label', 'Close dialog');
  expect(button).not.toHaveAttribute('aria-disabled');
});
```

## TDD Mode Considerations

When implementing tests in TDD mode:

1. **Write failing tests first**: Create tests for functionality that doesn't exist yet
2. **Avoid implementation details**: Focus on the expected behavior and interface
3. **Run tests to confirm they fail**: Use `npm run test:run` to verify test failures
4. **Don't write implementation code**: Only write the test, not the actual functionality

```typescript
// TDD Example - Test for non-existent feature
it('should calculate discount correctly', () => {
  // This component method doesn't exist yet
  const result = calculateDiscount(100, 0.2);
  expect(result).toBe(80);
});
```

## Development Workflow Integration

After creating tests, follow the project's development workflow:

1. **Format code**: `npm run format`
2. **Check linting**: `npm run lint`
3. **Type checking**: `npm run typecheck`
4. **Run tests**: `npm run test:run`
   - In TDD mode: Only new/modified tests should fail
   - In normal mode: All tests should pass
5. **Coverage check**: `npm run test:coverage` (when needed)

## Common Patterns to Test

1. **Component rendering**: Verify components render without crashing
2. **Props handling**: Test that props are properly used and displayed
3. **State management**: Test component state changes and updates
4. **Event handling**: Test user interactions and callbacks
5. **Conditional rendering**: Test different display states
6. **Error boundaries**: Test error handling and fallback UI
7. **Integration**: Test component interaction with hooks and context
8. **Accessibility**: Test ARIA attributes and keyboard navigation

Remember to focus on testing behavior from the user's perspective rather than implementation details, and ensure your tests are maintainable and provide good coverage of critical functionality.
