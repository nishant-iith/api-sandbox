
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { RequestPanel } from '@/components/request-panel';
import { ResponsePanel } from '@/components/response-panel';
import { ApiRequest, ApiResponse, CollectionItem, RequestHistoryItem, HttpMethod, KeyValuePair, Environment } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Terminal, AlertTriangle, X, Save, GraduationCap, List, Globe } from 'lucide-react';
import { SidebarContent as SandboxSidebarContent } from '@/components/sidebar-content';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Input } from './ui/input';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ThemeToggle } from './theme-toggle';
import { ExportDialog } from './export-dialog';
import { ImportDialog } from './import-dialog';
import { STORAGE_KEYS, DEFAULTS } from '@/lib/constants';
import { generateId } from '@/utils/id-generator';

export function ApiSandbox() {
  const [activeRequest, setActiveRequest] = useState<ApiRequest | null>(null);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [history, setHistory] = useLocalStorage<RequestHistoryItem[]>(STORAGE_KEYS.HISTORY, []);
  const [collections, setCollections] = useLocalStorage<CollectionItem[]>(STORAGE_KEYS.COLLECTIONS, []);
  const [environments, setEnvironments] = useLocalStorage<Environment[]>(STORAGE_KEYS.ENVIRONMENTS, []);
  const [activeEnvironmentId, setActiveEnvironmentId] = useLocalStorage<string | null>(STORAGE_KEYS.ACTIVE_ENVIRONMENT, null);

  const [showCorsWarning, setShowCorsWarning] = useState(false);
  
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isLargeDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    // Only run on the client
    if (typeof window !== 'undefined' && !activeRequest) {
        const defaultRequest: ApiRequest = {
          id: generateId('req'),
          name: DEFAULTS.REQUEST_NAME,
          method: 'GET',
          url: DEFAULTS.PLACEHOLDER_URL,
          queryParams: [{ id: generateId('param'), key: '', value: '', enabled: true }],
          headers: [{ id: generateId('header'), key: 'Content-Type', value: 'application/json', enabled: true }],
          body: '',
          bodyType: 'none',
        };
        setActiveRequest(defaultRequest);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const updateRequest = (updatedFields: Partial<ApiRequest>) => {
    if (activeRequest) {
      const newActiveRequest = { ...activeRequest, ...updatedFields };
      setActiveRequest(newActiveRequest);

      // Also update the request within the collections state
      setCollections(prevCollections => {
        return prevCollections.map(collection => {
            const requestExists = collection.children?.some(child => child.id === newActiveRequest.id);
            if(requestExists) {
                return {
                    ...collection,
                    children: collection.children?.map(child => 
                        child.id === newActiveRequest.id
                            ? { ...child, name: newActiveRequest.name, request: newActiveRequest }
                            : child
                    )
                }
            }
            return collection;
        });
      });

    }
  };

  const handleSelectRequest = (request: ApiRequest) => {
    setActiveRequest(request);
    setResponse(null);
  };
  
  const handleSaveRequest = () => {
    if (!activeRequest) return;

    let isNewToCollections = true;
    const updatedCollections = collections.map(collection => {
      const requestIndex = collection.children?.findIndex(child => child.id === activeRequest.id);
      if (requestIndex !== -1 && requestIndex !== undefined && collection.children) {
        isNewToCollections = false;
        const updatedChildren = [...collection.children];
        updatedChildren[requestIndex] = {
            id: activeRequest.id,
            name: activeRequest.name,
            type: 'request',
            request: activeRequest,
        };
        return { ...collection, children: updatedChildren };
      }
      return collection;
    });

    if (isNewToCollections) {
      toast({
        title: "Request not in a collection",
        description: "Save this request to a new or existing collection first.",
      });
    } else {
       setCollections(updatedCollections);
       toast({
        title: "Request Saved",
        description: `"${activeRequest.name}" has been updated.`,
      });
    }
  };

  /**
   * Handles importing data from file
   * @param data - Imported data containing collections, environments, and/or history
   */
  const handleImportData = (data: {
    collections?: CollectionItem[];
    environments?: Environment[];
    history?: RequestHistoryItem[];
  }) => {
    if (data.collections) {
      setCollections(data.collections);
    }
    if (data.environments) {
      setEnvironments(data.environments);
    }
    if (data.history) {
      setHistory(data.history);
    }
  };

  const validateUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  const substituteVariables = (str: string): string => {
    const activeEnvironment = environments.find(env => env.id === activeEnvironmentId);
    if (!activeEnvironment || !str) return str;
    
    let substitutedStr = str;
    activeEnvironment.variables.forEach(variable => {
      if (variable.enabled && variable.key) {
        const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g');
        substitutedStr = substitutedStr.replace(regex, variable.value);
      }
    });
    return substitutedStr;
  };


  const handleSendRequest = async () => {
    if (!activeRequest) return;

    // Import validation functions
    const { sanitizeUrl: cleanUrl, validateUrl: checkUrl, sanitizeHeaderValue, sanitizeHeaderKey } = await import('@/services/validation-service');

    const processedUrl = substituteVariables(activeRequest.url);
    const cleanedUrl = cleanUrl(processedUrl);

    if (!checkUrl(cleanedUrl)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid URL after variable substitution.",
      });
      return;
    }

    setLoading(true);
    setResponse(null);
    setShowCorsWarning(false);
    const startTime = Date.now();

    try {
      const url = new URL(cleanedUrl);
      activeRequest.queryParams
        .filter(p => p.enabled && p.key)
        .forEach(p => url.searchParams.append(substituteVariables(p.key), substituteVariables(p.value)));

      const headers = new Headers();
      activeRequest.headers
        .filter(h => h.enabled && h.key)
        .forEach(h => {
          const key = sanitizeHeaderKey(substituteVariables(h.key));
          const value = sanitizeHeaderValue(substituteVariables(h.value));
          if (key) headers.append(key, value);
        });

      let body: BodyInit | undefined = undefined;
      if (activeRequest.method !== 'GET' && activeRequest.method !== 'HEAD') {
         if (activeRequest.bodyType === 'json' && activeRequest.body) {
          body = substituteVariables(activeRequest.body);
          if (!headers.has('Content-Type')) {
            headers.append('Content-Type', 'application/json');
          }
        } else if (activeRequest.bodyType === 'form-urlencoded' && activeRequest.body) {
          const substitutedBody = substituteVariables(activeRequest.body);
          const bodyParams = JSON.parse(substitutedBody);
          const urlSearchParams = new URLSearchParams();
          for(const key in bodyParams) {
              urlSearchParams.append(key, bodyParams[key]);
          }
          body = urlSearchParams;
          if (!headers.has('Content-Type')) {
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
          }
        }
      }

      const res = await fetch(url.toString(), {
        method: activeRequest.method,
        headers,
        body,
        mode: 'cors',
      });

      const endTime = Date.now();
      
      const responseBody = await res.text();
      const responseSize = new Blob([responseBody]).size;

      let responseData;
      try {
        responseData = JSON.parse(responseBody);
      } catch (e) {
        responseData = responseBody;
      }

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const newResponse: ApiResponse = {
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        data: responseData,
        time: endTime - startTime,
        size: responseSize,
        raw: responseBody,
      };
      setResponse(newResponse);
      const generateId = (): string => {
        // This function is safe to use on client-side only hooks/effects
        return `id_${Math.random().toString(36).substring(2, 11)}`;
      };
      const newHistoryItem: RequestHistoryItem = {
        id: `hist_${generateId()}`,
        request: activeRequest,
        response: newResponse,
        timestamp: Date.now(),
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 50));

    } catch (error: any) {
      const endTime = Date.now();
      const isCorsError = error instanceof TypeError && (error.message.includes('Failed to fetch') || error.message.includes('CORS'));
      if (isCorsError) {
        setShowCorsWarning(true);
      }
      const errorResponse: ApiResponse = {
        status: 0,
        statusText: 'Client Error',
        headers: {},
        data: { error: 'Failed to fetch. This might be due to a CORS issue, network problem, or invalid URL.', details: error.message },
        time: endTime - startTime,
        size: 0,
        raw: error.message,
      };
      setResponse(errorResponse);
       toast({
        variant: "destructive",
        title: "Request Failed",
        description: error.message || "Could not send request. Check the console for more details.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!activeRequest) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Terminal className="w-8 h-8 animate-spin" />
        </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2 justify-between">
               <div className="flex items-center gap-2">
                 <Terminal className="w-6 h-6 text-primary" />
                 <h1 className="text-lg font-semibold group-data-[collapsible=icon]:hidden">API Sandbox</h1>
               </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SandboxSidebarContent
              history={history}
              collections={collections}
              environments={environments}
              onSelectRequest={handleSelectRequest}
              setCollections={setCollections}
              setEnvironments={setEnvironments}
              activeRequestId={activeRequest.id}
            />
          </SidebarContent>
        </Sidebar>
        <div className="flex flex-col h-screen flex-1">
            <header className="p-2 border-b flex items-center justify-between gap-2 shrink-0">
              <div className='flex items-center gap-2'>
                <SidebarTrigger/>
                 <Input
                  value={activeRequest.name}
                  onChange={e => updateRequest({ name: e.target.value })}
                  className="font-semibold text-base border-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 h-9 flex-1 w-full md:w-auto"
                  aria-label="Request Name"
                />
              </div>
              <div className="flex items-center gap-2">
                 <Select value={activeEnvironmentId || 'none'} onValueChange={v => setActiveEnvironmentId(v === 'none' ? null : v)}>
                    <SelectTrigger className="w-auto md:w-[180px] h-9">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        {isDesktop && <SelectValue placeholder="Select Environment" />}
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="none">No Environment</SelectItem>
                        {environments.map(env => (
                            <SelectItem key={env.id} value={env.id}>{env.name}</SelectItem>
                        ))}
                    </SelectContent>
                 </Select>

                <Button variant={isLargeDesktop ? "outline" : "icon"} size="sm" onClick={handleSaveRequest} title="Save Request">
                  <Save className={isLargeDesktop ? "mr-2 h-4 w-4" : "h-4 w-4"} />
                  {isLargeDesktop && 'Save'}
                </Button>
                <ExportDialog
                  collections={collections}
                  environments={environments}
                  history={history}
                />
                <ImportDialog
                  collections={collections}
                  environments={environments}
                  history={history}
                  onImport={handleImportData}
                />
                 <Link href="/learn">
                    <Button variant={isLargeDesktop ? "outline" : "icon"} size="sm" title="Learn APIs">
                        <GraduationCap className={isLargeDesktop ? "mr-2 h-4 w-4" : "h-4 w-4"} />
                        {isLargeDesktop && 'Learn APIs'}
                    </Button>
                </Link>
                <a href="https://free-apis.github.io/" target="_blank" rel="noopener noreferrer">
                    <Button variant={isLargeDesktop ? "outline" : "icon"} size="sm" title="Free APIs List">
                        <List className={isLargeDesktop ? "mr-2 h-4 w-4" : "h-4 w-4"} />
                        {isLargeDesktop && 'Free APIs'}
                    </Button>
                </a>
                <ThemeToggle />
              </div>
            </header>
            
            <main className="flex-1 overflow-auto p-4 flex flex-col gap-4">
                <RequestPanel 
                    request={activeRequest}
                    onUpdateRequest={updateRequest}
                    onSend={handleSendRequest}
                    loading={loading}
                />
                {showCorsWarning && (
                    <Alert variant="destructive" className="relative shrink-0">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>CORS Error</AlertTitle>
                        <AlertDescription>
                            The request was blocked by the browser's CORS policy. This is a security feature to prevent cross-origin requests. You can often resolve this by using a CORS proxy or ensuring the server is configured to allow requests from this origin.
                        </AlertDescription>
                        <button onClick={() => setShowCorsWarning(false)} className="absolute top-2 right-2">
                            <X className="h-4 w-4" />
                        </button>
                    </Alert>
                )}
                <ResponsePanel response={response} loading={loading} />
            </main>
          </div>
      </div>
    </SidebarProvider>
  );
}
