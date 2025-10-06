/**
 * ID Generator Utility
 * Centralized ID generation to avoid duplication across components
 */

/**
 * Generates a unique ID with optional prefix
 * Uses timestamp + random string for better uniqueness than Math.random() alone
 *
 * @param prefix - Optional prefix for the ID (e.g., 'req', 'coll', 'env')
 * @returns Unique identifier string in format: {prefix}_{timestamp}_{random}
 *
 * @example
 * generateId() // "id_1704567890123_abc123"
 * generateId('req') // "req_1704567890123_xyz789"
 */
export const generateId = (prefix: string = 'id'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${prefix}_${timestamp}_${random}`;
};

/**
 * Generates a UUID-like ID (more unique but longer)
 * Use this when you need guaranteed uniqueness
 *
 * @returns UUID-like string
 *
 * @example
 * generateUniqueId() // "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6"
 */
export const generateUniqueId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Checks if a string is a valid ID format
 *
 * @param id - ID string to validate
 * @returns True if ID is valid format
 *
 * @example
 * isValidId('req_1704567890123_abc123') // true
 * isValidId('invalid') // false
 */
export const isValidId = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;

  // Check for format: prefix_timestamp_random
  const parts = id.split('_');
  if (parts.length !== 3) return false;

  const [prefix, timestamp, random] = parts;

  // Validate each part
  if (!prefix || prefix.length === 0) return false;
  if (!timestamp || isNaN(Number(timestamp))) return false;
  if (!random || random.length === 0) return false;

  return true;
};

/**
 * Extracts prefix from an ID
 *
 * @param id - ID string
 * @returns Prefix or null if invalid
 *
 * @example
 * getIdPrefix('req_1704567890123_abc123') // "req"
 */
export const getIdPrefix = (id: string): string | null => {
  if (!isValidId(id)) return null;
  return id.split('_')[0];
};

/**
 * Generates a batch of unique IDs
 * Useful when creating multiple items at once
 *
 * @param count - Number of IDs to generate
 * @param prefix - Optional prefix for all IDs
 * @returns Array of unique IDs
 *
 * @example
 * generateBatchIds(3, 'item') // ['item_...', 'item_...', 'item_...']
 */
export const generateBatchIds = (count: number, prefix: string = 'id'): string[] => {
  const ids: string[] = [];
  for (let i = 0; i < count; i++) {
    ids.push(generateId(prefix));
    // Small delay to ensure different timestamps
    if (i < count - 1) {
      const start = Date.now();
      while (Date.now() === start) {
        // Wait for next millisecond
      }
    }
  }
  return ids;
};
