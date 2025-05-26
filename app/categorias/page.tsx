import { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/site-header';
import { getCategorias } from '@/lib/contentful';
import { Categoria } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Categorías | PublishMind',
  description: 'Explora todas las categorías de contenido disponibles en PublishMind.',
};

export default async function CategoriasPage() {
  const categoriasData = await getCategorias();
  const categorias = categoriasData as unknown as Categoria[];

  return (
    <>
      <SiteHeader categorias={categorias} />
      
      <section className="pb-12 pt-36 md:pt-40">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Categorías
            </h1>
            <p className="max-w-3xl text-xl text-muted-foreground">
              Explora nuestras categorías de contenido y encuentra publicaciones sobre los temas que más te interesan.
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((categoria) => {
              const imageUrl = categoria.fields.imagen?.fields.file.url 
                ? `https:${categoria.fields.imagen.fields.file.url}`
                : 'https://images.pexels.com/photos/6177645/pexels-photo-6177645.jpeg';
                
              return (
                <Link 
                  key={categoria.sys.id}
                  href={`/categoria/${categoria.fields.slug}`}
                  className="group relative overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={categoria.fields.nombre}
                      width={600}
                      height={338}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="p-6">
                    <h2 className="mb-2 text-2xl font-bold group-hover:text-primary">
                      {categoria.fields.nombre}
                    </h2>
                    {categoria.fields.descripcion && (
                      <p className="text-muted-foreground">
                        {categoria.fields.descripcion}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}