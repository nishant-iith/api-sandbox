/**
 * Import Service
 * Handles importing application data from JSON files with validation
 */

import { CollectionItem, Environment, RequestHistoryItem } from '@/lib/types';
import { ExportData } from './export-service';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates the structure of imported data
 * @param data - The data object to validate
 * @returns Validation result with any errors found
 */
export const validateImportData = (data: any): ValidationResult => {
  const errors: string[] = [];

  // Check if data exists
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format');
    return { isValid: false, errors };
  }

  // Check version field
  if (!data.version) {
    errors.push('Missing version field');
  }

  // Check exportDate field
  if (!data.exportDate) {
    errors.push('Missing exportDate field');
  }

  // Validate collections if present
  if (data.collections !== undefined) {
    if (!Array.isArray(data.collections)) {
      errors.push('Collections must be an array');
    } else {
      data.collections.forEach((collection: any, index: number) => {
        if (!collection.id) errors.push(`Collection ${index} missing id`);
        if (!collection.name) errors.push(`Collection ${index} missing name`);
        if (!collection.type) errors.push(`Collection ${index} missing type`);
      });
    }
  }

  // Validate environments if present
  if (data.environments !== undefined) {
    if (!Array.isArray(data.environments)) {
      errors.push('Environments must be an array');
    } else {
      data.environments.forEach((env: any, index: number) => {
        if (!env.id) errors.push(`Environment ${index} missing id`);
        if (!env.name) errors.push(`Environment ${index} missing name`);
        if (!env.variables || !Array.isArray(env.variables)) {
          errors.push(`Environment ${index} missing or invalid variables array`);
        }
      });
    }
  }

  // Validate history if present
  if (data.history !== undefined) {
    if (!Array.isArray(data.history)) {
      errors.push('History must be an array');
    } else {
      data.history.forEach((item: any, index: number) => {
        if (!item.id) errors.push(`History item ${index} missing id`);
        if (!item.request) errors.push(`History item ${index} missing request`);
        if (!item.response) errors.push(`History item ${index} missing response`);
        if (!item.timestamp) errors.push(`History item ${index} missing timestamp`);
      });
    }
  }

  // Check if at least one data type is present
  if (!data.collections && !data.environments && !data.history) {
    errors.push('No data to import (collections, environments, or history)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Imports data from a JSON file
 * @param file - The file to import
 * @returns Promise resolving to validated import data
 */
export const importFromFile = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    // Check file type
    if (!file.name.endsWith('.json')) {
      reject(new Error('File must be a JSON file'));
      return;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      reject(new Error('File size exceeds 10MB limit'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        // Validate the data structure
        const validation = validateImportData(data);

        if (!validation.isValid) {
          reject(new Error(`Validation failed: ${validation.errors.join(', ')}`));
          return;
        }

        resolve(data as ExportData);
      } catch (error) {
        if (error instanceof SyntaxError) {
          reject(new Error('Invalid JSON format in file'));
        } else {
          reject(error);
        }
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

/**
 * Merges imported collections with existing ones
 * @param existing - Existing collections
 * @param imported - Imported collections
 * @param mode - 'replace' or 'merge'
 * @returns Merged collections
 */
export const mergeCollections = (
  existing: CollectionItem[],
  imported: CollectionItem[],
  mode: 'replace' | 'merge' = 'merge'
): CollectionItem[] => {
  if (mode === 'replace') {
    return imported;
  }

  // Merge mode: add imported collections, skip duplicates by ID
  const existingIds = new Set(existing.map(c => c.id));
  const newCollections = imported.filter(c => !existingIds.has(c.id));

  return [...existing, ...newCollections];
};

/**
 * Merges imported environments with existing ones
 * @param existing - Existing environments
 * @param imported - Imported environments
 * @param mode - 'replace' or 'merge'
 * @returns Merged environments
 */
export const mergeEnvironments = (
  existing: Environment[],
  imported: Environment[],
  mode: 'replace' | 'merge' = 'merge'
): Environment[] => {
  if (mode === 'replace') {
    return imported;
  }

  // Merge mode: add imported environments, skip duplicates by ID
  const existingIds = new Set(existing.map(e => e.id));
  const newEnvironments = imported.filter(e => !existingIds.has(e.id));

  return [...existing, ...newEnvironments];
};

/**
 * Merges imported history with existing history
 * @param existing - Existing history
 * @param imported - Imported history
 * @param maxItems - Maximum number of history items to keep
 * @returns Merged history
 */
export const mergeHistory = (
  existing: RequestHistoryItem[],
  imported: RequestHistoryItem[],
  maxItems: number = 100
): RequestHistoryItem[] => {
  // Combine and sort by timestamp (newest first)
  const combined = [...existing, ...imported];
  const sorted = combined.sort((a, b) => b.timestamp - a.timestamp);

  // Remove duplicates by ID and limit to maxItems
  const seen = new Set<string>();
  const unique = sorted.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return unique.slice(0, maxItems);
};
