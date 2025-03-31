'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

export default function TestApp() {
  const [input, setInput] = useState('');

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Component Test</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Alert Component</h2>
          <Alert>
            <AlertTitle>This is an alert title</AlertTitle>
            <AlertDescription>This is an alert description</AlertDescription>
          </Alert>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Card Component</h2>
          <Card className="p-4">
            <p>This is a card component</p>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Button Component</h2>
          <div className="flex gap-2">
            <Button>Default Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Input Component</h2>
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type something here"
            className="max-w-md"
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Spinner Component</h2>
          <div className="flex items-center gap-4">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
} 