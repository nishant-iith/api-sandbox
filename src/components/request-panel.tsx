
"use client";

import React, { useState } from 'react';
import { ApiRequest, HttpMethod } from '@/lib/types';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { KeyValueEditor } from './key-value-editor';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { Send, Loader2, Copy, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { METHOD_COLORS } from '@/lib/constants';
import { UrlInput } from './url-input';
import { JsonEditor } from './json-editor';
import { AuthEditor } from './auth-editor';

interface RequestPanelProps {
  request: ApiRequest;
  onUpdateRequest: (updatedFields: Partial<ApiRequest>) => void;
  onSend: () => void;
  loading: boolean;
  onDuplicate?: () => void;
  onCopyAsCurl?: () => void;
}

export const RequestPanel = React.memo(function RequestPanel({
  request,
  onUpdateRequest,
  onSend,
  loading,
  onDuplicate,
  onCopyAsCurl
}: RequestPanelProps) {
  const [isUrlValid, setIsUrlValid] = useState(true);

  const handleMethodChange = (method: HttpMethod) => {
    onUpdateRequest({ method });
  };

  const handleBodyTypeChange = (bodyType: 'none' | 'json' | 'form-urlencoded') => {
    onUpdateRequest({ bodyType });
  };

  /**
   * Gets CSS classes for HTTP method styling
   * @param method - HTTP method
   * @returns CSS class string with color and font weight
   */
  const getMethodClass = (method: HttpMethod): string => {
    const baseColor = METHOD_COLORS[method] || 'text-gray-500';
    return `${baseColor} font-bold`;
  };

  const isBodyDisabled = request.method === 'GET' || request.method === 'HEAD';

  return (
    <Card className="shadow-sm shrink-0">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row md:items-start gap-2 p-4 pb-0">
          <Select value={request.method} onValueChange={handleMethodChange}>
            <SelectTrigger className={cn(
              "w-full md:w-[130px] focus:ring-0 focus:ring-offset-0 font-mono text-sm h-10",
              getMethodClass(request.method)
            )}>
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GET" className={getMethodClass('GET')}>GET</SelectItem>
              <SelectItem value="POST" className={getMethodClass('POST')}>POST</SelectItem>
              <SelectItem value="PUT" className={getMethodClass('PUT')}>PUT</SelectItem>
              <SelectItem value="PATCH" className={getMethodClass('PATCH')}>PATCH</SelectItem>
              <SelectItem value="DELETE" className={getMethodClass('DELETE')}>DELETE</SelectItem>
              <SelectItem value="HEAD" className={getMethodClass('HEAD')}>HEAD</SelectItem>
              <SelectItem value="OPTIONS" className={getMethodClass('OPTIONS')}>OPTIONS</SelectItem>
            </SelectContent>
          </Select>
          <UrlInput
            value={request.url}
            onChange={(url) => onUpdateRequest({ url })}
            onValidationChange={setIsUrlValid}
            placeholder="https://api.example.com/data"
          />
          <Button
            onClick={onSend}
            disabled={loading || !isUrlValid || !request.url.trim()}
            className="w-full md:w-[100px] h-10"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Send
          </Button>
        </div>

        <div className="p-4 pt-0">
          {/* Action Buttons */}
          {(onDuplicate || onCopyAsCurl) && (
            <div className="flex items-center gap-2 mb-4">
              {onDuplicate && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onDuplicate}
                  className="text-xs h-8"
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Duplicate
                </Button>
              )}
              {onCopyAsCurl && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={onCopyAsCurl}
                  className="text-xs h-8"
                >
                  <Terminal className="h-3.5 w-3.5 mr-1.5" />
                  Copy as cURL
                </Button>
              )}
            </div>
          )}

          <Tabs defaultValue="params" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="params">Query Params</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="auth">Auth</TabsTrigger>
              <TabsTrigger value="body" disabled={isBodyDisabled}>Body</TabsTrigger>
            </TabsList>
            <TabsContent value="params" className="mt-4">
              <KeyValueEditor
                value={request.queryParams}
                onChange={v => onUpdateRequest({ queryParams: v })}
              />
            </TabsContent>
            <TabsContent value="headers" className="mt-4">
              <KeyValueEditor
                value={request.headers}
                onChange={v => onUpdateRequest({ headers: v })}
              />
            </TabsContent>
            <TabsContent value="auth" className="mt-4">
              <AuthEditor
                value={request.auth || { type: 'none' }}
                onChange={(auth) => onUpdateRequest({ auth })}
              />
            </TabsContent>
            <TabsContent value="body" className="mt-4">
              <div className="space-y-4">
                <Select value={request.bodyType} onValueChange={handleBodyTypeChange} disabled={isBodyDisabled}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Body Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="form-urlencoded">Form URL Encoded</SelectItem>
                  </SelectContent>
                </Select>
                {request.bodyType === 'json' && (
                  <JsonEditor
                    value={request.body}
                    onChange={(body) => onUpdateRequest({ body })}
                    placeholder='{ "key": "value" }'
                    disabled={isBodyDisabled}
                    minHeight="200px"
                  />
                )}
                {request.bodyType === 'form-urlencoded' && (
                   <Textarea
                    placeholder='{ "key1": "value1", "key2": "value2" }'
                    value={request.body}
                    onChange={e => onUpdateRequest({ body: e.target.value })}
                    className="font-code min-h-[200px]"
                    disabled={isBodyDisabled}
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
});
