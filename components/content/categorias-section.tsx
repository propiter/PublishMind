import Link from 'next/link';
import Image from 'next/image';
import { Categoria } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoriasSectionProps {
  categorias: Categoria[];
  className?: string;
}

export function CategoriasSection({ 
  categorias, 
  className 
}: CategoriasSectionProps) {
  if (!categorias || categorias.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h2 className="text-2xl font-bold tracking-tight">Categorías</h2>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categorias.map((categoria) => {
          const imageUrl = categoria.fields.imagen?.fields.file.url 
            ? `https:${categoria.fields.imagen.fields.file.url}`
            : 'https://images.pexels.com/photos/6177645/pexels-photo-6177645.jpeg';
            
          return (
            <Link 
              key={categoria.sys.id}
              href={`/categoria/${categoria.fields.slug}`}
              className="group overflow-hidden rounded-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={categoria.fields.nombre}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={300}
                  height={300}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end p-3">
                  <h3 className="text-base font-bold text-white">
                    {categoria.fields.nombre}
                  </h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}