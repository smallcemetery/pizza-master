import Image from 'next/image';
import React, { forwardRef } from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  category?: string;
  name: string;
  compound?: string;
  price: number;
  image: string;
  id: string;
}

export const Card = forwardRef<HTMLDivElement, Props>(({ name, price, image, ...props }, ref) => {
  return (
    <div
      className='w-full max-w-[180px] min-w-0 h-auto min-h-[220px] sm:min-h-[250px] border border-black flex flex-col py-[8px] sm:py-[10px] items-center cursor-pointer hover:shadow-grow hover:translate-y-[-4px] sm:hover:translate-y-[-10px] transition-all duration-300 ease-out rounded-sm bg-white/50'
      ref={ref}
      {...props}>
      {image ? (
        <Image
          src={image}
          alt={name}
          width={150}
          height={150}
          className='rounded-full size-[100px] sm:size-[130px] md:size-[150px] object-cover shrink-0'
        />
      ) : (
        <div className='bg-emerald-400 size-[100px] sm:size-[130px] md:size-[150px] rounded-full shrink-0' />
      )}
      <p className='pt-[5px] px-2 text-center text-xs sm:text-sm line-clamp-2 w-full'>{name}</p>
      <div className='w-full flex-1 px-[12px] sm:px-[20px] flex items-end pb-[8px]'>
        <p className='w-full text-center text-sm sm:text-base border border-black py-[6px] bg-transparent'>{price} ₽</p>
      </div>
    </div>
  );
});

Card.displayName = 'Card';
