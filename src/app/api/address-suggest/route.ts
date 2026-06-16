import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 3) {
      return NextResponse.json([]);
    }

    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '6');
    url.searchParams.set('countrycodes', 'ru');

    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'PizzaMasterApp/1.0',
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const data = (await res.json()) as { display_name: string }[];
    const suggestions = data.map((item) => item.display_name);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Address suggest error:', error);
    return NextResponse.json([]);
  }
}
