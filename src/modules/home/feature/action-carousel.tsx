'use client';

import { StoryViewer, type StoryItem } from '@/components/stories/story-viewer';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

type Story = StoryItem;

export const ActionCarousel = () => {
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const { data: stories, isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data } = await axios.get<Story[]>('/api/stories');
      return data;
    },
    staleTime: 1000 * 30,
  });

  const items: Story[] = stories?.length
    ? stories
    : Array.from({ length: 3 }).map((_, i) => ({
        id: `placeholder-${i}`,
        title: `История ${i + 1}`,
        image: null,
      }));

  const openStory = (index: number) => {
    if (items[index]?.id.startsWith('placeholder-') && !stories?.length) return;
    setViewerIndex(index);
  };

  return (
    <>
      <div className='w-full max-w-3xl mx-auto px-1'>
        <p className='text-[10px] sm:text-xs text-center text-gray-600 mb-2 sm:mb-4'>Истории</p>
        <div className='flex gap-3 sm:gap-5 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {items.map((story, index) => {
            const showImage = story.image && !brokenImages.has(story.id);
            return (
              <button
                key={story.id}
                type='button'
                onClick={() => openStory(index)}
                className='flex flex-col items-center gap-1.5 shrink-0 snap-start w-[72px] sm:w-[88px] cursor-pointer group'>
                <div className='w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-full border-2 border-black p-[2px] sm:p-[3px] bg-gradient-to-br from-[#FDB4B4] to-[#BFACC0] shadow-grow group-active:scale-95 transition-transform'>
                  <div className='w-full h-full rounded-full overflow-hidden border border-black bg-[#FFF3E6]'>
                    {showImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={story.image!}
                        alt={story.title}
                        className='w-full h-full object-cover'
                        loading='lazy'
                        referrerPolicy='no-referrer'
                        onError={() => setBrokenImages((prev) => new Set(prev).add(story.id))}
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-xl sm:text-2xl'>
                        🍕
                      </div>
                    )}
                  </div>
                </div>
                <p className='text-[9px] sm:text-[10px] text-center leading-tight line-clamp-2 w-full'>
                  {isLoading && !stories ? '…' : story.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {viewerIndex !== null && (
        <StoryViewer stories={items} initialIndex={viewerIndex} onClose={() => setViewerIndex(null)} />
      )}
    </>
  );
};
