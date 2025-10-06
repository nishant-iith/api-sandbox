/**
 * Authentication Utilities
 * Handles auth header injection and credential processing
 */

import { AuthConfig, KeyValuePair } from '@/lib/types';

/**
 * Applies authentication to headers and query parameters
 * @param auth - Authentication configuration
 * @param headers - Current headers map
 * @param queryParams - Current query parameters
 * @param substituteVariables - Function to substitute environment variables
 * @returns Modified headers and query params with auth applied
 */
export const applyAuthentication = (
  auth: AuthConfig | undefined,
  headers: Headers,
  queryParams: URLSearchParams,
  substituteVariables: (str: string) => string
): { headers: Headers; queryParams: URLSearchParams } => {
  if (!auth || auth.type === 'none') {
    return { headers, queryParams };
  }

  switch (auth.type) {
    case 'bearer':
      if (auth.bearer?.token) {
        const token = substituteVariables(auth.bearer.token);
        headers.set('Authorization', `Bearer ${token}`);
      }
      break;

    case 'basic':
      if (auth.basic?.username && auth.basic?.password) {
        const username = substituteVariables(auth.basic.username);
        const password = substituteVariables(auth.basic.password);
        const credentials = btoa(`${username}:${password}`);
        headers.set('Authorization', `Basic ${credentials}`);
      }
      break;

    case 'api-key':
      if (auth.apiKey?.key && auth.apiKey?.value) {
        const key = substituteVariables(auth.apiKey.key);
        const value = substituteVariables(auth.apiKey.value);

        if (auth.apiKey.addTo === 'header') {
          headers.set(key, value);
        } else if (auth.apiKey.addTo === 'query') {
          queryParams.set(key, value);
        }
      }
      break;

    case 'oauth2':
      // Placeholder for OAuth2
      if (auth.oauth2?.accessToken) {
        const token = substituteVariables(auth.oauth2.accessToken);
        headers.set('Authorization', `Bearer ${token}`);
      }
      break;
  }

  return { headers, queryParams };
};

/**
 * Checks if authentication is configured
 * @param auth - Authentication configuration
 * @returns True if auth is configured with credentials
 */
export const hasAuthentication = (auth: AuthConfig | undefined): boolean => {
  if (!auth || auth.type === 'none') {
    return false;
  }

  switch (auth.type) {
    case 'bearer':
      return !!auth.bearer?.token;
    case 'basic':
      return !!(auth.basic?.username && auth.basic?.password);
    case 'api-key':
      return !!(auth.apiKey?.key && auth.apiKey?.value);
    case 'oauth2':
      return !!auth.oauth2?.accessToken;
    default:
      return false;
  }
};

/**
 * Gets a human-readable description of the auth configuration
 * @param auth - Authentication configuration
 * @returns Description string
 */
export const getAuthDescription = (auth: AuthConfig | undefined): string => {
  if (!auth || auth.type === 'none') {
    return 'No authentication';
  }

  switch (auth.type) {
    case 'bearer':
      return auth.bearer?.token ? 'Bearer Token (configured)' : 'Bearer Token (not configured)';
    case 'basic':
      return auth.basic?.username ? `Basic Auth (${auth.basic.username})` : 'Basic Auth (not configured)';
    case 'api-key':
      if (auth.apiKey?.key) {
        const location = auth.apiKey.addTo === 'header' ? 'Header' : 'Query';
        return `API Key (${auth.apiKey.key} in ${location})`;
      }
      return 'API Key (not configured)';
    case 'oauth2':
      return 'OAuth 2.0 (coming soon)';
    default:
      return 'Unknown authentication';
  }
};
