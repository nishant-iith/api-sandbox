/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI instead of crashing the entire app
 */

"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary class component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Update state when an error is caught
   * @param error - The error that was thrown
   */
  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Log error details for debugging
   * @param error - The error that was thrown
   * @param errorInfo - Information about the component stack
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for development
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);

    // Store error info in state
    this.setState({ errorInfo });

    // Log to localStorage for debugging (keep last 10 errors)
    try {
      const errorLog = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      const logs = JSON.parse(localStorage.getItem('error-logs') || '[]');
      logs.push(errorLog);

      // Keep only last 10 errors
      const recentLogs = logs.slice(-10);
      localStorage.setItem('error-logs', JSON.stringify(recentLogs));
    } catch (e) {
      // Fail silently if localStorage is not available
      console.error('Failed to log error to localStorage:', e);
    }
  }

  /**
   * Reset error boundary state
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  /**
   * Reload the entire application
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * Navigate to home page
   */
  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
              <CardDescription>
                The application encountered an unexpected error
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="rounded-md bg-destructive/10 p-4">
                <p className="font-mono text-sm text-destructive">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>

              <details className="rounded-md border p-4">
                <summary className="cursor-pointer font-medium text-sm mb-2">
                  Technical Details
                </summary>
                <div className="mt-2 space-y-2">
                  {this.state.error?.stack && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Error Stack:</p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Component Stack:</p>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>

              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">What you can do:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Try reloading the page</li>
                  <li>Check your browser console for more details</li>
                  <li>Export your data before reloading (if possible)</li>
                  <li>Clear your browser cache and try again</li>
                  <li>Report this issue on GitHub</li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button onClick={this.handleReset} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              <Button onClick={this.handleGoHome} variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
