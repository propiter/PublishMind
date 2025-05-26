import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const publicationData = await request.json();
    
    const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_MANUAL || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...publicationData,
        contentfulSpaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
        contentfulAccessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit publication');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}