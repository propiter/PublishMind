'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Categoria } from '@/lib/types';

interface MobileMenuProps {
  isOpen: boolean;
  categorias: Categoria[];
  pathname: string;
}

export function MobileMenu({ isOpen, categorias, pathname }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t">
      <div className="container py-4 space-y-4">
        <nav className="flex flex-col space-y-4">
          {categorias.map((categoria) => (
            <Link 
              key={categoria.sys.id}
              href={`/categoria/${categoria.fields.slug}`} 
              className={cn(
                'py-2 text-base font-medium transition-colors hover:text-primary',
                pathname === `/categoria/${categoria.fields.slug}` 
                  ? 'text-primary'
                  : 'text-foreground/60'
              )}
            >
              {categoria.fields.nombre}
            </Link>
          ))}
          <Link
            href="/crear-publicacion"
            className="py-2 text-base font-medium text-primary transition-colors hover:text-primary/80"
          >
            Crear publicación
          </Link>
        </nav>
      </div>
    </div>
  );
}