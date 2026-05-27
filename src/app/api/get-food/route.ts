/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/shared/utils/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await prisma.food.findMany();
    return NextResponse.json(data);
  } catch (err: any) {
    console.log(err, ' ошибка при получении данные каталогов');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
