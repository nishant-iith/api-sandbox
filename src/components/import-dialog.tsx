/**
 * Import Dialog Component
 * Provides UI for importing collections, environments, and history from JSON files
 */

"use client";

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Upload, FileJson, AlertCircle } from 'lucide-react';
import { importFromFile, mergeCollections, mergeEnvironments, mergeHistory } from '@/services/import-service';
import { ExportData } from '@/services/export-service';
import { CollectionItem, Environment, RequestHistoryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

interface ImportDialogProps {
  collections: CollectionItem[];
  environments: Environment[];
  history: RequestHistoryItem[];
  onImport: (data: {
    collections?: CollectionItem[];
    environments?: Environment[];
    history?: RequestHistoryItem[];
  }) => void;
}

/**
 * Dialog component for importing application data
 * @param collections - Current collections
 * @param environments - Current environments
 * @param history - Current history
 * @param onImport - Callback when import is successful
 */
export function ImportDialog({ collections, environments, history, onImport }: ImportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ExportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  /**
   * Handles file selection and validation
   * @param event - File input change event
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);
    setPreviewData(null);
    setIsLoading(true);

    try {
      const data = await importFromFile(file);
      setPreviewData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the import action
   */
  const handleImport = () => {
    if (!previewData) return;

    try {
      const importedData: {
        collections?: CollectionItem[];
        environments?: Environment[];
        history?: RequestHistoryItem[];
      } = {};

      // Merge or replace collections
      if (previewData.collections) {
        importedData.collections = mergeCollections(
          collections,
          previewData.collections,
          importMode
        );
      }

      // Merge or replace environments
      if (previewData.environments) {
        importedData.environments = mergeEnvironments(
          environments,
          previewData.environments,
          importMode
        );
      }

      // Merge history (always merge, never replace completely)
      if (previewData.history) {
        importedData.history = mergeHistory(history, previewData.history);
      }

      onImport(importedData);

      toast({
        title: 'Import Successful',
        description: `Data imported in ${importMode} mode`
      });

      // Reset and close
      handleClose();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    }
  };

  /**
   * Resets dialog state and closes
   */
  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    setPreviewData(null);
    setError(null);
    setImportMode('merge');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
      else setIsOpen(true);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="Import Data">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Import collections, environments, or history from a JSON file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Import Mode Selection */}
          <div className="space-y-2">
            <Label htmlFor="import-mode">Import Mode</Label>
            <Select value={importMode} onValueChange={(v) => setImportMode(v as 'merge' | 'replace')}>
              <SelectTrigger id="import-mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="merge">Merge (keep existing + add new)</SelectItem>
                <SelectItem value="replace">Replace (delete existing)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {importMode === 'merge'
                ? 'New items will be added, existing items kept'
                : 'All existing data will be replaced'}
            </p>
          </div>

          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="file-input">Select File</Label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                disabled={isLoading}
              >
                <FileJson className="mr-2 h-4 w-4" />
                {selectedFile ? selectedFile.name : 'Choose JSON file'}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          {previewData && (
            <Alert>
              <FileJson className="h-4 w-4" />
              <AlertTitle>Ready to Import</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside text-sm mt-2">
                  {previewData.collections && (
                    <li>{previewData.collections.length} collection(s)</li>
                  )}
                  {previewData.environments && (
                    <li>{previewData.environments.length} environment(s)</li>
                  )}
                  {previewData.history && (
                    <li>{previewData.history.length} history item(s)</li>
                  )}
                </ul>
                <p className="text-xs mt-2 text-muted-foreground">
                  Exported: {new Date(previewData.exportDate).toLocaleString()}
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!previewData || isLoading}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
