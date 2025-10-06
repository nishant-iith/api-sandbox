/**
 * Export Dialog Component
 * Provides UI for exporting collections, environments, history, or all data
 */

"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Download, FileJson, Database, History, Package } from 'lucide-react';
import { exportCollections, exportEnvironments, exportHistory, exportAll } from '@/services/export-service';
import { CollectionItem, Environment, RequestHistoryItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ExportDialogProps {
  collections: CollectionItem[];
  environments: Environment[];
  history: RequestHistoryItem[];
  externalOpen?: boolean;
  onExternalOpenChange?: (open: boolean) => void;
}

/**
 * Dialog component for exporting application data
 * @param collections - Current collections
 * @param environments - Current environments
 * @param history - Request history
 * @param externalOpen - External control for dialog open state
 * @param onExternalOpenChange - Callback for external state changes
 */
export function ExportDialog({
  collections,
  environments,
  history,
  externalOpen,
  onExternalOpenChange
}: ExportDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { toast } = useToast();

  // Use external control if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = onExternalOpenChange || setInternalOpen;

  /**
   * Handles export action with success notification
   * @param exportFn - Export function to execute
   * @param description - Description for toast
   */
  const handleExport = (exportFn: () => void, description: string) => {
    try {
      exportFn();
      toast({
        title: 'Export Successful',
        description
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" title="Export Data">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Download your API Sandbox data as JSON files for backup or sharing
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Button
            onClick={() => handleExport(
              () => exportCollections(collections),
              `${collections.length} collection(s) exported`
            )}
            className="w-full justify-start"
            variant="outline"
            disabled={collections.length === 0}
          >
            <FileJson className="mr-2 h-4 w-4" />
            Export Collections ({collections.length})
          </Button>

          <Button
            onClick={() => handleExport(
              () => exportEnvironments(environments),
              `${environments.length} environment(s) exported`
            )}
            className="w-full justify-start"
            variant="outline"
            disabled={environments.length === 0}
          >
            <Database className="mr-2 h-4 w-4" />
            Export Environments ({environments.length})
          </Button>

          <Button
            onClick={() => handleExport(
              () => exportHistory(history),
              `${history.length} history item(s) exported`
            )}
            className="w-full justify-start"
            variant="outline"
            disabled={history.length === 0}
          >
            <History className="mr-2 h-4 w-4" />
            Export History ({history.length})
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button
            onClick={() => handleExport(
              () => exportAll(collections, environments, history),
              'All data exported successfully'
            )}
            className="w-full justify-start"
            variant="default"
            disabled={collections.length === 0 && environments.length === 0 && history.length === 0}
          >
            <Package className="mr-2 h-4 w-4" />
            Export Everything
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
