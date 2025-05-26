'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Calendar, User, Clock } from 'lucide-react';

import { Publicacion } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface PublicacionCardProps {
  publicacion: Publicacion;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
  index?: number;
}

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

export function PublicacionCard({ 
  publicacion, 
  variant = 'default',
  className,
  index = 0
}: PublicacionCardProps) {
  if (!publicacion) return null;
  
  const { titulo, slug, imagenDestacada, fechaPublicacion, autor, categoria, tags, contenido } = publicacion.fields;
  
  const formattedDate = fechaPublicacion ? format(
    new Date(fechaPublicacion),
    'dd MMMM, yyyy',
    { locale: es }
  ) : '';
  
  const imageDimensions = {
    featured: { width: 1200, height: 600 },
    default: { width: 800, height: 450 },
    compact: { width: 400, height: 225 }
  };
  
  const imageUrl = imagenDestacada?.fields?.file?.url 
    ? `https:${imagenDestacada.fields.file.url}`
    : 'https://images.pexels.com/photos/3585048/pexels-photo-3585048.jpeg';
  
  const imageWidth = imageDimensions[variant].width;
  const imageHeight = imageDimensions[variant].height;

  // Extract a brief excerpt from the content
  const excerpt = contenido?.content?.[0]?.content?.[0]?.value?.slice(0, 150) + '...' || '';
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Card className={cn(
        'group h-full overflow-hidden transition-all duration-300 hover:shadow-lg',
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
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              priority={variant === 'featured'}
            />
          </div>
        </Link>
        
        <div className={cn(
          'flex flex-col',
          variant === 'featured' && 'lg:w-1/2',
          variant === 'compact' ? 'p-3' : 'p-5'
        )}>
          <CardContent className="flex-1 space-y-4 p-0">
            <div className="flex items-center gap-2">
              <Link 
                href={`/categoria/${categoria.fields.slug}`}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                {categoria.fields.nombre}
              </Link>
              <time dateTime={fechaPublicacion} className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-1 h-3 w-3" />
                {formattedDate}
              </time>
            </div>
            
            <Link href={`/publicacion/${slug}`} className="group block space-y-2">
              <h3 className={cn(
                'font-bold leading-tight tracking-tight transition-colors group-hover:text-primary',
                variant === 'featured' ? 'text-2xl md:text-3xl' : 'text-xl',
                variant === 'compact' && 'text-base'
              )}>
                {titulo}
              </h3>
              
              {variant !== 'compact' && (
                <p className="line-clamp-2 text-muted-foreground">
                  {excerpt}
                </p>
              )}
            </Link>
            
            {variant !== 'compact' && autor && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium hover:text-foreground transition-colors">
                  {autor}
                </span>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-wrap items-center gap-2 p-0 pt-4">
            {tags && tags.length > 0 && (
              <>
                {tags.slice(0, variant === 'compact' ? 2 : 3).map((tag) => (
                  <Link key={tag} href={`/etiqueta/${tag}`}>
                    <Badge variant="secondary" className="transition-colors hover:bg-secondary/80">
                      #{tag}
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
    </motion.div>
  );
}