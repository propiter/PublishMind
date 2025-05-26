"use client";

import { useState, useEffect } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { PublicationForm } from '@/components/content/publication-form';
import { getCategorias } from '@/lib/contentful';
import { Categoria } from '@/lib/types';

export default function CrearPublicacionPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  useEffect(() => {
    async function loadCategorias() {
      try {
        const categoriasData = await getCategorias();
        setCategorias(categoriasData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    }
    
    loadCategorias();
  }, []);

  return (
    <>
      <SiteHeader categorias={categorias} />
      
      <div className="pb-16 pt-36 md:pt-40">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Crear publicación
            </h1>
            <p className="text-muted-foreground">
              Comparte tu conocimiento, historias o experiencias con nuestra comunidad.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <PublicationForm categorias={categorias} />
          </div>
        </div>
      </div>
    </>
  );
}