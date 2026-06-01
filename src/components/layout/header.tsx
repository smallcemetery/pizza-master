'use client';

import { LOGO_SRC, SITE_NAME } from '@/shared/config/site';
import { userAtom } from '@/store/user';
import { useAtomValue } from 'jotai/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/about', label: 'О нас' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/corporate', label: 'Корпоративные заказы' },
] as const;

export const Header = () => {
  const user = useAtomValue(userAtom);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className='w-full min-h-[56px] sm:min-h-[60px] flex items-center justify-between gap-2 px-3 min-[375px]:px-4 min-[425px]:px-5 md:px-8 lg:px-12 xl:px-[100px] bg-[#e8d8c9] border-b border-black/10 sticky top-0 z-40'>
      <Link href='/home' className='flex items-center gap-2 min-w-0 shrink' onClick={() => setMenuOpen(false)}>
        <div className='w-9 h-9 shrink-0 overflow-hidden rounded-full'>
          <img
            src="/logo.png"
            alt="Логотип"
            className='w-full h-full object-cover'
          />
        </div>
        <span className='font-medium text-sm min-[375px]:text-base truncate max-w-[120px] min-[425px]:max-w-none'>
          {SITE_NAME}
        </span>
      </Link>

      <nav className='hidden lg:flex gap-5 items-center text-sm'>
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className='hover:underline underline-offset-4 whitespace-nowrap'>
            {label}
          </Link>
        ))}
      </nav>

      <div className='hidden lg:flex gap-5 items-center text-sm shrink-0'>
        <Link href='/basket' className='hover:underline underline-offset-4'>
          Корзина
        </Link>
        <Link href='/profile' className='hover:underline underline-offset-4 hover:text-[#FDB4B4] max-w-[180px] truncate'>
          {user?.email ?? 'Профиль'}
        </Link>
      </div>

      <button
        type='button'
        className='lg:hidden border border-black px-3 py-1.5 text-xs sm:text-sm bg-white/60 cursor-pointer'
        aria-expanded={menuOpen}
        aria-label='Меню'
        onClick={() => setMenuOpen((v) => !v)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <div className='absolute left-0 right-0 top-full bg-[#FFF3E6] border-b border-black shadow-md lg:hidden flex flex-col py-3 px-4 gap-3 text-sm z-50'>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className='py-1' onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href='/basket' className='py-1' onClick={() => setMenuOpen(false)}>
            Корзина
          </Link>
          <Link href='/profile' className='py-1 truncate' onClick={() => setMenuOpen(false)}>
            {user?.email ?? 'Профиль'}
          </Link>
        </div>
      )}
    </header>
  );
};
