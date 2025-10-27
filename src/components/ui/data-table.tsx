import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  loading?: boolean;
  error?: string | null;
  emptyState?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  enableSorting?: boolean;
  className?: string;
}

export function DataTable<TData>({
  columns,
  data,
  loading = false,
  error = null,
  emptyState,
  onRowClick,
  enableSorting = true,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    enableSorting,
  });

  if (loading) {
    return (
      <div
        className={cn(
          'bg-background rounded-lg border border-[#cfd1e8]',
          className
        )}
      >
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-background">
                {columns.map((_, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-[14px] font-['Inter:Bold',_sans-serif] font-bold text-[#0d0f1c] leading-[21px]"
                  >
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-t border-[#e5e8eb]">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-6">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'bg-background rounded-lg border border-[#cfd1e8] p-8 text-center',
          className
        )}
      >
        <div className="text-red-600 font-medium">Error loading data</div>
        <div className="text-sm text-gray-600 mt-1">{error}</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        className={cn(
          'bg-background rounded-lg border border-[#cfd1e8] p-8 text-center',
          className
        )}
      >
        {emptyState || (
          <div>
            <div className="text-gray-500 font-medium">No data available</div>
            <div className="text-sm text-gray-400 mt-1">
              No items to display
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-background rounded-lg border border-[#cfd1e8]',
        className
      )}
    >
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-background">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-[14px] font-['Inter:Bold',_sans-serif] font-bold text-[#0d0f1c] leading-[21px]"
                    style={{ width: header.getSize() }}
                    scope="col"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          'flex items-center gap-2',
                          header.column.getCanSort() && enableSorting
                            ? 'cursor-pointer select-none hover:text-gray-700'
                            : ''
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        role="button"
                        tabIndex={
                          header.column.getCanSort() && enableSorting ? 0 : -1
                        }
                        aria-sort={
                          header.column.getIsSorted()
                            ? header.column.getIsSorted() === 'asc'
                              ? 'ascending'
                              : 'descending'
                            : 'none'
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {enableSorting && header.column.getCanSort() && (
                          <span
                            className="text-xs text-gray-400"
                            aria-hidden="true"
                          >
                            {{
                              asc: '↑',
                              desc: '↓',
                            }[header.column.getIsSorted() as string] ?? '↕'}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-t border-[#e5e8eb] h-[72px]',
                  onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''
                )}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 h-[72px] text-[14px] text-[#47579e] leading-[21px] font-['Inter:Regular',_sans-serif] font-normal align-middle"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
