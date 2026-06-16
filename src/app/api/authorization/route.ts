/* eslint-disable @typescript-eslint/no-explicit-any */
import { applySessionCookies } from '@/shared/utils/auth-cookies';
import { sanitizeUser } from '@/shared/utils/admin';
import { NextResponse } from 'next/server';
import { authController } from './controller';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await authController.auth(body);

    const response = NextResponse.json(
      {
        ...result,
        user: sanitizeUser(result.user),
      },
      { status: 200 },
    );

    applySessionCookies(response, result.user.email);

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || 'Ошибка авторизации' },
      { status: 401 },
    );
  }
}
