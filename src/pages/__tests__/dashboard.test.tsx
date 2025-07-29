import { render, screen } from '@/test/test-utils';
import Dashboard from '../Dashboard';

describe('Dashboard', () => {
  test('renders dashboard heading', () => {
    render(<Dashboard />);

    expect(
      screen.getByRole('heading', { name: /dashboard/i })
    ).toBeInTheDocument();
  });

  test('displays card with project title and description', () => {
    render(<Dashboard />);

    expect(screen.getByText('React Vite Starter')).toBeInTheDocument();
    expect(
      screen.getByText(/React \+ Vite \+ TypeScript template/i)
    ).toBeInTheDocument();
  });

  test('renders card structure correctly', () => {
    render(<Dashboard />);

    // Check that card content is present
    expect(screen.getByText('React Vite Starter')).toBeInTheDocument();
    expect(
      screen.getByText(/building apps with shadcn\/ui/i)
    ).toBeInTheDocument();
  });
});
