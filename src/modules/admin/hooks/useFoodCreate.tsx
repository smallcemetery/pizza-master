'use client';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useFoodCreate = () => {
  return useMutation({
    mutationKey: ['create-food'],
    mutationFn: async (data: { name: string; price: number; image: FileList; category: string; compound: string }) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('price', data.price.toString());
      formData.append('category', data.category);
      formData.append('compound', data.compound);
      formData.append('image', data.image[0]); // Берем сам файл

      const { data: response } = await axios.post('/api/create-food', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(response, 'ответ от сервера при создании продукта');

      return response;
    },
    onSuccess: () => {
      console.log('Продукт создан!');
    },
    onError: (err) => {
      console.log(err, 'ошибка в хуке создания продукта');
    },
  });
};
