'use client';
import { SnakeGameOverlay } from '@/components/game/snake-game';
import { userAtom } from '@/store/user';
import { useAtomValue } from 'jotai/react';
import { useState } from 'react';
import { ActionCarousel } from './feature/action-carousel';
import { DrawerFood } from './feature/drawer';
import { useFood } from './hooks/usefood';

const Catalog = [
  {
    id: 1,
    name: 'Пицца',
  },
  {
    id: 2,
    name: 'Комбо',
  },
  {
    id: 3,
    name: 'Десерты',
  },
  {
    id: 4,
    name: 'Закуски',
  },
  {
    id: 5,
    name: 'Напитки',
  },
];

export const HomeModule = () => {
  const user = useAtomValue(userAtom);
  console.log(user, 'данные юзера');
  const { data } = useFood();

  const [activeCategory, setActiveCategory] = useState(Catalog[0].name);
  const filteredData = data?.filter((item) => item.category === activeCategory) || [];

  return (
    <div className='flex flex-col items-center w-full bg-[#e8d8c9]'>
      <SnakeGameOverlay />
      <div className='w-full h-max py-[40px] flex justify-center'>
        <ActionCarousel />
      </div>
      <div className='w-full h-max bg-[#FFF3E6] rounded-3xl py-[10px]'>
        <div className='w-full max-w-[1000px] m-auto flex flex-col gap-[40px]'>
          <div className='w-full flex gap-[15px]'>
            {Catalog.map(({ id, name }) => (
              <p key={id} className='relative group inline-block cursor-pointer' onClick={() => setActiveCategory(name)}>
                {name}
                <span className='absolute left-0 -bottom-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full' />
              </p>
            ))}
          </div>
          <div className='w-full h-[900px] flex flex-wrap gap-[25px]'>
            {filteredData.length > 0 ? (
              filteredData.map(({ id, name, price, compound, image }) => (
                <DrawerFood key={id} name={name} price={price} compound={compound} image={image} id={id} />
              ))
            ) : (
              <p>В этой категории пока пусто или данные еще грузятся...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
