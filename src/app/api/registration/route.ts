/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { registerController } from './controller';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerController.register(body);

    const response = NextResponse.json(result, { status: 201 });

    // ЗАПИСЫВАЕМ КУКУ
    response.cookies.set('auth', 'true', {
      httpOnly: true, // чтобы нельзя было украсть через JS
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Ошибка сервера' }, { status: 500 });
  }
}
