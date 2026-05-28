'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';

type ActionFormType = {
  name: string;
  description: string;
  image: FileList;
};

export const Actions = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<ActionFormType>();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ActionFormType) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      if (data.image?.[0]) formData.append('image', data.image[0]);
      const { data: res } = await axios.post('/api/create-action', formData);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      reset();
    },
  });

  return (
    <form className='flex flex-col gap-[10px] w-[320px]' onSubmit={handleSubmit((d) => mutate(d))}>
      <h2 className='font-medium'>Новая акция</h2>
      <Input placeholder='Название акции' {...register('name', { required: true })} />
      <Textarea placeholder='Описание' className='min-h-[80px]' {...register('description', { required: true })} />
      <input type='file' accept='image/*' {...register('image')} />
      <Button type='submit' disabled={isPending} className='cursor-pointer border border-black'>
        {isPending ? 'Сохранение...' : 'Создать акцию'}
      </Button>
    </form>
  );
};
