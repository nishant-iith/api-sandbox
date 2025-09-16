"use client";

import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Skeleton } from './ui/skeleton';

interface CodeSnippetViewerProps {
  code: string;
  language: string;
  isLoading?: boolean;
}

export function CodeSnippetViewer({ code, language, isLoading = false }: CodeSnippetViewerProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </Button>
      <ScrollArea className="max-h-[400px] rounded-md border bg-secondary">
        <pre className="p-4 text-sm">
          <code className={`language-${language} font-code`}>{code}</code>
        </pre>
      </ScrollArea>
    </div>
  );
}
