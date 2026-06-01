import { prisma } from '@/shared/utils/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        city: true,
        street: true,
        home: true,
        apartment: true,
        numbering: true,
        bonuses: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
