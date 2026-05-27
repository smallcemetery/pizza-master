/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useBasket } from './hooks/use-basket';

export const BasketModule = () => {
  const [count, setCount] = useState(1);
  const { data } = useBasket();

  console.log(data, 'данные корзины');

  return (
    <div className='w-full bg-[#e8d8c9] flex px-[200px] gap-[50px] pt-[50px]'>
      <div className='w-[300px] h-[250px] bg-white rounded-[5px] p-[15px] flex flex-col'>
        <h1>Оформление</h1>
        <div className='w-full flex flex-1 flex-col px-[10px] gap-[10px] overflow-y-auto'>
          {data &&
            data.items.map((item: any) => (
              <div className='flex items-center' key={item.id}>
                <div className='flex-1 flex flex-col'>
                  <p>{item.food.name}</p>
                  <p>{item.food.price}р</p>
                </div>
                <p>x {item.quantity}</p>
              </div>
            ))}
        </div>
        <Button className='cursor-pointer hover:bg-amber-50 hover:text-black hover:border border-black'>Оформить</Button>
      </div>
      <div className='flex flex-1 h-[200px] rounded-[5px] border border-black justify-between items-center bg-white px-[20px] py-[30px] gap-[15px]'>
        <div className='size-[150px] bg-amber-200 rounded-full' />
        <div className='flex flex-col w-max h-full justify-between'>
          <div>
            <h1>Пицца Ассорти</h1>
            <p>450р</p>
          </div>
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
        </div>
        <p className='h-full'>то из чего делалась пицца </p>
      </div>
      <div className='w-[300px] h-[250px] bg-white rounded-[5px] p-[15px]'>адрес чет там еще можно указать</div>
    </div>
  );
};
