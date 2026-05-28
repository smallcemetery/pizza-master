'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';

export const ActionCarousel = () => {
  const { data: stories } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data } = await axios.get('/api/stories');
      return data;
    },
  });

  const items = stories?.length
    ? stories
    : Array.from({ length: 3 }).map((_, i) => ({ id: `placeholder-${i}`, title: `История ${i + 1}`, image: null }));

  return (
    <Carousel opts={{ align: 'start' }} className='w-full max-w-sm sm:max-w-md lg:max-w-3xl'>
      <CarouselContent>
        {items.map((story: { id: string; title: string; image: string | null }) => (
          <CarouselItem key={story.id} className='basis-[220px] shrink-0'>
            <div className='p-1 w-[200px]'>
              <Card className='border-2 border-black bg-[#FFF3E6] shadow-grow overflow-hidden'>
                <CardContent className='flex flex-col aspect-square items-center justify-center p-0 relative'>
                  {story.image ? (
                    <Image src={story.image} alt={story.title} fill className='object-cover' sizes='200px' />
                  ) : (
                    <div className='w-full h-full bg-[#FDB4B4]/30 flex flex-col items-center justify-center gap-[8px]'>
                      <span className='text-3xl'>🍕</span>
                      <span className='text-xs px-2 text-center'>{story.title}</span>
                    </div>
                  )}
                  {story.image && (
                    <span className='absolute bottom-2 left-2 right-2 text-xs bg-white/80 border border-black px-2 py-1 text-center'>
                      {story.title}
                    </span>
                  )}
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='border border-black' />
      <CarouselNext className='border border-black' />
    </Carousel>
  );
};
