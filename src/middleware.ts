import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/home',
  '/about',
  '/contacts',
  '/corporate',
  '/basket',
  '/authorization',
  '/registration',
];

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get('auth')?.value === 'true';
  const isAdmin = request.cookies.get('admin')?.value === 'true';
  const { pathname } = request.nextUrl;

  const isPublicPage = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (pathname.startsWith('/admin')) {
    if (!isAuth) {
      const loginUrl = new URL('/authorization', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/profile') && !isAuth) {
    const loginUrl = new URL('/authorization', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && (pathname.startsWith('/authorization') || pathname.startsWith('/registration'))) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  if (!isAuth && !isPublicPage) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)'],
};
