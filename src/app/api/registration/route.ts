/* eslint-disable @typescript-eslint/no-explicit-any */
import { applySessionCookies } from '@/shared/utils/auth-cookies';
import { sanitizeUser } from '@/shared/utils/admin';
import { NextResponse } from 'next/server';
import { registerController } from './controller';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await registerController.register(body);

    const response = NextResponse.json(
      {
        ...result,
        user: sanitizeUser(result.user),
      },
      { status: 201 },
    );

    applySessionCookies(response, result.user.email);

    return response;
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Ошибка сервера' }, { status: 500 });
  }
}
