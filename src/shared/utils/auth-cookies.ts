import { isAdminEmail } from '@/shared/utils/admin';
import type { NextResponse } from 'next/server';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
} as const;

export function applySessionCookies(response: NextResponse, email: string) {
  response.cookies.set('auth', 'true', COOKIE_OPTS);

  if (isAdminEmail(email)) {
    response.cookies.set('admin', 'true', COOKIE_OPTS);
  } else {
    response.cookies.set('admin', '', { ...COOKIE_OPTS, maxAge: 0 });
  }
}

export function clearSessionCookies(response: NextResponse) {
  response.cookies.set('auth', '', { ...COOKIE_OPTS, maxAge: 0 });
  response.cookies.set('admin', '', { ...COOKIE_OPTS, maxAge: 0 });
}
