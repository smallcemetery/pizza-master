import { prisma } from '@/shared/utils/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const basket = await prisma.basket.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            food: true, // Сразу тянем данные о еде (название, цена, состав)
          },
        },
      },
    });

    // Если корзины в базе вообще нет, возвращаем объект с пустым массивом
    // Это избавит тебя от проверок типа basket?.items?.map...
    if (!basket) {
      return NextResponse.json({ items: [] });
    }

    return NextResponse.json(basket);
  } catch (error) {
    console.error('Ошибка при получении корзины:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
