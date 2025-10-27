export interface Device {
  id: string;
  model: string;
  os: string;
  osVersion: string;
  status: 'connected' | 'disconnected';
  dataCenterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeviceRequest {
  model: string;
  os: string;
  osVersion: string;
  status: 'connected' | 'disconnected';
  dataCenterId: string;
}

export interface UpdateDeviceRequest extends CreateDeviceRequest {
  id: string;
}
