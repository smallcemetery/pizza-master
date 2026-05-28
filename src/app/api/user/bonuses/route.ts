import { prisma } from '@/shared/utils/db';
import { NextResponse } from 'next/server';

const MAX_SNAKE_BONUS = 50;

export async function PATCH(req: Request) {
  try {
    const { userId, earned } = await req.json();

    if (!userId || typeof earned !== 'number') {
      return NextResponse.json({ error: 'userId and earned are required' }, { status: 400 });
    }

    const bonusToAdd = Math.min(Math.max(0, Math.floor(earned)), MAX_SNAKE_BONUS);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { bonuses: { increment: bonusToAdd } },
    });

    return NextResponse.json({ user, added: bonusToAdd });
  } catch (error) {
    console.error('Ошибка при начислении бонусов:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
