import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { SiteHeader } from '@/components/layout/site-header';
import { PublicacionesGrid } from '@/components/content/publicaciones-grid';
import { getPublicaciones, getCategorias, getAllTags } from '@/lib/contentful';
import { generateTagMetadata } from '@/components/seo/metadata';
import { Publicacion } from '@/lib/types';

export const revalidate = 3600; // Revalidate every hour

interface TagPageProps {
  params: {
    nombre: string;
  };
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  return generateTagMetadata(decodeURIComponent(params.nombre));
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  
  // Limit to top 50 tags to prevent excessive build times
  return tags.slice(0, 50).map((tag) => ({
    nombre: encodeURIComponent(tag),
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const tagName = decodeURIComponent(params.nombre);
  const categorias = await getCategorias();
  
  // Get publications with this tag
  const publicacionesResponse = await getPublicaciones({
    limit: 100,
    tag: tagName,
  });
  
  const publicaciones = publicacionesResponse.items as unknown as Publicacion[];
  
  if (publicaciones.length === 0) {
    notFound();
  }
  
  // Get all tags to show related tags
  const allTags = await getAllTags();
  
  // Filter out the current tag and limit to 15 random related tags
  const relatedTags = allTags
    .filter(tag => tag !== tagName)
    .sort(() => 0.5 - Math.random())
    .slice(0, 15);
  
  return (
    <>
      <SiteHeader categorias={categorias} />
      
      <section className="pb-12 pt-36 md:pt-40">
        <div className="container">
          <div className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
            <a href="/" className="transition-colors hover:text-foreground">
              Inicio
            </a>
            <span>/</span>
            <a href="/etiquetas" className="transition-colors hover:text-foreground">
              Etiquetas
            </a>
            <span>/</span>
            <span className="font-medium text-foreground">
              {tagName}
            </span>
          </div>
          
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            #{tagName}
          </h1>
          
          <p className="mb-8 max-w-3xl text-xl text-muted-foreground">
            Explora todas las publicaciones etiquetadas con <strong>#{tagName}</strong>
          </p>
          
          {/* Publications */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-3">
              <PublicacionesGrid 
                publicaciones={publicaciones}
              />
            </div>
            
            <div className="space-y-8">
              {/* Related tags */}
              <div className="space-y-4 rounded-lg border bg-card p-5 shadow-sm">
                <h3 className="text-lg font-medium">Etiquetas relacionadas</h3>
                
                <div className="flex flex-wrap gap-2">
                  {relatedTags.map((tag) => (
                    <a 
                      key={tag}
                      href={`/etiqueta/${encodeURIComponent(tag)}`}
                      className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                    >
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Tag Info Card */}
              <div className="rounded-lg border bg-card p-5 shadow-sm">
                <h3 className="text-lg font-medium">Sobre esta etiqueta</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Contenido etiquetado con <strong>#{tagName}</strong>, organizado por relevancia.
                </p>
                <div className="mt-4">
                  <span className="text-sm text-muted-foreground">
                    {publicaciones.length} publicaciones
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}