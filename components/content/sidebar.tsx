'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Publicacion, Categoria } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
  publicacionesPopulares?: Publicacion[];
  publicacionesRecientes?: Publicacion[];
  categoriasDestacadas?: Categoria[];
  etiquetasPopulares?: string[];
}

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.4 }
};

export function Sidebar({
  className,
  publicacionesPopulares,
  publicacionesRecientes,
  categoriasDestacadas,
  etiquetasPopulares,
}: SidebarProps) {
  return (
    <aside className={cn('space-y-8', className)}>
      {/* Publicaciones Populares */}
      {publicacionesPopulares && publicacionesPopulares.length > 0 && (
        <motion.section {...fadeInUp}>
          <h3 className="mb-4 text-lg font-semibold">Publicaciones populares</h3>
          <div className="space-y-4">
            {publicacionesPopulares.map((publicacion, index) => (
              <Link 
                key={publicacion.sys.id}
                href={`/publicacion/${publicacion.fields.slug}`}
                className="group block"
              >
                <Card className="p-3 transition-colors hover:bg-muted/50">
                  <span className="mb-1 text-sm font-medium text-primary">
                    {publicacion.fields.categoria.fields.nombre}
                  </span>
                  <h4 className="line-clamp-2 text-base font-medium group-hover:text-primary">
                    {publicacion.fields.titulo}
                  </h4>
                </Card>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
      
      {/* Categorías Destacadas */}
      {categoriasDestacadas && categoriasDestacadas.length > 0 && (
        <motion.section {...fadeInUp}>
          <h3 className="mb-4 text-lg font-semibold">Categorías destacadas</h3>
          <div className="grid gap-2">
            {categoriasDestacadas.map((categoria) => (
              <Link 
                key={categoria.sys.id}
                href={`/categoria/${categoria.fields.slug}`}
                className="group block"
              >
                <Card className="p-3 transition-colors hover:bg-muted/50">
                  <h4 className="text-base font-medium group-hover:text-primary">
                    {categoria.fields.nombre}
                  </h4>
                  {categoria.fields.descripcion && (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {categoria.fields.descripcion}
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
      
      {/* Etiquetas Populares */}
      {etiquetasPopulares && etiquetasPopulares.length > 0 && (
        <motion.section {...fadeInUp}>
          <h3 className="mb-4 text-lg font-semibold">Etiquetas populares</h3>
          <div className="flex flex-wrap gap-2">
            {etiquetasPopulares.map((tag) => (
              <Link key={tag} href={`/etiqueta/${tag}`}>
                <Badge variant="secondary" className="hover:bg-secondary/80">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </aside>
  );
}