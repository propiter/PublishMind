import { getPublicaciones, getCategorias, getAllTags } from '@/lib/contentful';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://publishmind.com';

  try {
    // Fetch all dynamic content
    const [publicaciones, categorias, tags] = await Promise.all([
      getPublicaciones({ limit: 1000 }),
      getCategorias(),
      getAllTags(),
    ]);

    // Create XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/categorias</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/etiquetas</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${publicaciones.items.map((pub: any) => `
  <url>
    <loc>${baseUrl}/publicacion/${pub.fields.slug}</loc>
    <lastmod>${pub.sys.updatedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  ${categorias.map((cat: any) => `
  <url>
    <loc>${baseUrl}/categoria/${cat.fields.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  ${tags.map((tag: string) => `
  <url>
    <loc>${baseUrl}/etiqueta/${encodeURIComponent(tag)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`).join('')}
</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}