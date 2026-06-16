import { formatShortAddress } from '@/shared/utils/format-dadata-address';
import { NextResponse } from 'next/server';

type DadataSuggestion = {
  value: string;
  data: Parameters<typeof formatShortAddress>[0];
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();
    const apiKey = process.env.DADATA_API_KEY;

    if (!q || q.length < 3) {
      return NextResponse.json([]);
    }

    if (!apiKey) {
      console.warn('DADATA_API_KEY не задан — подсказки адресов недоступны');
      return NextResponse.json([]);
    }

    const res = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify({ query: q, count: 8 }),
    });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const json = (await res.json()) as { suggestions?: DadataSuggestion[] };
    const seen = new Set<string>();
    const suggestions: string[] = [];

    for (const item of json.suggestions ?? []) {
      const short = formatShortAddress(item.data);
      if (!short || seen.has(short)) continue;
      seen.add(short);
      suggestions.push(short);
    }

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('DaData address suggest error:', error);
    return NextResponse.json([]);
  }
}
