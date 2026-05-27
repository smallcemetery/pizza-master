import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@base-ui/react/button';
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

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card name={name} price={price} image={image} id={id} />
      </DrawerTrigger>
      <DrawerContent className='h-[400px]'>
        <DrawerHeader>
          <DrawerTitle>{name}</DrawerTitle>
          <DrawerDescription>{price}р</DrawerDescription>
        </DrawerHeader>
        <div className='mx-auto w-full max-w-sm flex flex-col gap-[20px] items-center'>
          <div className='flex gap-[50px]'>
            {image ? (
              <Image src={image} alt='nf' className='size-[150px]' width={150} height={150} />
            ) : (
              <div className='size-[150px] rounded-full bg-amber-300' />
            )}
            <p className='flex-1'>{compound}</p>
          </div>
          <DrawerFooter className='flex flex-row gap-[100px]'>
            <div className='flex gap-[10px] items-center mr-[30px]'>
              <Button
                onClick={() => setCount(count - 1)}
                disabled={count < 2}
                className='bg-transparent text-black cursor-pointer border border-black w-max px-2 hover:bg-slate-100'>
                -
              </Button>
              <p className='text-black text-[14px]'>{count}</p>
              <Button
                onClick={() => setCount(count + 1)}
                className='bg-transparent text-black cursor-pointer border border-black w-max px-2 hover:bg-slate-100'>
                +
              </Button>
            </div>
            <Button className='bg-transparent text-black cursor-pointer border border-black w-[100px] h-[30px] px-4 hover:bg-slate-100'>
              В корзину
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
