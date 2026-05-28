/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/shared/utils/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, foodId, quantity: rawQty } = body;
    const addQty = Math.max(1, Math.floor(Number(rawQty) || 1));

    // 1. ЖЕСТКАЯ ПРОВЕРКА: если foodId не пришел, стопаем всё
    if (!foodId) {
      return NextResponse.json({ error: 'foodId is missing' }, { status: 400 });
    }

    const finalUserId = typeof userId === 'object' ? userId.id : userId;

    if (!finalUserId) {
      return NextResponse.json({ error: 'userId is missing' }, { status: 400 });
    }

    // 2. Ищем или создаем корзину
    let basket = await prisma.basket.findUnique({
      where: { userId: finalUserId },
    });

    if (!basket) {
      basket = await prisma.basket.create({
        data: { userId: finalUserId },
      });
    }

    // 3. Ищем товар в корзине
    const existingItem = await prisma.basketItem.findFirst({
      where: {
        basketId: basket.id,
        foodId: foodId,
      },
    });

    if (existingItem) {
      // Обновляем
      const updated = await prisma.basketItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + addQty },
      });
      return NextResponse.json(updated);
    } else {
      // СОЗДАЕМ НОВЫЙ (используем connect, чтобы Prisma не ругалась)
      const newItem = await prisma.basketItem.create({
        data: {
          quantity: addQty,
          // Вместо basketId: basket.id пишем так, это надежнее:
          basket: { connect: { id: basket.id } },
          food: { connect: { id: foodId } },
        },
      });
      return NextResponse.json(newItem);
    }
  } catch (error: any) {
    console.error('ОШИБКА:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
