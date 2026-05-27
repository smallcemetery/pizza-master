/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image';
import Link from 'next/link';
import pizza from '../../../public/pizza2.png';
import { AuthForm } from './feature/auth-form';

export const AuthModule = () => {
  return (
    <div className='flex justify-center items-center w-full bg-[#BFACC0]'>
      <div className='w-[450px] h-[500px] rounded-[15px] bg-[#ffffff] border border-[#FDB4B4] shadow-grow relative p-[20px] flex flex-col'>
        <Image src={pizza} alt='nf' className='size-[250px] absolute top-[-90px] right-[-90px] animate-rotate' />
        <div className='w-full h-[100px] flex flex-col gap-[5px]'>
          <h1>Authorization</h1>
          <p className='leading-4 text-[14px]'>
            for full access to the <br /> site's features
          </p>
        </div>
        <AuthForm />
        <div className='w-full flex-1 flex justify-end items-end text-right'>
          <Link href='/registration' className='w-max h-max flex'>
            <p className='text-[10px] leading-4 w-max h-max'>
              Don't you have an account? <br /> registred
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
