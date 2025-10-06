"use client";

import React from 'react';
import { AuthConfig } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Eye, EyeOff, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from './ui/alert';

interface AuthEditorProps {
  value: AuthConfig;
  onChange: (value: AuthConfig) => void;
}

/**
 * Authentication editor component
 * Supports Bearer, Basic Auth, API Key, and OAuth2 (placeholder)
 */
export const AuthEditor = React.memo(function AuthEditor({ value, onChange }: AuthEditorProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showToken, setShowToken] = React.useState(false);

  /**
   * Updates auth type and clears previous auth data
   */
  const handleTypeChange = (type: AuthConfig['type']) => {
    onChange({
      type,
      bearer: undefined,
      basic: undefined,
      apiKey: undefined,
      oauth2: undefined
    });
  };

  /**
   * Updates bearer token
   */
  const handleBearerChange = (token: string) => {
    onChange({
      ...value,
      bearer: { token }
    });
  };

  /**
   * Updates basic auth credentials
   */
  const handleBasicChange = (field: 'username' | 'password', fieldValue: string) => {
    onChange({
      ...value,
      basic: {
        username: value.basic?.username || '',
        password: value.basic?.password || '',
        [field]: fieldValue
      }
    });
  };

  /**
   * Updates API key configuration
   */
  const handleApiKeyChange = (field: 'key' | 'value' | 'addTo', fieldValue: string) => {
    onChange({
      ...value,
      apiKey: {
        key: value.apiKey?.key || '',
        value: value.apiKey?.value || '',
        addTo: value.apiKey?.addTo || 'header',
        [field]: fieldValue
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Auth Type Selector */}
      <div className="space-y-2">
        <Label htmlFor="auth-type">Authentication Type</Label>
        <Select value={value.type} onValueChange={handleTypeChange}>
          <SelectTrigger id="auth-type">
            <SelectValue placeholder="Select auth type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Auth</SelectItem>
            <SelectItem value="bearer">Bearer Token</SelectItem>
            <SelectItem value="basic">Basic Auth</SelectItem>
            <SelectItem value="api-key">API Key</SelectItem>
            <SelectItem value="oauth2" disabled>OAuth 2.0 (Coming Soon)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* No Auth */}
      {value.type === 'none' && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No authentication will be added to this request.
          </AlertDescription>
        </Alert>
      )}

      {/* Bearer Token */}
      {value.type === 'bearer' && (
        <div className="space-y-2">
          <Label htmlFor="bearer-token">Token</Label>
          <div className="relative">
            <Input
              id="bearer-token"
              type={showToken ? 'text' : 'password'}
              placeholder="Enter bearer token"
              value={value.bearer?.token || ''}
              onChange={(e) => handleBearerChange(e.target.value)}
              className="font-mono pr-10"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
            >
              {showToken ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Will be sent as: <code className="text-xs">Authorization: Bearer {'{token}'}</code>
          </p>
        </div>
      )}

      {/* Basic Auth */}
      {value.type === 'basic' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="basic-username">Username</Label>
            <Input
              id="basic-username"
              type="text"
              placeholder="Enter username"
              value={value.basic?.username || ''}
              onChange={(e) => handleBasicChange('username', e.target.value)}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="basic-password">Password</Label>
            <div className="relative">
              <Input
                id="basic-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={value.basic?.password || ''}
                onChange={(e) => handleBasicChange('password', e.target.value)}
                className="font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Will be sent as: <code className="text-xs">Authorization: Basic {'{base64(username:password)}'}</code>
          </p>
        </div>
      )}

      {/* API Key */}
      {value.type === 'api-key' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key-name">Key</Label>
            <Input
              id="api-key-name"
              type="text"
              placeholder="e.g., X-API-Key, api_key"
              value={value.apiKey?.key || ''}
              onChange={(e) => handleApiKeyChange('key', e.target.value)}
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key-value">Value</Label>
            <div className="relative">
              <Input
                id="api-key-value"
                type={showToken ? 'text' : 'password'}
                placeholder="Enter API key value"
                value={value.apiKey?.value || ''}
                onChange={(e) => handleApiKeyChange('value', e.target.value)}
                className="font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key-location">Add to</Label>
            <Select
              value={value.apiKey?.addTo || 'header'}
              onValueChange={(v) => handleApiKeyChange('addTo', v)}
            >
              <SelectTrigger id="api-key-location">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="header">Header</SelectItem>
                <SelectItem value="query">Query Params</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            {value.apiKey?.addTo === 'header' ? (
              <>Will be sent as a header: <code className="text-xs">{value.apiKey?.key || 'Key'}: {'{value}'}</code></>
            ) : (
              <>Will be sent as query parameter: <code className="text-xs">?{value.apiKey?.key || 'key'}={'{value}'}</code></>
            )}
          </p>
        </div>
      )}

      {/* OAuth2 Placeholder */}
      {value.type === 'oauth2' && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            OAuth 2.0 support is coming soon. For now, you can use Bearer Token with your access token.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
});
