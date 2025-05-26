import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { prompt, category } = await request.json();
    
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_AUTO;
    if (!webhookUrl) {
      throw new Error('Webhook URL no configurada');
    }

    console.log('URL completa del webhook:', webhookUrl);
    console.log('Datos enviados:', { prompt, category });
    
    const response = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_AUTO || '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        category,
        contentfulSpaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
        contentfulAccessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
      })
    });

    console.log('Status del webhook:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del webhook:', errorText);
      throw new Error(`Error del webhook: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en generate-content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}