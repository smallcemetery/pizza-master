'use client';
import { SnakeGameOverlay } from '@/components/game/snake-game';
import { ALL_CATEGORY, CATALOG_CATEGORIES } from '@/shared/constants/catalog';
import { useState } from 'react';
import { ActionCarousel } from './feature/action-carousel';
import { DrawerFood } from './feature/drawer';
import { useFood } from './hooks/usefood';

type FoodItem = {
  id: string;
  name: string;
  price: number;
  compound: string;
  image: string;
  category: string;
};

const FoodGrid = ({ items }: { items: FoodItem[] }) => (
  <div className='w-full grid grid-cols-2 min-[425px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 justify-items-center'>
    {items.map(({ id, name, price, compound, image }) => (
      <DrawerFood key={id} name={name} price={price} compound={compound} image={image} id={id} />
    ))}
  </div>
);

export const HomeModule = () => {
  const { data, isLoading } = useFood();
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORY);

  const tabs = [ALL_CATEGORY, ...CATALOG_CATEGORIES];

  const filteredData =
    activeCategory === ALL_CATEGORY
      ? data ?? []
      : data?.filter((item) => item.category === activeCategory) ?? [];

  return (
    <div className='flex flex-col items-center w-full bg-[#e8d8c9] min-h-screen'>
      <SnakeGameOverlay />
      <div className='w-full py-4 sm:py-8 md:py-10 flex justify-center px-1 min-[375px]:px-3'>
        <ActionCarousel />
      </div>
      <div className='w-full bg-[#FFF3E6] rounded-t-3xl py-3 sm:py-6 md:py-8 px-2 min-[375px]:px-4 md:px-6'>
        <div className='w-full max-w-[1000px] mx-auto flex flex-col gap-6 md:gap-10'>
          <div className='w-full flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center sm:justify-start'>
            {tabs.map((name) => (
              <button
                key={name}
                type='button'
                className={`relative text-xs min-[375px]:text-sm sm:text-base px-2 py-1 cursor-pointer ${
                  activeCategory === name ? 'font-medium underline underline-offset-4' : ''
                }`}
                onClick={() => setActiveCategory(name)}>
                {name}
              </button>
            ))}
          </div>

          {isLoading && <p className='text-sm text-center py-10'>Загрузка меню...</p>}

          {!isLoading && activeCategory === ALL_CATEGORY && data && data.length > 0 && (
            <div className='flex flex-col gap-8 md:gap-10'>
              {CATALOG_CATEGORIES.map((category) => {
                const blockItems = data.filter((item) => item.category === category);
                if (!blockItems.length) return null;
                return (
                  <section key={category} className='w-full'>
                    <h2 className='text-base sm:text-lg font-medium mb-4 pb-2 border-b border-black/20'>
                      {category}
                    </h2>
                    <FoodGrid items={blockItems} />
                  </section>
                );
              })}
            </div>
          )}

          {!isLoading && activeCategory !== ALL_CATEGORY && filteredData.length > 0 && (
            <FoodGrid items={filteredData} />
          )}

          {!isLoading && filteredData.length === 0 && activeCategory !== ALL_CATEGORY && (
            <p className='text-sm text-center py-10'>В этой категории пока пусто</p>
          )}

          {!isLoading && activeCategory === ALL_CATEGORY && (!data || data.length === 0) && (
            <p className='text-sm text-center py-10'>Меню пока пусто</p>
          )}
        </div>
      </div>
    </div>
  );
};
