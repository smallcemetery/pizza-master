'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Actions } from './feature/actions';
import { Food } from './feature/food';
import { Stories } from './feature/stories';

const Category = [
  { id: 1, name: 'Еда', component: <Food /> },
  { id: 2, name: 'Акции', component: <Actions /> },
  { id: 3, name: 'Истории', component: <Stories /> },
];

export const AdminModule = () => {
  const [state, setState] = useState(<Food />);

  return (
    <div className='w-full min-h-screen bg-[#e8d8c9] px-3 sm:px-6 py-4 sm:py-6'>
      <div className='w-full max-w-[900px] mx-auto min-h-[480px] rounded-xl sm:rounded-[4px] bg-[#fff3e6] p-3 sm:p-5 flex flex-col border border-black/10'>
        <div className='w-full flex flex-wrap gap-2 mb-3 sm:mb-4'>
          {Category.map(({ id, name, component }) => (
            <Button
              key={id}
              onClick={() => setState(component)}
              className='text-xs sm:text-sm border border-black cursor-pointer'>
              {name}
            </Button>
          ))}
        </div>
        <div className='w-full flex-1 flex justify-center items-start overflow-auto min-h-0'>{state}</div>
      </div>
    </div>
  );
};
