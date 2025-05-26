'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Categoria } from '@/lib/types';
import { SearchOverlay } from './search-overlay';
import { MobileMenu } from './mobile-menu';

interface SiteHeaderProps {
  categorias: Categoria[];
}

export function SiteHeader({ categorias = [] }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);
  
  return (
    <header className={cn(
      'fixed top-0 z-40 w-full transition-all duration-300',
      isScrolled 
        ? 'bg-background/80 backdrop-blur-md border-b shadow-sm' 
        : 'bg-background/0'
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight">
              PublishMind
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {categorias.map((categoria) => (
              <Link 
                key={categoria.sys.id}
                href={`/categoria/${categoria.fields.slug}`} 
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === `/categoria/${categoria.fields.slug}` 
                    ? 'text-primary'
                    : 'text-foreground/60'
                )}
              >
                {categoria.fields.nombre}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setSearchOpen(true)}
            variant="ghost"
            size="icon"
            className="rounded-full p-2 hover:bg-muted"
            aria-label="Toggle search"
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Link href="/crear-publicacion">
            <Button size="sm" variant="default" className="hidden sm:inline-flex">
              Crear publicación
            </Button>
          </Link>
          
          <ThemeToggle />
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      <MobileMenu 
        isOpen={isMenuOpen}
        categorias={categorias}
        pathname={pathname}
      />
      
      <SearchOverlay 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </header>
  );
}