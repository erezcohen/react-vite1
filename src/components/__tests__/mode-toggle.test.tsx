import { render, screen, waitFor } from '@/test/test-utils';
import { ModeToggle } from '../mode-toggle';
import { useTheme } from '@/contexts/ThemeContext';
import userEvent from '@testing-library/user-event';

// Mock the ThemeContext
vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockSetTheme = vi.fn();

describe('ModeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
  });

  it('renders the toggle button with accessibility label', () => {
    render(<ModeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();

    const srOnlyText = screen.getByText('Toggle theme');
    expect(srOnlyText).toBeInTheDocument();
    expect(srOnlyText).toHaveClass('sr-only');
  });

  it('renders sun and moon icons with correct classes', () => {
    render(<ModeToggle />);

    const sunIcon = document.querySelector('.lucide-sun');
    const moonIcon = document.querySelector('.lucide-moon');

    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
    expect(moonIcon).toHaveClass('absolute');
  });

  it('has correct button styling', () => {
    render(<ModeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toHaveClass('w-9', 'px-0');
  });

  it('button has correct aria attributes', () => {
    render(<ModeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toHaveAttribute('aria-haspopup', 'menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens dropdown menu when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('calls setTheme with "light" when Light option is clicked', async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    expect(screen.getByText('Light')).toBeInTheDocument();

    const lightOption = screen.getByText('Light');
    await user.click(lightOption);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it('calls setTheme with "dark" when Dark option is clicked', async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    expect(screen.getByText('Dark')).toBeInTheDocument();

    const darkOption = screen.getByText('Dark');
    await user.click(darkOption);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it('calls setTheme with "system" when System option is clicked', async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('System')).toBeInTheDocument();
    });

    const systemOption = screen.getByText('System');
    await user.click(systemOption);

    expect(mockSetTheme).toHaveBeenCalledWith('system');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation', async () => {
    render(<ModeToggle />);

    const button = screen.getByRole('button', { name: /toggle theme/i });

    // Focus the button
    button.focus();
    expect(document.activeElement).toBe(button);

    // Test that button can receive focus
    expect(button).toHaveFocus();
  });
});
