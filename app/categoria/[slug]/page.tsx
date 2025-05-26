import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { SiteHeader } from '@/components/layout/site-header';
import { PublicacionesGrid } from '@/components/content/publicaciones-grid';
import { TagsCloud } from '@/components/content/tags-cloud';
import { getCategoriaBySlug, getPublicaciones, getCategorias, getAllTags } from '@/lib/contentful';
import { generateCategoriaMetadata } from '@/lib/seo';
import { Publicacion, Categoria, Imagen } from '@/lib/types';

export const revalidate = 3600; // Revalidate every hour

interface CategoriaPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoriaPageProps): Promise<Metadata> {
  const categoria = await getCategoriaBySlug(params.slug);
  
  if (!categoria) {
    return {
      title: 'Categoría no encontrada'
    };
  }
  
  return generateCategoriaMetadata(categoria);
}

export async function generateStaticParams() {
  const categorias = await getCategorias();
  
  return categorias.map((entry) => {
    const categoria = entry as unknown as Categoria;
    return {
      slug: categoria.fields.slug
    };
  });
}

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const { slug } = params;
  const categoria = await getCategoriaBySlug(slug);
  const categorias = await getCategorias();
  
  if (!categoria) {
    notFound();
  }
  
  // Get publications for this category
  const publicacionesResponse = await getPublicaciones({
    limit: 100,
    categoria: slug,
  });
  
  const publicaciones = publicacionesResponse.items as unknown as Publicacion[];
  
  // Get popular tags from this category's publications
  const allCategoryTags = publicaciones
    .map(pub => pub.fields.tags || [])
    .flat();
  
  const tagCounts = allCategoryTags.reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([tag]) => tag);
  
  // Process hero image
  const heroImageUrl = categoria.fields.imagen?.fields.file.url 
    ? `https:${categoria.fields.imagen.fields.file.url}`
    : 'https://images.pexels.com/photos/6177645/pexels-photo-6177645.jpeg';
  
  return (
    <>
      <SiteHeader categorias={categorias} />
      
      {/* Hero */}
      <section className="relative pb-8 pt-36 md:pt-40">
        <div className="absolute inset-0 z-0 h-96 overflow-hidden">
          <Image
            src={heroImageUrl}
            alt={categoria.fields.nombre}
            fill
            className="object-cover object-center blur-sm brightness-50"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-background/20 backdrop-blur-sm" />
        </div>
        
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground text-white/70">
            <a href="/" className="transition-colors hover:text-white">
              Inicio
            </a>
            <span>/</span>
            <a href="/categorias" className="transition-colors hover:text-white">
              Categorías
            </a>
            <span>/</span>
            <span className="font-medium text-white">
              {categoria.fields.nombre}
            </span>
          </div>
          
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
            {categoria.fields.nombre}
          </h1>
          
          {categoria.fields.descripcion && (
            <p className="max-w-3xl text-xl text-white/90">
              {categoria.fields.descripcion}
            </p>
          )}
        </div>
      </section>
      
      {/* Publications */}
      <section className="py-12">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {publicaciones.length > 0 ? (
            <>
              <h2 className="mb-8 text-3xl font-bold tracking-tight">
                Todas las publicaciones
              </h2>
              
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                <div className="md:col-span-3">
                  <PublicacionesGrid 
                    publicaciones={publicaciones}
                  />
                </div>
                
                <div className="space-y-8">
                  {/* Popular tags in this category */}
                  <TagsCloud 
                    tags={popularTags}
                    title="Temas populares"
                  />
                  
                  {/* Category Info Card */}
                  <div className="rounded-lg border bg-card p-5 shadow-sm">
                    <h3 className="text-lg font-medium">Sobre esta categoría</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {categoria.fields.descripcion || `Explora todas las publicaciones en la categoría ${categoria.fields.nombre}.`}
                    </p>
                    <div className="mt-4">
                      <span className="text-sm text-muted-foreground">
                        {publicaciones.length} publicaciones
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <h2 className="text-xl font-medium">No hay publicaciones en esta categoría</h2>
              <p className="mt-2 text-muted-foreground">
                Sé el primero en crear contenido para esta categoría.
              </p>
              <a 
                href="/crear-publicacion"
                className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Crear publicación
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}