'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Story = {
  id: string;
  title: string;
  image: string | null;
};

export const ActionCarousel = () => {
  const { data: stories, isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data } = await axios.get<Story[]>('/api/stories');
      return data;
    },
  });

  const items: Story[] = stories?.length
    ? stories
    : Array.from({ length: 3 }).map((_, i) => ({
        id: `placeholder-${i}`,
        title: `История ${i + 1}`,
        image: null,
      }));

  return (
    <div className='w-full max-w-3xl mx-auto'>
      <p className='text-xs text-center text-gray-600 mb-3 sm:mb-4'>Истории</p>
      <div className='flex gap-4 sm:gap-5 overflow-x-auto pb-2 px-1 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        {items.map((story) => (
          <article
            key={story.id}
            className='flex flex-col items-center gap-2 shrink-0 snap-start w-[88px] sm:w-[100px]'>
            <div className='w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full border-2 border-black p-[3px] bg-[#FDB4B4] shadow-grow'>
              <div className='w-full h-full rounded-full overflow-hidden border border-black bg-[#FFF3E6]'>
                {story.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={story.image}
                    alt={story.title}
                    className='w-full h-full object-cover'
                    loading='lazy'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-2xl sm:text-3xl'>
                    🍕
                  </div>
                )}
              </div>
            </div>
            <p className='text-[10px] sm:text-xs text-center leading-tight line-clamp-2 w-full px-0.5'>
              {isLoading && !stories ? '…' : story.title}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};
