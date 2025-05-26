import { createClient } from 'contentful';
import type { Categoria, Publicacion, ContentfulResponse } from './types';

// Safely get env vars with build-time validation
function getContentfulConfig() {
  // These will only be checked during build/SSR
  if (typeof window === 'undefined') {
    const requiredVars = ['CONTENTFUL_SPACE_ID', 'CONTENTFUL_ACCESS_TOKEN', 'CONTENTFUL_PREVIEW_TOKEN'];
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        console.error(`Missing required Contentful env var: ${varName}`);
      }
    }
  }

  return {
    spaceId: process.env.CONTENTFUL_SPACE_ID || '',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
    previewToken: process.env.CONTENTFUL_PREVIEW_TOKEN || '',
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master'
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
    if (!previewClient) console.error('Preview client not initialized - check env vars');
    return previewClient || client;
  }
  if (!client) console.error('Client not initialized - check env vars');
  return client || previewClient;
};

// Fetch all publications with options for filtering
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
    order: '-sys.createdAt',
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

// Get a single publication by slug
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

// Fetch all categories
export async function getCategorias(preview: boolean = false): Promise<Categoria[]> {
  const client = getClient(preview);
  if (!client) {
    throw new Error('Contentful client not initialized - check environment variables');
  }

  const response = await client.getEntries({
    content_type: 'categoria',
    order: ['fields.nombre'],
    include: 1,
  });

  return response.items as unknown as Categoria[];
}

// Get a single category by slug
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

// Get all unique tags from publications
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

// Search publications across all relevant fields
export async function searchPublicaciones(
  query: string, 
  preview: boolean = false
): Promise<ContentfulResponse> {
  const client = getClient(preview);
  if (!client) {
    throw new Error('Contentful client not initialized');
  }

  // Search across multiple fields
  const response = await client.getEntries({
    content_type: 'publicacion',
    query,
    include: 2,
    // Search in these fields:
    'fields.titulo[search]': query,
    'fields.contenido[search]': query,
    'fields.tags[search]': query,
    'fields.autor[search]': query,
    'fields.categoria.fields.nombre[search]': query
  });

  return response as unknown as ContentfulResponse;
}