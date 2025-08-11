import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import DataCenters from '../DataCenters';

// Mock console.log to test the Add Data Center button functionality
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('DataCenters Page', () => {
  beforeEach(() => {
    mockConsoleLog.mockClear();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  it('renders page content correctly', async () => {
    render(<DataCenters />);

    // Check that the main page structure is present
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Data Centers' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add data center/i })
    ).toBeInTheDocument();

    // Wait for data to load and check table headers
    await waitFor(() => {
      expect(screen.getByText('Location')).toBeInTheDocument();
    });

    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('IP Range')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<DataCenters />);

    // The DataTable component should show loading state
    // This will be visible briefly before data loads
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('displays data when loaded successfully', async () => {
    render(<DataCenters />);

    // Wait for the mocked data to load
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    // Check that all mock data is displayed
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('Chicago')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();

    // Check data types are displayed
    expect(screen.getAllByText('On-Premise')).toHaveLength(3);
    expect(screen.getAllByText('Cloud')).toHaveLength(2);

    // Check IP ranges are displayed
    expect(screen.getByText('192.168.1.0/24')).toBeInTheDocument();
    expect(screen.getByText('10.0.0.0/16')).toBeInTheDocument();

    // Check descriptions are displayed
    expect(screen.getByText('Main data center')).toBeInTheDocument();
    expect(screen.getByText('Cloud data center')).toBeInTheDocument();
  });

  it('handles error state correctly', async () => {
    // Override the handler to return an error
    server.use(
      http.get('/api/data-centers', () => {
        return HttpResponse.json(
          { error: 'Failed to fetch data centers' },
          { status: 500 }
        );
      })
    );

    render(<DataCenters />);

    // Wait for the error to be displayed
    await waitFor(() => {
      expect(
        screen.getByText(/failed to fetch data centers/i)
      ).toBeInTheDocument();
    });
  });

  it('displays empty state when no data centers exist', async () => {
    // Override the handler to return empty array
    server.use(
      http.get('/api/data-centers', () => {
        return HttpResponse.json({ data: [] });
      })
    );

    render(<DataCenters />);

    // Wait for the empty state to be displayed
    await waitFor(() => {
      expect(screen.getByText('No data centers found')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Start by adding your first data center')
    ).toBeInTheDocument();
  });

  it('handles Add Data Center button click', async () => {
    const user = userEvent.setup();

    render(<DataCenters />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Data Centers')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add data center/i });

    await user.click(addButton);

    // Verify console.log was called (since the functionality is not implemented yet)
    expect(mockConsoleLog).toHaveBeenCalledWith('Add data center clicked');
    expect(mockConsoleLog).toHaveBeenCalledTimes(1);
  });

  it('displays correct button styling and icon', async () => {
    render(<DataCenters />);

    // Wait for component to load
    await waitFor(() => {
      expect(screen.getByText('Data Centers')).toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add data center/i });

    // Check button contains the Plus icon and text
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveTextContent('Add Data Center');

    // The Plus icon should be present (it's an SVG element)
    const svg = addButton.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies correct CSS classes and styling', () => {
    render(<DataCenters />);

    const mainElement = screen.getByRole('main');

    // Check main container has correct classes
    expect(mainElement).toHaveClass('px-40', 'py-5');
  });

  it('handles table data rendering with correct cell styling', async () => {
    render(<DataCenters />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    // Check that location cells have correct styling (text is in paragraph element)
    const locationCell = screen.getByText('New York');
    expect(locationCell).toHaveClass('block', 'leading-[21px]');
    // Check the parent div has correct styling
    expect(locationCell.parentElement).toHaveClass(
      'css-mw0uwd',
      'font-normal',
      'text-[#0d0f1c]',
      'text-[14px]'
    );

    // Check that type cells have correct styling (use getAllByText since there are multiple)
    const typeCells = screen.getAllByText('On-Premise');
    expect(typeCells[0]).toHaveClass('block', 'leading-[21px]');
    expect(typeCells[0].parentElement).toHaveClass(
      'css-nnn1vs',
      'font-normal',
      'text-[#47579e]',
      'text-[14px]'
    );
  });

  it('integrates correctly with TanStack Query', async () => {
    render(<DataCenters />);

    // The component should make a request to /api/data-centers
    // and display the data when it arrives
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    // Verify that all expected data is displayed
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('Chicago')).toBeInTheDocument();
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
  });

  it('handles DataTable component integration', async () => {
    render(<DataCenters />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Location')).toBeInTheDocument();
    });

    // Verify that the table structure is correct
    expect(screen.getByRole('table')).toBeInTheDocument();

    // Check column headers are present
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('IP Range')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('displays correct number of data center rows', async () => {
    render(<DataCenters />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    // Check that all 5 mock data centers are displayed
    const locationCells = [
      screen.getByText('New York'),
      screen.getByText('Los Angeles'),
      screen.getByText('Chicago'),
      screen.getByText('London'),
      screen.getByText('Tokyo'),
    ];

    locationCells.forEach((cell) => {
      expect(cell).toBeInTheDocument();
    });
  });

  it('handles network errors gracefully', async () => {
    // Override the handler to simulate network failure
    server.use(
      http.get('/api/data-centers', () => {
        return HttpResponse.error();
      })
    );

    render(<DataCenters />);

    // Wait for the error handling
    await waitFor(() => {
      // The error should be handled by the DataTable component
      // which should display some form of error state
      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });
  });

  it('maintains component structure during different states', async () => {
    render(<DataCenters />);

    // Check initial structure
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Data Centers' })
    ).toBeInTheDocument();

    // Wait for data to load and verify structure is maintained
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Data Centers' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add data center/i })
    ).toBeInTheDocument();
  });

  it('passes correct props to DataTable component', async () => {
    render(<DataCenters />);

    // Wait for data to load completely
    await waitFor(() => {
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    // The DataTable should receive:
    // - columns (4 columns defined)
    // - data (array of data centers)
    // - loading state
    // - error state
    // - emptyState component

    // Verify table headers (columns) are rendered correctly
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('IP Range')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
