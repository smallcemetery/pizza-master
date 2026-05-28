import { prisma } from '@/shared/utils/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'itemId is required' }, { status: 400 });
    }

    await prisma.basketItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Ошибка при удалении из корзины:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
