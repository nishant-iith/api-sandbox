export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface ApiRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  queryParams: KeyValuePair[];
  headers: KeyValuePair[];
  body: string;
  bodyType: 'none' | 'json' | 'form-urlencoded';
}

export interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
  size: number;
  raw: string;
}

export interface RequestHistoryItem {
  id: string;
  request: ApiRequest;
  response: ApiResponse;
  timestamp: number;
}

export interface CollectionItem {
  id: string;
  name: string;
  type: 'request' | 'folder';
  request?: ApiRequest;
  children?: CollectionItem[];
}

export interface Environment {
  id: string;
  name: string;
  variables: KeyValuePair[];
}
