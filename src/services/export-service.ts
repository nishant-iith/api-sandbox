/**
 * Export Service
 * Handles exporting application data (collections, environments, history) to JSON files
 */

import { CollectionItem, Environment, RequestHistoryItem } from '@/lib/types';

/**
 * Structure of exported data
 */
export interface ExportData {
  version: string;
  exportDate: string;
  collections?: CollectionItem[];
  environments?: Environment[];
  history?: RequestHistoryItem[];
}

/**
 * Exports collections to JSON file
 * @param collections - Array of collections to export
 */
export const exportCollections = (collections: CollectionItem[]): void => {
  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    collections
  };

  downloadJSON(data, `api-sandbox-collections-${getDateString()}.json`);
};

/**
 * Exports environments to JSON file
 * @param environments - Array of environments to export
 */
export const exportEnvironments = (environments: Environment[]): void => {
  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    environments
  };

  downloadJSON(data, `api-sandbox-environments-${getDateString()}.json`);
};

/**
 * Exports request history to JSON file
 * @param history - Array of history items to export
 */
export const exportHistory = (history: RequestHistoryItem[]): void => {
  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    history
  };

  downloadJSON(data, `api-sandbox-history-${getDateString()}.json`);
};

/**
 * Exports all data (collections, environments, history) to single JSON file
 * @param collections - Collections array
 * @param environments - Environments array
 * @param history - History array
 */
export const exportAll = (
  collections: CollectionItem[],
  environments: Environment[],
  history: RequestHistoryItem[]
): void => {
  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    collections,
    environments,
    history
  };

  downloadJSON(data, `api-sandbox-backup-${getDateString()}.json`);
};

/**
 * Downloads data as JSON file
 * @param data - Data object to export
 * @param filename - Name of the file to download
 */
const downloadJSON = (data: ExportData, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
};

/**
 * Gets current date as string (YYYY-MM-DD) for filename
 * @returns Date string
 */
const getDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
