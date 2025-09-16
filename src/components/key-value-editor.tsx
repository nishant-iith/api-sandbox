"use client";

import React, { useCallback } from 'react';
import { KeyValuePair } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface KeyValueEditorProps {
  value: KeyValuePair[];
  onChange: (value: KeyValuePair[]) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const KeyValueEditor = React.memo(function KeyValueEditor({ value, onChange }: KeyValueEditorProps) {
  const handleAdd = useCallback(() => {
    onChange([...value, { id: generateId(), key: '', value: '', enabled: true }]);
  }, [value, onChange]);

  const handleRemove = useCallback((id: string) => {
    onChange(value.filter(item => item.id !== id));
  }, [value, onChange]);

  const handleUpdate = useCallback((id: string, updatedField: Partial<KeyValuePair>) => {
    onChange(
      value.map(item => (item.id === id ? { ...item, ...updatedField } : item))
    );
  }, [value, onChange]);

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          <Checkbox
            checked={item.enabled}
            onCheckedChange={checked => handleUpdate(item.id, { enabled: !!checked })}
          />
          <Input
            placeholder="Key"
            value={item.key}
            onChange={e => handleUpdate(item.id, { key: e.target.value })}
            className="font-code"
          />
          <Input
            placeholder="Value"
            value={item.value}
            onChange={e => handleUpdate(item.id, { value: e.target.value })}
            className="font-code"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemove(item.id)}
            disabled={value.length <= 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={handleAdd} className="mt-2">
        <Plus className="mr-2 h-4 w-4" />
        Add
      </Button>
    </div>
  );
});
