"use client";

import React, { useState, useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, Wand2 } from 'lucide-react';
import { validateJSON, formatJSON } from '@/services/validation-service';
import { cn } from '@/lib/utils';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minHeight?: string;
}

/**
 * JSON editor component with real-time validation and formatting
 * Shows syntax errors with line numbers and provides format button
 */
export const JsonEditor = React.memo(function JsonEditor({
  value,
  onChange,
  placeholder = '{ "key": "value" }',
  disabled = false,
  minHeight = '200px'
}: JsonEditorProps) {
  const [validation, setValidation] = useState<{
    isValid: boolean;
    error?: string;
    lineNumber?: number;
  }>({ isValid: true });
  const [showValidation, setShowValidation] = useState(false);

  // Validate JSON on change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = validateJSON(value);
      setValidation(result);
      setShowValidation(!result.isValid && value.trim().length > 0);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [value]);

  /**
   * Formats the JSON with proper indentation
   */
  const handleFormat = () => {
    const formatted = formatJSON(value, 2);
    if (formatted !== value) {
      onChange(formatted);
    }
  };

  /**
   * Gets border color based on validation state
   */
  const getBorderClass = (): string => {
    if (!value.trim() || !showValidation) return '';
    return validation.isValid
      ? 'border-green-500 dark:border-green-600 focus-visible:ring-green-500'
      : 'border-red-500 dark:border-red-600 focus-visible:ring-red-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {value.trim() && showValidation && (
            <>
              {validation.isValid ? (
                <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Valid JSON</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Invalid JSON</span>
                </div>
              )}
            </>
          )}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleFormat}
          disabled={disabled || !value.trim() || !validation.isValid}
          className="h-7 text-xs"
        >
          <Wand2 className="h-3 w-3 mr-1.5" />
          Format JSON
        </Button>
      </div>

      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "font-mono text-sm",
          getBorderClass()
        )}
        style={{ minHeight }}
      />

      {/* Error message with line number */}
      {showValidation && !validation.isValid && validation.error && (
        <div className="flex items-start gap-2 text-xs px-3 py-2 rounded-md bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Syntax Error</p>
            <p className="mt-1 text-red-600 dark:text-red-400">{validation.error}</p>
            {validation.lineNumber && (
              <p className="mt-1 text-red-600 dark:text-red-400">
                at line {validation.lineNumber}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
