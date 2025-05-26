import { createClient } from 'contentful';
import type { Categoria, Publicacion, ContentfulResponse } from './types';

// Safely get env vars with build-time validation
function getContentfulConfig() {
  return {
    spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
    previewToken: process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_TOKEN || '',
    environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'
  };
}

const config = getContentfulConfig();

// Initialize clients with proper fallbacks
export const client = config.spaceId && config.accessToken
  ? createClient({
      space: config.spaceId,
      accessToken: config.accessToken,
      environment: config.environment
    })
  : null;

export const previewClient = config.spaceId && config.previewToken
  ? createClient({
      space: config.spaceId,
      accessToken: config.previewToken,
      environment: config.environment,
      host: 'preview.contentful.com'
    })
  : null;

export const getClient = (preview: boolean = false) => {
  if (preview) {
    return previewClient || client;
  }
  return client || previewClient;
};

// Rest of the file remains unchanged
export async function getPublicaciones({ 
  limit = 10, 
  skip = 0, 
  categoria = '', 
  tag = '', 
  preview = false 
} = {}) {
  const client = getClient(preview);
  if (!client) {
    throw new Error('Contentful client not initialized - check environment variables');
  }

  const filters: any = {
    content_type: 'publicacion',
    order: ['-sys.createdAt'],
    limit,
    skip,
    include: 2,
  };

  if (categoria) {
    filters['fields.categoria.sys.contentType.sys.id'] = 'categoria';
    filters['fields.categoria.fields.slug'] = categoria;
  }

  if (tag) {
    filters['fields.tags[in]'] = tag;
  }

  const response = await client.getEntries(filters);
  return response as unknown as ContentfulResponse;
}

export async function getPublicacionBySlug(slug: string, preview: boolean = false): Promise<Publicacion | null> {
  const client = getClient(preview);
  if (!client) {
    throw new Error('Contentful client not initialized - check environment variables');
  }

  const response = await client.getEntries({
    content_type: 'publicacion',
    'fields.slug': slug,
    include: 2,
  });

  return response.items[0] as unknown as Publicacion || null;
}

export async function getCategorias(preview: boolean = false): Promise<Categoria[]> {
  const client = getClient(preview);
  if (!client) {
    throw new Error('Contentful client not initialized - check environment variables');
  }

  try {
    const response = await client.getEntries({
      content_type: 'categoria',
      order: ['fields.nombre'],
      include: 1,
    });

    if (!response.items) {
      console.error('No categories found in Contentful');
      return [];
    }

    return response.items as unknown as Categoria[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoriaBySlug(slug: string, preview = false): Promise<Categoria | null> {
  const client = getClient(preview);
  if (!client) {
    throw new Error('Contentful client not initialized - check environment variables');
  }

  const response = await client.getEntries({
    content_type: 'categoria',
    'fields.slug': slug,
    limit: 1,
    include: 2,
  });

  return response.items[0] as unknown as Categoria || null;
}

export async function getAllTags(preview: boolean = false): Promise<string[]> {
  const client = getClient(preview);
  if (!client) {
    throw new Error('Contentful client not initialized - check environment variables');
  }

  const response = await client.getEntries({
    content_type: 'publicacion',
    select: ['fields.tags'],
    limit: 1000,
  });
  
  const allTags = response.items
    .map(item => (item.fields as any).tags)
    .filter(Boolean)
    .flat();
  
  return [...new Set(allTags)];
}

export async function searchPublicaciones(
  query: string, 
  preview: boolean = false
): Promise<ContentfulResponse> {
  const client = getClient(preview);
  if (!client) {
    throw new Error('Contentful client not initialized');
  }

  const searchQuery = query.toLowerCase().trim();

  try {
    const response = await client.getEntries({
      content_type: 'publicacion',
      limit: 12,
      include: 2,
      'query': searchQuery,
      'fields.titulo[match]': searchQuery,
      'fields.contenido[match]': searchQuery,
      'fields.autor[match]': searchQuery,
      'fields.tags[in]': searchQuery,
      'fields.categoria.fields.nombre[match]': searchQuery,
      order: ['-sys.createdAt']
    });

    return response as unknown as ContentfulResponse;
  } catch (error) {
    console.error('Search error:', error);
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: 12,
    } as unknown as ContentfulResponse;
  }
}