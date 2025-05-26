import { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/site-header';
import { PublicacionesGrid } from '@/components/content/publicaciones-grid';
import { Sidebar } from '@/components/content/sidebar';
import { getPublicaciones, getCategorias, getAllTags } from '@/lib/contentful';
import { Publicacion, Categoria } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Últimas Publicaciones | PublishMind',
  description: 'Las publicaciones más recientes de PublishMind.',
};

export default async function UltimasPublicacionesPage() {
  const [publicacionesResponse, categoriasData, tags] = await Promise.all([
    getPublicaciones({ limit: 12 }),
    getCategorias(),
    getAllTags()
  ]);
  
  const publicaciones = publicacionesResponse.items as unknown as Publicacion[];
  const categorias = categoriasData as unknown as Categoria[];

  return (
    <>
      <SiteHeader categorias={categorias} />
      
      <section className="pb-12 pt-36 md:pt-40">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Últimas publicaciones
            </h1>
            <p className="max-w-3xl text-xl text-muted-foreground">
              Mantente al día con el contenido más reciente de nuestra plataforma.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-3">
              <PublicacionesGrid 
                publicaciones={publicaciones}
                featuredFirst={true}
              />
            </div>
            
            <Sidebar
              categoriasDestacadas={categorias.slice(0, 5)}
              etiquetasPopulares={tags.slice(0, 15)}
            />
          </div>
        </div>
      </section>
    </>
  );
}