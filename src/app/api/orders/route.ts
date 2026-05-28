import { prisma } from '@/shared/utils/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      deliveryType,
      deliveryTime,
      paymentMethod,
      bonusUsed = 0,
      address,
    } = body;

    if (!userId || !deliveryType || !deliveryTime || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const basket = await prisma.basket.findUnique({
      where: { userId },
      include: { items: { include: { food: true } } },
    });

    if (!basket?.items.length) {
      return NextResponse.json({ error: 'Корзина пуста' }, { status: 400 });
    }

    const subtotal = basket.items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const appliedBonus = Math.min(bonusUsed, user.bonuses, subtotal);
    const total = Math.max(0, subtotal - appliedBonus);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          deliveryType,
          deliveryTime,
          paymentMethod,
          bonusUsed: appliedBonus,
          total,
          address: address ?? null,
          items: {
            create: basket.items.map((item) => ({
              foodId: item.foodId,
              foodName: item.food.name,
              price: item.food.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      if (appliedBonus > 0) {
        await tx.user.update({
          where: { id: userId },
          data: { bonuses: { decrement: appliedBonus } },
        });
      }

      await tx.basketItem.deleteMany({ where: { basketId: basket.id } });

      return created;
    });

    const updatedUser = await prisma.user.findUnique({ where: { id: userId } });

    return NextResponse.json({ order, user: updatedUser }, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
    const tableMissing =
      message.includes('does not exist') ||
      message.includes('Order') ||
      (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === 'P2021');

    return NextResponse.json(
      {
        error: tableMissing
          ? 'Таблица заказов не найдена в базе данных'
          : 'Не удалось создать заказ',
        details: message,
        hint: tableMissing ? 'Выполните в терминале: npx prisma migrate deploy' : undefined,
      },
      { status: 500 },
    );
  }
}
