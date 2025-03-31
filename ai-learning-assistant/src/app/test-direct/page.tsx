'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function TestDirectImportsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Testing Direct Imports</h1>
      <Alert className="mb-4">
        <AlertTitle>Test Alert</AlertTitle>
        <AlertDescription>This page tests direct imports without path aliases</AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-2">Card Component</h2>
          <p>This is a card with direct import</p>
        </Card>
        
        <div className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-2">Button Component</h2>
          <div className="flex gap-2">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </div>
        
        <div className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-2">Input Component</h2>
          <Input placeholder="Test input" />
        </div>
        
        <div className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-2">Spinner Component</h2>
          <div className="flex items-center gap-2">
            <Spinner />
            <span>Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
} 