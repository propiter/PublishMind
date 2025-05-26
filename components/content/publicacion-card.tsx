'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Publicacion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface PublicacionCardProps {
  publicacion: Publicacion;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function PublicacionCard({ 
  publicacion, 
  variant = 'default',
  className 
}: PublicacionCardProps) {
  if (!publicacion) return null;
  
  const { titulo, slug, imagenDestacada, fechaPublicacion, autor, categoria, tags } = publicacion.fields;
  
  // Format publication date
  const formattedDate = fechaPublicacion ? format(
    new Date(fechaPublicacion),
    'dd MMMM, yyyy',
    { locale: es }
  ) : '';
  
  // Set image dimensions based on variant
  const imageDimensions = {
    featured: { width: 1200, height: 600 },
    default: { width: 800, height: 450 },
    compact: { width: 400, height: 225 }
  };
  
  // Generate image url with size optimization
  const imageUrl = imagenDestacada?.fields?.file?.url 
    ? `https:${imagenDestacada.fields.file.url}`
    : 'https://images.pexels.com/photos/3585048/pexels-photo-3585048.jpeg';
  
  const imageWidth = imageDimensions[variant].width;
  const imageHeight = imageDimensions[variant].height;
  
  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-300 hover:shadow-md',
      variant === 'featured' && 'lg:flex',
      className
    )}>
      <Link 
        href={`/publicacion/${slug}`} 
        className={cn(
          'block overflow-hidden',
          variant === 'featured' && 'lg:w-1/2'
        )}
      >
        <div className={cn(
          'overflow-hidden',
          variant === 'featured' ? 'aspect-video lg:h-full' : 'aspect-video',
          variant === 'compact' && 'aspect-[4/3]'
        )}>
          <Image
            src={imageUrl}
            alt={titulo}
            width={imageWidth}
            height={imageHeight}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <div className={cn(
        'flex flex-col',
        variant === 'featured' && 'lg:w-1/2',
        variant === 'compact' ? 'p-3' : 'p-5'
      )}>
        <CardContent className="flex-1 p-0">
          <div className="mb-3 flex items-center gap-2">
            <Link 
              href={`/categoria/${categoria.fields.slug}`}
              className="text-xs font-medium uppercase tracking-wider text-primary hover:underline"
            >
              {categoria.fields.nombre}
            </Link>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          
          <Link href={`/publicacion/${slug}`}>
            <h3 className={cn(
              'font-bold leading-tight tracking-tight hover:underline',
              variant === 'featured' ? 'mb-4 text-2xl md:text-3xl' : 'mb-2 text-lg',
              variant === 'compact' && 'text-base'
            )}>
              {titulo}
            </h3>
          </Link>
          
          {variant !== 'compact' && autor && (
            <p className="mb-4 text-sm text-muted-foreground">
              Por <span className="font-medium">{autor}</span>
            </p>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-wrap items-center gap-2 p-0 pt-3">
          {tags && tags.length > 0 && (
            <>
              {tags.slice(0, variant === 'compact' ? 2 : 3).map((tag) => (
                <Link key={tag} href={`/etiqueta/${tag}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80">
                    {tag}
                  </Badge>
                </Link>
              ))}
              
              {tags.length > (variant === 'compact' ? 2 : 3) && (
                <Badge variant="outline" className="text-muted-foreground">
                  +{tags.length - (variant === 'compact' ? 2 : 3)}
                </Badge>
              )}
            </>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}