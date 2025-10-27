import { http, HttpResponse } from 'msw';
import type { DataCenter, CreateDataCenterRequest } from '@/types/DataCenter';
import type { Device, CreateDeviceRequest } from '@/types/Device';

// Mock data matching Figma design
// eslint-disable-next-line prefer-const
let dataCenters: DataCenter[] = [
  {
    id: '1',
    location: 'New York',
    type: 'On-Premise',
    ipRange: '192.168.1.0/24',
    description: 'Main data center',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    location: 'Los Angeles',
    type: 'Cloud',
    ipRange: '10.0.0.0/16',
    description: 'Cloud data center',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    location: 'Chicago',
    type: 'On-Premise',
    ipRange: '172.16.0.0/20',
    description: 'Secondary data center',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    location: 'London',
    type: 'Cloud',
    ipRange: '10.1.0.0/16',
    description: 'International cloud data center',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    location: 'Tokyo',
    type: 'On-Premise',
    ipRange: '192.168.2.0/24',
    description: 'Asia data center',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock devices data - references existing data center IDs
// eslint-disable-next-line prefer-const
let devices: Device[] = [
  {
    id: 'dev-001',
    model: 'iPhone 15 Pro',
    os: 'iOS',
    osVersion: '17.1.2',
    status: 'connected',
    dataCenterId: '1',
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
  },
  {
    id: 'dev-002',
    model: 'Galaxy S24 Ultra',
    os: 'Android',
    osVersion: '14.0',
    status: 'connected',
    dataCenterId: '1',
    createdAt: new Date('2024-01-16T09:30:00Z').toISOString(),
    updatedAt: new Date('2024-01-16T09:30:00Z').toISOString(),
  },
  {
    id: 'dev-003',
    model: 'iPhone 14',
    os: 'iOS',
    osVersion: '16.7.1',
    status: 'disconnected',
    dataCenterId: '2',
    createdAt: new Date('2024-01-17T14:15:00Z').toISOString(),
    updatedAt: new Date('2024-01-17T14:15:00Z').toISOString(),
  },
  {
    id: 'dev-004',
    model: 'Pixel 8 Pro',
    os: 'Android',
    osVersion: '14.0',
    status: 'connected',
    dataCenterId: '2',
    createdAt: new Date('2024-01-18T11:20:00Z').toISOString(),
    updatedAt: new Date('2024-01-18T11:20:00Z').toISOString(),
  },
  {
    id: 'dev-005',
    model: 'Galaxy S23',
    os: 'Android',
    osVersion: '13.0',
    status: 'connected',
    dataCenterId: '3',
    createdAt: new Date('2024-01-19T08:45:00Z').toISOString(),
    updatedAt: new Date('2024-01-19T08:45:00Z').toISOString(),
  },
  {
    id: 'dev-006',
    model: 'iPhone 13 Pro Max',
    os: 'iOS',
    osVersion: '16.6',
    status: 'disconnected',
    dataCenterId: '3',
    createdAt: new Date('2024-01-20T13:10:00Z').toISOString(),
    updatedAt: new Date('2024-01-20T13:10:00Z').toISOString(),
  },
  {
    id: 'dev-007',
    model: 'Galaxy A54',
    os: 'Android',
    osVersion: '13.0',
    status: 'connected',
    dataCenterId: '4',
    createdAt: new Date('2024-01-21T16:25:00Z').toISOString(),
    updatedAt: new Date('2024-01-21T16:25:00Z').toISOString(),
  },
  {
    id: 'dev-008',
    model: 'iPhone 15',
    os: 'iOS',
    osVersion: '17.0',
    status: 'connected',
    dataCenterId: '4',
    createdAt: new Date('2024-01-22T12:05:00Z').toISOString(),
    updatedAt: new Date('2024-01-22T12:05:00Z').toISOString(),
  },
  {
    id: 'dev-009',
    model: 'Pixel 7a',
    os: 'Android',
    osVersion: '13.0',
    status: 'disconnected',
    dataCenterId: '5',
    createdAt: new Date('2024-01-23T09:15:00Z').toISOString(),
    updatedAt: new Date('2024-01-23T09:15:00Z').toISOString(),
  },
  {
    id: 'dev-010',
    model: 'Galaxy Z Fold5',
    os: 'Android',
    osVersion: '13.0',
    status: 'connected',
    dataCenterId: '5',
    createdAt: new Date('2024-01-24T15:40:00Z').toISOString(),
    updatedAt: new Date('2024-01-24T15:40:00Z').toISOString(),
  },
  {
    id: 'dev-011',
    model: 'iPhone 12 Pro',
    os: 'iOS',
    osVersion: '16.7.2',
    status: 'connected',
    dataCenterId: '1',
    createdAt: new Date('2024-01-25T07:30:00Z').toISOString(),
    updatedAt: new Date('2024-01-25T07:30:00Z').toISOString(),
  },
  {
    id: 'dev-012',
    model: 'Galaxy S24',
    os: 'Android',
    osVersion: '14.0',
    status: 'disconnected',
    dataCenterId: '2',
    createdAt: new Date('2024-01-26T14:50:00Z').toISOString(),
    updatedAt: new Date('2024-01-26T14:50:00Z').toISOString(),
  },
  {
    id: 'dev-013',
    model: 'Pixel 8',
    os: 'Android',
    osVersion: '14.0',
    status: 'connected',
    dataCenterId: '3',
    createdAt: new Date('2024-01-27T10:35:00Z').toISOString(),
    updatedAt: new Date('2024-01-27T10:35:00Z').toISOString(),
  },
  {
    id: 'dev-014',
    model: 'iPhone 14 Pro Max',
    os: 'iOS',
    osVersion: '17.1',
    status: 'connected',
    dataCenterId: '4',
    createdAt: new Date('2024-01-28T11:55:00Z').toISOString(),
    updatedAt: new Date('2024-01-28T11:55:00Z').toISOString(),
  },
  {
    id: 'dev-015',
    model: 'Galaxy Note 20',
    os: 'Android',
    osVersion: '12.0',
    status: 'disconnected',
    dataCenterId: '5',
    createdAt: new Date('2024-01-29T13:20:00Z').toISOString(),
    updatedAt: new Date('2024-01-29T13:20:00Z').toISOString(),
  },
  {
    id: 'dev-016',
    model: 'iPhone SE (3rd gen)',
    os: 'iOS',
    osVersion: '16.6',
    status: 'connected',
    dataCenterId: '1',
    createdAt: new Date('2024-01-30T08:15:00Z').toISOString(),
    updatedAt: new Date('2024-01-30T08:15:00Z').toISOString(),
  },
  {
    id: 'dev-017',
    model: 'Galaxy Z Flip5',
    os: 'Android',
    osVersion: '13.0',
    status: 'connected',
    dataCenterId: '2',
    createdAt: new Date('2024-01-31T16:45:00Z').toISOString(),
    updatedAt: new Date('2024-01-31T16:45:00Z').toISOString(),
  },
  {
    id: 'dev-018',
    model: 'Pixel 6a',
    os: 'Android',
    osVersion: '13.0',
    status: 'disconnected',
    dataCenterId: '3',
    createdAt: new Date('2024-02-01T12:10:00Z').toISOString(),
    updatedAt: new Date('2024-02-01T12:10:00Z').toISOString(),
  },
  {
    id: 'dev-019',
    model: 'iPhone 13 mini',
    os: 'iOS',
    osVersion: '16.7.1',
    status: 'connected',
    dataCenterId: '4',
    createdAt: new Date('2024-02-02T09:25:00Z').toISOString(),
    updatedAt: new Date('2024-02-02T09:25:00Z').toISOString(),
  },
  {
    id: 'dev-020',
    model: 'Galaxy A34',
    os: 'Android',
    osVersion: '13.0',
    status: 'connected',
    dataCenterId: '5',
    createdAt: new Date('2024-02-03T14:30:00Z').toISOString(),
    updatedAt: new Date('2024-02-03T14:30:00Z').toISOString(),
  },
];

export const handlers = [
  // GET /api/data-centers
  http.get('/api/data-centers', async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return HttpResponse.json({ data: dataCenters });
  }),

  // POST /api/data-centers
  http.post('/api/data-centers', async ({ request }) => {
    const body = (await request.json()) as CreateDataCenterRequest;

    const newDataCenter: DataCenter = {
      id: String(Date.now()),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dataCenters.push(newDataCenter);

    await new Promise((resolve) => setTimeout(resolve, 200));

    return HttpResponse.json({ data: newDataCenter }, { status: 201 });
  }),

  // PUT /api/data-centers/:id
  http.put('/api/data-centers/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as CreateDataCenterRequest;

    const index = dataCenters.findIndex((dc) => dc.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { error: 'Data center not found' },
        { status: 404 }
      );
    }

    dataCenters[index] = {
      ...dataCenters[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await new Promise((resolve) => setTimeout(resolve, 150));

    return HttpResponse.json({ data: dataCenters[index] });
  }),

  // DELETE /api/data-centers/:id
  http.delete('/api/data-centers/:id', async ({ params }) => {
    const { id } = params;

    const index = dataCenters.findIndex((dc) => dc.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { error: 'Data center not found' },
        { status: 404 }
      );
    }

    const deletedDataCenter = dataCenters.splice(index, 1)[0];

    await new Promise((resolve) => setTimeout(resolve, 100));

    return HttpResponse.json({ data: deletedDataCenter });
  }),

  // GET /api/devices
  http.get('/api/devices', async ({ request }) => {
    const url = new URL(request.url);
    const forceError = url.searchParams.get('forceError');

    // Simulate API error scenario for testing
    if (forceError === 'true') {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return HttpResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }

    // Simulate network delay (100-200ms)
    await new Promise((resolve) => setTimeout(resolve, 120));

    return HttpResponse.json({ data: devices });
  }),

  // POST /api/devices
  http.post('/api/devices', async ({ request }) => {
    const body = (await request.json()) as CreateDeviceRequest;

    const newDevice: Device = {
      id: `dev-${String(Date.now())}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    devices.push(newDevice);

    await new Promise((resolve) => setTimeout(resolve, 150));

    return HttpResponse.json({ data: newDevice }, { status: 201 });
  }),
];
