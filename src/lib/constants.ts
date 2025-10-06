/**
 * Application Constants
 * Centralized constants to avoid magic strings and improve maintainability
 */

/**
 * LocalStorage keys used throughout the application
 */
export const STORAGE_KEYS = {
  COLLECTIONS: 'api-sandbox-collections',
  ENVIRONMENTS: 'api-sandbox-environments',
  HISTORY: 'api-sandbox-history',
  ACTIVE_ENVIRONMENT: 'api-sandbox-active-env',
  ERROR_LOGS: 'error-logs',
  THEME: 'theme',
} as const;

/**
 * HTTP Methods supported by the application
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
} as const;

/**
 * Request body types
 */
export const BODY_TYPES = {
  NONE: 'none',
  JSON: 'json',
  FORM_URLENCODED: 'form-urlencoded',
  FORM_DATA: 'form-data',
  RAW: 'raw',
  BINARY: 'binary',
} as const;

/**
 * HTTP status code ranges
 */
export const STATUS_CODES = {
  SUCCESS_MIN: 200,
  SUCCESS_MAX: 299,
  REDIRECT_MIN: 300,
  REDIRECT_MAX: 399,
  CLIENT_ERROR_MIN: 400,
  CLIENT_ERROR_MAX: 499,
  SERVER_ERROR_MIN: 500,
  SERVER_ERROR_MAX: 599,
} as const;

/**
 * Common HTTP headers
 */
export const COMMON_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
  USER_AGENT: 'User-Agent',
  CACHE_CONTROL: 'Cache-Control',
} as const;

/**
 * Content type values
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  FORM_DATA: 'multipart/form-data',
  XML: 'application/xml',
  HTML: 'text/html',
  TEXT: 'text/plain',
  BINARY: 'application/octet-stream',
} as const;

/**
 * Default values for new items
 */
export const DEFAULTS = {
  REQUEST_NAME: 'Untitled Request',
  COLLECTION_NAME: 'New Collection',
  ENVIRONMENT_NAME: 'New Environment',
  PLACEHOLDER_URL: 'https://jsonplaceholder.typicode.com/todos/1',
  MAX_HISTORY_ITEMS: 50,
  MAX_ERROR_LOGS: 10,
  DEBOUNCE_DELAY: 500, // milliseconds
} as const;

/**
 * Validation limits
 */
export const LIMITS = {
  MAX_URL_LENGTH: 2048,
  MAX_HEADER_LENGTH: 8192,
  MAX_BODY_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_REQUEST_NAME_LENGTH: 200,
  MAX_COLLECTION_NAME_LENGTH: 100,
  MAX_ENVIRONMENT_NAME_LENGTH: 100,
  MAX_VARIABLE_KEY_LENGTH: 100,
} as const;

/**
 * Timeouts and intervals
 */
export const TIMEOUTS = {
  DEFAULT_REQUEST_TIMEOUT: 30000, // 30 seconds
  TOAST_DURATION: 3000, // 3 seconds
  DEBOUNCE_SAVE: 500, // 500ms
  ERROR_DISPLAY: 5000, // 5 seconds
} as const;

/**
 * UI breakpoints (matching Tailwind defaults)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Collection and environment item types
 */
export const ITEM_TYPES = {
  FOLDER: 'folder',
  REQUEST: 'request',
} as const;

/**
 * Export/Import version
 */
export const EXPORT_VERSION = '1.0.0';

/**
 * Feature flags (for future use)
 */
export const FEATURES = {
  ENABLE_WEBSOCKET: false,
  ENABLE_SSE: false,
  ENABLE_GRAPHQL: false,
  ENABLE_MOCK_SERVER: false,
  ENABLE_ANALYTICS: false,
} as const;

/**
 * API response format preferences
 */
export const RESPONSE_FORMATS = {
  TREE: 'tree',
  RAW: 'raw',
  PREVIEW: 'preview',
} as const;

/**
 * Theme modes
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

/**
 * Regex patterns for validation
 */
export const PATTERNS = {
  URL: /^https?:\/\/.+/i,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  VARIABLE: /\{\{([^}]+)\}\}/g,
  HEADER_KEY: /^[a-zA-Z0-9\-_]+$/,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  INVALID_URL: 'Invalid URL format',
  INVALID_JSON: 'Invalid JSON format',
  NETWORK_ERROR: 'Network error occurred',
  CORS_ERROR: 'CORS policy blocked the request',
  TIMEOUT_ERROR: 'Request timeout',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  IMPORT_FAILED: 'Failed to import data',
  EXPORT_FAILED: 'Failed to export data',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  REQUEST_SENT: 'Request sent successfully',
  COLLECTION_SAVED: 'Collection saved',
  ENVIRONMENT_SAVED: 'Environment saved',
  DATA_EXPORTED: 'Data exported successfully',
  DATA_IMPORTED: 'Data imported successfully',
} as const;

/**
 * Method colors for UI (Tailwind classes)
 */
export const METHOD_COLORS = {
  GET: 'text-green-600 dark:text-green-400',
  POST: 'text-orange-600 dark:text-orange-400',
  PUT: 'text-blue-600 dark:text-blue-400',
  PATCH: 'text-purple-600 dark:text-purple-400',
  DELETE: 'text-red-600 dark:text-red-400',
  HEAD: 'text-gray-600 dark:text-gray-400',
  OPTIONS: 'text-pink-600 dark:text-pink-400',
} as const;

/**
 * Status code colors for UI
 */
export const STATUS_COLORS = {
  SUCCESS: 'text-green-500',
  REDIRECT: 'text-blue-500',
  CLIENT_ERROR: 'text-yellow-500',
  SERVER_ERROR: 'text-red-500',
  ERROR: 'text-gray-500',
} as const;
