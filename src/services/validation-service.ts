/**
 * Validation and Sanitization Service
 * Provides utilities for validating and sanitizing user input to prevent security issues
 */

/**
 * Sanitizes URL input to prevent XSS and injection attacks
 * @param url - The URL string to sanitize
 * @returns Sanitized URL string
 */
export const sanitizeUrl = (url: string): string => {
  if (!url) return '';

  // Remove any script tags
  let sanitized = url.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (except for data URLs in specific contexts)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Remove vbscript: protocol
  sanitized = sanitized.replace(/vbscript:/gi, '');

  // Remove any on* event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');

  return sanitized.trim();
};

/**
 * Validates URL format
 * @param url - The URL string to validate
 * @returns True if URL is valid, false otherwise
 */
export const validateUrl = (url: string): boolean => {
  if (!url || !url.trim()) return false;

  try {
    const urlObject = new URL(url);
    // Only allow http and https protocols
    return urlObject.protocol === 'http:' || urlObject.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Sanitizes header value to prevent header injection attacks
 * @param value - The header value to sanitize
 * @returns Sanitized header value
 */
export const sanitizeHeaderValue = (value: string): string => {
  if (!value) return '';

  // Remove newlines and carriage returns (prevents header injection)
  let sanitized = value.replace(/[\r\n]/g, '');

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  return sanitized.trim();
};

/**
 * Sanitizes header key to ensure it's a valid HTTP header name
 * @param key - The header key to sanitize
 * @returns Sanitized header key
 */
export const sanitizeHeaderKey = (key: string): string => {
  if (!key) return '';

  // Remove invalid characters (only allow alphanumeric, hyphens, and underscores)
  let sanitized = key.replace(/[^a-zA-Z0-9\-_]/g, '');

  return sanitized.trim();
};

/**
 * Validates JSON string format
 * @param json - The JSON string to validate
 * @returns Object containing validation result and optional error message
 */
export const validateJSON = (json: string): {
  isValid: boolean;
  error?: string;
  lineNumber?: number;
} => {
  if (!json || !json.trim()) {
    return { isValid: true }; // Empty is considered valid
  }

  try {
    JSON.parse(json);
    return { isValid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Try to extract line number from error message
      const match = error.message.match(/position (\d+)/);
      const position = match ? parseInt(match[1], 10) : undefined;

      let lineNumber: number | undefined;
      if (position !== undefined) {
        lineNumber = json.substring(0, position).split('\n').length;
      }

      return {
        isValid: false,
        error: error.message,
        lineNumber
      };
    }

    return {
      isValid: false,
      error: 'Invalid JSON format'
    };
  }
};

/**
 * Formats JSON string with proper indentation
 * @param json - The JSON string to format
 * @param spaces - Number of spaces for indentation (default: 2)
 * @returns Formatted JSON string or original if invalid
 */
export const formatJSON = (json: string, spaces: number = 2): string => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed, null, spaces);
  } catch {
    return json; // Return original if invalid
  }
};

/**
 * Validates HTTP method
 * @param method - The HTTP method to validate
 * @returns True if method is valid, false otherwise
 */
export const validateHttpMethod = (method: string): boolean => {
  const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
  return validMethods.includes(method.toUpperCase());
};

/**
 * Sanitizes request name/title
 * @param name - The name to sanitize
 * @returns Sanitized name
 */
export const sanitizeRequestName = (name: string): string => {
  if (!name) return '';

  // Remove HTML tags
  let sanitized = name.replace(/<[^>]*>/g, '');

  // Remove script content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Limit length
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 200);
  }

  return sanitized.trim();
};

/**
 * Validates and sanitizes query parameter key
 * @param key - The query parameter key
 * @returns Sanitized key
 */
export const sanitizeQueryParamKey = (key: string): string => {
  if (!key) return '';

  // URL encode special characters
  return encodeURIComponent(key.trim());
};

/**
 * Validates and sanitizes query parameter value
 * @param value - The query parameter value
 * @returns Sanitized value
 */
export const sanitizeQueryParamValue = (value: string): string => {
  if (!value) return '';

  // URL encode special characters
  return encodeURIComponent(value.trim());
};

/**
 * Checks if a string contains potential XSS patterns
 * @param input - The input string to check
 * @returns True if suspicious patterns are found
 */
export const containsXSSPatterns = (input: string): boolean => {
  if (!input) return false;

  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<embed/i,
    /<object/i,
    /vbscript:/i,
    /data:text\/html/i
  ];

  return xssPatterns.some(pattern => pattern.test(input));
};

/**
 * Validates content type header
 * @param contentType - The content type to validate
 * @returns True if valid content type
 */
export const validateContentType = (contentType: string): boolean => {
  if (!contentType) return false;

  const validPatterns = [
    /^application\/json/,
    /^application\/xml/,
    /^application\/x-www-form-urlencoded/,
    /^multipart\/form-data/,
    /^text\//,
    /^application\/octet-stream/
  ];

  return validPatterns.some(pattern => pattern.test(contentType.toLowerCase()));
};

/**
 * Sanitizes environment variable key
 * @param key - The variable key to sanitize
 * @returns Sanitized key
 */
export const sanitizeVariableKey = (key: string): string => {
  if (!key) return '';

  // Allow only alphanumeric, underscores, and hyphens
  let sanitized = key.replace(/[^a-zA-Z0-9_-]/g, '');

  // Ensure it doesn't start with a number
  if (/^\d/.test(sanitized)) {
    sanitized = '_' + sanitized;
  }

  return sanitized.trim();
};

/**
 * Checks if input exceeds safe length limits
 * @param input - The input to check
 * @param maxLength - Maximum allowed length (default: 10000)
 * @returns True if within limits
 */
export const isWithinSafeLength = (input: string, maxLength: number = 10000): boolean => {
  return input.length <= maxLength;
};
