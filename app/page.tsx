import { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/site-header';
import { PublicacionesGrid } from '@/components/content/publicaciones-grid';
import { CategoriasSection } from '@/components/content/categorias-section';
import { TagsCloud } from '@/components/content/tags-cloud';
import { getPublicaciones, getCategorias, getAllTags } from '@/lib/contentful';
import { Publicacion, Categoria } from '@/lib/types';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'PublishMind - Plataforma de Contenido Dinámico',
  description: 'Explora nuestra plataforma de contenido con publicaciones dinámicas sobre diversos temas. Navega por categorías o crea tu propio contenido.',
};

export default async function Home() {
  // Fetch data from Contentful
  const publicacionesResponse = await getPublicaciones({ limit: 7 });
  const publicaciones = publicacionesResponse.items as unknown as Publicacion[];
  
  const categoriasData = await getCategorias();
  const categorias = categoriasData as unknown as Categoria[];
  
  const tags = await getAllTags();
  
  return (
    <>
      <SiteHeader categorias={categorias} />
      
      {/* Hero Section */}
      <section className="relative pb-12 pt-36 md:pt-40 lg:pt-48">
        <div className="container flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Explora y Crea Contenido Dinámico
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Descubre publicaciones únicas o crea las tuyas propias. Una plataforma
            para compartir conocimiento, historias y experiencias.
          </p>
        </div>
      </section>
      
      {/* Recent Publications */}
      <section className="bg-muted/40 py-12 md:py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Publicaciones recientes</h2>
          </div>
          
          <PublicacionesGrid 
            publicaciones={publicaciones} 
            featuredFirst={true} 
          />
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <CategoriasSection categorias={categorias} />
        </div>
      </section>
      
      {/* Tags Cloud */}
      <section className="bg-muted/40 py-12 md:py-16">
        <div className="container">
          <TagsCloud 
            tags={tags} 
            title="Temas populares"
            limit={20} 
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="rounded-xl bg-primary/5 p-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              ¿Tienes algo que compartir?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Puedes crear tu propia publicación o dejar que generemos contenido 
              automáticamente basado en tus ideas. ¡Es fácil y rápido!
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a 
                href="/crear-publicacion" 
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Crear publicación
              </a>
              <a 
                href="/buscar" 
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Explorar contenido
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}