import { prisma } from '@/shared/utils/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const actions = await prisma.action.findMany();
    return NextResponse.json(actions);
  } catch (error) {
    console.error('Ошибка при получении акций:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
