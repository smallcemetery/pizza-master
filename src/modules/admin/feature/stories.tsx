'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useStoryCreate } from '../hooks/useStoryCreate';

type StoryFormType = {
  title: string;
  image: FileList;
};

export const Stories = () => {
  const { mutate, isPending } = useStoryCreate();
  const [preview, setPreview] = useState({ title: 'Название истории', imageUrl: '' });
  const { register, handleSubmit, reset } = useForm<StoryFormType>();

  const onSubmit = (data: StoryFormType) => {
    const file = data.image[0];
    if (file) {
      setPreview({ title: data.title, imageUrl: URL.createObjectURL(file) });
    }
    mutate(data, {
      onSuccess: () => {
        reset();
        setPreview({ title: 'Название истории', imageUrl: '' });
      },
    });
  };

  return (
    <div className='w-full h-full flex justify-between items-center px-[40px] gap-[40px]'>
      <form className='flex flex-col gap-[10px] items-center' onSubmit={handleSubmit(onSubmit)}>
        <div className='relative w-[180px] h-[280px] group'>
          <input type='file' accept='image/*' className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10' {...register('image', { required: true })} />
          <div className='absolute inset-0 rounded-[15px] border border-black border-dashed flex justify-center items-center bg-[#FFF3E6] group-hover:bg-[#FDB4B4]/20 transition-colors'>
            <h1 className='text-[12px] text-center px-4'>Загрузите фото для истории</h1>
          </div>
        </div>
        <Input placeholder='Название истории' {...register('title', { required: true })} />
        <Button type='submit' disabled={isPending} className='cursor-pointer w-[140px] border border-black'>
          {isPending ? 'Сохранение...' : 'Добавить'}
        </Button>
      </form>

      <div className='w-[180px] h-[280px] border-2 border-black rounded-[15px] overflow-hidden bg-[#FFF3E6] flex flex-col shadow-grow'>
        {preview.imageUrl ? (
          <Image src={preview.imageUrl} alt='' width={180} height={220} className='w-full h-[220px] object-cover' />
        ) : (
          <div className='w-full h-[220px] bg-[#FDB4B4]/30 flex items-center justify-center text-4xl'>🍕</div>
        )}
        <p className='text-xs text-center py-[10px] px-2 border-t border-black'>{preview.title}</p>
      </div>
    </div>
  );
};
