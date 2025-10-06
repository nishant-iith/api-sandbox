/**
 * API Client Service
 * Handles HTTP requests with proper error handling, cancellation, and timeout support
 */

import { ApiRequest, ApiResponse, KeyValuePair } from '@/lib/types';
import { TIMEOUTS } from '@/lib/constants';

/**
 * Active request controllers for cancellation
 */
const activeRequests = new Map<string, AbortController>();

/**
 * Substitutes environment variables in a string
 * @param str - String with variables in {{key}} format
 * @param variables - Key-value pairs of variables
 * @returns String with variables substituted
 */
const substituteVariables = (str: string, variables: KeyValuePair[]): string => {
  if (!str) return str;

  let result = str;
  variables.forEach(variable => {
    if (variable.enabled && variable.key) {
      const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g');
      result = result.replace(regex, variable.value);
    }
  });

  return result;
};

/**
 * Sends an HTTP request
 * @param request - The API request configuration
 * @param environmentVariables - Environment variables for substitution
 * @param timeout - Request timeout in milliseconds
 * @returns Promise resolving to API response
 */
export const sendRequest = async (
  request: ApiRequest,
  environmentVariables: KeyValuePair[] = [],
  timeout: number = TIMEOUTS.DEFAULT_REQUEST_TIMEOUT
): Promise<ApiResponse> => {
  const startTime = Date.now();
  const abortController = new AbortController();
  activeRequests.set(request.id, abortController);

  try {
    // Substitute variables in URL
    const processedUrl = substituteVariables(request.url, environmentVariables);

    // Validate and construct URL
    const url = new URL(processedUrl);

    // Add query parameters
    request.queryParams
      .filter(p => p.enabled && p.key)
      .forEach(p => {
        const key = substituteVariables(p.key, environmentVariables);
        const value = substituteVariables(p.value, environmentVariables);
        url.searchParams.append(key, value);
      });

    // Construct headers
    const headers = new Headers();
    request.headers
      .filter(h => h.enabled && h.key)
      .forEach(h => {
        const key = substituteVariables(h.key, environmentVariables);
        const value = substituteVariables(h.value, environmentVariables);
        headers.append(key, value);
      });

    // Construct body
    let body: BodyInit | undefined = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      if (request.bodyType === 'json' && request.body) {
        body = substituteVariables(request.body, environmentVariables);
        if (!headers.has('Content-Type')) {
          headers.append('Content-Type', 'application/json');
        }
      } else if (request.bodyType === 'form-urlencoded' && request.body) {
        const substitutedBody = substituteVariables(request.body, environmentVariables);
        const bodyParams = JSON.parse(substitutedBody);
        const urlSearchParams = new URLSearchParams();
        for (const key in bodyParams) {
          urlSearchParams.append(key, bodyParams[key]);
        }
        body = urlSearchParams;
        if (!headers.has('Content-Type')) {
          headers.append('Content-Type', 'application/x-www-form-urlencoded');
        }
      }
    }

    // Set timeout
    const timeoutId = setTimeout(() => abortController.abort(), timeout);

    // Make request
    const response = await fetch(url.toString(), {
      method: request.method,
      headers,
      body,
      mode: 'cors',
      signal: abortController.signal,
    });

    clearTimeout(timeoutId);

    const endTime = Date.now();

    // Read response body
    const responseBody = await response.text();
    const responseSize = new Blob([responseBody]).size;

    // Parse response data
    let responseData: unknown;
    try {
      responseData = JSON.parse(responseBody);
    } catch {
      responseData = responseBody;
    }

    // Extract response headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    // Construct API response
    const apiResponse: ApiResponse = {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data: responseData,
      time: endTime - startTime,
      size: responseSize,
      raw: responseBody,
    };

    activeRequests.delete(request.id);
    return apiResponse;

  } catch (error) {
    const endTime = Date.now();

    // Handle different error types
    if (error instanceof Error) {
      // Timeout error
      if (error.name === 'AbortError') {
        throw new Error('Request timeout exceeded');
      }

      // CORS error
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('CORS policy blocked the request or network error occurred');
      }
    }

    // Generic error response
    const errorResponse: ApiResponse = {
      status: 0,
      statusText: 'Client Error',
      headers: {},
      data: {
        error: 'Failed to fetch',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      time: endTime - startTime,
      size: 0,
      raw: error instanceof Error ? error.message : 'Unknown error',
    };

    activeRequests.delete(request.id);
    return errorResponse;
  }
};

/**
 * Cancels an active request
 * @param requestId - ID of the request to cancel
 * @returns True if request was cancelled, false if not found
 */
export const cancelRequest = (requestId: string): boolean => {
  const controller = activeRequests.get(requestId);
  if (controller) {
    controller.abort();
    activeRequests.delete(requestId);
    return true;
  }
  return false;
};

/**
 * Cancels all active requests
 */
export const cancelAllRequests = (): void => {
  activeRequests.forEach((controller) => controller.abort());
  activeRequests.clear();
};

/**
 * Gets the number of active requests
 * @returns Number of requests currently in flight
 */
export const getActiveRequestCount = (): number => {
  return activeRequests.size;
};

/**
 * Checks if a request is currently active
 * @param requestId - ID of the request to check
 * @returns True if request is active
 */
export const isRequestActive = (requestId: string): boolean => {
  return activeRequests.has(requestId);
};
