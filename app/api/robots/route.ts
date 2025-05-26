export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://publishmind.com';
    
    const content = `# https://www.robotstxt.org/robotstxt.html
  User-agent: *
  Allow: /
  Disallow: /api/*
  Disallow: /_next/*
  
  # Host
  Host: ${baseUrl}
  
  # Sitemaps
  Sitemap: ${baseUrl}/sitemap.xml`;
  
    return new Response(content, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=59',
      },
    });
  }