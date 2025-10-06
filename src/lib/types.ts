export interface KeyValuePair {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
  secret?: boolean; // For masking sensitive values in environment variables
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

/**
 * Authentication configuration for API requests
 */
export interface AuthConfig {
  type: 'none' | 'bearer' | 'basic' | 'api-key' | 'oauth2';
  bearer?: {
    token: string;
  };
  basic?: {
    username: string;
    password: string;
  };
  apiKey?: {
    key: string;
    value: string;
    addTo: 'header' | 'query';
  };
  oauth2?: {
    // Placeholder for future OAuth2 implementation
    accessToken?: string;
  };
}

export interface ApiRequest {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  queryParams: KeyValuePair[];
  headers: KeyValuePair[];
  body: string;
  bodyType: 'none' | 'json' | 'form-urlencoded';
  auth?: AuthConfig;
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
