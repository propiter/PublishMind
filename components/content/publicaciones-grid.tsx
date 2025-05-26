import { Publicacion } from '@/lib/types';
import { PublicacionCard } from '@/components/content/publicacion-card';
import { cn } from '@/lib/utils';

interface PublicacionesGridProps {
  publicaciones: Publicacion[];
  className?: string;
  featuredFirst?: boolean;
}

export function PublicacionesGrid({
  publicaciones,
  className,
  featuredFirst = false,
}: PublicacionesGridProps) {
  if (!publicaciones || publicaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium">No se encontraron publicaciones</h3>
        <p className="mt-2 text-muted-foreground">
          Intenta con diferentes filtros o vuelve más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-8', className)}>
      {featuredFirst && publicaciones.length > 0 && (
        <PublicacionCard 
          publicacion={publicaciones[0]} 
          variant="featured" 
        />
      )}
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(featuredFirst ? publicaciones.slice(1) : publicaciones).map((publicacion) => (
          <PublicacionCard
            key={publicacion.sys.id}
            publicacion={publicacion}
            variant="default"
          />
        ))}
      </div>
    </div>
  );
}