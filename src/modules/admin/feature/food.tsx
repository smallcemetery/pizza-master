'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFoodCreate } from '../hooks/useFoodCreate';

type FoodFormType = {
  name: string;
  price: number;
  image: FileList;
  category: string;
  compound: string;
};

export const Food = () => {
  const { mutate } = useFoodCreate();
  const [cardData, setCardData] = useState({
    name: 'Название',
    price: 0,
    imageUrl: '',
    compound: '',
    category: '',
  });

  const onSubmit = (data: FoodFormType) => {
    const file = data.image[0];
    const objectUrl = URL.createObjectURL(file);

    setCardData({
      name: data.name,
      price: data.price,
      imageUrl: objectUrl,
      compound: data.compound,
      category: data.category,
    });
    mutate(data);
    console.log(cardData, 'данные формы админ панели создания товаров');
  };

  const { register, handleSubmit } = useForm<FoodFormType>();

  return (
    <div className='w-full h-full flex bg-red-300 justify-between items-center px-[60px]'>
      <form className='flex flex-col gap-[10px] items-center' onSubmit={handleSubmit(onSubmit)}>
        <div className='relative size-[180px] group'>
          <input type='file' className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10' {...register('image')} />
          <div className='absolute inset-0 rounded-full border border-black border-dashed flex justify-center items-center bg-transparent group-hover:bg-gray-50 transition-colors'>
            <h1 className='text-[12px] text-center px-4'>Вставьте фотографию продукта</h1>
          </div>
        </div>
        <Input placeholder='Напишите название нового товара.' {...register('name')} />
        <Input placeholder='Укажите цену нового товара.' {...register('price', { valueAsNumber: true })} />
        <Input placeholder='Укажите категорию товара.' {...register('category')} />
        <Textarea placeholder='Напишите рецепт нового товара.' className='min-h-[100px] max-h-[150px]' {...register('compound')} />
        <Button type='submit' className='cursor-pointer w-[120px]'>
          Создать
        </Button>
      </form>
      <div className='w-[180px] h-[250px] border border-black flex flex-col py-[10px] items-center cursor-pointer hover:shadow-grow hover:translate-y-[-10px] transition-all duration-300 ease-out'>
        {cardData.imageUrl ? (
          <Image src={cardData.imageUrl} alt='nf' className='size-[150px] rounded-full' width={150} height={150} />
        ) : (
          <div className='size-[150px] rounded-full bg-amber-50' />
        )}
        <p className='pt-[5px]'>{cardData.name}</p>
        <div className='w-full flex-1 px-[20px] flex items-end'>
          <Button type='button' className='bg-transparent text-black cursor-pointer border border-black w-full hover:bg-slate-100'>
            {cardData.price}р
          </Button>
        </div>
      </div>
    </div>
  );
};
