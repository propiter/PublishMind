"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';

import { SiteHeader } from '@/components/layout/site-header';
import { PublicacionesGrid } from '@/components/content/publicaciones-grid';
import { searchPublicaciones, getCategorias } from '@/lib/contentful';
import { Publicacion, Categoria } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Simple toast notification function
const showErrorToast = (message: string) => {
  try {
    // Try using browser notification API if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Error', { body: message });
    } else {
      // Fallback to alert
      alert(message);
    }
  } catch (error) {
    console.error('Failed to show notification:', error);
    alert(message); // Ultimate fallback
  }
};

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Publicacion[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Load categories on mount
  useEffect(() => {
    async function loadCategorias() {
      try {
        const categoriasData = await getCategorias();
        setCategorias(categoriasData as unknown as Categoria[]);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
    
    loadCategorias();
  }, []);
  
  // Handle initial search from URL
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);
  
  // Handle search
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      const response = await searchPublicaciones(searchQuery);
      setSearchResults(response.items as unknown as Publicacion[]);
      
      // Update URL with search query
      const url = new URL(window.location.href);
      url.searchParams.set('q', searchQuery);
      window.history.pushState({}, '', url);
    } catch (error) {
      console.error('Search failed:', error);
      showErrorToast('Error en la búsqueda: No se pudo completar la búsqueda');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }
  
  return (
    <>
      <SiteHeader categorias={categorias} />
      
      <div className="pb-12 pt-36 md:pt-40">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Buscar contenido
          </h1>
          
          <form onSubmit={(e) => e.preventDefault()} className="mb-8">
            <div className="flex w-full max-w-xl items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por título, contenido, etiquetas, autor o categoría..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={() => handleSearch(query)}
                disabled={isSearching || !query.trim()}
              >
                {isSearching ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Buscar
              </Button>
            </div>
          </form>
          
          {isSearching ? (
            <div className="flex h-40 flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Buscando publicaciones...</p>
            </div>
          ) : hasSearched ? (
            searchResults.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-medium">
                  {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{query}"
                </h2>
                <PublicacionesGrid publicaciones={searchResults} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-medium">
                  No se encontraron resultados para "{query}"
                </h2>
                <p className="mt-2 max-w-md text-muted-foreground">
                  Intenta con términos diferentes o explora el contenido por categorías y etiquetas.
                </p>
                <div className="mt-6 flex gap-4">
                  <a 
                    href="/"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Ir al inicio
                  </a>
                  <a 
                    href="/categorias"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Ver categorías
                  </a>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-medium">
                Busca en nuestra colección de publicaciones
              </h2>
              <p className="mt-2 max-w-md text-muted-foreground">
                Escribe términos de búsqueda para encontrar publicaciones por título, contenido o etiquetas.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}