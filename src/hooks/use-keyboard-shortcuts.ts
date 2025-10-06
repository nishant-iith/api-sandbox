/**
 * Keyboard Shortcuts Hook
 * Provides keyboard shortcut functionality for common actions
 */

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlOrCmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

/**
 * Hook to register keyboard shortcuts
 * @param options - Configuration object with shortcuts and enabled state
 */
export const useKeyboardShortcuts = ({
  shortcuts,
  enabled = true
}: UseKeyboardShortcutsOptions) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input/textarea
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Allow Ctrl/Cmd shortcuts even in input fields for common actions
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Check if this is a navigation shortcut (not allowed in input fields)
      const isNavigationShortcut = !isCtrlOrCmd;

      if (isInputField && isNavigationShortcut) return;

      for (const shortcut of shortcuts) {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrlOrCmd ? isCtrlOrCmd : !isCtrlOrCmd;
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

/**
 * Gets the platform-specific modifier key label
 * @returns 'Cmd' on Mac, 'Ctrl' on other platforms
 */
export const getModifierKey = (): string => {
  if (typeof window === 'undefined') return 'Ctrl';
  return navigator.platform.toLowerCase().includes('mac') ? 'Cmd' : 'Ctrl';
};

/**
 * Formats a keyboard shortcut for display
 * @param shortcut - The shortcut configuration
 * @returns Formatted shortcut string (e.g., "Ctrl+S" or "Cmd+Enter")
 */
export const formatShortcut = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = [];

  if (shortcut.ctrlOrCmd) {
    parts.push(getModifierKey());
  }
  if (shortcut.shift) {
    parts.push('Shift');
  }
  if (shortcut.alt) {
    parts.push('Alt');
  }

  // Capitalize key name for display
  const keyName = shortcut.key.length === 1
    ? shortcut.key.toUpperCase()
    : shortcut.key.charAt(0).toUpperCase() + shortcut.key.slice(1);

  parts.push(keyName);

  return parts.join('+');
};
