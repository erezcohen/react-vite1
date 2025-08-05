import { render, screen } from '@/test/test-utils';
import { AppFooter } from '../app-footer';

describe('AppFooter', () => {
  test('renders footer element with correct structure', () => {
    render(<AppFooter />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-between',
      'gap-4',
      'min-h-[3rem]',
      'md:h-20',
      'py-2',
      'md:flex-row'
    );
  });

  test('has proper semantic footer structure', () => {
    render(<AppFooter />);

    // Should be a footer landmark
    const footer = screen.getByRole('contentinfo');
    expect(footer.tagName).toBe('FOOTER');
  });

  test('maintains consistent height across breakpoints', () => {
    render(<AppFooter />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('min-h-[3rem]', 'md:h-20');
  });
});
