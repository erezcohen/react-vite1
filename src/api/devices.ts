import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  Device,
  CreateDeviceRequest,
  UpdateDeviceRequest,
} from '@/types/Device';

// API functions
const fetchDevices = async (): Promise<Device[]> => {
  const response = await fetch('/api/devices');

  if (!response.ok) {
    throw new Error(`Failed to fetch devices: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

const createDevice = async (device: CreateDeviceRequest): Promise<Device> => {
  const response = await fetch('/api/devices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(device),
  });

  if (!response.ok) {
    throw new Error(`Failed to create device: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

const updateDevice = async (device: UpdateDeviceRequest): Promise<Device> => {
  const response = await fetch(`/api/devices/${device.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(device),
  });

  if (!response.ok) {
    throw new Error(`Failed to update device: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

const deleteDevice = async (id: string): Promise<Device> => {
  const response = await fetch(`/api/devices/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete device: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

// Query keys
export const deviceKeys = {
  all: ['devices'] as const,
  lists: () => [...deviceKeys.all, 'list'] as const,
  list: (filters: string) => [...deviceKeys.lists(), { filters }] as const,
  details: () => [...deviceKeys.all, 'detail'] as const,
  detail: (id: string) => [...deviceKeys.details(), id] as const,
};

// Hooks
export const useDevices = () => {
  return useQuery({
    queryKey: deviceKeys.lists(),
    queryFn: fetchDevices,
  });
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.lists() });
    },
  });
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.lists() });
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: deviceKeys.lists() });
    },
  });
};
