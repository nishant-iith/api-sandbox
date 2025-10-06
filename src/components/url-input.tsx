"use client";

import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { validateUrlAdvanced, UrlValidationResult } from '@/services/validation-service';
import { cn } from '@/lib/utils';

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  className?: string;
  placeholder?: string;
}

/**
 * URL input component with real-time validation and visual feedback
 * Shows validation state with colors and provides suggestions for common mistakes
 */
export const UrlInput = React.memo(function UrlInput({
  value,
  onChange,
  onValidationChange,
  className,
  placeholder = "https://api.example.com/data"
}: UrlInputProps) {
  const [validation, setValidation] = useState<UrlValidationResult>({
    isValid: false,
    state: 'empty'
  });
  const [showSuggestion, setShowSuggestion] = useState(false);

  // Validate URL on change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = validateUrlAdvanced(value);
      setValidation(result);
      setShowSuggestion(!!result.suggestion);
      onValidationChange?.(result.isValid);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [value, onValidationChange]);

  /**
   * Applies suggested URL correction
   */
  const applySuggestion = () => {
    if (validation.suggestion) {
      onChange(validation.suggestion);
      setShowSuggestion(false);
    }
  };

  /**
   * Gets border color classes based on validation state
   */
  const getBorderClass = (): string => {
    if (!value.trim()) return '';

    switch (validation.state) {
      case 'valid':
        return 'border-green-500 dark:border-green-600 focus-visible:ring-green-500';
      case 'invalid':
        return 'border-red-500 dark:border-red-600 focus-visible:ring-red-500';
      case 'warning':
        return 'border-yellow-500 dark:border-yellow-600 focus-visible:ring-yellow-500';
      default:
        return '';
    }
  };

  /**
   * Gets validation icon based on state
   */
  const getValidationIcon = () => {
    if (!value.trim()) return null;

    switch (validation.state) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />;
      case 'invalid':
        return <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "font-mono text-sm pr-10",
              getBorderClass(),
              className
            )}
          />
          {value.trim() && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getValidationIcon()}
            </div>
          )}
        </div>
      </div>

      {/* Validation message and suggestion */}
      {value.trim() && validation.message && (
        <div className={cn(
          "flex items-start gap-2 text-xs px-3 py-2 rounded-md",
          validation.state === 'valid' && "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300",
          validation.state === 'invalid' && "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300",
          validation.state === 'warning' && "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300"
        )}>
          <div className="mt-0.5">
            {validation.state === 'valid' && <CheckCircle className="h-3.5 w-3.5" />}
            {validation.state === 'invalid' && <AlertCircle className="h-3.5 w-3.5" />}
            {validation.state === 'warning' && <AlertTriangle className="h-3.5 w-3.5" />}
          </div>
          <div className="flex-1">
            <p className="font-medium">{validation.message}</p>
            {showSuggestion && validation.suggestion && (
              <div className="mt-2 flex items-center gap-2">
                <Lightbulb className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="flex-1 font-mono break-all">{validation.suggestion}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={applySuggestion}
                  className="h-6 text-xs"
                >
                  Apply
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
