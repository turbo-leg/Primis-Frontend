import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://primis-full-stack.onrender.com';
    
    console.log(`[Proxy] Attempting login to: ${apiUrl}/api/v1/auth/login`);
    
    const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log(`[Proxy] Backend response status: ${response.status}`);
    console.log(`[Proxy] Backend response body preview: ${responseText.substring(0, 200)}`);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('[Proxy] Failed to parse backend response as JSON');
      return NextResponse.json(
        { error: 'Invalid response from backend server', details: responseText },
        { status: 502 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Proxy] Internal server error:', error);
    return NextResponse.json(
      { error: 'Internal proxy error', message: error.message },
      { status: 500 }
    );
  }
}
