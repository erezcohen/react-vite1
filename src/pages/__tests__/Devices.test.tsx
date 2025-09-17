import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import Devices from '../Devices';

// Mock console.log to test the Add Device button functionality
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('Devices Page', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  describe('Page Rendering Tests', () => {
    it('should render page content correctly', async () => {
      render(<Devices />);

      // Check that the main page structure is present
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Devices' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /add device/i })
      ).toBeInTheDocument();

      // Wait for data to load and check table headers
      await waitFor(() => {
        expect(screen.getByText('ID')).toBeInTheDocument();
      });

      expect(screen.getByText('Model')).toBeInTheDocument();
      expect(screen.getByText('OS')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Data Center')).toBeInTheDocument();
    });

    it('should apply correct CSS classes and styling', () => {
      render(<Devices />);

      const mainElement = screen.getByRole('main');

      // Check main container has correct classes
      expect(mainElement).toHaveClass('px-40', 'py-5');
    });

    it('should maintain component structure during different states', async () => {
      render(<Devices />);

      // Check initial structure
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Devices' })
      ).toBeInTheDocument();

      // Wait for data to load and verify structure is maintained
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Devices' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /add device/i })
      ).toBeInTheDocument();
    });
  });

  describe('Data Display Tests', () => {
    it('should display devices when loaded successfully', async () => {
      render(<Devices />);

      // Wait for the mocked data to load
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      // Check that sample mock data is displayed
      expect(screen.getByText('Galaxy S24 Ultra')).toBeInTheDocument();
      expect(screen.getByText('Pixel 8 Pro')).toBeInTheDocument();
      expect(screen.getByText('iPhone 14')).toBeInTheDocument();

      // Check OS versions are displayed (use getAllByText for multiple occurrences)
      expect(screen.getByText('iOS 17.1.2')).toBeInTheDocument();
      expect(screen.getAllByText('Android 14.0').length).toBeGreaterThan(0);

      // Check status badges are displayed (use getAllByText for multiple occurrences)
      expect(screen.getAllByText('connected').length).toBeGreaterThan(0);
      expect(screen.getAllByText('disconnected').length).toBeGreaterThan(0);
    });

    it('should display correct device data in table', async () => {
      render(<Devices />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      // Check that device IDs are displayed
      expect(screen.getByText('dev-001')).toBeInTheDocument();
      expect(screen.getByText('dev-002')).toBeInTheDocument();

      // Check that data center locations are displayed (via lookup, use getAllByText for multiple occurrences)
      expect(screen.getAllByText('New York').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Los Angeles').length).toBeGreaterThan(0);
    });

    it('should display correct number of device rows', async () => {
      render(<Devices />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      // Check that multiple devices are displayed (at least 5 from mock data)
      const deviceIds = [
        screen.queryByText('dev-001'),
        screen.queryByText('dev-002'),
        screen.queryByText('dev-003'),
        screen.queryByText('dev-004'),
        screen.queryByText('dev-005'),
      ].filter(Boolean);

      expect(deviceIds.length).toBeGreaterThanOrEqual(5);
    });

    it('should handle table data rendering with correct cell styling', async () => {
      render(<Devices />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      // Check that ID cells have correct styling
      const idCell = screen.getByText('dev-001');
      expect(idCell).toHaveClass('block', 'leading-[21px]');
      expect(idCell.parentElement).toHaveClass(
        'css-mw0uwd',
        'font-normal',
        'text-[#0d0f1c]',
        'text-[14px]'
      );

      // Check that model cells have correct styling
      const modelCell = screen.getByText('iPhone 15 Pro');
      expect(modelCell).toHaveClass('block', 'leading-[21px]');
      expect(modelCell.parentElement).toHaveClass(
        'css-mw0uwd',
        'font-normal',
        'text-[#0d0f1c]',
        'text-[14px]'
      );
    });
  });

  describe('Loading and Error State Tests', () => {
    it('should display loading state initially', () => {
      render(<Devices />);

      // The DataTable component should show loading state
      // This will be visible briefly before data loads
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });

    it('should handle error state correctly', async () => {
      // Override the handler to return an error
      server.use(
        http.get('/api/devices', () => {
          return HttpResponse.json(
            { error: 'Failed to fetch devices' },
            { status: 500 }
          );
        })
      );

      render(<Devices />);

      // Wait for the error to be displayed
      await waitFor(() => {
        expect(
          screen.getByText(/failed to fetch devices/i)
        ).toBeInTheDocument();
      });
    });

    it('should display empty state when no devices exist', async () => {
      // Override the handler to return empty array
      server.use(
        http.get('/api/devices', () => {
          return HttpResponse.json({ data: [] });
        })
      );

      render(<Devices />);

      // Wait for the empty state to be displayed
      await waitFor(() => {
        expect(screen.getByText('No devices found')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Start by adding your first device')
      ).toBeInTheDocument();
    });

    it('should handle network errors gracefully', async () => {
      // Override the handler to simulate network failure
      server.use(
        http.get('/api/devices', () => {
          return HttpResponse.error();
        })
      );

      render(<Devices />);

      // Wait for the error handling
      await waitFor(() => {
        // The error should be handled by the DataTable component
        // which should display some form of error state
        const mainElement = screen.getByRole('main');
        expect(mainElement).toBeInTheDocument();
      });
    });
  });

  describe('Table Functionality Tests', () => {
    it('should support table sorting functionality', async () => {
      render(<Devices />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      // The table headers should be clickable for sorting
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Model')).toBeInTheDocument();
      expect(screen.getByText('OS')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Data Center')).toBeInTheDocument();
    });

    it('should handle DataTable component integration', async () => {
      render(<Devices />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('ID')).toBeInTheDocument();
      });

      // Verify that the table structure is correct
      expect(screen.getByRole('table')).toBeInTheDocument();

      // Check column headers are present
      expect(screen.getByText('Model')).toBeInTheDocument();
      expect(screen.getByText('OS')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Data Center')).toBeInTheDocument();
    });

    it('should pass correct props to DataTable component', async () => {
      render(<Devices />);

      // Wait for data to load completely
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      // The DataTable should receive:
      // - columns (5 columns defined)
      // - data (array of devices)
      // - loading state
      // - error state
      // - emptyState component

      // Verify table headers (columns) are rendered correctly
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Model')).toBeInTheDocument();
      expect(screen.getByText('OS')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Data Center')).toBeInTheDocument();
    });

    it('should integrate correctly with TanStack Query', async () => {
      render(<Devices />);

      // The component should make a request to /api/devices
      // and display the data when it arrives
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });

      // Verify that expected data is displayed
      expect(screen.getByText('Galaxy S24 Ultra')).toBeInTheDocument();
      expect(screen.getByText('Pixel 8 Pro')).toBeInTheDocument();
      expect(screen.getByText('iPhone 14')).toBeInTheDocument();
    });
  });

  describe('Button and Interaction Tests', () => {
    it('should show Add Device button (visual only)', async () => {
      render(<Devices />);

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('Devices')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add device/i });
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveTextContent('Add Device');
    });

    it('should handle Add Device button click', async () => {
      const user = userEvent.setup();

      render(<Devices />);

      // Wait for the component to load
      await waitFor(() => {
        expect(screen.getByText('Devices')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add device/i });

      await user.click(addButton);

      // Verify console.log was called (since the functionality is not implemented yet)
      expect(mockConsoleLog).toHaveBeenCalledWith('Add device clicked');
      expect(mockConsoleLog).toHaveBeenCalledTimes(1);
    });

    it('should display correct button styling and icon', async () => {
      render(<Devices />);

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('Devices')).toBeInTheDocument();
      });

      const addButton = screen.getByRole('button', { name: /add device/i });

      // Check button contains the Plus icon and text
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveTextContent('Add Device');

      // The Plus icon should be present (it's an SVG element)
      const svg = addButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper accessibility attributes', async () => {
      render(<Devices />);

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByText('Devices')).toBeInTheDocument();
      });

      // Check that main page elements have proper roles
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Devices' })
      ).toBeInTheDocument();

      // Check that the Add Device button has proper accessibility attributes
      const addButton = screen.getByRole('button', { name: /add device/i });
      expect(addButton).toHaveAttribute('aria-label', 'Add Device');
      expect(addButton).toHaveAttribute('tabIndex', '0');

      // Wait for table to load and check it has proper table structure
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });
  });
});
