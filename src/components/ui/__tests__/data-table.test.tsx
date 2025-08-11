import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { DataTable } from '../data-table';
import { ColumnDef } from '@tanstack/react-table';

// Mock data types for testing
interface TestData {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
}

const mockData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'active' },
];

const mockColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: true,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: true,
    cell: ({ row }) => (
      <span
        className={
          row.original.status === 'active' ? 'text-green-600' : 'text-red-600'
        }
      >
        {row.original.status}
      </span>
    ),
  },
];

describe('DataTable', () => {
  const defaultProps = {
    columns: mockColumns,
    data: mockData,
  };

  it('renders table with data correctly', () => {
    render(<DataTable {...defaultProps} />);

    // Check table structure
    expect(screen.getByRole('table')).toBeInTheDocument();

    // Check headers are rendered
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Check data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('displays loading state correctly', () => {
    render(<DataTable {...defaultProps} loading={true} />);

    // Check that table structure is present during loading
    expect(screen.getByRole('table')).toBeInTheDocument();

    // Check that skeleton loading elements are present
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);

    // Ensure actual data is not shown during loading
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('displays error state correctly', () => {
    const errorMessage = 'Failed to fetch data from server';
    render(<DataTable {...defaultProps} error={errorMessage} />);

    // Check error message is displayed
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    // Ensure table and data are not shown during error
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });

  it('displays empty state when no data provided', () => {
    render(<DataTable {...defaultProps} data={[]} />);

    // Check default empty state message
    expect(screen.getByText('No data available')).toBeInTheDocument();
    expect(screen.getByText('No items to display')).toBeInTheDocument();

    // Ensure table is not shown when empty
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('displays custom empty state when provided', () => {
    const customEmptyState = <div>Custom empty message</div>;
    render(
      <DataTable {...defaultProps} data={[]} emptyState={customEmptyState} />
    );

    // Check custom empty state is displayed
    expect(screen.getByText('Custom empty message')).toBeInTheDocument();

    // Ensure default empty state is not shown
    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
  });

  it('handles row clicks when onRowClick is provided', async () => {
    const user = userEvent.setup();
    const mockOnRowClick = vi.fn();

    render(<DataTable {...defaultProps} onRowClick={mockOnRowClick} />);

    // Find and click a table row (using the first data row)
    const firstRow = screen.getByText('John Doe').closest('tr');
    expect(firstRow).toBeInTheDocument();

    await user.click(firstRow!);

    // Verify onRowClick was called with correct data
    expect(mockOnRowClick).toHaveBeenCalledTimes(1);
    expect(mockOnRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('does not handle row clicks when onRowClick is not provided', () => {
    render(<DataTable {...defaultProps} />);

    const firstRow = screen.getByText('John Doe').closest('tr');
    expect(firstRow).toBeInTheDocument();

    // Should not have cursor-pointer class when onRowClick is not provided
    expect(firstRow).not.toHaveClass('cursor-pointer');
  });

  it('handles column sorting when enabled', async () => {
    const user = userEvent.setup();

    render(<DataTable {...defaultProps} enableSorting={true} />);

    // Find sortable column header (Name column)
    const nameHeader = screen.getByText('Name').closest('div');
    expect(nameHeader).toBeInTheDocument();
    expect(nameHeader).toHaveClass('cursor-pointer');

    // Check initial sort indicators are present (multiple columns can be sortable)
    const sortIndicators = screen.getAllByText('↕');
    expect(sortIndicators.length).toBeGreaterThan(0);

    // Click to sort ascending
    await user.click(nameHeader!);

    // Should show ascending sort indicator somewhere in the document
    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('disables sorting when enableSorting is false', () => {
    render(<DataTable {...defaultProps} enableSorting={false} />);

    // Find column header
    const nameHeader = screen.getByText('Name').closest('div');
    expect(nameHeader).toBeInTheDocument();

    // Should not have cursor-pointer class when sorting is disabled
    expect(nameHeader).not.toHaveClass('cursor-pointer');

    // Should not show any sort indicators
    expect(screen.queryByText('↕')).not.toBeInTheDocument();
    expect(screen.queryByText('↑')).not.toBeInTheDocument();
    expect(screen.queryByText('↓')).not.toBeInTheDocument();
  });

  it('respects individual column sorting configuration', () => {
    render(<DataTable {...defaultProps} enableSorting={true} />);

    // Email column should not be sortable (enableSorting: false in column definition)
    const emailHeader = screen.getByText('Email').closest('div');
    expect(emailHeader).toBeInTheDocument();
    expect(emailHeader).not.toHaveClass('cursor-pointer');

    // Name column should be sortable (enableSorting: true in column definition)
    const nameHeader = screen.getByText('Name').closest('div');
    expect(nameHeader).toBeInTheDocument();
    expect(nameHeader).toHaveClass('cursor-pointer');
  });

  it('applies custom className correctly', () => {
    const customClass = 'custom-table-class';
    render(<DataTable {...defaultProps} className={customClass} />);

    // The custom class should be applied to the wrapper div
    const tableWrapper = document.querySelector('.custom-table-class');
    expect(tableWrapper).toBeInTheDocument();
  });

  it('renders custom cell content correctly', () => {
    render(<DataTable {...defaultProps} />);

    // Check that custom status cell rendering works - use getAllByText since there are multiple active statuses
    const activeStatuses = screen.getAllByText('active');
    const inactiveStatuses = screen.getAllByText('inactive');

    expect(activeStatuses.length).toBe(2); // John Doe and Bob Johnson
    expect(inactiveStatuses.length).toBe(1); // Jane Smith

    // Check custom styling is applied (though we can't easily test the actual CSS classes,
    // we can verify the elements exist with the expected structure)
    expect(activeStatuses[0].tagName).toBe('SPAN');
    expect(inactiveStatuses[0].tagName).toBe('SPAN');
  });

  it('handles multiple sorting states correctly', async () => {
    const user = userEvent.setup();

    render(<DataTable {...defaultProps} enableSorting={true} />);

    const nameHeader = screen.getByText('Name').closest('div');
    expect(nameHeader).toBeInTheDocument();

    // Initial state - unsorted (multiple unsorted indicators may be present)
    const initialSortIndicators = screen.getAllByText('↕');
    expect(initialSortIndicators.length).toBeGreaterThan(0);

    // Click once - ascending
    await user.click(nameHeader!);
    expect(screen.getByText('↑')).toBeInTheDocument();

    // Click again - descending
    await user.click(nameHeader!);
    expect(screen.getByText('↓')).toBeInTheDocument();

    // Click again - back to unsorted
    await user.click(nameHeader!);
    const finalSortIndicators = screen.getAllByText('↕');
    expect(finalSortIndicators.length).toBeGreaterThan(0);
  });

  it('maintains accessibility attributes', () => {
    render(<DataTable {...defaultProps} />);

    // Check table has proper structure
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check headers are properly structured
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(4); // ID, Name, Email, Status

    // Check rows are properly structured
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // Header row + data rows
  });

  it('handles empty columns array gracefully', () => {
    render(<DataTable columns={[]} data={[]} />);

    // Should show empty state rather than crash
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('handles edge cases in data correctly', () => {
    // Test with empty array (this should work)
    const { rerender } = render(<DataTable {...defaultProps} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();

    // Test with normal data
    rerender(<DataTable {...defaultProps} data={mockData} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('preserves table structure during state transitions', async () => {
    const { rerender } = render(<DataTable {...defaultProps} loading={true} />);

    // Initially loading
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(
      0
    );

    // Switch to error state
    rerender(<DataTable {...defaultProps} error="Something went wrong" />);
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    // Switch to data loaded
    rerender(<DataTable {...defaultProps} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
