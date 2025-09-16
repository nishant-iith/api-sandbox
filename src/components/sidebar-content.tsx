
"use client";

import { ApiRequest, CollectionItem, RequestHistoryItem, Environment } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { History, Folder, Plus, MoreVertical, Trash2, FilePlus, Edit, X, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useState } from "react";
import { Input } from "./ui/input";
import { EnvironmentEditor } from "./environment-editor";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface SidebarContentProps {
  history: RequestHistoryItem[];
  collections: CollectionItem[];
  environments: Environment[];
  onSelectRequest: (request: ApiRequest) => void;
  setCollections: (collections: CollectionItem[] | ((prev: CollectionItem[]) => CollectionItem[])) => void;
  setEnvironments: (environments: Environment[] | ((prev: Environment[]) => Environment[])) => void;
  activeRequestId: string;
}

const generateId = (prefix: string = 'id') => `${prefix}_${Math.random().toString(36).substring(2, 11)}`;

export function SidebarContent({ 
  history, 
  collections, 
  environments, 
  onSelectRequest, 
  setCollections, 
  setEnvironments, 
  activeRequestId 
}: SidebarContentProps) {
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [collectionName, setCollectionName] = useState("");
  const [editingEnvironment, setEditingEnvironment] = useState<Environment | null>(null);

  const handleAddCollection = () => {
    const newCollection: CollectionItem = {
      id: generateId('coll'),
      name: 'New Collection',
      type: 'folder',
      children: [],
    };
    setCollections(prev => [...prev, newCollection]);
  };
  
  const handleRemoveCollection = (id: string) => {
    setCollections(collections.filter(c => c.id !== id));
  };
  
  const handleStartEditing = (collection: CollectionItem) => {
    setEditingCollectionId(collection.id);
    setCollectionName(collection.name);
  };
  
  const handleSaveCollectionName = (id: string) => {
    setCollections(prev => prev.map(c => c.id === id ? { ...c, name: collectionName } : c));
    setEditingCollectionId(null);
  };

  const handleAddRequestToCollection = (collectionId: string) => {
     const newRequest: ApiRequest = {
        id: generateId('req'),
        name: 'New Request',
        method: 'GET',
        url: '',
        queryParams: [],
        headers: [],
        body: '',
        bodyType: 'none',
      };
      
      setCollections((prevCollections: CollectionItem[]) => prevCollections.map(c => {
        if(c.id === collectionId) {
            return {
                ...c,
                children: [...(c.children || []), { id: newRequest.id, name: newRequest.name, type: 'request', request: newRequest }]
            }
        }
        return c;
      }));
  };

  const handleRemoveRequest = (collectionId: string, requestId: string) => {
    setCollections((prevCollections: CollectionItem[]) => prevCollections.map(c => {
        if (c.id === collectionId) {
            return {
                ...c,
                children: c.children?.filter(child => child.id !== requestId)
            }
        }
        return c;
    }));
  };
  
  const handleAddEnvironment = () => {
    const newEnvironment: Environment = {
      id: generateId('env'),
      name: 'New Environment',
      variables: [{id: generateId('var'), key: '', value: '', enabled: true}],
    };
    setEnvironments(prev => [...prev, newEnvironment]);
    setEditingEnvironment(newEnvironment);
  };
  
  const handleRemoveEnvironment = (id: string) => {
    setEnvironments(prev => prev.filter(env => env.id !== id));
  };

  const handleSaveEnvironment = (updatedEnvironment: Environment) => {
    setEnvironments(prev => prev.map(env => env.id === updatedEnvironment.id ? updatedEnvironment : env));
    setEditingEnvironment(null);
  }


  const getMethodClass = (method?: string) => {
    switch (method) {
        case 'GET': return 'text-green-600';
        case 'POST': return 'text-orange-500';
        case 'PUT': return 'text-blue-500';
        case 'PATCH': return 'text-purple-500';
        case 'DELETE': return 'text-red-500';
        default: return 'text-gray-400';
    }
  };


  const renderCollection = (item: CollectionItem) => (
    <AccordionItem value={item.id} key={item.id} className="border-none">
        <div className="flex items-center group hover:bg-sidebar-accent rounded-md">
            <AccordionTrigger className="hover:no-underline px-2 py-1.5 flex-1">
                <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-accent"/>
                    {editingCollectionId === item.id ? (
                      <Input 
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        onBlur={() => handleSaveCollectionName(item.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveCollectionName(item.id)}}
                        className="h-7 text-sm"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="text-sm font-medium truncate">{item.name}</span>
                    )}
                </div>
            </AccordionTrigger>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-6 w-6 mr-1 opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                     </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleAddRequestToCollection(item.id)}>
                        <FilePlus className="w-4 h-4 mr-2" /> Add Request
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStartEditing(item)}>
                        <Edit className="w-4 h-4 mr-2" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRemoveCollection(item.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Collection
                    </DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
       </div>
       <AccordionContent className="pl-4 pt-1">
         <div className="space-y-1">
          {item.children?.map(child => (
            <div key={child.id} data-active={activeRequestId === child.id} className="group flex items-center justify-between rounded-md text-sm font-medium hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent">
                <button onClick={() => child.request && onSelectRequest(child.request)} className="flex items-center gap-2 p-2 flex-1 text-left">
                    <span className={`font-mono text-xs w-12 text-left font-bold ${getMethodClass(child.request?.method)}`}>
                        {child.request?.method}
                    </span>
                    <span className="truncate flex-1">{child.name}</span>
                </button>
                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveRequest(item.id, child.id)}>
                    <X className="w-3 h-3 text-destructive" />
                </Button>
            </div>
          ))}
          {(!item.children || item.children.length === 0) && (
              <p className="text-xs text-muted-foreground p-2">No requests in this collection.</p>
          )}
         </div>
       </AccordionContent>
    </AccordionItem>
  );

  return (
    <>
      <ScrollArea className="h-full group-data-[collapsible=icon]:hidden">
        <div className="p-2 space-y-4">
            {/* Collections Section */}
            <div>
              <div className="flex justify-between items-center mb-1 px-2">
                  <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    Collections
                  </h2>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleAddCollection}>
                      <Plus className="w-4 h-4"/>
                  </Button>
              </div>
              <Accordion type="multiple" className="w-full space-y-1">
                  {collections.map(renderCollection)}
              </Accordion>
              {collections.length === 0 && <p className="text-xs text-muted-foreground p-2">No collections yet.</p>}
            </div>

            <Separator />

            {/* Environments Section */}
            <div>
              <div className="flex justify-between items-center mb-1 px-2">
                  <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Environments
                  </h2>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleAddEnvironment}>
                      <Plus className="w-4 h-4"/>
                  </Button>
              </div>
              <div className="space-y-1">
                  {environments.map(env => (
                      <div key={env.id} className="group flex items-center justify-between rounded-md text-sm font-medium hover:bg-sidebar-accent">
                          <button className="flex items-center gap-2 p-2 flex-1 text-left" onClick={() => setEditingEnvironment(env)}>
                              <span className="truncate flex-1">{env.name}</span>
                          </button>
                          <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                      <MoreVertical className="w-4 h-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => setEditingEnvironment(env)}>
                                      <Edit className="w-4 h-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRemoveEnvironment(env.id)} className="text-destructive">
                                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                                  </DropdownMenuItem>
                              </DropdownMenuContent>
                          </DropdownMenu>
                      </div>
                  ))}
                  {environments.length === 0 && <p className="text-xs text-muted-foreground p-2">No environments yet.</p>}
              </div>
            </div>

            <Separator />
            
            {/* History Section */}
            <div>
              <div className="flex justify-between items-center mb-1 px-2">
                  <h2 className="text-sm font-semibold tracking-tight flex items-center gap-2">
                    <History className="w-4 h-4" />
                    History
                  </h2>
              </div>
              <div className="space-y-1">
              {history.map(item => (
                  <button
                      key={item.id}
                      onClick={() => onSelectRequest(item.request)}
                      data-active={activeRequestId === item.request.id}
                      className="w-full text-left p-2 rounded-md hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent"
                  >
                      <div className="flex items-center gap-2">
                          <span className={`font-mono text-xs w-12 text-left font-bold ${getMethodClass(item.request.method)}`}>
                              {item.request.method}
                          </span>
                          <span className="truncate flex-1 text-sm">{item.request.name || item.request.url}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 pl-[56px]">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                      </div>
                  </button>
              ))}
              {history.length === 0 && <p className="text-xs text-muted-foreground p-2">No history yet.</p>}
              </div>
            </div>
        </div>
      </ScrollArea>
    {editingEnvironment && (
        <EnvironmentEditor
            environment={editingEnvironment}
            onSave={handleSaveEnvironment}
            onClose={() => setEditingEnvironment(null)}
        />
    )}
    </>
  )
}
