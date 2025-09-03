import { http, HttpResponse } from 'msw';
import type { DataCenter, CreateDataCenterRequest } from '@/types/DataCenter';

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
];
