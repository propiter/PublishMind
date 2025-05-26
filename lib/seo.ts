import { Metadata } from 'next';
import { Publicacion, Categoria } from './types';

const siteConfig = {
  name: 'PublishMind',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://publishmind.com',
  ogImage: 'https://publishmind.com/og.jpg',
  description: 'Plataforma de contenido dinámico con publicaciones generadas manualmente y automáticamente.',
  twitter: '@PublishMind',
};

// Generate JSON-LD structured data for a blog post
export function generateArticleStructuredData(publicacion: Publicacion) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: publicacion.fields.titulo,
    description: extractDescription(publicacion.fields.contenido),
    image: publicacion.fields.imagenDestacada?.fields.file.url 
      ? `https:${publicacion.fields.imagenDestacada.fields.file.url}`
      : siteConfig.ogImage,
    datePublished: publicacion.fields.fechaPublicacion,
    dateModified: publicacion.sys.updatedAt,
    author: {
      '@type': 'Person',
      name: publicacion.fields.autor || 'PublishMind',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/publicacion/${publicacion.fields.slug}`,
    },
    keywords: publicacion.fields.tags?.join(', '),
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

// Generate website structured data
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/buscar?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// Extract description from rich text content
export function extractDescription(content: any, maxLength = 160): string {
  try {
    const firstParagraph = content?.content?.find((item: any) => 
      item.nodeType === 'paragraph' && 
      item.content?.some((textNode: any) => textNode.value?.trim())
    );
    
    if (firstParagraph) {
      const text = firstParagraph.content
        .filter((node: any) => node.nodeType === 'text')
        .map((node: any) => node.value)
        .join(' ')
        .trim();
      
      return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
    }
  } catch (error) {
    console.error('Error extracting description:', error);
  }
  
  return siteConfig.description;
}

// Generate metadata for the home page
export function generateHomeMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ['blog', 'contenido', 'publicaciones', 'artículos'],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [{ url: siteConfig.ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    alternates: {
      canonical: siteConfig.url,
      languages: {
        'es-ES': '/es',
      },
    },
  };
}

// Generate metadata for a blog post
export function generatePublicacionMetadata(publicacion: Publicacion): Metadata {
  const url = `${siteConfig.url}/publicacion/${publicacion.fields.slug}`;
  const description = extractDescription(publicacion.fields.contenido);
  const image = publicacion.fields.imagenDestacada?.fields.file.url 
    ? `https:${publicacion.fields.imagenDestacada.fields.file.url}`
    : siteConfig.ogImage;

  return {
    title: publicacion.fields.titulo,
    description,
    keywords: publicacion.fields.tags,
    authors: [{ name: publicacion.fields.autor || siteConfig.name }],
    openGraph: {
      type: 'article',
      url,
      title: publicacion.fields.titulo,
      description,
      images: [{ url: image }],
      publishedTime: publicacion.fields.fechaPublicacion,
      modifiedTime: publicacion.sys.updatedAt,
      authors: [publicacion.fields.autor || siteConfig.name],
      tags: publicacion.fields.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: publicacion.fields.titulo,
      description,
      images: [image],
      creator: siteConfig.twitter,
    },
    alternates: {
      canonical: url,
    },
  };
}

// Generate metadata for a category page
export function generateCategoriaMetadata(categoria: Categoria): Metadata {
  const url = `${siteConfig.url}/categoria/${categoria.fields.slug}`;
  const title = `${categoria.fields.nombre} | Categoría`;
  const description = categoria.fields.descripcion || 
    `Explora todas las publicaciones en la categoría ${categoria.fields.nombre}`;
  const image = categoria.fields.imagen?.fields.file.url 
    ? `https:${categoria.fields.imagen.fields.file.url}`
    : siteConfig.ogImage;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
  };
}

// Generate metadata for a tag page
export function generateTagMetadata(tagName: string): Metadata {
  return {
    title: `Publicaciones sobre ${tagName} | PublishMind`,
    description: `Explora las últimas publicaciones etiquetadas con ${tagName} en PublishMind`,
    openGraph: {
      title: `Publicaciones sobre ${tagName} | PublishMind`,
      description: `Artículos y contenido relacionado con ${tagName}`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/etiqueta/${encodeURIComponent(tagName)}`,
      siteName: 'PublishMind',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Publicaciones sobre ${tagName} | PublishMind`,
      description: `Artículos y contenido relacionado con ${tagName}`,
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og-image.png`],
    },
  };
}