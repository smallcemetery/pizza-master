/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { authController } from './controller';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await authController.auth(body);

    const response = NextResponse.json(result, { status: 200 });

    // Устанавливаем куку, чтобы middleware пустила юзера
    response.cookies.set('auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || 'Ошибка авторизации' },
      { status: 401 }, // 401 - Неавторизован
    );
  }
}
