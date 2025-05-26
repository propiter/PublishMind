import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Search, Loader2, Calendar, User, Tag, FileText } from 'lucide-react';
import debounce from 'lodash/debounce';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SearchResult {
  sys: {
    id: string;
  };
  fields: {
    titulo: string;
    slug: string;
    contenido: any;
    autor?: string;
    fechaPublicacion?: string;
    categoria: {
      fields: {
        nombre: string;
        slug: string;
      };
    };
    tags?: string[];
    imagenDestacada?: {
      fields: {
        file: {
          url: string;
        };
      };
    };
  };
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const search = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setResults(data.items);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

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

  useEffect(() => {
    search(query);
  }, [query, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => prev > -1 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex > -1) {
        const selected = results[selectedIndex];
        router.push(`/publicacion/${selected.fields.slug}`);
        onClose();
      } else if (query.trim()) {
        router.push(`/buscar?q=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-background/95 backdrop-blur-sm pt-20"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container max-w-2xl"
          >
            <div className="rounded-lg border bg-card shadow-lg">
              <div className="flex items-center gap-2 border-b p-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar publicaciones, autores, etiquetas..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="border-0 bg-transparent text-lg focus-visible:ring-0"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Cerrar búsqueda</span>
                </Button>
              </div>

              <div className="max-h-[calc(80vh-6rem)] overflow-auto p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.sys.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Button
                          variant="ghost"
                          className={`w-full justify-start rounded-lg p-3 text-left ${
                            selectedIndex === index ? 'bg-accent' : ''
                          }`}
                          onClick={() => {
                            router.push(`/publicacion/${result.fields.slug}`);
                            onClose();
                          }}
                        >
                          <div className="flex gap-4">
                            {result.fields.imagenDestacada && (
                              <img
                                src={`https:${result.fields.imagenDestacada.fields.file.url}`}
                                alt={result.fields.titulo}
                                className="h-16 w-16 rounded object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="mb-1 font-medium">
                                {result.fields.titulo}
                              </h3>
                              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                {result.fields.autor && (
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {result.fields.autor}
                                  </span>
                                )}
                                {result.fields.fechaPublicacion && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(
                                      new Date(result.fields.fechaPublicacion),
                                      'dd MMM, yyyy',
                                      { locale: es }
                                    )}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {result.fields.categoria.fields.nombre}
                                </span>
                              </div>
                              {result.fields.tags && result.fields.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {result.fields.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs"
                                    >
                                      <Tag className="h-3 w-3" />
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : query.trim() ? (
                  <div className="py-8 text-center">
                    <p className="text-lg font-medium">
                      No se encontraron resultados para "{query}"
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      Intenta con términos diferentes o explora las categorías
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Búsquedas populares
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['JavaScript', 'React', 'Next.js', 'Node.js', 'TypeScript'].map(
                        (term) => (
                          <Button
                            key={term}
                            variant="secondary"
                            size="sm"
                            onClick={() => setQuery(term)}
                            className="rounded-full"
                          >
                            {term}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}