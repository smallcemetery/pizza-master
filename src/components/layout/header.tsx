'use client';
import { userAtom } from '@/store/user';
import { useAtomValue } from 'jotai/react';
import Link from 'next/link';

export const Header = () => {
  const user = useAtomValue(userAtom);

  return (
    <div className='w-full h-[60px] flex justify-between px-[100px] items-center bg-[#e8d8c9]'>
      <div>
        <Link href='/home'>Название</Link>
      </div>
      <div className='flex gap-[20px] items-center'>
        <Link href='/about' className='hover:underline-offset-4 hover:underline cursor-pointer'>
          О нас
        </Link>
        <Link href='/contacts' className='hover:underline-offset-4 hover:underline cursor-pointer'>
          Контакты
        </Link>
        <Link href='/corporate' className='hover:underline-offset-4 hover:underline cursor-pointer'>
          Корпоративные заказы
        </Link>
      </div>
      <div className='flex gap-[20px] items-center'>
        <Link href='/basket' className='hover:underline-offset-4 hover:underline cursor-pointer'>
          Корзина
        </Link>
        <Link href='/profile' className='hover:underline-offset-4 hover:underline cursor-pointer hover:text-[#FDB4B4]'>
          {user?.email}
        </Link>
      </div>
    </div>
  );
};
