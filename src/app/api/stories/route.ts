import { prisma } from '@/shared/utils/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(stories);
  } catch (error) {
    console.error('Ошибка при получении историй:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
