'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, X, BookOpen, Hash, TrendingUp, PenSquare, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Categoria } from '@/lib/types';
import { SearchOverlay } from './search-overlay';
import { MobileMenu } from './mobile-menu';

interface SiteHeaderProps {
  categorias: Categoria[];
}

const mainNavItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/categorias', label: 'Categorías', icon: BookOpen },
  { href: '/etiquetas', label: 'Etiquetas', icon: Hash },
  { href: '/populares', label: 'Populares', icon: TrendingUp },
];

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
      'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      isScrolled && 'shadow-sm'
    )}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <motion.span 
                className="text-xl font-bold tracking-tight"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                PublishMind
              </motion.span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              {mainNavItems.map(({ href, label, icon: Icon }) => (
                <Link 
                  key={href}
                  href={href} 
                  className={cn(
                    'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
                    pathname === href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setSearchOpen(true)}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Link href="/crear-publicacion">
              <Button 
                size="sm" 
                className="hidden sm:inline-flex items-center bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <PenSquare className="mr-2 h-4 w-4" />
                Crear publicación
              </Button>
            </Link>
            
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? 'close' : 'menu'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MobileMenu 
                isOpen={isMenuOpen}
                categorias={categorias}
                pathname={pathname}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <SearchOverlay 
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      </div>
    </header>
  );
}