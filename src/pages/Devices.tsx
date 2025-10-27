import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { Plus } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { useDevices } from '@/api/devices';
import { useDataCenters } from '@/api/datacenters';
import type { Device } from '@/types/Device';

const columnHelper = createColumnHelper<Device>();

export default function Devices() {
  const { data: devices = [], isLoading, error } = useDevices();
  const { data: dataCenters = [] } = useDataCenters();

  // Create a lookup map for data center names
  const dataCenterLookup = dataCenters.reduce(
    (acc, dc) => {
      acc[dc.id] = dc.location;
      return acc;
    },
    {} as Record<string, string>
  );

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      size: 180,
      cell: (info) => (
        <div className="css-mw0uwd font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#0d0f1c] text-[14px] text-left w-full">
          <p className="block leading-[21px]">{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor('model', {
      header: 'Model',
      size: 200,
      cell: (info) => (
        <div className="css-mw0uwd font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#0d0f1c] text-[14px] text-left w-full">
          <p className="block leading-[21px]">{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor('os', {
      header: 'OS',
      size: 160,
      cell: (info) => (
        <div className="css-nnn1vs font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#47579e] text-[14px] text-left w-full">
          <p className="block leading-[21px]">{`${info.getValue()} ${info.row.original.osVersion}`}</p>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      size: 140,
      cell: (info) => {
        const status = info.getValue();
        const isConnected = status === 'connected';
        return (
          <div className="flex items-center">
            <div
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isConnected
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                }`}
              ></div>
              {status}
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor('dataCenterId', {
      header: 'Data Center',
      size: 180,
      cell: (info) => (
        <div className="css-nnn1vs font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic text-[#47579e] text-[14px] text-left w-full">
          <p className="block leading-[21px]">
            {dataCenterLookup[info.getValue()] || 'Unknown'}
          </p>
        </div>
      ),
    }),
  ];

  const handleAddDevice = () => {
    // TODO: Open add device modal/form
    console.log('Add device clicked');
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAddDevice();
    }
  };

  return (
    <main className="h-[735px] px-40 py-5">
      <div className="max-w-[960px] mx-auto h-[695px] overflow-clip">
        {/* Page Header - matching Figma exactly */}
        <div className="flex flex-wrap gap-3 items-start justify-between p-4">
          <div className="min-w-72 w-72">
            <h1 className="text-[32px] font-['Inter:Bold',_sans-serif] font-bold text-[#0d0f1c] leading-[40px]">
              Devices
            </h1>
          </div>
          <div className="h-12">
            <div className="h-12 flex items-center justify-center">
              <div
                onClick={handleAddDevice}
                onKeyDown={handleKeyDown}
                className="bg-[#625b71] box-border cursor-pointer flex flex-col items-center justify-center overflow-clip rounded-xl"
                role="button"
                tabIndex={0}
                aria-label="Add Device"
              >
                <div className="box-border flex flex-row gap-2 items-center justify-center px-4 py-2.5">
                  <div className="size-5">
                    <Plus size={20} className="text-white" />
                  </div>
                  <div className="flex flex-col font-['Roboto:Medium',_sans-serif] font-medium justify-center text-[#ffffff] text-[14px] text-left text-nowrap tracking-[0.1px]">
                    <p className="leading-[20px] whitespace-pre">Add Device</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="px-4 py-3">
          <DataTable
            columns={columns as ColumnDef<Device>[]}
            data={devices}
            loading={isLoading}
            error={error?.message}
            emptyState={
              <div>
                <div className="text-gray-500 font-medium">
                  No devices found
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Start by adding your first device
                </div>
              </div>
            }
          />
        </div>
      </div>
    </main>
  );
}
