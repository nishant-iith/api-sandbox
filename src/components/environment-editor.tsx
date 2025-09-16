
"use client";

import { useState, useEffect } from 'react';
import { Environment } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { KeyValueEditor } from './key-value-editor';

interface EnvironmentEditorProps {
  environment: Environment;
  onSave: (environment: Environment) => void;
  onClose: () => void;
}

export function EnvironmentEditor({ environment, onSave, onClose }: EnvironmentEditorProps) {
  const [editedEnvironment, setEditedEnvironment] = useState<Environment>(environment);

  useEffect(() => {
    setEditedEnvironment(environment);
  }, [environment]);

  const handleSave = () => {
    onSave(editedEnvironment);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Environment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="env-name">Environment Name</Label>
            <Input
              id="env-name"
              value={editedEnvironment.name}
              onChange={(e) => setEditedEnvironment({ ...editedEnvironment, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Variables</Label>
            <KeyValueEditor
              value={editedEnvironment.variables}
              onChange={(variables) => setEditedEnvironment({ ...editedEnvironment, variables })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
