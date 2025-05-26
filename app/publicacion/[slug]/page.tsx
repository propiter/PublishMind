import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/layout/site-header';
import { Badge } from '@/components/ui/badge';
import { PublicacionCard } from '@/components/content/publicacion-card';
import { SocialShareButtons } from '@/components/content/social-share-buttons';
import { getPublicacionBySlug, getPublicaciones, getCategorias } from '@/lib/contentful';
import { renderRichText } from '@/lib/richText';
import { generatePublicacionMetadata } from '@/components/seo/metadata';
import { Publicacion } from '@/lib/types';
import { ScrollToTopButton } from '@/components/ui/scroll-to-top-button';

export const revalidate = 3600; // Revalidate every hour

interface PublicacionPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PublicacionPageProps): Promise<Metadata> {
  const publicacion = await getPublicacionBySlug(params.slug);
  
  if (!publicacion) {
    return {
      title: 'Publicación no encontrada'
    };
  }
  
  return generatePublicacionMetadata(publicacion);
}

export async function generateStaticParams() {
  const publicaciones = await getPublicaciones({ limit: 100 });
  
  return publicaciones.items.map((publicacion: Publicacion) => ({
    slug: publicacion.fields.slug,
  }));
}

export default async function PublicacionPage({ params }: PublicacionPageProps) {
  const { slug } = params;
  const publicacion = await getPublicacionBySlug(slug);
  const categorias = await getCategorias();
  
  if (!publicacion) {
    notFound();
  }
  
  // Get related publications (same category or with shared tags)
  const relacionadasResponse = await getPublicaciones({
    limit: 3,
    categoria: publicacion.fields.categoria.fields.slug,
  });
  
  // Filter out the current publication
  const publicacionesRelacionadas = relacionadasResponse.items
    .filter((item: Publicacion) => item.fields.slug !== slug) as unknown as Publicacion[];
  
  // Format date
  const formattedDate = publicacion.fields.fechaPublicacion 
    ? format(new Date(publicacion.fields.fechaPublicacion), 'dd MMMM, yyyy', { locale: es })
    : '';
  
  // Process hero image
  const heroImageUrl = publicacion.fields.imagenDestacada?.fields.file.url 
    ? `https:${publicacion.fields.imagenDestacada.fields.file.url}`
    : 'https://images.pexels.com/photos/3585048/pexels-photo-3585048.jpeg';
  
  return (
    <>
      <SiteHeader categorias={categorias} />
      
      <article className="pb-16 pt-36 md:pt-40">
        {/* Hero */}
        <div className="container max-w-5xl">
          <Link 
            href={`/categoria/${publicacion.fields.categoria.fields.slug}`}
            className="mb-3 inline-block text-sm font-medium uppercase tracking-wider text-primary hover:underline"
          >
            {publicacion.fields.categoria.fields.nombre}
          </Link>
          
          <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {publicacion.fields.titulo}
          </h1>
          
          <div className="mb-8 flex items-center gap-4 text-muted-foreground">
            <time dateTime={publicacion.fields.fechaPublicacion}>
              {formattedDate}
            </time>
            <span>•</span>
            {publicacion.fields.autor && (
              <span>Por <span className="font-medium text-foreground">{publicacion.fields.autor}</span></span>
            )}
          </div>
          
          <div className="mb-10 overflow-hidden rounded-lg">
            <Image
              src={heroImageUrl}
              alt={publicacion.fields.titulo}
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="container max-w-3xl">
          <div className="prose prose-lg dark:prose-invert mx-auto">
            {renderRichText(publicacion.fields.contenido)}
          </div>
          
          {/* Tags */}
          {publicacion.fields.tags && publicacion.fields.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2">
              {publicacion.fields.tags.map((tag) => (
                <Link key={tag} href={`/etiqueta/${tag}`}>
                  <Badge variant="secondary" className="hover:bg-secondary/80">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
          
          {/* Share Buttons */}
          <div className="mt-12 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Compartir:</span>
              <SocialShareButtons />
            </div>
            
            <ScrollToTopButton />
          </div>
        </div>
      </article>
      
      {/* Related Publications */}
      {publicacionesRelacionadas.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="container">
            <h2 className="mb-8 text-2xl font-bold tracking-tight">
              Publicaciones relacionadas
            </h2>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publicacionesRelacionadas.map((publicacion) => (
                <PublicacionCard
                  key={publicacion.sys.id}
                  publicacion={publicacion}
                  variant="default"
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}