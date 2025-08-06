import { render, screen } from '@/test/test-utils';
import { AppHeader } from '../app-header';

describe('AppHeader', () => {
  test('renders app header with banner role', () => {
    render(<AppHeader />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('contains DCMS navigation elements', () => {
    render(<AppHeader />);

    // Check for main navigation
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();

    // Check for DCMS navigation links
    expect(
      screen.getByRole('link', { name: 'Data Centers' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Devices' })).toBeInTheDocument();
  });

  test('displays DCMS logo and star button', () => {
    render(<AppHeader />);

    // Check for DCMS text
    expect(screen.getByText('DCMS')).toBeInTheDocument();

    // Check for star icon button
    const starButton = screen.getByRole('button', {
      name: 'user-button',
    });
    expect(starButton).toBeInTheDocument();
  });

  test('has correct header styling', () => {
    render(<AppHeader />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-background', 'border-b', 'border-[#e5e8eb]');
  });

  test('renders home link', () => {
    render(<AppHeader />);

    // Look for link that goes to home page
    const homeLinks = screen.getAllByRole('link');
    expect(homeLinks.some((link) => link.getAttribute('href') === '/')).toBe(
      true
    );
  });

  test('navigation links have correct styling for inactive state', () => {
    render(<AppHeader />);

    const dataCentersLink = screen.getByRole('link', { name: 'Data Centers' });
    const devicesLink = screen.getByRole('link', { name: 'Devices' });

    // Both should have inactive styling since we're not on those routes
    expect(dataCentersLink).toHaveClass('text-[#565a6f]');
    expect(devicesLink).toHaveClass('text-[#565a6f]');
  });
});
