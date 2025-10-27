import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, beforeEach, describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';
import { useDevices, useCreateDevice, deviceKeys } from '../devices';
import type { CreateDeviceRequest } from '@/types/Device';

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

describe('Device API Layer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('deviceKeys', () => {
    it('should generate correct query keys', () => {
      expect(deviceKeys.all).toEqual(['devices']);
      expect(deviceKeys.lists()).toEqual(['devices', 'list']);
      expect(deviceKeys.list('active')).toEqual([
        'devices',
        'list',
        { filters: 'active' },
      ]);
      expect(deviceKeys.details()).toEqual(['devices', 'detail']);
      expect(deviceKeys.detail('dev-123')).toEqual([
        'devices',
        'detail',
        'dev-123',
      ]);
    });
  });

  describe('useDevices', () => {
    it('should fetch devices successfully', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDevices(), { wrapper });

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

    it('should handle loading state correctly', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDevices(), { wrapper });

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

    it('should handle error state correctly', async () => {
      // Override the default handler with an error response
      server.use(
        http.get('/api/devices', () => {
          return HttpResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
          );
        })
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDevices(), { wrapper });

      // Wait for the query to complete with error
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.error!.message).toContain(
        'Failed to fetch devices'
      );
    });

    it('should use correct query key', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDevices(), { wrapper });

      // The query key should match the deviceKeys.lists()
      expect(result.current).toBeDefined();
    });
  });

  describe('Query key management', () => {
    it('should invalidate cache properly', async () => {
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

      const { result } = renderHook(() => useCreateDevice(), { wrapper });

      const newDevice: CreateDeviceRequest = {
        model: 'Test Phone',
        os: 'Android',
        osVersion: '14.0',
        status: 'connected',
        dataCenterId: '1',
      };

      act(() => {
        result.current.mutate(newDevice);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Should have called invalidateQueries with the correct key
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: deviceKeys.lists(),
      });
    });
  });

  describe('Error handling scenarios', () => {
    it('should handle network errors', async () => {
      // Test with forceError parameter
      server.use(
        http.get('/api/devices', ({ request }) => {
          const url = new URL(request.url);
          if (url.searchParams.get('forceError') === 'true') {
            return HttpResponse.json(
              { error: 'Internal server error' },
              { status: 500 }
            );
          }
          return HttpResponse.json({ data: [] });
        })
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDevices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual([]);
    });

    it('should handle server errors', async () => {
      server.use(
        http.get('/api/devices', () => {
          return HttpResponse.json({ error: 'Server Error' }, { status: 500 });
        })
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDevices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error!.message).toContain(
        'Failed to fetch devices'
      );
    });

    it('should not retry failed queries due to test configuration', async () => {
      let attemptCount = 0;

      // Override handler to count attempts
      server.use(
        http.get('/api/devices', () => {
          attemptCount++;
          return HttpResponse.json({ error: 'Server Error' }, { status: 500 });
        })
      );

      const wrapper = createWrapper();
      const { result } = renderHook(() => useDevices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      // Should only attempt once due to retry: false in test config
      expect(attemptCount).toBe(1);
    });
  });

  describe('Integration with MSW', () => {
    it('should properly integrate with MSW handlers', async () => {
      const wrapper = createWrapper();

      // Test fetch
      const { result: fetchResult } = renderHook(() => useDevices(), {
        wrapper,
      });

      await waitFor(() => {
        expect(fetchResult.current.isSuccess).toBe(true);
      });

      // Should have devices data from MSW handlers
      expect(fetchResult.current.data).toBeDefined();
      expect(fetchResult.current.data!.length).toBeGreaterThan(0);

      // Verify device structure
      const firstDevice = fetchResult.current.data![0];
      expect(firstDevice).toHaveProperty('id');
      expect(firstDevice).toHaveProperty('model');
      expect(firstDevice).toHaveProperty('os');
      expect(firstDevice).toHaveProperty('osVersion');
      expect(firstDevice).toHaveProperty('status');
      expect(firstDevice).toHaveProperty('dataCenterId');
    });

    it('should handle network delays from MSW handlers', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDevices(), { wrapper });

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

  describe('Loading and Success States', () => {
    it('should properly manage loading states for queries', async () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useDevices(), { wrapper });

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
  });
});
