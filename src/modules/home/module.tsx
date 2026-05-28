'use client';
import { SnakeGameOverlay } from '@/components/game/snake-game';
import { useState } from 'react';
import { ActionCarousel } from './feature/action-carousel';
import { DrawerFood } from './feature/drawer';
import { useFood } from './hooks/usefood';

const Catalog = [
  { id: 1, name: 'Пицца' },
  { id: 2, name: 'Комбо' },
  { id: 3, name: 'Десерты' },
  { id: 4, name: 'Закуски' },
  { id: 5, name: 'Напитки' },
];

export const HomeModule = () => {
  const { data, isLoading } = useFood();
  const [activeCategory, setActiveCategory] = useState(Catalog[0].name);
  const filteredData = data?.filter((item) => item.category === activeCategory) || [];

  return (
    <div className='flex flex-col items-center w-full bg-[#e8d8c9] min-h-screen'>
      <SnakeGameOverlay />
      <div className='w-full py-6 sm:py-8 md:py-10 flex justify-center px-2 min-[375px]:px-3'>
        <ActionCarousel />
      </div>
      <div className='w-full bg-[#FFF3E6] rounded-t-3xl py-4 sm:py-6 md:py-8 px-3 min-[375px]:px-4 md:px-6'>
        <div className='w-full max-w-[1000px] mx-auto flex flex-col gap-6 md:gap-10'>
          <div className='w-full flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center sm:justify-start'>
            {Catalog.map(({ id, name }) => (
              <button
                key={id}
                type='button'
                className={`relative text-xs min-[375px]:text-sm sm:text-base px-2 py-1 cursor-pointer ${
                  activeCategory === name ? 'font-medium' : ''
                }`}
                onClick={() => setActiveCategory(name)}>
                {name}
                <span
                  className={`absolute left-0 -bottom-0 h-px bg-black transition-all duration-300 ${
                    activeCategory === name ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className='w-full min-h-[200px] grid grid-cols-2 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 justify-items-center'>
            {isLoading && <p className='col-span-full text-sm text-center py-10'>Загрузка меню...</p>}
            {!isLoading && filteredData.length > 0 ? (
              filteredData.map(({ id, name, price, compound, image }) => (
                <DrawerFood key={id} name={name} price={price} compound={compound} image={image} id={id} />
              ))
            ) : (
              !isLoading && (
                <p className='col-span-full text-sm text-center py-10'>
                  В этой категории пока пусто
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
