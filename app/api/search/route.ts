import { NextResponse } from 'next/server';
import { searchPublicaciones } from '@/lib/contentful';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query?.trim()) {
      return NextResponse.json({ items: [] });
    }

    const results = await searchPublicaciones(query);
    
    // Transform results to include only necessary data
    const transformedResults = results.items.map(item => ({
      sys: {
        id: item.sys.id
      },
      fields: {
        titulo: item.fields.titulo,
        slug: item.fields.slug,
        contenido: item.fields.contenido,
        autor: item.fields.autor,
        fechaPublicacion: item.fields.fechaPublicacion,
        categoria: {
          fields: {
            nombre: item.fields.categoria.fields.nombre,
            slug: item.fields.categoria.fields.slug
          }
        },
        tags: item.fields.tags,
        imagenDestacada: item.fields.imagenDestacada
      }
    }));

    return NextResponse.json({ 
      items: transformedResults,
      total: results.total
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Error al realizar la búsqueda', items: [] }, 
      { status: 500 }
    );
  }
}