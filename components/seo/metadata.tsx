import { Metadata } from 'next';
import { Publicacion, Categoria } from '@/lib/types';

const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://PublishMind.com';
export const metadataBase = new URL(process.env.DOMAIN || 'http://localhost:3000');

// Default metadata
export const defaultMetadata: Metadata = {
  title: {
    default: 'PublishMind - Plataforma de Contenido Dinámico',
    template: '%s | PublishMind'
  },
  description: 'Explora nuestra plataforma de contenido con publicaciones dinámicas sobre diversos temas. Navega por categorías o crea tu propio contenido.',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: domain,
    siteName: 'PublishMind',
    images: [{
      url: 'https://PublishMind.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'PublishMind - Plataforma de Contenido Dinámico'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@PublishMind',
    creator: '@PublishMind'
  }
};

// Generate metadata for publication page
export function generatePublicacionMetadata(publicacion: Publicacion): Metadata {
  const imageUrl = publicacion.fields.imagenDestacada?.fields.file.url 
    ? `${metadataBase.protocol}://${metadataBase.host}${publicacion.fields.imagenDestacada.fields.file.url}` 
    : `${domain}/og-image.jpg`;

  return {
    title: publicacion.fields.titulo,
    description: extractDescriptionFromContent(publicacion.fields.contenido),
    openGraph: {
      type: 'article',
      locale: 'es_ES',
      url: `${domain}/publicacion/${publicacion.fields.slug}`,
      title: publicacion.fields.titulo,
      description: extractDescriptionFromContent(publicacion.fields.contenido),
      publishedTime: publicacion.fields.fechaPublicacion,
      modifiedTime: publicacion.sys.updatedAt,
      authors: [publicacion.fields.autor],
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: publicacion.fields.titulo
      }],
      tags: publicacion.fields.tags
    },
    twitter: {
      card: 'summary_large_image',
      site: '@PublishMind',
      creator: '@PublishMind',
      images: [{
        url: imageUrl,
        alt: publicacion.fields.titulo
      }]
    }
  };
}

// Generate metadata for category page
export function generateCategoriaMetadata(categoria: Categoria): Metadata {
  const imageUrl = categoria.fields.imagen?.fields.file.url 
    ? `${metadataBase.protocol}://${metadataBase.host}${categoria.fields.imagen.fields.file.url}` 
    : `${domain}/og-image.jpg`;

  return {
    title: `${categoria.fields.nombre} | Categoría`,
    description: categoria.fields.descripcion || `Explora todas las publicaciones en la categoría ${categoria.fields.nombre}`,
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: `${domain}/categoria/${categoria.fields.slug}`,
      title: `${categoria.fields.nombre} | Categoría`,
      description: categoria.fields.descripcion || `Explora todas las publicaciones en la categoría ${categoria.fields.nombre}`,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: categoria.fields.nombre
      }]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@PublishMind',
      creator: '@PublishMind',
      images: [{
        url: imageUrl,
        alt: categoria.fields.nombre
      }]
    }
  };
}

// Generate metadata for tag page
export function generateTagMetadata(tag: string): Metadata {
  return {
    title: `#${tag} | Publicaciones etiquetadas`,
    description: `Explora todas las publicaciones etiquetadas con #${tag}`,
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: `${domain}/etiqueta/${tag}`,
      title: `#${tag} | Publicaciones etiquetadas`,
      description: `Explora todas las publicaciones etiquetadas con #${tag}`
    },
    twitter: {
      card: 'summary_large_image',
      site: '@PublishMind',
      creator: '@PublishMind'
    }
  };
}

// Helper function to extract a description from rich text content
function extractDescriptionFromContent(content: any): string {
  try {
    // Try to find the first paragraph with content
    const firstParagraph = content?.content?.find((item: any) => 
      item.nodeType === 'paragraph' && 
      item.content?.some((textNode: any) => textNode.value?.trim())
    );
    
    // Extract text from that paragraph
    if (firstParagraph) {
      const text = firstParagraph.content
        .filter((node: any) => node.nodeType === 'text')
        .map((node: any) => node.value)
        .join(' ')
        .trim();
      
      if (text) {
        // Truncate to a reasonable length for a meta description
        return text.length > 160 ? `${text.slice(0, 157)}...` : text;
      }
    }
  } catch (error) {
    console.error('Error extracting description from content:', error);
  }
  
  return 'Descubre contenido interesante en nuestra plataforma PublishMind. Navega por diversas categorías y encuentra información valiosa.';
}