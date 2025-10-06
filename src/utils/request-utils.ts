/**
 * Request Utility Functions
 * Provides helper functions for request operations like duplication and cURL generation
 */

import { ApiRequest, KeyValuePair } from '@/lib/types';
import { generateId } from './id-generator';

/**
 * Duplicates a request with a new ID and updated name
 * @param request - The request to duplicate
 * @returns New request with unique ID
 */
export const duplicateRequest = (request: ApiRequest): ApiRequest => {
  return {
    ...request,
    id: generateId('req'),
    name: `${request.name} (Copy)`,
    queryParams: request.queryParams.map(param => ({
      ...param,
      id: generateId('param')
    })),
    headers: request.headers.map(header => ({
      ...header,
      id: generateId('header')
    }))
  };
};

/**
 * Generates cURL command from API request
 * @param request - The API request to convert
 * @param environmentVariables - Optional environment variables for substitution
 * @returns cURL command string
 */
export const generateCurlCommand = (
  request: ApiRequest,
  environmentVariables: KeyValuePair[] = []
): string => {
  const parts: string[] = ['curl'];

  // Add method (if not GET)
  if (request.method !== 'GET') {
    parts.push(`-X ${request.method}`);
  }

  // Substitute environment variables in URL
  let url = request.url;
  environmentVariables.forEach(envVar => {
    if (envVar.enabled && envVar.key && envVar.value) {
      const regex = new RegExp(`{{${envVar.key}}}`, 'g');
      url = url.replace(regex, envVar.value);
    }
  });

  // Add query parameters to URL
  const enabledParams = request.queryParams.filter(p => p.enabled && p.key);
  if (enabledParams.length > 0) {
    const queryString = enabledParams
      .map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join('&');
    url += (url.includes('?') ? '&' : '?') + queryString;
  }

  // Add headers
  const enabledHeaders = request.headers.filter(h => h.enabled && h.key);
  enabledHeaders.forEach(header => {
    let headerValue = header.value;
    // Substitute environment variables
    environmentVariables.forEach(envVar => {
      if (envVar.enabled && envVar.key && envVar.value) {
        const regex = new RegExp(`{{${envVar.key}}}`, 'g');
        headerValue = headerValue.replace(regex, envVar.value);
      }
    });
    parts.push(`-H "${header.key}: ${headerValue.replace(/"/g, '\\"')}"`);
  });

  // Add body for methods that support it
  if (request.bodyType !== 'none' && request.body &&
      !['GET', 'HEAD'].includes(request.method)) {

    let bodyContent = request.body;

    // Substitute environment variables in body
    environmentVariables.forEach(envVar => {
      if (envVar.enabled && envVar.key && envVar.value) {
        const regex = new RegExp(`{{${envVar.key}}}`, 'g');
        bodyContent = bodyContent.replace(regex, envVar.value);
      }
    });

    // Format body based on type
    if (request.bodyType === 'json') {
      // Minify JSON to single line for cURL
      try {
        const minified = JSON.stringify(JSON.parse(bodyContent));
        parts.push(`-d '${minified.replace(/'/g, "'\\''")}'`);
      } catch {
        // If invalid JSON, use as-is
        parts.push(`-d '${bodyContent.replace(/'/g, "'\\''")}'`);
      }
    } else {
      parts.push(`-d '${bodyContent.replace(/'/g, "'\\''")}'`);
    }
  }

  // Add URL (quoted)
  parts.push(`"${url}"`);

  return parts.join(' \\\n  ');
};

/**
 * Copies text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when copy is complete
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback for non-secure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } finally {
      textArea.remove();
    }
  }
};

/**
 * Auto-generates request name from URL
 * @param url - The URL to generate name from
 * @returns Generated request name
 */
export const generateRequestName = (url: string): string => {
  if (!url || !url.trim()) return 'New Request';

  try {
    const urlObject = new URL(url);
    const pathname = urlObject.pathname;

    // Remove leading/trailing slashes and take last segment
    const segments = pathname.split('/').filter(s => s);
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      // Convert to title case and replace special chars
      return lastSegment
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // If no pathname, use hostname
    return urlObject.hostname
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

  } catch {
    // If URL is invalid, return default
    return 'New Request';
  }
};
