
"use client";

import React, { useState } from 'react';
import { ApiResponse } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableRow } from './ui/table';
import { Clock, HardDrive, Server, Copy, Check } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';
import { JsonViewer } from './json-viewer';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface ResponsePanelProps {
  response: ApiResponse | null;
  loading: boolean;
}

export const ResponsePanel = React.memo(function ResponsePanel({ response, loading }: ResponsePanelProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const isJsonResponse = response?.headers['content-type']?.includes('application/json');

  const prettyRaw = isJsonResponse ? JSON.stringify(response.data, null, 2) : response?.raw ?? '';

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(prettyRaw);
    setCopied(true);
    toast({ title: 'Response body copied!' });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Card className="h-full shadow-sm flex-1">
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-8 w-1/4" />
            </div>
            <Skeleton className="h-6 w-[120px]" />
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!response) {
    return (
      <Card className="h-full flex items-center justify-center flex-1 border-dashed shadow-sm">
        <div className="text-center text-muted-foreground">
          <Server className="mx-auto h-12 w-12" />
          <p className="mt-4 font-medium">Send a request to see the response</p>
        </div>
      </Card>
    );
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-500 text-green-500';
    if (status >= 300 && status < 400) return 'bg-blue-500 text-blue-500';
    if (status >= 400 && status < 500) return 'bg-yellow-500 text-yellow-500';
    if (status >= 500) return 'bg-red-500 text-red-500';
    return 'bg-gray-500 text-gray-500';
  };

  return (
    <Card className="h-full flex flex-col shadow-sm flex-1 min-h-0">
      <CardHeader className="shrink-0">
        <div className="flex justify-between items-center">
          <CardTitle>Response</CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <Badge variant="outline" className={`flex items-center gap-2 border-current ${getStatusColor(response.status).replace('bg-', 'text-')}`}>
              <span className={`h-2 w-2 rounded-full ${getStatusColor(response.status)}`}></span>
              Status: {response.status} {response.statusText}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Time: {response.time}ms
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" /> Size: {(response.size / 1024).toFixed(2)} KB
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <Tabs defaultValue="body" className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 shrink-0">
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
          <TabsContent value="body" className="mt-4 flex-1 min-h-0">
             <Tabs defaultValue="tree" className="h-full flex flex-col">
              <div className="flex justify-between items-center shrink-0">
                <TabsList>
                  <TabsTrigger value="tree">Tree</TabsTrigger>
                  <TabsTrigger value="raw">Raw</TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <TabsContent value="tree" className="mt-2 flex-1 min-h-0">
                <ScrollArea className="h-full">
                  <JsonViewer data={response.data} />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="raw" className="mt-2 flex-1 min-h-0">
                <ScrollArea className="h-full bg-secondary rounded-md">
                   <pre className="p-4 text-sm font-code whitespace-pre-wrap break-all">{prettyRaw}</pre>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="headers" className="mt-4 flex-1 min-h-0">
            <ScrollArea className="h-full rounded-md border">
              <Table>
                <TableBody>
                  {Object.entries(response.headers).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium font-code">{key}</TableCell>
                      <TableCell className="font-code">{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});
