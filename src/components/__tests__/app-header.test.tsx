import { render, screen } from '@/test/test-utils';
import { AppHeader } from '../app-header';

describe('AppHeader', () => {
  test('renders app header with banner role', () => {
    render(<AppHeader />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('contains navigation elements', () => {
    render(<AppHeader />);

    // Check for multiple navigation elements (main nav and user nav)
    const navElements = screen.getAllByRole('navigation');
    expect(navElements).toHaveLength(2);
  });

  test('displays user avatar and dropdown', () => {
    render(<AppHeader />);

    // Check for avatar fallback text (image might not load in test environment)
    expect(screen.getByText('SC')).toBeInTheDocument();

    // Check that we have buttons (sidebar + user dropdown)
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('has correct sticky header styling', () => {
    render(<AppHeader />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('sticky', 'top-0', 'z-50', 'border-b');
  });

  test('renders home link', () => {
    render(<AppHeader />);

    // Look for link that goes to home page
    const homeLinks = screen.getAllByRole('link');
    expect(homeLinks.some((link) => link.getAttribute('href') === '/')).toBe(
      true
    );
  });
});
