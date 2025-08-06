import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { IconButton } from '../icon-button';

// Simple icon component for testing
const TestIcon = () => <svg data-testid="test-icon" />;

describe('IconButton', () => {
  const defaultProps = {
    'aria-label': 'Test icon button',
    children: <TestIcon />,
  };

  it('renders correctly', () => {
    render(<IconButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: 'Test icon button' });
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('requires aria-label prop for accessibility', () => {
    render(<IconButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Test icon button');
  });

  it('renders with default variant and icon size', () => {
    render(<IconButton {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('size-9'); // icon size from Button component
  });

  describe('variants', () => {
    it('renders default variant correctly', () => {
      render(<IconButton {...defaultProps} variant="default" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'bg-primary',
        'text-primary-foreground',
        'shadow-xs'
      );
    });

    it('renders secondary variant correctly', () => {
      render(<IconButton {...defaultProps} variant="secondary" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
    });

    it('renders ghost variant correctly', () => {
      render(<IconButton {...defaultProps} variant="ghost" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'hover:bg-accent',
        'hover:text-accent-foreground'
      );
    });

    it('renders outline variant correctly', () => {
      render(<IconButton {...defaultProps} variant="outline" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border', 'bg-background');
    });
  });

  it('handles user interactions', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<IconButton {...defaultProps} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<IconButton {...defaultProps} disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      'disabled:pointer-events-none',
      'disabled:opacity-50'
    );
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();

    render(<IconButton {...defaultProps} ref={ref} />);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('applies custom className', () => {
    render(<IconButton {...defaultProps} className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  describe('accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<IconButton {...defaultProps} aria-label="Custom label" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();

      render(<IconButton {...defaultProps} onClick={mockOnClick} />);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('maintains focus outline styles', () => {
      render(<IconButton {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(
        'focus-visible:ring-ring/50',
        'focus-visible:ring-[3px]'
      );
    });
  });
});
