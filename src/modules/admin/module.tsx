'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Actions } from './feature/actions';
import { Food } from './feature/food';
import { Stories } from './feature/stories';

const Category = [
  {
    id: 1,
    name: 'Еда',
    component: <Food />,
  },
  {
    id: 2,
    name: 'Акции',
    component: <Actions />,
  },
  {
    id: 3,
    name: 'Истории',
    component: <Stories />,
  },
];

export const AdminModule = () => {
  const [state, setState] = useState(<Food />);

  return (
    <div className='flex justify-center items-center w-full'>
      <div className='w-[900px] h-[600px] rounded-[4px] bg-[#fff3e6] p-[20px] flex flex-col'>
        <div className='w-full h-[60px]'>
          {Category.map(({ id, name, component }) => (
            <Button key={id} onClick={() => setState(component)}>
              {name}
            </Button>
          ))}
        </div>
        <div className='w-full flex-1 flex justify-center items-center'>{state}</div>
      </div>
    </div>
  );
};
