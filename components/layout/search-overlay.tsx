'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      try {
        window.location.href = `/buscar?q=${encodeURIComponent(searchQuery.trim())}`;
      } finally {
        setIsLoading(false);
        onClose();
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          className="fixed inset-0 z-50 flex items-start justify-center bg-background/95 backdrop-blur-sm pt-20"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            variants={contentVariants}
            transition={{ duration: 0.2 }}
            className="container max-w-2xl p-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Buscar contenido</h2>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={onClose}
                aria-label="Cerrar búsqueda"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Buscar por título, contenido o etiquetas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-input bg-background pl-10 pr-20 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  autoFocus
                />
                <Button 
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
                  disabled={!searchQuery.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Buscar'
                  )}
                </Button>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Sugerencias populares:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['JavaScript', 'React', 'Next.js', 'TypeScript', 'Node.js'].map((tag) => (
                    <Button
                      key={tag}
                      variant="secondary"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}