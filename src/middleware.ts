import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get('auth')?.value === 'true'; // получаем куку под названием auth и проверяем на значение ( если true )

  const { pathname } = request.nextUrl;
  console.log('---> Middleware running on:', pathname);

  const publicPaths = ['/authorization', '/registration']; // пути которые будут работать без флага isAuth

  const isPublicPage = publicPaths.some((path) => pathname.startsWith(path)); // это проверка находится ли юзер на разрешенной странице сейчас или нет

  // Логика перенаправления

  if (!isAuth && !isPublicPage) {
    // Если пользователь не авторизован и пытается зайти на любую страницу, кроме auth/reg
    return NextResponse.redirect(new URL('/authorization', request.url));
  }

  // Если авторизован и пытается зайти на страницы логина — можно кинуть в профиль или на главную
  if (isAuth && isPublicPage) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

//Конфиг, чтобы мидлвара не срабатывала на картинки, статику и системные файлы
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // это паттерн файлов ( как паттерн валидации просто загугли и поймешь за 3 минуты)
};
