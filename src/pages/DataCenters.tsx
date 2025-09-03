import { useMemo } from 'react';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { useDataCenters } from '@/api/datacenters';
import type { DataCenter } from '@/types/DataCenter';

const columnHelper = createColumnHelper<DataCenter>();

export default function DataCenters() {
  const { data: dataCenters = [], isLoading, error } = useDataCenters();

  const columns = useMemo(
    () => [
      columnHelper.accessor('location', {
        header: 'Location',
        size: 223,
        cell: (info) => (
          <div className="css-mw0uwd font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#0d0f1c] text-[14px] text-left w-full">
            <p className="block leading-[21px]">{info.getValue()}</p>
          </div>
        ),
      }),
      columnHelper.accessor('type', {
        header: 'Type',
        size: 221,
        cell: (info) => (
          <div className="css-nnn1vs font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#47579e] text-[14px] text-left w-full">
            <p className="block leading-[21px]">{info.getValue()}</p>
          </div>
        ),
      }),
      columnHelper.accessor('ipRange', {
        header: 'IP Range',
        size: 245,
        cell: (info) => (
          <div className="css-nnn1vs font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#47579e] text-[14px] text-left w-full">
            <p className="block leading-[21px]">{info.getValue()}</p>
          </div>
        ),
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        size: 237,
        cell: (info) => (
          <div className="css-nnn1vs font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#47579e] text-[14px] text-left w-full">
            <p className="block leading-[21px]">{info.getValue()}</p>
          </div>
        ),
      }),
    ],
    []
  );

  const handleAddDataCenter = () => {
    // TODO: Open add data center modal/form
    console.log('Add data center clicked');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAddDataCenter();
    }
  };

  return (
    <main className="h-[735px] px-40 py-5">
      <div className="max-w-[960px] mx-auto h-[695px] overflow-clip">
        {/* Page Header - matching Figma exactly */}
        <div className="flex flex-wrap gap-3 items-start justify-between p-4">
          <div className="min-w-72 w-72">
            <h1 className="text-[32px] font-['Inter:Bold',_sans-serif] font-bold text-[#0d0f1c] leading-[40px]">
              Data Centers
            </h1>
          </div>
          <div className="h-12">
            <div className="h-12 flex items-center justify-center">
              <div
                onClick={handleAddDataCenter}
                onKeyDown={handleKeyDown}
                className="bg-[#625b71] box-border cursor-pointer flex flex-col items-center justify-center overflow-clip rounded-xl"
                role="button"
                tabIndex={0}
                aria-label="Add Data Center"
              >
                <div className="box-border flex flex-row gap-2 items-center justify-center px-4 py-2.5">
                  <div className="size-5">
                    <Plus size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center text-[#ffffff] text-[14px] text-left text-nowrap tracking-[0.1px]">
                    <p className="leading-[20px] whitespace-pre">
                      Add Data Center
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="px-4 py-3">
          <DataTable
            columns={columns as ColumnDef<DataCenter>[]}
            data={dataCenters}
            loading={isLoading}
            error={error?.message}
            emptyState={
              <div>
                <div className="text-gray-500 font-medium">
                  No data centers found
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Start by adding your first data center
                </div>
              </div>
            }
          />
        </div>
      </div>
    </main>
  );
}
