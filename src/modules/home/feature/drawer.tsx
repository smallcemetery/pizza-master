'use client';

import { useAddBasket } from '@/components/hooks/add-basket-items';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import Image from 'next/image';
import { FC, useState } from 'react';
import { Card } from './card';

type Props = {
  category?: string;
  name: string;
  compound?: string;
  price: number;
  image: string;
  id: string;
};

export const DrawerFood: FC<Props> = ({ name, price, compound, image, id }) => {
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false);
  const [addedMsg, setAddedMsg] = useState('');
  const { mutate, isPending } = useAddBasket();

  const handleAdd = () => {
    mutate(
      { foodId: id, quantity: count },
      {
        onSuccess: () => {
          setAddedMsg('Добавлено в корзину');
          setTimeout(() => setAddedMsg(''), 2000);
          setOpen(false);
          setCount(1);
        },
        onError: () => {
          setAddedMsg('Ошибка добавления');
        },
      },
    );
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Card name={name} price={price} image={image} id={id} />
      </DrawerTrigger>
      <DrawerContent className='max-h-[90vh] bg-[#FFF3E6] border-t border-black'>
        <DrawerHeader className='px-4 sm:px-6'>
          <DrawerTitle className='text-base sm:text-lg line-clamp-2 text-center sm:text-left'>{name}</DrawerTitle>
          <DrawerDescription className='text-center sm:text-left'>{price} ₽</DrawerDescription>
        </DrawerHeader>
        <div className='mx-auto w-full max-w-lg px-4 sm:px-6 pb-2 flex flex-col gap-4 min-[768px]:flex-row min-[768px]:items-start min-[768px]:gap-6'>
          <div className='flex justify-center shrink-0'>
            {image ? (
              <Image
                src={image}
                alt={name}
                className='size-[120px] sm:size-[150px] rounded-full object-cover border border-black'
                width={150}
                height={150}
              />
            ) : (
              <div className='size-[120px] sm:size-[150px] rounded-full bg-amber-300 border border-black' />
            )}
          </div>
          <p className='flex-1 min-w-0 text-sm leading-relaxed line-clamp-4 sm:line-clamp-6 md:line-clamp-none text-ellipsis overflow-hidden'>
            {compound || 'Состав не указан'}
          </p>
        </div>
        <DrawerFooter className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 pb-6'>
          <div className='flex gap-3 items-center justify-center sm:justify-start'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              disabled={count < 2}
              className='border border-black bg-transparent text-black cursor-pointer min-w-[36px] px-2 hover:bg-slate-100'>
              −
            </Button>
            <span className='text-sm min-w-[24px] text-center'>{count}</span>
            <Button
              type='button'
              variant='outline'
              onClick={() => setCount((c) => c + 1)}
              className='border border-black bg-transparent text-black cursor-pointer min-w-[36px] px-2 hover:bg-slate-100'>
              +
            </Button>
          </div>
          <div className='flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto'>
            <Button
              type='button'
              disabled={isPending}
              onClick={handleAdd}
              className='w-full sm:w-auto border border-black bg-black text-white cursor-pointer hover:bg-black/90 disabled:opacity-50'>
              {isPending ? 'Добавляем...' : 'В корзину'}
            </Button>
            {addedMsg && <p className='text-xs text-center sm:text-right text-green-700'>{addedMsg}</p>}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
