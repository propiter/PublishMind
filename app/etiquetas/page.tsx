import { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/site-header';
import { getCategorias, getAllTags } from '@/lib/contentful';
import { Categoria } from '@/lib/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Etiquetas | PublishMind',
  description: 'Explora todas las etiquetas y temas disponibles en PublishMind.',
};

export default async function EtiquetasPage() {
  const [categoriasData, tags] = await Promise.all([
    getCategorias(),
    getAllTags()
  ]);
  
  const categorias = categoriasData as unknown as Categoria[];

  return (
    <>
      <SiteHeader categorias={categorias} />
      
      <section className="pb-12 pt-36 md:pt-40">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Explorar etiquetas
            </h1>
            <p className="max-w-3xl text-xl text-muted-foreground">
              Descubre contenido por temas específicos a través de nuestras etiquetas.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <Link key={tag} href={`/etiqueta/${tag}`}>
                <Badge 
                  variant="secondary" 
                  className="text-base hover:bg-secondary/80"
                >
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}