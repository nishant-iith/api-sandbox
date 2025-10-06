"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { KeyboardShortcut, formatShortcut } from '@/hooks/use-keyboard-shortcuts';
import { Keyboard } from 'lucide-react';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts: KeyboardShortcut[];
}

/**
 * Dialog component that displays all available keyboard shortcuts
 */
export const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({
  open,
  onOpenChange,
  shortcuts
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to speed up your workflow
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 gap-2">
            {shortcuts.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent"
              >
                <span className="text-sm text-muted-foreground">
                  {shortcut.description}
                </span>
                <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
                  {formatShortcut(shortcut)}
                </kbd>
              </div>
            ))}
          </div>

          {shortcuts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No keyboard shortcuts available
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t text-xs text-muted-foreground">
          <p>
            💡 Tip: Most shortcuts work globally, but some are disabled when typing in input fields.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
