export interface DataCenter {
  id: string;
  location: string;
  type: 'On-Premise' | 'Cloud';
  ipRange: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDataCenterRequest {
  location: string;
  type: 'On-Premise' | 'Cloud';
  ipRange: string;
  description: string;
}

export interface UpdateDataCenterRequest extends CreateDataCenterRequest {
  id: string;
}
