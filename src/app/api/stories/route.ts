import { prisma } from '@/shared/utils/db';
import { normalizeSupabaseImageUrl } from '@/shared/utils/supabase-image';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const normalized = stories.map((story) => ({
      ...story,
      image: normalizeSupabaseImageUrl(story.image) ?? story.image,
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error('Ошибка при получении историй:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
