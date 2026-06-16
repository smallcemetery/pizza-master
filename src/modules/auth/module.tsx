/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image';
import Link from 'next/link';
import pizza from '../../../public/pizza2.png';
import { AuthForm } from './feature/auth-form';

export const AuthModule = () => {
  return (
    <div className='flex justify-center items-center w-full min-h-screen bg-[#BFACC0] px-3 py-8 overflow-x-hidden'>
      <div className='w-full max-w-[450px] min-h-[420px] sm:min-h-[500px] rounded-[15px] bg-[#ffffff] border border-[#FDB4B4] shadow-grow relative p-4 sm:p-5 flex flex-col overflow-hidden'>
        <Image
          src={pizza}
          alt=''
          className='size-[100px] sm:size-[180px] md:size-[220px] absolute top-[-30px] sm:top-[-60px] right-[-20px] sm:right-[-70px] animate-rotate pointer-events-none select-none'
        />
        <div className='w-full flex flex-col gap-1 sm:gap-1.5 relative z-10'>
          <h1 className='text-base sm:text-lg'>Авторизация</h1>
          <p className='leading-snug text-xs sm:text-sm'>
            для полного доступа к функциям сайта
          </p>
        </div>
        <div className='relative z-10 mt-2'>
          <AuthForm />
        </div>
        <div className='w-full flex-1 flex justify-end items-end text-right relative z-10 pt-4'>
          <Link href='/registration' className='w-max h-max flex'>
            <p className='text-[10px] sm:text-xs leading-snug'>
              У тебя нет аккаунта? <br /> регистрация
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
