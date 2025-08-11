import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  DataCenter,
  CreateDataCenterRequest,
  UpdateDataCenterRequest,
} from '@/types/DataCenter';

// API functions
const fetchDataCenters = async (): Promise<DataCenter[]> => {
  const response = await fetch('/api/data-centers');

  if (!response.ok) {
    throw new Error(`Failed to fetch data centers: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

const createDataCenter = async (
  dataCenter: CreateDataCenterRequest
): Promise<DataCenter> => {
  const response = await fetch('/api/data-centers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataCenter),
  });

  if (!response.ok) {
    throw new Error(`Failed to create data center: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

const updateDataCenter = async (
  dataCenter: UpdateDataCenterRequest
): Promise<DataCenter> => {
  const response = await fetch(`/api/data-centers/${dataCenter.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataCenter),
  });

  if (!response.ok) {
    throw new Error(`Failed to update data center: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

const deleteDataCenter = async (id: string): Promise<DataCenter> => {
  const response = await fetch(`/api/data-centers/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete data center: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
};

// Query keys
export const dataCenterKeys = {
  all: ['dataCenters'] as const,
  lists: () => [...dataCenterKeys.all, 'list'] as const,
  list: (filters: string) => [...dataCenterKeys.lists(), { filters }] as const,
  details: () => [...dataCenterKeys.all, 'detail'] as const,
  detail: (id: string) => [...dataCenterKeys.details(), id] as const,
};

// Hooks
export const useDataCenters = () => {
  return useQuery({
    queryKey: dataCenterKeys.lists(),
    queryFn: fetchDataCenters,
  });
};

export const useCreateDataCenter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDataCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataCenterKeys.lists() });
    },
  });
};

export const useUpdateDataCenter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDataCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataCenterKeys.lists() });
    },
  });
};

export const useDeleteDataCenter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDataCenter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dataCenterKeys.lists() });
    },
  });
};
