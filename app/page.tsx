import { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/site-header';
import { PublicacionesGrid } from '@/components/content/publicaciones-grid';
import { CategoriasSection } from '@/components/content/categorias-section';
import { TagsCloud } from '@/components/content/tags-cloud';
import { getPublicaciones, getCategorias, getAllTags } from '@/lib/contentful';
import { Publicacion, Categoria } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedHero } from '@/components/content/AnimatedHero';
import { AnimatedSection } from '@/components/content/AnimatedSection';
import { AnimatedCTA } from '@/components/content/AnimatedCTA';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'PublishMind - Plataforma de Contenido Dinámico',
  description: 'Explora nuestra plataforma de contenido con publicaciones dinámicas sobre diversos temas. Navega por categorías o crea tu propio contenido.',
};

export default async function Home() {
  // Fetch data from Contentful
  const [publicacionesResponse, categoriasData, tags] = await Promise.all([
    getPublicaciones({ limit: 7 }),
    getCategorias(),
    getAllTags()
  ]);
  
  const publicaciones = publicacionesResponse.items as unknown as Publicacion[];
  const categorias = categoriasData as unknown as Categoria[];
  
  return (
    <>
      <SiteHeader categorias={categorias} />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        
        <div className="container max-w-6xl mx-auto relative z-10 py-20 md:py-32 px-4 sm:px-6 lg:px-8">
          <AnimatedHero />
        </div>
      </section>
      
      {/* Recent Publications */}
      <section className="py-20 bg-muted/40">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <AnimatedSection>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Publicaciones recientes
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Descubre el contenido más reciente de nuestra comunidad.
              </p>
            </AnimatedSection>
          </div>
          
          <PublicacionesGrid 
            publicaciones={publicaciones} 
            featuredFirst={true} 
          />
          
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="group" asChild>
              <Link href="/ultimas-publicaciones">
                Ver todas las publicaciones
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Explora por categorías
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Encuentra contenido organizado por temas que te interesan.
            </p>
          </AnimatedSection>
          
          <CategoriasSection categorias={categorias} />
        </div>
      </section>
      
      {/* Tags Cloud */}
      <section className="py-20 bg-muted/40">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Temas populares
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Explora el contenido a través de etiquetas específicas.
            </p>
          </AnimatedSection>
          
          <TagsCloud 
            tags={tags} 
            limit={20} 
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-primary/5 px-8 py-16 text-center sm:px-16">
            <AnimatedCTA />
          </div>
        </div>
      </section>
    </>
  );
}