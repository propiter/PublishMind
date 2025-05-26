'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchQuery.trim())}`;
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-start justify-center bg-background/95 backdrop-blur-sm pt-20">
      <div className="container max-w-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Buscar contenido</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="search"
            placeholder="Buscar por título, contenido o etiquetas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-4 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          />
          <Button 
            type="submit"
            size="sm"
            className="absolute right-1 top-1"
            disabled={!searchQuery.trim()}
          >
            Buscar
          </Button>
        </form>
      </div>
    </div>
  );
}