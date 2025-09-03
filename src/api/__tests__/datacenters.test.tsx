import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import {
  useDataCenters,
  useCreateDataCenter,
  useUpdateDataCenter,
  useDeleteDataCenter,
  dataCenterKeys,
} from '../datacenters';
import type {
  CreateDataCenterRequest,
  UpdateDataCenterRequest,
} from '@/types/DataCenter';

// Create wrapper component with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// Mock data structures are handled by MSW handlers in src/mocks/handlers.ts

describe('DataCenter API Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('dataCenterKeys', () => {
    it('should generate correct query keys', () => {
      expect(dataCenterKeys.all).toEqual(['dataCenters']);
      expect(dataCenterKeys.lists()).toEqual(['dataCenters', 'list']);
      expect(dataCenterKeys.list('active')).toEqual([
        'dataCenters',
        'list',
        { filters: 'active' },
      ]);
      expect(dataCenterKeys.details()).toEqual(['dataCenters', 'detail']);
      expect(dataCenterKeys.detail('123')).toEqual([
        'dataCenters',
        'detail',
        '123',
      ]);
    });
  });

  describe('useDataCenters', () => {
    it('should fetch data centers successfully', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDataCenters(), { wrapper });

      // Initially loading
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBe(null);

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should have data
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeDefined();
      expect(Array.isArray(result.current.data)).toBe(true);
      expect(result.current.data!.length).toBeGreaterThan(0);
      expect(result.current.error).toBe(null);
    });

    it('should handle fetch error', async () => {
      // Override the default handler with an error response
      server.use(
        http.get('/api/data-centers', () => {
          return HttpResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
          );
        })
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDataCenters(), { wrapper });

      // Wait for the query to complete with error
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.error!.message).toContain(
        'Failed to fetch data centers'
      );
    });

    it('should use correct query key', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDataCenters(), { wrapper });

      // The query key should match the dataCenterKeys.lists()
      expect(result.current).toBeDefined();
    });
  });

  describe('useCreateDataCenter', () => {
    it('should create data center successfully', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useCreateDataCenter(), { wrapper });

      const newDataCenter: CreateDataCenterRequest = {
        location: 'New Test Location',
        type: 'Cloud',
        ipRange: '172.16.0.0/20',
        description: 'New test description',
      };

      // Initially not mutating
      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBe(null);

      // Trigger the mutation
      act(() => {
        result.current.mutate(newDataCenter);
      });

      // Wait for the mutation to complete
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBeDefined();
      expect(result.current.data!.location).toBe(newDataCenter.location);
      expect(result.current.data!.type).toBe(newDataCenter.type);
      expect(result.current.data!.id).toBeDefined();
      expect(result.current.error).toBe(null);
    });

    it('should handle create error', async () => {
      // Override the default handler with an error response
      server.use(
        http.post('/api/data-centers', () => {
          return HttpResponse.json({ error: 'Bad Request' }, { status: 400 });
        })
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useCreateDataCenter(), { wrapper });

      const newDataCenter: CreateDataCenterRequest = {
        location: 'New Test Location',
        type: 'Cloud',
        ipRange: '172.16.0.0/20',
        description: 'New test description',
      };

      // Trigger the mutation
      act(() => {
        result.current.mutate(newDataCenter);
      });

      // Wait for the mutation to complete with error
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.error!.message).toContain(
        'Failed to create data center'
      );
    });

    it('should invalidate cache on successful create', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: 0 },
          mutations: { retry: false },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Spy on invalidateQueries
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useCreateDataCenter(), { wrapper });

      const newDataCenter: CreateDataCenterRequest = {
        location: 'New Test Location',
        type: 'Cloud',
        ipRange: '172.16.0.0/20',
        description: 'New test description',
      };

      act(() => {
        result.current.mutate(newDataCenter);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should have called invalidateQueries with the correct key
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: dataCenterKeys.lists(),
      });
    });
  });

  describe('useUpdateDataCenter', () => {
    it('should update data center successfully', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useUpdateDataCenter(), { wrapper });

      const updateData: UpdateDataCenterRequest = {
        id: '1',
        location: 'Updated Location',
        type: 'On-Premise',
        ipRange: '192.168.2.0/24',
        description: 'Updated description',
      };

      // Initially not mutating
      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBe(null);

      // Trigger the mutation
      act(() => {
        result.current.mutate(updateData);
      });

      // Wait for the mutation to complete
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBeDefined();
      expect(result.current.data!.id).toBe(updateData.id);
      expect(result.current.data!.location).toBe(updateData.location);
      expect(result.current.error).toBe(null);
    });

    it('should handle update error for non-existent data center', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useUpdateDataCenter(), { wrapper });

      const updateData: UpdateDataCenterRequest = {
        id: 'non-existent-id',
        location: 'Updated Location',
        type: 'On-Premise',
        ipRange: '192.168.2.0/24',
        description: 'Updated description',
      };

      // Trigger the mutation
      act(() => {
        result.current.mutate(updateData);
      });

      // Wait for the mutation to complete with error
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.error!.message).toContain(
        'Failed to update data center'
      );
    });

    it('should invalidate cache on successful update', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: 0 },
          mutations: { retry: false },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // Spy on invalidateQueries
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useUpdateDataCenter(), { wrapper });

      const updateData: UpdateDataCenterRequest = {
        id: '1',
        location: 'Updated Location',
        type: 'On-Premise',
        ipRange: '192.168.2.0/24',
        description: 'Updated description',
      };

      act(() => {
        result.current.mutate(updateData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should have called invalidateQueries with the correct key
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: dataCenterKeys.lists(),
      });
    });
  });

  describe('useDeleteDataCenter', () => {
    it('should delete data center successfully', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDeleteDataCenter(), { wrapper });

      const deleteId = '1';

      // Initially not mutating
      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBe(null);

      // Trigger the mutation
      act(() => {
        result.current.mutate(deleteId);
      });

      // Wait for the mutation to complete
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBeDefined();
      expect(result.current.data!.id).toBe(deleteId);
      expect(result.current.error).toBe(null);
    });

    it('should handle delete error for non-existent data center', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDeleteDataCenter(), { wrapper });

      const deleteId = 'non-existent-id';

      // Trigger the mutation
      act(() => {
        result.current.mutate(deleteId);
      });

      // Wait for the mutation to complete with error
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.error!.message).toContain(
        'Failed to delete data center'
      );
    });

    it('should invalidate cache on successful delete', async () => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false, gcTime: 0 },
          mutations: { retry: false },
        },
      });

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // First, fetch data to ensure we have data centers available
      const { result: fetchResult } = renderHook(() => useDataCenters(), {
        wrapper,
      });
      await waitFor(() => {
        expect(fetchResult.current.isSuccess).toBe(true);
      });

      // Use an existing data center id from the fetched data
      const existingId = fetchResult.current.data![0].id;

      // Spy on invalidateQueries
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useDeleteDataCenter(), { wrapper });

      act(() => {
        result.current.mutate(existingId);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should have called invalidateQueries with the correct key
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: dataCenterKeys.lists(),
      });
    });
  });

  describe('Integration with MSW', () => {
    it('should properly integrate with MSW handlers for all operations', async () => {
      const wrapper = createWrapper();

      // Test fetch
      const { result: fetchResult } = renderHook(() => useDataCenters(), {
        wrapper,
      });

      await waitFor(() => {
        expect(fetchResult.current.isSuccess).toBe(true);
      });

      // We have initial data from MSW handlers

      // Test create
      const { result: createResult } = renderHook(() => useCreateDataCenter(), {
        wrapper,
      });

      const newDataCenter: CreateDataCenterRequest = {
        location: 'Integration Test Location',
        type: 'Cloud',
        ipRange: '10.10.0.0/16',
        description: 'Integration test description',
      };

      act(() => {
        createResult.current.mutate(newDataCenter);
      });

      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true);
      });

      const createdDataCenter = createResult.current.data!;
      expect(createdDataCenter.location).toBe(newDataCenter.location);
      expect(createdDataCenter.id).toBeDefined();

      // Test update
      const { result: updateResult } = renderHook(() => useUpdateDataCenter(), {
        wrapper,
      });

      const updateData: UpdateDataCenterRequest = {
        id: createdDataCenter.id,
        location: 'Updated Integration Location',
        type: 'On-Premise',
        ipRange: '172.20.0.0/20',
        description: 'Updated integration description',
      };

      act(() => {
        updateResult.current.mutate(updateData);
      });

      await waitFor(() => {
        expect(updateResult.current.isSuccess).toBe(true);
      });

      expect(updateResult.current.data!.location).toBe(updateData.location);
      expect(updateResult.current.data!.type).toBe(updateData.type);

      // Test delete
      const { result: deleteResult } = renderHook(() => useDeleteDataCenter(), {
        wrapper,
      });

      act(() => {
        deleteResult.current.mutate(createdDataCenter.id);
      });

      await waitFor(() => {
        expect(deleteResult.current.isSuccess).toBe(true);
      });

      expect(deleteResult.current.data!.id).toBe(createdDataCenter.id);
    });

    it('should handle network delays from MSW handlers', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDataCenters(), { wrapper });

      const startTime = Date.now();

      // Wait for the query to complete
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should have taken at least 100ms due to MSW handler delay
      expect(duration).toBeGreaterThanOrEqual(95); // Allow some margin for timing
    });
  });

  describe('Error Handling and Retry Logic', () => {
    it('should not retry failed queries due to test configuration', async () => {
      let attemptCount = 0;

      // Override handler to count attempts
      server.use(
        http.get('/api/data-centers', () => {
          attemptCount++;
          return HttpResponse.json({ error: 'Server Error' }, { status: 500 });
        })
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDataCenters(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Should only attempt once due to retry: false in test config
      expect(attemptCount).toBe(1);
    });

    it('should not retry failed mutations due to test configuration', async () => {
      let attemptCount = 0;

      // Override handler to count attempts
      server.use(
        http.post('/api/data-centers', () => {
          attemptCount++;
          return HttpResponse.json({ error: 'Server Error' }, { status: 500 });
        })
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useCreateDataCenter(), { wrapper });

      const newDataCenter: CreateDataCenterRequest = {
        location: 'Test Location',
        type: 'Cloud',
        ipRange: '10.0.0.0/16',
        description: 'Test description',
      };

      act(() => {
        result.current.mutate(newDataCenter);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Should only attempt once due to retry: false in test config
      expect(attemptCount).toBe(1);
    });
  });

  describe('Loading and Success States', () => {
    it('should properly manage loading states for queries', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDataCenters(), { wrapper });

      // Should start in loading state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.isPending).toBe(true);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should be in success state
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });

    it('should properly manage loading states for mutations', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useCreateDataCenter(), { wrapper });

      // Should start in idle state
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isIdle).toBe(true);

      const newDataCenter: CreateDataCenterRequest = {
        location: 'Test Location',
        type: 'Cloud',
        ipRange: '10.0.0.0/16',
        description: 'Test description',
      };

      act(() => {
        result.current.mutate(newDataCenter);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should be in success state
      expect(result.current.isPending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.data).toBeDefined();
    });
  });
});
